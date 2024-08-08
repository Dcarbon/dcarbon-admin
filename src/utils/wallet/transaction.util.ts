import { CARBON_IDL } from '@contracts/carbon/carbon.idl.ts';
import { ICarbonContract } from '@contracts/carbon/carbon.interface.ts';
import { Program } from '@coral-xyz/anchor';
import { Wallet } from '@solana/wallet-adapter-react';
import {
  ComputeBudgetProgram,
  Connection,
  Keypair,
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';
import base58 from 'bs58';

interface ISendTxOption {
  connection: Connection;
  wallet: Wallet;
  payerKey: PublicKey;
  txInstructions?: TransactionInstruction;
  arrTxInstructions?: TransactionInstruction[];
  otherSigner?: Keypair;
}

const sendTx = async ({
  connection,
  wallet,
  payerKey,
  txInstructions,
  otherSigner,
  arrTxInstructions,
}: ISendTxOption): Promise<{
  status: 'success' | 'error' | 'reject';
  tx?: string;
}> => {
  let tx: string | undefined;
  if (
    !txInstructions &&
    (!arrTxInstructions || arrTxInstructions.length === 0)
  ) {
    return {
      status: 'error',
      tx,
    };
  }
  try {
    const blockhash =
      await connection.getLatestBlockhashAndContext('confirmed');
    const setComputeUnitPriceIx = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: Number(import.meta.env.VITE_COMPUTE_UNIT_PRICE || 100000),
    });
    const messageV0 = new TransactionMessage({
      payerKey,
      recentBlockhash: blockhash.value.blockhash,
      instructions: txInstructions
        ? [setComputeUnitPriceIx, txInstructions]
        : arrTxInstructions
          ? [setComputeUnitPriceIx, ...arrTxInstructions]
          : [],
    }).compileToV0Message();
    const transactionV0 = new VersionedTransaction(messageV0);
    if (otherSigner) transactionV0.sign([otherSigner]);
    const signature = await (wallet?.adapter as any)?.signTransaction(
      transactionV0,
    );
    const signatureEncode = base58.encode(signature?.signatures?.[0]);

    const blockHeight = await connection.getBlockHeight({
      commitment: 'confirmed',
      minContextSlot: blockhash.context.slot,
    });
    const transactionTTL = blockHeight + 151;
    const waitToConfirm = () =>
      new Promise((resolve) => setTimeout(resolve, 5000));
    const waitToRetry = () =>
      new Promise((resolve) => setTimeout(resolve, 2000));

    const numTry = 30;
    let isShoError = false;
    for (let i = 0; i < numTry; i++) {
      // check transaction TTL
      const blockHeight = await connection.getBlockHeight('confirmed');
      if (blockHeight >= transactionTTL) {
        throw new Error('ONCHAIN_TIMEOUT');
      }

      const data = await connection.simulateTransaction(transactionV0, {
        replaceRecentBlockhash: true,
        commitment: 'confirmed',
      });
      if (
        !isShoError &&
        import.meta.env.VITE_SKIP_PREFLIGHT === '1' &&
        data?.value?.err
      ) {
        isShoError = true;
        console.error('SimulateTransaction Error', data?.value?.logs);
      }

      await connection?.sendRawTransaction(signature.serialize(), {
        skipPreflight: import.meta.env.VITE_SKIP_PREFLIGHT === '1',
        maxRetries: 0,
        preflightCommitment: 'confirmed',
      });

      await waitToConfirm();

      const sigStatus = await connection.getSignatureStatus(signatureEncode);
      tx = signatureEncode;
      if (sigStatus.value?.err) {
        if (import.meta.env.VITE_SKIP_PREFLIGHT === '1') {
          console.error('GetSignatureStatus Error', data?.value?.logs);
        }
        throw new Error('UNKNOWN_TRANSACTION');
      }
      if (sigStatus.value?.confirmationStatus === 'confirmed') {
        break;
      }

      await waitToRetry();
    }
    return {
      status: 'success',
      tx,
    };
  } catch (e: any) {
    if (e.message === 'User rejected the request.') {
      return {
        status: 'reject',
        tx,
      };
    }
    console.error(e);
    return {
      status: 'error',
      tx,
    };
  }
};

const getProgram = (connect?: Connection): Program<ICarbonContract> => {
  if (!connect) {
    connect = new Connection(
      import.meta.env.VITE_RPC_URL as string,
      'confirmed',
    );
  }
  return new Program<ICarbonContract>(CARBON_IDL as ICarbonContract, {
    connection: connect,
  });
};
export { sendTx, getProgram };

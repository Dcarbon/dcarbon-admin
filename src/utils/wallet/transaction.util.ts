import { Wallet } from '@solana/wallet-adapter-react';
import {
  ComputeBudgetProgram,
  Connection,
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
  txInstructions: TransactionInstruction;
}

const sendTx = async ({
  connection,
  wallet,
  payerKey,
  txInstructions,
}: ISendTxOption): Promise<{
  status: 'success' | 'error';
  tx?: string;
}> => {
  let tx: string | undefined;
  try {
    const blockhash =
      await connection.getLatestBlockhashAndContext('confirmed');
    const setComputeUnitPriceIx = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: Number(import.meta.env.VITE_COMPUTE_UNIT_PRICE || 100000),
    });
    const messageV0 = new TransactionMessage({
      payerKey,
      recentBlockhash: blockhash.value.blockhash,
      instructions: [setComputeUnitPriceIx, txInstructions],
    }).compileToV0Message();
    const transactionV0 = new VersionedTransaction(messageV0);

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

    for (let i = 0; i < numTry; i++) {
      // check transaction TTL
      const blockHeight = await connection.getBlockHeight('confirmed');
      if (blockHeight >= transactionTTL) {
        throw new Error('ONCHAIN_TIMEOUT');
      }

      await connection.simulateTransaction(transactionV0, {
        replaceRecentBlockhash: true,
        commitment: 'confirmed',
      });

      await connection?.sendRawTransaction(signature.serialize(), {
        skipPreflight: import.meta.env.VITE_SKIP_PREFLIGHT === '1',
        maxRetries: 0,
        preflightCommitment: 'confirmed',
      });

      await waitToConfirm();

      const sigStatus = await connection.getSignatureStatus(signatureEncode);

      if (sigStatus.value?.err) {
        throw new Error('UNKNOWN_TRANSACTION');
      }

      if (sigStatus.value?.confirmationStatus === 'confirmed') {
        tx = signatureEncode;
        break;
      }

      await waitToRetry();
    }
    return {
      status: 'success',
      tx,
    };
  } catch (e) {
    console.error(e);
    return {
      status: 'error',
      tx,
    };
  }
};
export { sendTx };

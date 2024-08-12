import { CARBON_IDL } from '@contracts/carbon/carbon.idl.ts';
import { ICarbonContract } from '@contracts/carbon/carbon.interface.ts';
import { Program } from '@coral-xyz/anchor';
import { Wallet } from '@solana/wallet-adapter-react';
import {
  BlockhashWithExpiryBlockHeight,
  ComputeBudgetProgram,
  Connection,
  Keypair,
  PublicKey,
  RpcResponseAndContext,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';
import base58 from 'bs58';

type TSendTxStatus = 'success' | 'error' | 'reject';

interface ISendTxOption {
  connection: Connection;
  wallet: Wallet;
  payerKey: PublicKey;
  txInstructions?: TransactionInstruction;
  arrTxInstructions?: TransactionInstruction[];
  arrTxInstructionsSignAll?: TransactionInstruction[][];
  otherSigner?: Keypair;
}

type TTransaction = {
  tx: VersionedTransaction;
  blockhash: RpcResponseAndContext<BlockhashWithExpiryBlockHeight>;
};

interface ISendMultipleTxOption {
  connection: Connection;
  wallet: Wallet;
  payerKey: PublicKey;
  transactionsInsList: TransactionInstruction[][];
}

interface ISendMultipleTxResult {
  tx?: string;
  status: TSendTxStatus;
}

const sendTx = async ({
  connection,
  wallet,
  payerKey,
  txInstructions,
  otherSigner,
  arrTxInstructions,
}: ISendTxOption): Promise<{
  status: TSendTxStatus;
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

const createTransactionV0 = async (
  connection: Connection,
  payerKey: PublicKey,
  txInstructions: TransactionInstruction | TransactionInstruction[],
): Promise<{
  tx: VersionedTransaction;
  blockhash: RpcResponseAndContext<BlockhashWithExpiryBlockHeight>;
} | null> => {
  if (!txInstructions) {
    throw new Error('txInstructions is required');
  }

  if (!payerKey) {
    throw new Error('payerKey is required');
  }

  if (!connection) {
    throw new Error('connection is required');
  }

  try {
    const blockhash =
      await connection.getLatestBlockhashAndContext('confirmed');
    const setComputeUnitPriceIx = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: Number(
        import.meta.env.NEXT_PUBLIC_COMPUTE_UNIT_PRICE || 100000,
      ),
    });
    const messageV0 = new TransactionMessage({
      payerKey,
      recentBlockhash: blockhash.value.blockhash,
      instructions: [
        setComputeUnitPriceIx,
        ...(Array.isArray(txInstructions) ? txInstructions : [txInstructions]),
      ],
    }).compileToV0Message();
    const transactionV0 = new VersionedTransaction(messageV0);
    return { tx: transactionV0, blockhash };
  } catch (e) {
    const error = e as Error;
    throw error?.stack || error?.message;
  }
};

const createSendRawTransaction = async (
  connection: Connection,
  signature: VersionedTransaction,
  blockhash: RpcResponseAndContext<BlockhashWithExpiryBlockHeight>,
  transaction: VersionedTransaction,
): Promise<ISendMultipleTxResult> => {
  if (!connection) {
    throw new Error('connection is required');
  }
  if (!signature) {
    throw new Error('signature is required');
  }
  if (!blockhash) {
    throw new Error('blockhash is required');
  }
  if (!transaction) {
    throw new Error('transaction is required');
  }
  let tx: string | undefined;
  let status: TSendTxStatus = 'error';
  const signatureEncode = base58.encode(signature?.signatures?.[0]);
  const blockHeight = await connection.getBlockHeight({
    commitment: 'confirmed',
    minContextSlot: blockhash.context.slot,
  });
  const transactionTTL = blockHeight + 151;
  const waitToConfirm = () =>
    new Promise((resolve) => setTimeout(resolve, 5000));
  const waitToRetry = () => new Promise((resolve) => setTimeout(resolve, 2000));

  const numTry = 30;
  let isShoError = false;
  for (let i = 0; i < numTry; i++) {
    // check transaction TTL
    const blockHeight = await connection.getBlockHeight('confirmed');
    if (blockHeight >= transactionTTL) {
      throw new Error('ONCHAIN_TIMEOUT');
    }

    const data = await connection.simulateTransaction(transaction, {
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
      status = 'success';
      break;
    }

    await waitToRetry();
  }
  return {
    tx,
    status,
  };
};

const sendMultipleTx = async ({
  connection,
  wallet,
  payerKey,
  transactionsInsList,
}: ISendMultipleTxOption): Promise<ISendMultipleTxResult[]> => {
  if (!connection) {
    throw new Error('connection is required');
  }

  if (!wallet) {
    throw new Error('wallet is required');
  }

  const transactions: TTransaction[] = [];

  for (const listIns of transactionsInsList) {
    const txVer0 = await createTransactionV0(connection, payerKey, listIns);

    if (txVer0) {
      transactions.push(txVer0);
    }
  }

  try {
    const signatures = await (wallet?.adapter as any)?.signAllTransactions(
      transactions?.map((tx) => tx.tx),
    );

    let index = 0;
    const rawTransactions = [];
    for await (const tran of transactions) {
      rawTransactions.push(
        createSendRawTransaction(
          connection,
          signatures[index],
          tran.blockhash,
          tran.tx,
        ),
      );
      index++;
    }

    const results = await Promise.allSettled(rawTransactions);
    const sendTxMultipleResult: ISendMultipleTxResult[] = [];
    results.forEach((info) => {
      if (info.status === 'fulfilled' && info.value.status === 'success') {
        sendTxMultipleResult.push({
          status: 'success',
          tx: info.value.tx,
        });
      } else if (info.status === 'rejected') {
        sendTxMultipleResult.push({
          status: 'error',
        });
      } else if (info.status === 'fulfilled' && info.value.status === 'error') {
        sendTxMultipleResult.push({
          status: 'error',
          tx: info.value.tx,
        });
      }
    });
    return sendTxMultipleResult;
  } catch (e: any) {
    if (e.message === 'User rejected the request.') {
      return [
        {
          status: 'reject',
        },
      ];
    } else throw e?.stack || e?.message;
  }
};

const getProgram = (
  connect?: Connection,
): {
  connection: Connection;
  program: Program<ICarbonContract>;
} => {
  if (!connect) {
    connect = new Connection(
      import.meta.env.VITE_RPC_URL as string,
      'confirmed',
    );
  }
  return {
    connection: connect,
    program: new Program<ICarbonContract>(CARBON_IDL as ICarbonContract, {
      connection: connect,
    }),
  };
};
export { sendTx, getProgram, sendMultipleTx };

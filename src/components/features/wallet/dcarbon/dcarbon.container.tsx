import { memo, useEffect, useState } from 'react';
import { ERROR_CONTRACT } from '@/constants';
import { getMetadataOfMint } from '@adapters/common.ts';
import { associatedAddress } from '@coral-xyz/anchor/dist/cjs/utils/token';
import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddressSync,
} from '@solana/spl-token';
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react';
import { PublicKey, TransactionInstruction } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';
import TxModal from '@components/common/modal/tx-modal.tsx';
import DcarbonScreen, {
  IDcarbonInfo,
} from '@components/features/wallet/dcarbon/dcarbon.screen.tsx';
import { QUERY_KEYS } from '@utils/constants';
import useNotification from '@utils/helpers/my-notification.tsx';
import { getProgram, sendTx } from '@utils/wallet';

const DcarbonContainer = memo(() => {
  const [myNotification] = useNotification();
  const [txModalOpen, setTxModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refetch, setRefetch] = useState(0);
  const [governance, setGovernance] = useState<string>();
  const [contractDCarbonAvailable, setContractDCarbonAvailable] =
    useState<number>();
  const [dcarbonInfo, setDcarbonInfo] = useState<IDcarbonInfo>();
  const { publicKey, wallet } = useWallet();
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  const getAvailableBalance = async () => {
    if (!publicKey || !anchorWallet || !connection) return;
    const { connection: conn } = getProgram(connection);
    if (publicKey && governance) {
      const data = await conn.getParsedTokenAccountsByOwner(publicKey, {
        mint: new PublicKey(governance),
      });
      if (data && data.value?.length > 0) {
        setDcarbonInfo((prevState: any) => {
          return {
            ...prevState,
            owner_token_address: data.value[0].pubkey.toString(),
            balance: Number(
              data.value[0].account.data.parsed.info.tokenAmount.uiAmount.toFixed(
                2,
              ),
            ),
          };
        });
      } else {
        setDcarbonInfo((prevState: any) => {
          return {
            ...prevState,
            owner_token_address: '',
            balance: 0,
          };
        });
      }
    }
  };
  const { data } = useQuery({
    queryKey: [QUERY_KEYS.COMMON.GET_METADATA_OF_MINT, governance],
    queryFn: () => getMetadataOfMint(governance || ''),
    enabled: !!governance,
  });
  const getDCarbonInfo = async () => {
    if (!publicKey || !anchorWallet || !connection) return;
    try {
      setLoading(true);
      const { program, connection: conn } = getProgram(connection);
      const [governancePda] = PublicKey.findProgramAddressSync(
        [Buffer.from('governance'), publicKey.toBuffer()],
        program.programId,
      );
      try {
        const data = await program.account.governance.fetch(governancePda);
        if (data) {
          setDcarbonInfo((prevState: any) => {
            return {
              ...prevState,
              availableClaim: data.amount || 0,
            };
          });
        }
      } catch (e) {
        setDcarbonInfo((prevState: any) => {
          return {
            ...prevState,
            availableClaim: 0,
          };
        });
      }
      const [authority] = PublicKey.findProgramAddressSync(
        [Buffer.from('authority')],
        program.programId,
      );
      const [gvPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('governance')],
        program.programId,
      );
      const data2 = await program.account.governance.fetch(gvPda);
      if (data2 && data2.mint) {
        setGovernance(data2.mint.toString());
      }
      const dcarbonContract = await conn.getParsedTokenAccountsByOwner(
        authority,
        {
          mint: data2.mint,
        },
      );
      if (dcarbonContract && dcarbonContract.value?.length > 0) {
        setContractDCarbonAvailable(
          dcarbonContract.value[0].account.data.parsed.info.tokenAmount.uiAmount.toFixed(
            2,
          ),
        );
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.error(e);
    }
  };
  const claim = async () => {
    let transaction;
    try {
      setTxModalOpen(true);
      if (
        !anchorWallet ||
        !connection ||
        !publicKey ||
        !wallet ||
        !governance
      ) {
        myNotification(ERROR_CONTRACT.COMMON.CONNECT_ERROR);
        return;
      }
      const { program } = getProgram(connection);
      const [authority] = PublicKey.findProgramAddressSync(
        [Buffer.from('authority')],
        program.programId,
      );
      const dcarbonToken = new PublicKey(governance);
      const tokenAtaSender = associatedAddress({
        mint: dcarbonToken,
        owner: authority,
      });
      const tokenAtaReceiver = getAssociatedTokenAddressSync(
        dcarbonToken,
        publicKey,
      );
      const tokenAtaAccount = await connection.getAccountInfo(tokenAtaReceiver);
      const claimInsArray: TransactionInstruction[] = [];
      if (!tokenAtaAccount || !tokenAtaAccount.lamports) {
        claimInsArray.push(
          createAssociatedTokenAccountInstruction(
            publicKey,
            tokenAtaReceiver,
            publicKey,
            dcarbonToken,
          ),
        );
      }
      const claimIns = await program.methods
        .claimGovernanceToken()
        .accounts({
          signer: publicKey,
          tokenMint: dcarbonToken,
          tokenAtaReceiver: tokenAtaReceiver,
          tokenAtaSender: tokenAtaSender,
        })
        .instruction();
      claimInsArray.push(claimIns);
      const { status, tx } = await sendTx({
        connection,
        wallet,
        payerKey: publicKey,
        arrTxInstructions: claimInsArray,
      });
      transaction = tx;
      setTxModalOpen(false);
      if (status === 'reject') return;
      myNotification({
        description: transaction,
        type: status,
        tx_type: 'tx',
      });
      setRefetch((prevState) => prevState + 1);
    } catch (e) {
      console.error(e);
      myNotification(ERROR_CONTRACT.COMMON.ON_CHAIN_FETCH_ERROR);
      return;
    }
  };
  useEffect(() => {
    getDCarbonInfo().then();
  }, [connection, anchorWallet, refetch]);
  useEffect(() => {
    if (governance) getAvailableBalance().then();
  }, [anchorWallet, connection, governance, refetch]);
  return (
    <>
      <TxModal open={txModalOpen} setOpen={setTxModalOpen} />
      <DcarbonScreen
        dcarbonMetadata={data}
        loading={loading}
        dcarbonInfo={dcarbonInfo}
        claim={claim}
        contractDCarbonAvailable={contractDCarbonAvailable}
      />
    </>
  );
});
export default DcarbonContainer;

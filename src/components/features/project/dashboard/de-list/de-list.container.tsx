import { memo, useEffect, useState } from 'react';
import { ERROR_CONTRACT } from '@/constants';
import { getListingInfo } from '@adapters/project.ts';
import { CARBON_IDL } from '@contracts/carbon/carbon.idl.ts';
import { ICarbonContract } from '@contracts/carbon/carbon.interface.ts';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react';
import { PublicKey, TransactionInstruction } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';
import TxModal from '@components/common/modal/tx-modal.tsx';
import DeListTable from '@components/features/project/dashboard/de-list/table.tsx';
import { QUERY_KEYS } from '@utils/constants';
import useMultipleNotification from '@utils/helpers/multiple-notification.tsx';
import useMyNotification from '@utils/helpers/my-notification.tsx';
import { sendMultipleTx, splitArray } from '@utils/wallet';

interface IPagingState {
  page: number;
  limit: number;
}

interface IProps {
  projectId: string;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  refetch: () => void;
}

const DeListContainer = memo(
  ({ projectId, visible, setVisible, refetch }: IProps) => {
    const [openMultipleNotification] = useMultipleNotification();
    const [myNotification] = useMyNotification();
    const { publicKey, wallet } = useWallet();
    const { connection } = useConnection();
    const anchorWallet = useAnchorWallet();
    const [txModalOpen, setTxModalOpen] = useState(false);
    const [selected, setSelect] = useState<string[]>([]);
    const [selectedAll, setSelectAll] = useState<boolean>(false);
    const [paging, setPaging] = useState<IPagingState>({
      page: 1,
      limit: 10,
    });
    const { data, isLoading } = useQuery({
      queryKey: [
        QUERY_KEYS.PROJECT.LISTING_INFO,
        projectId,
        paging.limit,
        paging.page,
        publicKey,
      ],
      queryFn: () =>
        getListingInfo({
          slug: projectId,
          owner_wallet: publicKey ? publicKey?.toString() : '',
          limit: paging.limit,
          page: paging.page,
        }),
      staleTime: 0,
      enabled: visible && !!wallet && !!projectId && !!paging.page,
    });

    const deList = async () => {
      if (!anchorWallet || !connection || !publicKey || !wallet) {
        myNotification(ERROR_CONTRACT.COMMON.CONNECT_ERROR);
        return;
      }
      let successTransactions = [];
      let errorTransactions = [];
      try {
        setTxModalOpen(true);
        let listDeList = selected;
        if (selectedAll) {
          listDeList = (data?.common.all_listing || []).map(
            (info) => info.mint,
          );
        }
        const provider = new AnchorProvider(connection, anchorWallet);
        const program = new Program<ICarbonContract>(
          CARBON_IDL as ICarbonContract,
          provider,
        );
        const splitArr = splitArray<string>(listDeList, 5);
        const cancelListingInsArrayForMultipleTx: TransactionInstruction[][] =
          [];
        for (let i0 = 0; i0 < splitArr.length; i0++) {
          const cancelListingInsArray: TransactionInstruction[] = [];
          const mints = splitArr[i0];
          for (let i = 0; i < mints.length; i++) {
            const mint = new PublicKey(mints[i]);
            const sourceAta = getAssociatedTokenAddressSync(mint, publicKey);
            const cancelListingIns = await program.methods
              .cancelListing()
              .accounts({
                signer: publicKey,
                mint,
                sourceAta,
              })
              .instruction();
            cancelListingInsArray.push(cancelListingIns);
          }
          cancelListingInsArrayForMultipleTx.push(cancelListingInsArray);
        }
        const result = await sendMultipleTx({
          connection,
          wallet,
          payerKey: publicKey,
          transactionsInsList: cancelListingInsArrayForMultipleTx,
        });
        if (result.filter((info) => info.status === 'reject').length > 0) {
          return;
        }
        successTransactions = result.filter(
          (info) => info.status === 'success',
        );
        errorTransactions = result.filter((info) => info.status === 'error');
        setTxModalOpen(false);
        if (successTransactions.length > 0) {
          openMultipleNotification({
            txs: successTransactions.map((info) => info.tx || ''),
            type: 'success',
            tx_type: 'tx',
          });
        }
        if (errorTransactions.length > 0) {
          openMultipleNotification({
            txs: errorTransactions.map((info) => info.tx || ''),
            type: 'error',
            tx_type: 'tx',
            successCount: successTransactions.length,
          });
        }
        setVisible(false);
        refetch();
      } catch (e) {
        console.error(e);
      } finally {
        setTxModalOpen(false);
      }
    };
    const triggerSetSelectAll = (all: boolean) => {
      setSelectAll(all);
    };
    useEffect(() => {
      if (visible) refetch();
    }, [visible]);
    return (
      <>
        <TxModal open={txModalOpen} setOpen={setTxModalOpen} />
        <DeListTable
          data={data}
          loading={isLoading}
          open={visible}
          setOpen={setVisible}
          selected={selected}
          setSelect={setSelect}
          setPaging={setPaging}
          deList={deList}
          selectedAll={selectedAll}
          setSelectAll={triggerSetSelectAll}
        />
      </>
    );
  },
);
export default DeListContainer;

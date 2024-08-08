import { Flex } from 'antd';
import CenterContentLayout from '@components/common/layout/center-content/center-content.layout.tsx';

import './role.css';

import { memo, useEffect, useRef, useState } from 'react';
import { ERROR_CONTRACT } from '@/constants';
import { CARBON_IDL } from '@contracts/carbon/carbon.idl.ts';
import { ICarbonContract } from '@contracts/carbon/carbon.interface.ts';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import TxModal from '@components/common/modal/tx-modal.tsx';
import AdminContainer from '@components/features/contract/role/admin/admin.container.tsx';
import MasterScreen from '@components/features/contract/role/master/master.screen.tsx';
import { IContractUser } from '@components/features/contract/role/role.interface.ts';
import useNotification from '@utils/helpers/my-notification.tsx';
import { getProgram, sendTx } from '@utils/wallet';

interface IMasterRef {
  setMaster: (master: IContractUser) => void;
}

interface IAdminRef {
  setAdminMasterWallet: (wallet: string) => void;
}

const ContractRole = memo(() => {
  const [loading, setLoading] = useState(false);
  const [myNotification] = useNotification();
  const { publicKey, wallet } = useWallet();
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  const masterRef = useRef<IMasterRef>();
  const [txModalOpen, setTxModalOpen] = useState(false);
  const adminRef = useRef<IAdminRef>();
  const [refetch, setRefetch] = useState(0);
  const getMaster = async (): Promise<string | undefined> => {
    try {
      setLoading(true);
      const program = getProgram(connection);
      const [masterPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('master')],
        program.programId,
      );
      const masterData = await program.account.master.fetch(masterPda);
      masterRef.current?.setMaster({
        wallet: masterData.masterKey.toString(),
        status: 'active',
      });
      adminRef.current?.setAdminMasterWallet(masterData.masterKey.toString());
      setLoading(false);
    } catch (e) {
      console.error(e);
      myNotification(ERROR_CONTRACT.COMMON.ON_CHAIN_FETCH_ERROR);
      return;
    }
  };
  const triggerTransferMaster = async (master: string): Promise<void> => {
    let transaction;
    try {
      setTxModalOpen(true);
      if (!anchorWallet || !connection || !publicKey || !wallet) {
        myNotification(ERROR_CONTRACT.COMMON.CONNECT_ERROR);
        return;
      }
      const masterAddress = new PublicKey(master);
      const provider = new AnchorProvider(connection, anchorWallet);
      const program = new Program<ICarbonContract>(
        CARBON_IDL as ICarbonContract,
        provider,
      );

      const transferMasterIns = await program.methods
        .transferMasterRights(masterAddress)
        .accounts({
          signer: publicKey,
        })
        .instruction();
      const { status, tx } = await sendTx({
        connection,
        wallet,
        payerKey: publicKey,
        txInstructions: transferMasterIns,
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
      setTxModalOpen(false);
      myNotification(ERROR_CONTRACT.COMMON.TX_ERROR);
      console.error(e);
    }
  };
  useEffect(() => {
    getMaster().then();
  }, [connection, anchorWallet, refetch]);
  return (
    <>
      {' '}
      <TxModal open={txModalOpen} setOpen={setTxModalOpen} />
      <CenterContentLayout contentWidth={'480px'} vertical>
        <Flex vertical>
          <MasterScreen
            loading={loading}
            ref={masterRef}
            currentWallet={anchorWallet?.publicKey.toString()}
            triggerTransferMaster={triggerTransferMaster}
          />
          <AdminContainer
            connection={connection}
            anchorWallet={anchorWallet}
            ref={adminRef}
            currentWallet={anchorWallet?.publicKey.toString()}
          />
        </Flex>
      </CenterContentLayout>
    </>
  );
});
export default ContractRole;

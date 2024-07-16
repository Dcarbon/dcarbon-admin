import { Flex } from 'antd';
import CenterContentLayout from '@components/common/layout/center-content/center-content.layout.tsx';

import './role.css';

import { memo, useEffect, useRef, useState } from 'react';
import { ERROR_CONTRACT } from '@/constants';
import { CARBON_IDL } from '@contracts/carbon/carbon.idl.ts';
import { ICarbonContract } from '@contracts/carbon/carbon.interface.ts';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import AdminContainer from '@components/features/contract/role/admin/admin.container.tsx';
import MasterScreen from '@components/features/contract/role/master/master.screen.tsx';
import { IContractUser } from '@components/features/contract/role/role.interface.ts';
import useNotification from '@utils/helpers/my-notification.tsx';

interface IMasterRef {
  setMaster: (master: IContractUser) => void;
}

interface IAdminRef {
  setAdminMasterWallet: (wallet: string) => void;
}

const ContractRole = memo(() => {
  console.info('ContractRole');
  const [loading, setLoading] = useState(false);
  const [myNotification] = useNotification();
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  const masterRef = useRef<IMasterRef>();
  const adminRef = useRef<IAdminRef>();
  const getMaster = async (): Promise<string | undefined> => {
    try {
      if (!anchorWallet || !connection) {
        return;
      }
      setLoading(true);
      const provider = new AnchorProvider(connection, anchorWallet);
      const program = new Program<ICarbonContract>(
        CARBON_IDL as ICarbonContract,
        provider,
      );
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
  useEffect(() => {
    getMaster().then();
  }, [connection, anchorWallet]);
  return (
    <CenterContentLayout
      contentWidth={!connection || !anchorWallet ? '50%' : '480px'}
      vertical
    >
      {!connection || !anchorWallet ? (
        <span
          style={{
            fontSize: '24px',
            fontWeight: '500',
            color: 'orange',
          }}
        >
          You need to connect your wallet to continue!
        </span>
      ) : (
        <Flex vertical>
          <MasterScreen
            loading={loading}
            ref={masterRef}
            currentWallet={anchorWallet?.publicKey.toString()}
          />
          <AdminContainer
            connection={connection}
            anchorWallet={anchorWallet}
            ref={adminRef}
            currentWallet={anchorWallet?.publicKey.toString()}
          />
        </Flex>
      )}
    </CenterContentLayout>
  );
});
export default ContractRole;

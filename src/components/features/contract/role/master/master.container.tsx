import { memo, useEffect, useRef, useState } from 'react';
import { ERROR_CONTRACT } from '@/constants';
import { CARBON_IDL } from '@contracts/carbon/carbon.idl.ts';
import { ICarbonContract } from '@contracts/carbon/carbon.interface.ts';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { PublicKey, type Connection } from '@solana/web3.js';
import MasterScreen from '@components/features/contract/role/master/master.screen.tsx';
import { IContractUser } from '@components/features/contract/role/role.interface.ts';
import useNotification from '@utils/helpers/my-notification.tsx';

interface IRef {
  setMaster: (master: IContractUser) => void;
}

interface IProps {
  connection: Connection;
  anchorWallet: AnchorWallet;
}

const MasterContainer = memo(({ connection, anchorWallet }: IProps) => {
  console.info('MasterContainer');
  const masterRef = useRef<IRef>();
  const [myNotification] = useNotification();
  const [loading, setLoading] = useState(false);
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
  return <MasterScreen loading={loading} ref={masterRef} />;
});
export default MasterContainer;

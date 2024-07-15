import { memo, useEffect, useRef, useState } from 'react';
import { ERROR_CONTRACT } from '@/constants';
import { CARBON_IDL } from '@contracts/carbon/carbon.idl.ts';
import { ICarbonContract } from '@contracts/carbon/carbon.interface.ts';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { PublicKey, type Connection } from '@solana/web3.js';
import base58 from 'bs58';
import AdminScreen from '@components/features/contract/role/admin/admin.screen.tsx';
import { IContractUser } from '@components/features/contract/role/role.interface.ts';
import useNotification from '@utils/helpers/my-notification.tsx';

interface IRef {
  setAdministrators: (admins: IContractUser[]) => void;
}

interface IProps {
  connection: Connection;
  anchorWallet: AnchorWallet;
}

const AdminContainer = memo(({ connection, anchorWallet }: IProps) => {
  console.info('AdminContainer');
  const administratorRef = useRef<IRef>();
  const [myNotification] = useNotification();
  const [loading, setLoading] = useState(false);
  const getAdministrators = async (): Promise<string | undefined> => {
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
      const data = await connection.getProgramAccounts(program.programId, {
        dataSlice: { offset: 8, length: 32 },
        filters: [
          {
            dataSize: 32 + 8,
          },
          {
            memcmp: {
              offset: 0,
              bytes: base58.encode(
                CARBON_IDL?.accounts.find(
                  (acc: { name: string; discriminator: number[] }) =>
                    acc.name === 'Admin',
                )?.discriminator as number[],
              ),
            },
          },
        ],
      });
      setLoading(false);
      if (data.length > 0) {
        const admins: IContractUser[] = data.map((d: any) => {
          return {
            wallet: new PublicKey(d.account.data).toString(),
            status: 'active',
          };
        });
        administratorRef.current?.setAdministrators(admins);
      }
    } catch (e) {
      console.error(e);
      myNotification(ERROR_CONTRACT.COMMON.ON_CHAIN_FETCH_ERROR);
      return;
    }
  };
  useEffect(() => {
    getAdministrators().then();
  }, [connection, anchorWallet]);
  return <AdminScreen loading={loading} ref={administratorRef} />;
});
export default AdminContainer;

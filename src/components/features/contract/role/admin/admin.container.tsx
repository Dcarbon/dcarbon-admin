import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { ERROR_CONTRACT } from '@/constants';
import { CARBON_IDL } from '@contracts/carbon/carbon.idl.ts';
import { ICarbonContract } from '@contracts/carbon/carbon.interface.ts';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { AnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, type Connection } from '@solana/web3.js';
import base58 from 'bs58';
import TxModal from '@components/common/modal/tx-modal.tsx';
import AdminScreen from '@components/features/contract/role/admin/admin.screen.tsx';
import { IContractUser } from '@components/features/contract/role/role.interface.ts';
import useNotification from '@utils/helpers/my-notification.tsx';
import { sendTx } from '@utils/wallet';

interface IRef {
  setAdministrators: (admins: IContractUser[]) => void;
}

interface IProps {
  connection: Connection;
  anchorWallet: AnchorWallet;
  currentWallet?: string;
}

const AdminContainer = memo(
  forwardRef(({ connection, anchorWallet, currentWallet }: IProps, ref) => {
    console.info('AdminContainer');
    const { publicKey, wallet } = useWallet();
    const administratorRef = useRef<IRef>();
    const [myNotification] = useNotification();
    const [loading, setLoading] = useState(false);
    const [refetch, setRefetch] = useState(0);
    const [txModalOpen, setTxModalOpen] = useState(false);
    const [masterWallet, setMasterWallet] = useState<string>();
    useImperativeHandle(ref, () => ({
      setAdminMasterWallet(wallet: string) {
        setMasterWallet(wallet);
      },
    }));
    const getAdministrators = async (): Promise<string | undefined> => {
      try {
        if (!anchorWallet || !connection || !masterWallet) {
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
          admins.sort((a, b) =>
            a.wallet.localeCompare(b.wallet, 'es', { sensitivity: 'base' }),
          );
          administratorRef.current?.setAdministrators(admins);
        }
      } catch (e) {
        console.error(e);
        myNotification(ERROR_CONTRACT.COMMON.ON_CHAIN_FETCH_ERROR);
        return;
      }
    };
    const setAdmin = async (admin: string) => {
      let transaction;
      try {
        setTxModalOpen(true);
        if (!anchorWallet || !connection || !publicKey || !wallet) {
          myNotification(ERROR_CONTRACT.COMMON.CONNECT_ERROR);
          return;
        }
        const adminAddress = new PublicKey(admin);
        const provider = new AnchorProvider(connection, anchorWallet);
        const program = new Program<ICarbonContract>(
          CARBON_IDL as ICarbonContract,
          provider,
        );
        const [adminPda] = PublicKey.findProgramAddressSync(
          [Buffer.from('admin'), adminAddress.toBuffer()],
          program.programId,
        );
        const addAdminIns = await program.methods
          .addAdmin(adminAddress)
          .accounts({
            signer: publicKey,
          })
          .remainingAccounts([
            {
              pubkey: adminPda,
              isWritable: true,
              isSigner: false,
            },
          ])
          .instruction();
        const { status, tx } = await sendTx({
          connection,
          wallet,
          payerKey: publicKey,
          txInstructions: addAdminIns,
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
    const triggerRemoveAdmin = async (admin: string): Promise<void> => {
      let transaction;
      try {
        setTxModalOpen(true);
        if (!anchorWallet || !connection || !publicKey || !wallet) {
          myNotification(ERROR_CONTRACT.COMMON.CONNECT_ERROR);
          return;
        }
        const adminAddress = new PublicKey(admin);
        const provider = new AnchorProvider(connection, anchorWallet);
        const program = new Program<ICarbonContract>(
          CARBON_IDL as ICarbonContract,
          provider,
        );
        const delAdminIns = await program.methods
          .deleteAdmin(adminAddress)
          .accounts({
            signer: publicKey,
          })
          .instruction();
        const { status, tx } = await sendTx({
          connection,
          wallet,
          payerKey: publicKey,
          txInstructions: delAdminIns,
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
      getAdministrators().then();
    }, [connection, anchorWallet, masterWallet, refetch]);
    return (
      <>
        <TxModal open={txModalOpen} setOpen={setTxModalOpen} />
        <AdminScreen
          loading={loading || !masterWallet}
          ref={administratorRef}
          isMaster={masterWallet === currentWallet}
          setAdmin={setAdmin}
          triggerRemoveAdmin={triggerRemoveAdmin}
        />
      </>
    );
  }),
);
export default AdminContainer;

import { useEffect } from 'react';
import { useContractRole } from '@/contexts/contract-role-context.tsx';
import { EContractRole } from '@/enums';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { Avatar, Button, Dropdown, MenuProps } from 'antd';
import { getProgram } from '@utils/wallet';

function ConnectedButton() {
  const { publicKey, connected, wallet, disconnect, disconnecting } =
    useWallet();
  const { contractRole, setContractRole } = useContractRole();
  useEffect(() => {
    getRole().then();
  }, [publicKey]);
  if (!publicKey || !connected || !wallet) {
    return null;
  }
  const getRole = async () => {
    let isMaster = false;
    let isAdmin = false;
    if (publicKey) {
      const { program } = getProgram();
      try {
        const [masterPda] = PublicKey.findProgramAddressSync(
          [Buffer.from('master')],
          program.programId,
        );
        const masterData = await program.account.master.fetch(masterPda);
        if (masterData.masterKey.toString() === publicKey.toString()) {
          isMaster = true;
        }
        if (!isMaster) {
          try {
            const [adminPda] = PublicKey.findProgramAddressSync(
              [Buffer.from('admin'), publicKey.toBuffer()],
              program.programId,
            );
            const adminData = await program.account.admin.fetch(adminPda);
            if (
              adminData &&
              adminData.adminKey.toString() === publicKey.toString()
            ) {
              isAdmin = true;
            }
          } catch (e) {
            //
          }
        }
      } catch {
        //
      }
    }
    if (setContractRole) {
      if (isMaster) {
        setContractRole(EContractRole.MASTER);
      } else if (isAdmin) {
        setContractRole(EContractRole.ADMIN);
      } else {
        setContractRole(undefined);
      }
    }
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Button type="text" onClick={disconnect}>
          Disconnect
        </Button>
      ),
    },
  ];

  return (
    <Dropdown menu={{ items }}>
      <Button
        loading={disconnecting}
        icon={<Avatar src={wallet.adapter.icon} alt="icon" size={20} />}
      >
        <span
          style={{
            fontSize: '12px',
            fontWeight: 'bold',
            color: contractRole === EContractRole.MASTER ? 'red' : 'orange',
          }}
        >
          {contractRole ? contractRole : ''}
        </span>{' '}
        {(publicKey?.toBase58()?.slice(0, 5) || '') +
          '...' +
          (publicKey?.toBase58()?.slice(-5) || '')}
      </Button>
    </Dropdown>
  );
}

export default ConnectedButton;

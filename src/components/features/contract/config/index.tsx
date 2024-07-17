import { useEffect, useState } from 'react';
import { CARBON_IDL } from '@contracts/carbon/carbon.idl.ts';
import { ICarbonContract } from '@contracts/carbon/carbon.interface.ts';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import CenterContentLayout from '@components/common/layout/center-content/center-content.layout.tsx';
import TxModal from '@components/common/modal/tx-modal.tsx';
import ConfigScreen from '@components/features/contract/config/config.screen.tsx';
import useNotification from '@utils/helpers/my-notification.tsx';

const ContractConfig = () => {
  console.info('ContractConfig');
  const [loading, setLoading] = useState(false);
  const [myNotification] = useNotification();
  const [txModalOpen, setTxModalOpen] = useState(false);
  const { publicKey, wallet } = useWallet();
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  const getConfig = async () => {
    try {
      const provider = new AnchorProvider(connection, anchorWallet);
      const program = new Program<ICarbonContract>(
        CARBON_IDL as ICarbonContract,
        provider,
      );
      const [configContract] = PublicKey.findProgramAddressSync(
        [Buffer.from('contract_config')],
        program.programId,
      );
      const configData =
        await program.account.contractConfig.fetch(configContract);
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    getConfig().then();
  }, [connection, anchorWallet]);
  return (
    <>
      {' '}
      <TxModal open={txModalOpen} setOpen={setTxModalOpen} />
      <CenterContentLayout
        contentWidth={!connection || !anchorWallet ? '50%' : '45%'}
        contentMinWidth={'500px'}
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
          <ConfigScreen loading={true} />
        )}
      </CenterContentLayout>
    </>
  );
};

export default ContractConfig;

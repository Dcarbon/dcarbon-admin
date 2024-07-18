import { useEffect, useRef, useState } from 'react';
import { CARBON_IDL } from '@contracts/carbon/carbon.idl.ts';
import { ICarbonContract } from '@contracts/carbon/carbon.interface.ts';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import CenterContentLayout from '@components/common/layout/center-content/center-content.layout.tsx';
import TxModal from '@components/common/modal/tx-modal.tsx';
import { IConfig } from '@components/features/contract/config/config.interface.ts';
import ConfigScreen from '@components/features/contract/config/config.screen.tsx';

interface IRef {
  triggerSetConfig: (config: IConfig) => void;
}

const ContractConfig = () => {
  console.info('ContractConfig');
  const [loading, setLoading] = useState(false);
  // const [myNotification] = useNotification();
  const [txModalOpen, setTxModalOpen] = useState(false);
  const configRef = useRef<IRef>();
  // const { publicKey, wallet } = useWallet();
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  const getConfig = async () => {
    if (!anchorWallet || !connection) {
      return;
    }
    try {
      setLoading(true);
      const provider = new AnchorProvider(connection, anchorWallet);
      const program = new Program<ICarbonContract>(
        CARBON_IDL as ICarbonContract,
        provider,
      );
      const [configContract] = PublicKey.findProgramAddressSync(
        [Buffer.from('contract_config')],
        program.programId,
      );
      const data = await program.account.contractConfig.fetch(configContract);
      if (data) {
        setLoading(false);
        configRef.current?.triggerSetConfig({
          rate: data.rate.toNumber(),
          mint_fee: data.mintingFee.toNumber(), // FIXME: mock data
          collect_fee_wallet: 'Fxu7o9k8BKKAJyD94UfESH9sMrEFtoXtRRbQiiUFD1pv',
          dcarbon: {
            mint: '4gP1Dg9zaVXQsumuky64CjT4Za6fcY2mGtESfdSqhwXM',
            name: 'DCarbon Beta 1',
            symbol: 'DCAR1',
            description: 'DCarbon Beta 1 Demo',
            image:
              'https://dcarbon-dev-bucket.fabbidev.com/public/files/metadata/icon/image-1-1721275800831.jpg',
            decimals: 9,
            supply: 1000000,
          },
          carbon: {
            mint: 'GxQ9qHH5ujC2kEHei7yaVfsEvws3uE3jEQShsCrV3KzV',
            name: 'Carbon Beta 1',
            symbol: 'CARB1',
            description: 'Carbon Beta 1 Demo',
            image:
              'https://dcarbon-dev-bucket.fabbidev.com/public/files/metadata/icon/image-1-1721216768440.jpg',
            decimals: 9,
            mint_authority: 'DBfGEw3bdSm89VGMW4SQ6PvNETCW2rmPQijYpL92GSmX',
            supply: 0,
          },
        });
      }
    } catch (e) {
      setLoading(false);
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
        marginBottom={'0px'}
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
          <ConfigScreen loading={loading} ref={configRef} />
        )}
      </CenterContentLayout>
    </>
  );
};

export default ContractConfig;

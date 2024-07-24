import { useEffect, useRef, useState } from 'react';
import { ERROR_CONTRACT } from '@/constants';
import { getDeviceTypes } from '@adapters/config.ts';
import { CARBON_IDL } from '@contracts/carbon/carbon.idl.ts';
import { ICarbonContract } from '@contracts/carbon/carbon.interface.ts';
import { AnchorProvider, BN, Program } from '@coral-xyz/anchor';
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react';
import { PublicKey, TransactionInstruction } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';
import CenterContentLayout from '@components/common/layout/center-content/center-content.layout.tsx';
import TxModal from '@components/common/modal/tx-modal.tsx';
import { IConfig } from '@components/features/contract/config/config.interface.ts';
import ConfigScreen, {
  TConfigUpdate,
} from '@components/features/contract/config/config.screen.tsx';
import { QUERY_KEYS } from '@utils/constants';
import useNotification from '@utils/helpers/my-notification.tsx';
import { sendTx } from '@utils/wallet';

interface IRef {
  triggerSetConfig: (config: IConfig) => void;
}

const ContractConfig = () => {
  console.info('ContractConfig');
  const [loading, setLoading] = useState(false);
  const [refetch, setRefetch] = useState(0);
  const [myNotification] = useNotification();
  const [txModalOpen, setTxModalOpen] = useState(false);
  const configRef = useRef<IRef>();
  const { publicKey, wallet } = useWallet();
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  const { data, isLoading: deviceTypeLoading } = useQuery({
    queryKey: [QUERY_KEYS.DEVICE.TYPES],
    queryFn: getDeviceTypes,
  });
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
          device_limit: data.mintingLimits.map((info) => {
            return {
              device_type: info.deviceType,
              limit: info.limit,
            };
          }),
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
  const updateConfig = async (config: TConfigUpdate) => {
    let transaction;
    try {
      setTxModalOpen(true);
      if (!anchorWallet || !connection || !publicKey || !wallet) {
        myNotification(ERROR_CONTRACT.COMMON.CONNECT_ERROR);
        return;
      }
      const provider = new AnchorProvider(connection, anchorWallet);
      const program = new Program<ICarbonContract>(
        CARBON_IDL as ICarbonContract,
        provider,
      );
      let instructions: TransactionInstruction | undefined;
      if (config.type == 'mint_fee' && config.mint_fee) {
        instructions = await program.methods
          .setMintingFee(new BN(Number(config.mint_fee)))
          .accounts({
            signer: publicKey,
          })
          .instruction();
      } else if (config.type === 'device_limit') {
        instructions = await program.methods
          .setMintingLimit(new BN(config.d_type), new BN(config.type_limit))
          .accounts({
            signer: publicKey,
          })
          .instruction();
      }
      if (!instructions) throw new Error('instructions is required');
      const { status, tx } = await sendTx({
        connection,
        wallet,
        payerKey: publicKey,
        txInstructions: instructions,
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
    getConfig().then();
  }, [connection, anchorWallet, refetch]);
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
              textAlign: 'center',
            }}
          >
            You need to connect your wallet to continue!
          </span>
        ) : (
          <ConfigScreen
            loading={loading || deviceTypeLoading}
            ref={configRef}
            triggerUpdateConfig={updateConfig}
            deviceTypes={data}
          />
        )}
      </CenterContentLayout>
    </>
  );
};

export default ContractConfig;

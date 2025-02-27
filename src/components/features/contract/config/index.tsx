import { useEffect, useRef, useState } from 'react';
import { ERROR_CONTRACT } from '@/constants';
import { getConfigTokens, getDeviceTypes } from '@adapters/config.ts';
import { CARBON_IDL } from '@contracts/carbon/carbon.idl.ts';
import { ICarbonContract } from '@contracts/carbon/carbon.interface.ts';
import { AnchorProvider, BN, IdlTypes, Program } from '@coral-xyz/anchor';
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react';
import { PublicKey, TransactionInstruction } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';
import base58 from 'bs58';
import { ICoefficient } from '@/types/common';
import CenterContentLayout from '@components/common/layout/center-content/center-content.layout.tsx';
import TxModal from '@components/common/modal/tx-modal.tsx';
import { IConfig } from '@components/features/contract/config/config.interface.ts';
import ConfigScreen, {
  TConfigUpdate,
} from '@components/features/contract/config/config.screen.tsx';
import { QUERY_KEYS } from '@utils/constants';
import useNotification from '@utils/helpers/my-notification.tsx';
import { getProgram, sendTx } from '@utils/wallet';

interface IRef {
  triggerSetConfig: (config: IConfig) => void;
}

type ConfigArgs = IdlTypes<ICarbonContract>['configArgs'];

const ContractConfig = () => {
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
  const { data: config, isLoading: configLoading } = useQuery({
    queryKey: [QUERY_KEYS.GET_PROJECT_MODEL],
    queryFn: getConfigTokens,
  });
  const getConfig = async () => {
    try {
      setLoading(true);
      const { program } = getProgram(connection);
      const [configContract] = PublicKey.findProgramAddressSync(
        [Buffer.from('contract_config')],
        program.programId,
      );
      const [data, coefficients] = await Promise.all([
        program.account.contractConfig.fetch(configContract),
        getCoefficients(program),
      ]);
      if (data) {
        setLoading(false);
        configRef.current?.triggerSetConfig({
          rate: data.rate,
          mint_fee: data.mintingFee,
          collect_fee_wallet: data.vault.toString(),
          device_limit: data.mintingLimits.map((info) => {
            return {
              device_type: info.deviceType,
              limit: info.limit,
            };
          }),
          coefficients,
        });
      }
    } catch (e) {
      setLoading(false);
      console.error(e);
    }
  };
  const getCoefficients = async (
    program: Program<ICarbonContract>,
  ): Promise<ICoefficient[]> => {
    try {
      const data = await connection.getProgramAccounts(program.programId, {
        dataSlice: { offset: 8, length: 32 },
        filters: [
          {
            memcmp: {
              offset: 0,
              bytes: base58.encode(
                CARBON_IDL?.accounts.find(
                  (acc: { name: string; discriminator: number[] }) =>
                    acc.name === 'Coefficient',
                )?.discriminator as number[],
              ),
            },
          },
        ],
      });
      const coefficients: ICoefficient[] = [];
      await Promise.all(
        data?.map(async (info) => {
          const data = await program.account.coefficient.fetch(info.pubkey);
          coefficients.push({
            key: data.key.toString(),
            value: data.value.toString(),
            isOnChain: true,
          });
        }),
      );
      return coefficients.filter(
        (info) => info.key !== '' && info.key !== '\x00',
      );
    } catch (e) {
      console.error(e);
      myNotification(ERROR_CONTRACT.COMMON.ON_CHAIN_FETCH_ERROR);
      return [];
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
          .setMintingFee(Number(config.mint_fee))
          .accounts({
            signer: publicKey,
          })
          .instruction();
      } else if (config.type == 'rate' && config.rate) {
        instructions = await program.methods
          .setRate(Number(config.rate))
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
      } else if (config.type === 'coefficient') {
        instructions = await program.methods
          .setCoefficient(
            config.coefficient?.key,
            new BN(config.coefficient?.value.toString()),
          )
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
  const init = async (config: IConfig) => {
    let transaction;
    try {
      setTxModalOpen(true);
      if (!anchorWallet || !connection || !publicKey || !wallet) {
        myNotification(ERROR_CONTRACT.COMMON.CONNECT_ERROR);
        return;
      }
      const { program, connection: conn } = getProgram(connection);
      const [authority] = PublicKey.findProgramAddressSync(
        [Buffer.from('authority')],
        program.programId,
      );
      const dcarbonContract = await conn.getParsedTokenAccountsByOwner(
        authority,
        {
          mint: new PublicKey(config.dcarbon?.mint || ''),
        },
      );
      let dcarbonTotal = 0;
      if (dcarbonContract && dcarbonContract.value?.length > 0) {
        dcarbonTotal =
          dcarbonContract.value[0].account.data.parsed.info.tokenAmount
            .uiAmount;
      }
      if (dcarbonTotal === 0) {
        myNotification(ERROR_CONTRACT.CONTRACT.CONFIG.DCARBON_TOTAL_INVALID);
        return;
      }
      const configArgs: ConfigArgs = {
        mintingFee: config.mint_fee || 0,
        rate: config.rate || 0,
        governanceAmount: dcarbonTotal,
        vault: new PublicKey(config.collect_fee_wallet || ''),
      };

      const txIns = await program.methods
        .initConfig(configArgs)
        .accounts({
          signer: publicKey,
          mint: new PublicKey(config.carbon?.mint || ''),
          governanceMint: new PublicKey(config.dcarbon?.mint || ''),
        })
        .instruction();
      const { status, tx } = await sendTx({
        connection,
        wallet,
        payerKey: publicKey,
        txInstructions: txIns,
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
        contentWidth={'100%'}
        align={'start'}
        className={'ft-div'}
      >
        <ConfigScreen
          loading={loading || deviceTypeLoading}
          ref={configRef}
          triggerUpdateConfig={updateConfig}
          deviceTypes={data}
          configData={config}
          configLoading={configLoading}
          init={init}
        />
      </CenterContentLayout>
    </>
  );
};

export default ContractConfig;

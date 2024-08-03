import { memo, useEffect, useState } from 'react';
import { ERROR_CONTRACT } from '@/constants';
import { EIotDeviceType } from '@/enums';
import { getDeviceContractSettings } from '@adapters/config.ts';
import { FormOutlined } from '@ant-design/icons';
import { CARBON_IDL } from '@contracts/carbon/carbon.idl.ts';
import { ICarbonContract } from '@contracts/carbon/carbon.interface.ts';
import { AnchorProvider, BN, IdlTypes, Program } from '@coral-xyz/anchor';
import { AnchorWallet, Wallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, TransactionInstruction } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { Flex, Form, Switch } from 'antd';
import SubmitButton from '@components/common/button/submit-button.tsx';
import SkeletonInput from '@components/common/input/skeleton-input.tsx';
import TxModal from '@components/common/modal/tx-modal.tsx';
import { IDeviceSettingState } from '@components/features/project/devices/column.tsx';
import { QUERY_KEYS } from '@utils/constants';
import useNotification from '@utils/helpers/my-notification.tsx';
import { sendTx } from '@utils/wallet';

interface IProps {
  projectId: string;
  device: IDeviceSettingState;
  owner: string;
  closeSettingModel: (status: IDeviceSettingState | undefined) => void;
  anchorWallet?: AnchorWallet;
  connection?: Connection;
  publicKey: PublicKey | null;
  wallet: Wallet | null;
  refetch: () => void;
  activeDevices?: string[];
}

interface IFormValues {
  project_id: string;
  device_id: string;
  device_type: EIotDeviceType;
  owner: string;
  minter?: string;
  isOnChainSetting?: boolean;
  active?: boolean;
  currentActive?: boolean;
}

type RegisterDeviceArgs = IdlTypes<ICarbonContract>['registerDeviceArgs'];

const DeviceSetting = memo(
  ({
    projectId,
    device,
    closeSettingModel,
    owner,
    anchorWallet,
    connection,
    publicKey,
    wallet,
    refetch,
    activeDevices,
  }: IProps) => {
    const [form] = Form.useForm<IFormValues>();
    const [myNotification] = useNotification();
    const [txModalOpen, setTxModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { data, isLoading } = useQuery({
      queryKey: [QUERY_KEYS.DEVICE.CONTRACT_SETTINGS],
      queryFn: getDeviceContractSettings,
    });
    const getDeviceSetting = async () => {
      let initData: IFormValues | undefined;
      let isActive = false;
      try {
        if (!anchorWallet || !connection || !publicKey || !wallet) {
          myNotification(ERROR_CONTRACT.COMMON.CONNECT_ERROR);
          return;
        }
        setLoading(true);
        const provider = new AnchorProvider(connection, anchorWallet);
        const program = new Program<ICarbonContract>(
          CARBON_IDL as ICarbonContract,
          provider,
        );
        const [deviceSettingProgram] = PublicKey.findProgramAddressSync(
          [
            Buffer.from('device'),
            new BN(Number(projectId)).toBuffer('le', 2),
            new BN(Number(device?.id)).toBuffer('le', 2),
          ],
          program.programId,
        );
        try {
          const data = await program.account.device.fetch(deviceSettingProgram);
          if (data) {
            initData = {
              device_id: device.id,
              project_id: projectId,
              device_type: data.deviceType,
              isOnChainSetting: true,
              owner: data.owner.toString(),
              minter: data.minter.toString(),
              active: false,
            };
          }
        } catch (e2) {
          //
        }
        try {
          const [deviceStatusProgram] = PublicKey.findProgramAddressSync(
            [
              Buffer.from('device_status'),
              new BN(Number(device?.id)).toBuffer('le', 2),
            ],
            program.programId,
          );
          const activeData =
            await program.account.deviceStatus.fetch(deviceStatusProgram);
          isActive = activeData.isActive;
        } catch (e) {
          isActive = false;
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!initData) {
          initData = {
            device_id: device.id,
            project_id: projectId,
            device_type: device.type.id,
            owner,
            active: true,
            currentActive: isActive,
          };
        }
        form.setFieldsValue({
          ...initData,
        });
        setLoading(false);
      }
    };
    useEffect(() => {
      getDeviceSetting().then();
    }, []);
    useEffect(() => {
      if (data && data.devices_limit) {
        const deviceLimit = data?.devices_limit?.find(
          (info) => info.id === device.type?.id,
        );
        if (deviceLimit) {
          form.setFieldValue('mingting_limit', deviceLimit.limit);
        }
      }
      if (data && data.mint_signers && data.mint_signers.length > 0) {
        form.setFieldValue('minter', data.mint_signers[0]);
      }
    }, [data]);
    const submitSetting = async (values: IFormValues) => {
      let transaction;
      try {
        if (!anchorWallet || !connection || !publicKey || !wallet) {
          return;
        }
        setTxModalOpen(true);
        const provider = new AnchorProvider(connection, anchorWallet);
        const program = new Program<ICarbonContract>(
          CARBON_IDL as ICarbonContract,
          provider,
        );
        const registerDeviceArgs: RegisterDeviceArgs = {
          projectId: Number(values.project_id),
          deviceId: Number(values.device_id),
          deviceType: Number(values.device_type),
          owner: new PublicKey(values.owner),
          minter: new PublicKey(values.minter || ''),
        };
        const insArray: TransactionInstruction[] = [];
        const registerDeviceIns = await program.methods
          .registerDevice(registerDeviceArgs)
          .accounts({
            signer: publicKey,
          })
          .instruction();
        insArray.push(registerDeviceIns);
        if (values.active && !values.currentActive) {
          const activeDeviceIns = await program.methods
            .setActive(Number(values.project_id), Number(values.device_id))
            .accounts({
              signer: publicKey,
            })
            .instruction();
          insArray.push(activeDeviceIns);
        }
        const { status, tx } = await sendTx({
          connection,
          wallet,
          payerKey: publicKey,
          arrTxInstructions: insArray,
        });
        transaction = tx;
        setTxModalOpen(false);
        if (status === 'reject') return;
        myNotification({
          description: transaction,
          type: status,
          tx_type: 'tx',
        });
        closeSettingModel(undefined);
        refetch();
      } catch (e) {
        setTxModalOpen(false);
        myNotification(ERROR_CONTRACT.COMMON.TX_ERROR);
        console.error(e);
      }
    };
    return (
      <>
        {' '}
        <TxModal open={txModalOpen} setOpen={setTxModalOpen} />
        {!connection || !anchorWallet ? (
          <span
            style={{
              fontSize: '18px',
              fontWeight: '500',
              color: 'orange',
              textAlign: 'center',
            }}
          >
            You need to connect your wallet to continue!
          </span>
        ) : (
          <Form
            form={form}
            layout="vertical"
            style={{ width: '100%', marginTop: '30px' }}
            onFinish={(values) => submitSetting(values)}
            disabled={loading || form.getFieldValue('isOnChainSetting')}
          >
            <Form.Item style={{ marginBottom: 0 }}>
              <Form.Item
                label="Project ID"
                name="project_id"
                initialValue={projectId}
                rules={[
                  {
                    required: true,
                  },
                ]}
                style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
              >
                <SkeletonInput loading={loading} disabled />
              </Form.Item>
              <Form.Item
                label="Device ID"
                name="device_id"
                initialValue={device?.id}
                rules={[
                  {
                    required: true,
                  },
                ]}
                style={{
                  display: 'inline-block',
                  width: 'calc(50%)',
                  margin: '0px 0px 0px 8px',
                }}
              >
                <SkeletonInput loading={loading} disabled />
              </Form.Item>
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <Form.Item
                label="Minting Limit"
                name="mingting_limit"
                rules={[
                  {
                    required: true,
                    message: (
                      <span>
                        Need to <Link to={'/contract?tab=3'}>setting</Link>{' '}
                        minting limit
                      </span>
                    ),
                  },
                ]}
                style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
              >
                <SkeletonInput loading={loading || isLoading} disabled />
              </Form.Item>
              <Form.Item
                label="Device Type"
                name="device_type"
                initialValue={device?.type?.id}
                rules={[
                  {
                    required: true,
                  },
                ]}
                style={{
                  display: 'inline-block',
                  width: 'calc(50%)',
                  margin: '0px 0px 0px 8px',
                }}
              >
                <SkeletonInput loading={loading} disabled />
              </Form.Item>
            </Form.Item>
            <Form.Item label="Active" name="active">
              <Switch
                defaultChecked={activeDevices?.includes(device.id)}
                loading={loading || isLoading}
                disabled={
                  form.getFieldValue('isOnChainSetting') ||
                  form.getFieldValue('currentActive')
                }
              />
            </Form.Item>
            <Form.Item
              label="Owner"
              name="owner"
              initialValue={owner}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <SkeletonInput
                disabled
                loading={loading}
                placeholder={'Enter Owner address'}
              />
            </Form.Item>
            <Form.Item
              label="Minter"
              name="minter"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <SkeletonInput
                loading={loading}
                disabled
                placeholder={'Enter Minter address'}
              />
            </Form.Item>
            <Flex justify={'center'} style={{ marginTop: '30px' }}>
              <SubmitButton
                htmlType="submit"
                icon={<FormOutlined />}
                disabled={
                  loading || form.getFieldValue('isOnChainSetting') || isLoading
                }
              >
                Register
              </SubmitButton>
            </Flex>
          </Form>
        )}
      </>
    );
  },
);
export default DeviceSetting;

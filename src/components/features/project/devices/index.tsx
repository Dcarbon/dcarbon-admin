import { memo, useEffect, useState } from 'react';
import { ERROR_CONTRACT, ERROR_MSG, SUCCESS_MSG } from '@/constants';
import { addDevices, getIoTDevice } from '@adapters/project.ts';
import { EditFilled, PlusOutlined } from '@ant-design/icons';
import { DEFAULT_PAGING } from '@constants/common.constant.ts';
import { CARBON_IDL } from '@contracts/carbon/carbon.idl.ts';
import { ICarbonContract } from '@contracts/carbon/carbon.interface.ts';
import { AnchorProvider, BN, Program } from '@coral-xyz/anchor';
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Flex, Modal } from 'antd';
import { createStyles } from 'antd-style';
import { IDeviceRequest } from '@/types/device';
import SubmitButton from '@components/common/button/submit-button.tsx';
import TxModal from '@components/common/modal/tx-modal.tsx';
import MyTable from '@components/common/table/my-table.tsx';
import DeviceTable from '@components/features/project/device-modal/table.tsx';
import ProjectDevicesColumn, {
  IDeviceSettingState,
  IOnChainSettingProps,
} from '@components/features/project/devices/column.tsx';
import DeviceSetting from '@components/features/project/devices/device-setting.tsx';
import { QUERY_KEYS } from '@utils/constants';
import useNotification from '@utils/helpers/my-notification.tsx';
import { sendTx } from '@utils/wallet';

interface IProps {
  projectSlug: string;
}

const useStyle = createStyles(() => ({
  'my-modal-mask': {
    boxShadow: `inset 0 0 15px #fff`,
  },
  'my-modal-content': {
    border: '1px solid #333',
  },
}));

const ProjectDevices = memo(({ projectSlug }: IProps) => {
  const [search, setSearch] = useState<IDeviceRequest>({
    page: DEFAULT_PAGING.page,
    limit: 9999,
    project_id: projectSlug,
  } as IDeviceRequest);
  const [openDeviceSetting, setOpenDeviceSetting] = useState<
    IDeviceSettingState | undefined
  >(undefined);
  const [txModalOpen, setTxModalOpen] = useState(false);
  const [loadingActive, setLoadingActive] = useState('0');
  const [onChainSetting, setOnChainSetting] = useState<IOnChainSettingProps>({
    isLoading: false,
    registerDevices: [],
    activeDevices: [],
    nonceInfo: [],
  });
  const [openModifyDevices, setOpenModifyDevices] = useState(false);
  const [selectedDevice, setSelectDevice] = useState<string[]>([]);
  const [refetch, setRefetch] = useState(0);
  const { publicKey, wallet } = useWallet();
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  const queryClient = useQueryClient();
  const [myNotification] = useNotification();
  const openSetting = (device: IDeviceSettingState) => {
    if (!anchorWallet || !connection || !publicKey || !wallet) {
      myNotification(ERROR_CONTRACT.COMMON.CONNECT_ERROR);
      return;
    }
    setOpenDeviceSetting(device);
  };
  const { data: devices, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.GET_IOT_MODELS, search],
    queryFn: () => getIoTDevice(search),
    staleTime: 0,
    enabled:
      !!search.project_id &&
      (!!search.id ||
        !!search.status ||
        !!search.type ||
        !!search.page ||
        true),
  });
  const active = async (id: string) => {
    let transaction;
    try {
      if (!anchorWallet || !connection || !publicKey || !wallet) {
        myNotification(ERROR_CONTRACT.COMMON.CONNECT_ERROR);
        return;
      }
      setLoadingActive(id);
      const provider = new AnchorProvider(connection, anchorWallet);
      const program = new Program<ICarbonContract>(
        CARBON_IDL as ICarbonContract,
        provider,
      );
      const activeDeviceIns = await program.methods
        .setActive(Number(projectSlug), Number(id))
        .accounts({
          signer: publicKey,
        })
        .instruction();
      const { status, tx } = await sendTx({
        connection,
        wallet,
        payerKey: publicKey,
        txInstructions: activeDeviceIns,
      });
      transaction = tx;
      setTxModalOpen(false);
      if (status === 'reject') return;
      myNotification({
        description: transaction,
        type: status,
        tx_type: 'tx',
      });
    } catch (e) {
      //
    } finally {
      setRefetch((prevState) => prevState + 1);
      setLoadingActive('0');
    }
  };
  const getOnChainSetting = async () => {
    try {
      if (!anchorWallet || !connection || !publicKey || !wallet) {
        return;
      }
      if (!devices || !devices.data || devices.data.length === 0) return;
      setOnChainSetting({
        isLoading: true,
        registerDevices: [],
        activeDevices: [],
        nonceInfo: [],
      });
      const provider = new AnchorProvider(connection, anchorWallet);
      const program = new Program<ICarbonContract>(
        CARBON_IDL as ICarbonContract,
        provider,
      );
      const activeDevices: string[] = [];
      const registerDevices: string[] = [];
      const nonceInfo: { deviceId: string; nonce: number }[] = [];
      const lastMintTime: { deviceId: string; time: number }[] = [];
      await Promise.all(
        devices.data.map(async (device) => {
          try {
            const [deviceSettingProgram] = PublicKey.findProgramAddressSync(
              [
                Buffer.from('device'),
                new BN(Number(projectSlug)).toBuffer('le', 2),
                new BN(Number(device.iot_device_id)).toBuffer('le', 2),
              ],
              program.programId,
            );
            const register =
              await program.account.device.fetch(deviceSettingProgram);
            if (register && register.id) {
              registerDevices.push(device.iot_device_id);
            }
          } catch (e) {
            //
          }
          try {
            const [deviceStatusProgram] = PublicKey.findProgramAddressSync(
              [
                Buffer.from('device_status'),
                new BN(Number(device.iot_device_id)).toBuffer('le', 2),
              ],
              program.programId,
            );
            const activeData =
              await program.account.deviceStatus.fetch(deviceStatusProgram);
            if (activeData.isActive) activeDevices.push(device.iot_device_id);
            if (activeData) {
              nonceInfo.push({
                deviceId: device.iot_device_id,
                nonce: activeData.nonce || 0,
              });
              if (activeData.lastMintTime) {
                lastMintTime.push({
                  deviceId: device.iot_device_id,
                  time: activeData.lastMintTime.toNumber(),
                });
              }
            }
          } catch (e) {
            //
          }
        }),
      );
      setOnChainSetting({
        isLoading: false,
        activeDevices: activeDevices,
        registerDevices: registerDevices,
        nonceInfo,
        lastMintTime,
      });
    } catch (e) {
      setOnChainSetting({
        isLoading: false,
        registerDevices: [],
        activeDevices: [],
        nonceInfo: [],
      });
    }
  };
  useEffect(() => {
    if (devices && devices.data?.length > 0) {
      setSelectDevice(devices.data.map((dv) => dv.iot_device_id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devices?.data]);
  useEffect(() => {
    if (devices && devices.data && devices.data.length > 0) {
      getOnChainSetting().then();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devices?.data, anchorWallet, connection, refetch]);
  const { mutateAsync } = useMutation({
    mutationFn: addDevices,
    onSuccess: () => {
      myNotification({
        type: 'success',
        description: SUCCESS_MSG.PROJECT.ADD_DEVICES_SUCCESS,
      });
      queryClient
        .invalidateQueries({
          queryKey: [QUERY_KEYS.GET_IOT_MODELS, search],
        })
        .then();
    },
    onError: (error: any) => {
      myNotification({
        message: ERROR_MSG.PROJECT.ADD_DEVICES_ERROR,
        description: error.message || ERROR_MSG.COMMON.DEFAULT_ERROR,
      });
      if (devices && devices.data?.length > 0) {
        setSelectDevice(devices.data?.map((info) => info.iot_device_id));
      }
    },
  });
  const { styles } = useStyle();
  const classNames = {
    mask: styles['my-modal-mask'],
    content: styles['my-modal-content'],
  };

  const modalStyles = {
    mask: {
      backdropFilter: 'blur(10px)',
    },
    content: {
      boxShadow: '0 0 30px #999',
      borderRadius: 'var(--div-radius)',
    },
  };
  const columns = ProjectDevicesColumn({
    openSetting,
    active,
    loadingActive,
    onChainSetting,
    connectWallet: !!anchorWallet && !!connection && !!publicKey && !!wallet,
  });
  const handleAddDevices = async (): Promise<void> => {
    await mutateAsync({
      project_id: projectSlug,
      device_ids: selectedDevice?.map((device) => device) || [],
    });
  };
  const triggerRefetch = () => {
    setRefetch((prevState) => prevState + 1);
  };
  return (
    <>
      <TxModal open={txModalOpen} setOpen={setTxModalOpen} />
      <Flex justify="end" className="project-action-bar">
        <SubmitButton
          disabled={isLoading}
          icon={
            isLoading || !devices || devices?.data?.length === 0 ? (
              <PlusOutlined />
            ) : (
              <EditFilled />
            )
          }
          onClick={() => setOpenModifyDevices(true)}
        >
          Devices
        </SubmitButton>
      </Flex>
      <DeviceTable
        open={openModifyDevices}
        setOpen={setOpenModifyDevices}
        selectedDevice={selectedDevice}
        setSelectDevice={setSelectDevice}
        handleAddDevices={handleAddDevices}
      />
      {openDeviceSetting && (
        <Modal
          open={!!openDeviceSetting?.id}
          title={'Device register (On Chain)'}
          centered
          destroyOnClose
          maskClosable={false}
          onCancel={() => setOpenDeviceSetting(undefined)}
          onOk={() => setOpenDeviceSetting(undefined)}
          onClose={() => setOpenDeviceSetting(undefined)}
          footer={null}
          classNames={classNames}
          styles={modalStyles}
        >
          <DeviceSetting
            projectId={projectSlug}
            owner={'FjMxh8u7VxzhFN8KHGYZFNWxcE71rVVvxyzZcUYwMobx'} // FIXME: hardcode
            device={openDeviceSetting}
            closeSettingModel={setOpenDeviceSetting}
            anchorWallet={anchorWallet}
            connection={connection}
            wallet={wallet}
            publicKey={publicKey}
            refetch={triggerRefetch}
          />
        </Modal>
      )}
      <MyTable
        columns={columns}
        rowKey={'id'}
        key={'id'}
        loading={
          isLoading
            ? {
                spinning: isLoading,
                indicator: <div />,
              }
            : false
        }
        dataSource={isLoading || !devices ? [] : devices.data}
        scroll={{ y: '55vh' }}
        pagination={{
          pageSize: devices?.paging.limit || 12,
          total: devices?.paging.total || 1,
          current: devices?.paging.page || 1,
          onChange: (page) => setSearch({ ...search, page }),
        }}
      />
    </>
  );
});
export default ProjectDevices;

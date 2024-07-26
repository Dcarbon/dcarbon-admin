import { memo, useEffect, useState } from 'react';
import { ERROR_MSG, SUCCESS_MSG } from '@/constants';
import { addDevices, getIoTDevice } from '@adapters/project.ts';
import { EditFilled, PlusOutlined } from '@ant-design/icons';
import { DEFAULT_PAGING } from '@constants/common.constant.ts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Flex, Modal } from 'antd';
import { createStyles } from 'antd-style';
import { IDeviceRequest } from '@/types/device';
import SubmitButton from '@components/common/button/submit-button.tsx';
import MyTable from '@components/common/table/my-table.tsx';
import DeviceTable from '@components/features/project/device-modal/table.tsx';
import ProjectDevicesColumn from '@components/features/project/devices/column.tsx';
import { QUERY_KEYS } from '@utils/constants';
import useModalAction from '@utils/helpers/back-action.tsx';
import useNotification from '@utils/helpers/my-notification.tsx';

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
  const [openDeviceSetting, setOpenDeviceSetting] = useState<string>('__');
  const [openModifyDevices, setOpenModifyDevices] = useState(false);
  const [selectedDevice, setSelectDevice] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const [myNotification] = useNotification();
  const openSetting = (deviceId: string) => {
    setOpenDeviceSetting(deviceId);
  };
  const cancelModal = useModalAction({
    danger: true,
    fn: () => setOpenDeviceSetting('__'),
  });
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
  useEffect(() => {
    if (devices && devices.data?.length > 0) {
      setSelectDevice(devices.data.map((dv) => dv.iot_device_id));
    }
  }, [devices?.data]);
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
  const columns = ProjectDevicesColumn({ openSetting });
  const handleAddDevices = async (): Promise<void> => {
    await mutateAsync({
      project_id: projectSlug,
      device_ids: selectedDevice?.map((device) => device) || [],
    });
  };
  return (
    <>
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
      <Modal
        open={openDeviceSetting !== '__'}
        title={'Device register (On Chain)'}
        centered
        destroyOnClose
        maskClosable
        width={'calc(100vw / 2)'}
        onCancel={() => cancelModal()}
        onOk={() => setOpenDeviceSetting('__')}
        onClose={() => setOpenDeviceSetting('__')}
        classNames={classNames}
        styles={modalStyles}
      >
        <h3>{openDeviceSetting}</h3>
      </Modal>
      <MyTable
        columns={columns}
        rowKey={'id'}
        dataSource={isLoading || !devices ? [] : devices.data}
        scroll={{ y: '55vh' }}
        pagination={{
          pageSize: devices?.paging.limit || 1,
          total: devices?.paging.total || 1,
          current: devices?.paging.page || 1,
          onChange: (page) => setSearch({ ...search, page }),
        }}
      />
    </>
  );
});
export default ProjectDevices;

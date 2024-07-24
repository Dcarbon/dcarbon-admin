import { memo, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Flex, Modal } from 'antd';
import { createStyles } from 'antd-style';
import { DeviceDataType } from '@/types/device';
import { DeviceType } from '@/types/projects';
import SubmitButton from '@components/common/button/submit-button.tsx';
import MyInputSearch from '@components/common/input/my-input-search.tsx';
import MyTable from '@components/common/table/my-table.tsx';
import DeviceTable from '@components/features/project/device-modal/table.tsx';
import ProjectDevicesColumn from '@components/features/project/devices/column.tsx';
import useModalAction from '@utils/helpers/back-action.tsx';

interface IProps {
  devices: DeviceDataType[];
}

const useStyle = createStyles(() => ({
  'my-modal-mask': {
    boxShadow: `inset 0 0 15px #fff`,
  },
  'my-modal-content': {
    border: '1px solid #333',
  },
}));

const ProjectDevices = memo(({ devices }: IProps) => {
  const [openDeviceSetting, setOpenDeviceSetting] = useState<string>('__');
  const [openModifyDevices, setOpenModifyDevices] = useState(false);
  const [selectedDevice, setSelectDevice] = useState<DeviceType[]>([]);
  const openSetting = (deviceId: string) => {
    setOpenDeviceSetting(deviceId);
  };
  const cancelModal = useModalAction({
    danger: true,
    fn: () => setOpenDeviceSetting('__'),
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
  return (
    <>
      <Flex justify="space-between" className="project-action-bar">
        <MyInputSearch
          placeholder="Input search text"
          allowClear
          className="project-search-bar"
          // onSearch={handleSearch}
        />
        <SubmitButton
          icon={<PlusOutlined />}
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
      <MyTable columns={columns} rowKey={'id'} dataSource={devices} />
    </>
  );
});
export default ProjectDevices;

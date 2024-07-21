import { memo, useState } from 'react';
import { Modal } from 'antd';
import { createStyles } from 'antd-style';
import { DeviceDataType } from '@/types/device';
import MyTable from '@components/common/table/my-table.tsx';
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
  const [deviceSetting, setDeviceSetting] = useState<string>('__');
  const openSetting = (deviceId: string) => {
    setDeviceSetting(deviceId);
  };
  const cancelModal = useModalAction({
    danger: true,
    fn: () => setDeviceSetting('__'),
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
      <Modal
        open={deviceSetting !== '__'}
        title={'Device register (On Chain)'}
        centered
        destroyOnClose
        maskClosable
        width={'calc(100vw / 2)'}
        onCancel={() => cancelModal()}
        onOk={() => setDeviceSetting('__')}
        onClose={() => setDeviceSetting('__')}
        classNames={classNames}
        styles={modalStyles}
      >
        <h3>{deviceSetting}</h3>
      </Modal>
      <MyTable columns={columns} rowKey={'id'} dataSource={devices} />
    </>
  );
});
export default ProjectDevices;

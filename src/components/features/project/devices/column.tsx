import { EIotDeviceStatus } from '@/enums';
import { SettingOutlined } from '@ant-design/icons';
import { Button, Space, TableColumnsType, Tag } from 'antd';
import {
  DeviceDataType,
  TIotDeviceStatus,
  TIotDeviceType,
} from '@/types/device';

import './project-devices.css';

interface IProps {
  openSetting: (deviceId: string) => void;
}

const ProjectDevicesColumn = ({ openSetting }: IProps) => {
  const renderTag = (data: TIotDeviceStatus) => {
    let color = 'orange';
    switch (data.id) {
      case EIotDeviceStatus.NONE:
        color = 'orange';
        break;
      case EIotDeviceStatus.REGISTER:
        color = 'geekblue';
        break;
      case EIotDeviceStatus.SUCCESS:
        color = 'green';
        break;
      case EIotDeviceStatus.REJECT:
        color = 'red';
        break;
    }
    return (
      <Tag
        style={{
          minWidth: '80px',
          textAlign: 'center',
          fontSize: '12px',
        }}
        color={color}
      >
        {data.name}
      </Tag>
    );
  };

  const columns: TableColumnsType<DeviceDataType> = [
    {
      title: 'ID',
      dataIndex: 'iot_device_id',
      key: 'iot_device_id',
      fixed: 'left',
    },
    {
      title: 'Name',
      dataIndex: 'device_name',
      key: 'device_name',
    },
    {
      title: 'Type',
      dataIndex: 'device_type',
      key: 'device_type',
      render: (type: TIotDeviceType) => (
        <Tag
          style={{
            minWidth: '98px',
            textAlign: 'center',
            fontSize: '12px',
          }}
          color={'blue'}
        >
          {type.name}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: TIotDeviceStatus) => <span>{renderTag(status)}</span>,
    },
    {
      title: 'Token',
      // dataIndex: 'status',
      // key: 'status',
      // render: (status: TIotDeviceStatus) => <span>{renderTag(status)}</span>,
    },
    {
      title: 'Active',
      // dataIndex: 'status',
      // key: 'status',
      // render: (status: TIotDeviceStatus) => <span>{renderTag(status)}</span>,
    },
    {
      title: 'Nonce',
      // dataIndex: 'status',
      // key: 'status',
      // render: (status: TIotDeviceStatus) => <span>{renderTag(status)}</span>,
    },
    {
      title: 'Owner',
      // dataIndex: 'status',
      // key: 'status',
      // render: (status: TIotDeviceStatus) => <span>{renderTag(status)}</span>,
    },
    {
      title: 'Signer',
      // dataIndex: 'status',
      // key: 'status',
      // render: (status: TIotDeviceStatus) => <span>{renderTag(status)}</span>,
    },
    {
      title: 'Action',
      fixed: 'right',
      width: 100,
      render: (device: DeviceDataType) => (
        <Space className={'active-div'}>
          <Button
            icon={<SettingOutlined />}
            onClick={() => openSetting(device.iot_device_id.toString())}
          />
        </Space>
      ),
    },
  ];
  return columns;
};

export default ProjectDevicesColumn;

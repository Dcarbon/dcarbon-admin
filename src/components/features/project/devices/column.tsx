import { EIotDeviceStatus, EIotDeviceType } from '@/enums';
import Icon, {
  ExclamationCircleOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import {
  Button,
  Skeleton,
  Space,
  Switch,
  TableColumnsType,
  Tag,
  Tooltip,
} from 'antd';
import {
  DeviceDataType,
  TIotDeviceStatus,
  TIotDeviceType,
} from '@/types/device';

import './project-devices.css';

import DotIcon from '@icons/dot.icon.tsx';
import WalletIcon from '@icons/wallet.icon.tsx';
import { Link } from '@tanstack/react-router';

const OnChainIc = () => (
  <Icon
    size={20}
    component={() => <WalletIcon size={22} color={'var(--main-color)'} />}
  />
);

const StarIc = () => (
  <Icon component={() => <DotIcon size={22} color={'var(--main-color)'} />} />
);

export interface IDeviceSettingState {
  id: string;
  type: {
    name: string;
    id: EIotDeviceType;
  };
  limit?: number;
}

interface IProps {
  openSetting: (device: IDeviceSettingState, mode?: string) => void;
  active: (id: string, status: boolean) => void;
  loadingActive?: string;
  onChainSetting: IOnChainSettingProps;
  connectWallet?: boolean;
}

export interface IOnChainSettingProps {
  isLoading?: boolean;
  activeDevices: string[];
  registerDevices: string[];
  nonceInfo: { deviceId: string; nonce: number }[];
  lastMintTime?: { deviceId: string; time: number }[];
}

const ProjectDevicesColumn = ({
  openSetting,
  active,
  loadingActive,
  onChainSetting,
}: IProps) => {
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
      title: (
        <Tooltip title={'OnChain data'}>
          <span style={{ display: 'flex' }}>
            <span>Active</span>
            <OnChainIc />
          </span>{' '}
        </Tooltip>
      ),
      render: (device: DeviceDataType) => {
        return onChainSetting?.isLoading ? (
          <Skeleton.Button style={{ height: '25px' }} active />
        ) : (
          <Space style={{ display: 'flex', alignItems: 'center' }}>
            <Switch
              defaultChecked={onChainSetting.activeDevices.includes(
                device.iot_device_id,
              )}
              disabled={
                loadingActive !== '0' ||
                (!onChainSetting.registerDevices.includes(
                  device.iot_device_id,
                ) &&
                  !onChainSetting.activeDevices.includes(device.iot_device_id))
              }
              loading={loadingActive === device.iot_device_id}
              onChange={(status) => active(device.iot_device_id, status)}
            />
            {!onChainSetting.registerDevices.includes(device.iot_device_id) &&
              !onChainSetting.activeDevices.includes(device.iot_device_id) && (
                <Tooltip title={'Need to register device first'}>
                  <ExclamationCircleOutlined
                    style={{ color: 'orange', fontSize: '18px' }}
                  />
                </Tooltip>
              )}
          </Space>
        );
      },
    },
    {
      title: (
        <Tooltip title={'OnChain data'}>
          <span style={{ display: 'flex' }}>
            <span>Nonce</span>
            <OnChainIc />
          </span>{' '}
        </Tooltip>
      ),
      render: (device: DeviceDataType) => {
        const match = onChainSetting?.nonceInfo?.find(
          (info) => info.deviceId === device.iot_device_id,
        );
        return onChainSetting?.isLoading ? (
          <Skeleton.Button style={{ height: '25px' }} active />
        ) : (
          <span
            style={{
              fontWeight: 'bold',
              fontSize: '1.1em',
              color: 'var(--main-color)',
            }}
          >
            {match ? match.nonce : 0}
          </span>
        );
      },
    },
    {
      title: (
        <Tooltip title={'OnChain data'}>
          <span style={{ display: 'flex' }}>
            <span>Last Minted</span>
            <OnChainIc />
          </span>{' '}
        </Tooltip>
      ),
      render: (device: DeviceDataType) => {
        const match = onChainSetting?.lastMintTime?.find(
          (info) => info.deviceId === device.iot_device_id,
        );
        return onChainSetting?.isLoading ? (
          <Skeleton.Button style={{ height: '25px' }} active />
        ) : (
          <span>
            {match && match.time > 0
              ? new Date(match.time * 1000).toLocaleString('vi-VN')
              : ''}
          </span>
        );
      },
    },
    {
      title: (
        <Tooltip title={'OnChain data'}>
          <span style={{ display: 'flex' }}>
            <span>Register</span>
            <OnChainIc />
          </span>{' '}
        </Tooltip>
      ),
      render: (device: DeviceDataType) => {
        return onChainSetting?.isLoading ? (
          <Skeleton.Button style={{ height: '25px' }} active />
        ) : onChainSetting.registerDevices.includes(device.iot_device_id) ? (
          <StarIc />
        ) : (
          ''
        );
      },
    },
    {
      title: 'Action',
      fixed: 'right',
      width: 100,
      render: (device: DeviceDataType) => (
        <Space className={'active-div'}>
          {onChainSetting.registerDevices.includes(device.iot_device_id) ? (
            <Link
              onClick={() =>
                openSetting(
                  {
                    id: device.iot_device_id.toString(),
                    type: {
                      id: device.device_type.id,
                      name: device.device_name,
                    },
                  },
                  'view',
                )
              }
            >
              View
            </Link>
          ) : (
            <Button
              disabled={loadingActive !== '0' || onChainSetting?.isLoading}
              icon={<SettingOutlined />}
              onClick={() =>
                openSetting({
                  id: device.iot_device_id.toString(),
                  type: {
                    id: device.device_type.id,
                    name: device.device_name,
                  },
                })
              }
            />
          )}
        </Space>
      ),
    },
  ];
  return columns;
};

export default ProjectDevicesColumn;

import React, { memo, useState } from 'react';
import { getIoTDevice } from '@/adapters/project';
import { QUERY_KEYS } from '@/utils/constants';
import { useQuery } from '@tanstack/react-query';
import { Flex, Input, Modal, Select, Table } from 'antd';

import columns from './column';

type DeviceTableProps = {
  setSelectDevice: React.Dispatch<React.SetStateAction<DeviceType[]>>;
  selectedDevice: DeviceType[];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onOk?: () => void;
};
const { Option } = Select;
const DeviceTable = memo(
  ({
    open,
    setOpen,
    setSelectDevice,
    selectedDevice,
    onOk,
  }: DeviceTableProps) => {
    const [search, setSearch] = useState<IDeviceRequest>({
      page: 1,
    } as IDeviceRequest);
    const { data, isLoading } = useQuery({
      queryKey: [QUERY_KEYS.GET_IOT_MODELS, search],
      queryFn: () => getIoTDevice(search),
      staleTime: 0,
      enabled:
        !!search.id ||
        !!search.status ||
        !!search.type ||
        !!search.page ||
        true,
    });
    return (
      <Modal
        open={open}
        title="Select Device"
        centered
        destroyOnClose
        maskClosable
        onCancel={() =>
          Modal.confirm({
            title: 'Are you sure you want to cancel?',
            content: 'All changes will be lost!',
            onOk: () => setOpen(false),
            centered: true,
          })
        }
        onOk={onOk ? onOk : () => setOpen(false)}
        onClose={() => setOpen(false)}
      >
        <Flex className="device-modal" gap={10}>
          <Input.Search
            placeholder="Search"
            onSearch={(e) => setSearch({ ...search, id: e })}
          />
          <Select
            placeholder="Status"
            className="device-modal-select"
            onChange={(value) =>
              setSearch({
                ...search,
                status: value as string,
              })
            }
          >
            <Option value="active">Active</Option>
            <Option value="de_active">De Active</Option>
          </Select>
          <Select
            placeholder="Type"
            className="device-modal-select"
            onChange={(value) =>
              setSearch({
                ...search,
                type: value as string,
              })
            }
          >
            {data?.data.map((device) => (
              <Option value={device.device_type}>{device.device_type}</Option>
            ))}
          </Select>
        </Flex>
        <Table
          rowSelection={{
            type: 'checkbox',
            defaultSelectedRowKeys: selectedDevice.map(
              (device) => device.iot_device_id,
            ),
            onChange: (_selectedRowKeys, selectedRows) => {
              const data = selectedRows.map((device) => ({
                iot_device_id: device.iot_device_id,
                iot_device_type: device.device_type,
              }));
              setSelectDevice(data);
            },
          }}
          columns={columns}
          key={'iot_device_id'}
          loading={isLoading}
          dataSource={data?.data as DeviceDataType[]}
          rowKey="iot_device_id"
        />
      </Modal>
    );
  },
);

export default DeviceTable;

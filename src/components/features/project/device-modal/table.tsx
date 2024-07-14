import React, { memo, useState } from 'react';
import { getIoTDevice } from '@/adapters/project';
import { QUERY_KEYS } from '@/utils/constants';
import useModalAction from '@/utils/helpers/back-action.tsx';
import { useQuery } from '@tanstack/react-query';
import { Flex, Input, Modal, Select, Space, Typography } from 'antd';
import MyTable from '@components/common/table/my-table.tsx';

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
    const cancelModal = useModalAction({
      danger: true,
      fn: () => setOpen(false),
    });

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
        title={
          <Space size={10}>
            Select Device{' '}
            <Typography.Text type="secondary">{`(selected: ${selectedDevice.length})`}</Typography.Text>
          </Space>
        }
        centered
        destroyOnClose
        maskClosable
        onCancel={
          () => cancelModal()
          // Modal.confirm({
          //   title: 'Are you sure you want to cancel?',
          //   content: 'All changes will be lost!',
          //   onOk: () => setOpen(false),
          //   centered: true,
          // })
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
            onChange={(status) => setSearch({ ...search, status })}
          >
            {data?.common.iot_device_status.map((status) => (
              <Option value={status}>{status}</Option>
            ))}
          </Select>
          <Select
            placeholder="Type"
            className="device-modal-select"
            onChange={(type) => setSearch({ ...search, type })}
          >
            {data?.common.iot_device_types.map((type) => (
              <Option value={type}>{type}</Option>
            ))}
          </Select>
        </Flex>
        <MyTable
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
            getCheckboxProps: (record: DeviceDataType) => ({
              disabled:
                record.status !== 'active' &&
                !selectedDevice.some(
                  (device) => device.iot_device_id === record.iot_device_id,
                ),
              name: record.device_name,
            }),
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

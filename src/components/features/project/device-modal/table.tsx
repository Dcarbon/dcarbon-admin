import React, { memo, useState } from 'react';
import { getIoTDevice } from '@/adapters/project';
import { EIotDeviceStatus } from '@/enums';
import { QUERY_KEYS } from '@/utils/constants';
import useModalAction from '@/utils/helpers/back-action.tsx';
import { useQuery } from '@tanstack/react-query';
import { Flex, Input, Modal, Select, Space, Typography } from 'antd';
import { createStyles } from 'antd-style';
import {
  DeviceDataType,
  IDeviceRequest,
  TIotDeviceStatus,
  TIotDeviceType,
} from '@/types/device';
import MyTable from '@components/common/table/my-table.tsx';

import columns from './column';

type DeviceTableProps = {
  setSelectDevice: React.Dispatch<React.SetStateAction<string[]>>;
  selectedDevice: string[];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onOk?: () => void;
  handleAddDevices: () => Promise<void>;
};
const { Option } = Select;
const useStyle = createStyles(() => ({
  'my-modal-mask': {
    boxShadow: `inset 0 0 15px #fff`,
  },
  'my-modal-content': {
    border: '1px solid #333',
  },
}));
const DeviceTable = memo(
  ({
    open,
    setOpen,
    setSelectDevice,
    selectedDevice,
    handleAddDevices,
  }: DeviceTableProps) => {
    const [search, setSearch] = useState<IDeviceRequest>({
      page: 1,
    } as IDeviceRequest);
    const [isLoadingAdd, setLoadingAdd] = useState<boolean>(false);
    useState<string[]>(selectedDevice);

    const { styles } = useStyle();
    const cancelModal = useModalAction({
      danger: true,
      fn: () => setOpen(false),
    });
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
        height: '90vh',
      },
    };

    const { data, isLoading } = useQuery({
      queryKey: [QUERY_KEYS.GET_IOT_MODELS, search],
      queryFn: () => getIoTDevice(search),
      staleTime: 0,
      enabled:
        open &&
        (!!search.id ||
          !!search.status ||
          !!search.type ||
          !!search.page ||
          true),
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
        width={700}
        centered
        destroyOnClose
        maskClosable
        onCancel={() => cancelModal()}
        onOk={async () => {
          setLoadingAdd(true);
          await handleAddDevices();
          setLoadingAdd(false);
          setOpen(false);
        }}
        onClose={() => setOpen(false)}
        classNames={classNames}
        styles={modalStyles}
        okButtonProps={{
          disabled:
            isLoadingAdd || !selectedDevice || selectedDevice.length === 0,
          loading: isLoadingAdd,
        }}
        cancelButtonProps={{ disabled: isLoadingAdd }}
      >
        <Flex className="device-modal" gap={10}>
          <Input.Search
            placeholder="Search"
            onSearch={(e) => setSearch({ ...search, id: e })}
            disabled={isLoadingAdd}
          />
          <Select
            placeholder="Status"
            className="device-modal-select"
            onChange={(status) => setSearch({ ...search, status })}
            disabled={isLoadingAdd}
          >
            {data?.common.iot_device_status.map((info: TIotDeviceStatus) => (
              <Option key={info.code} value={info.code}>
                {info.name}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="Type"
            className="device-modal-select"
            onChange={(type) => setSearch({ ...search, type })}
            disabled={isLoadingAdd}
          >
            {data?.common.iot_device_types.map((info: TIotDeviceType) => (
              <Option key={info.id} value={info.id}>
                {info.name}
              </Option>
            ))}
          </Select>
        </Flex>
        <MyTable
          rowSelection={{
            type: 'checkbox',
            preserveSelectedRowKeys: true,
            defaultSelectedRowKeys: selectedDevice.map((device) => {
              return device;
            }),
            columnWidth: 50,
            onChange: (_selectedRowKeys, selectedRows) => {
              const selectedCurrentPage = selectedRows
                .filter((dv) => !!dv?.iot_device_id)
                .map((device) => device.iot_device_id);
              const currentSelected = selectedDevice;
              const current = (data?.data || []).map((dv) => dv.iot_device_id);

              const uncheckedAll = currentSelected.filter(
                (x) => !selectedCurrentPage.includes(x),
              );
              const uncheckedReal = current.filter((x) =>
                uncheckedAll.includes(x),
              );
              const newSelected = currentSelected.filter(
                (x) => !uncheckedReal.includes(x),
              );
              setSelectDevice(
                Array.from(new Set([...newSelected, ...selectedCurrentPage])),
              );
            },
            getCheckboxProps: (record: DeviceDataType) => ({
              disabled:
                isLoadingAdd || record.status?.id === EIotDeviceStatus.REJECT,
              name: record.device_name,
            }),
          }}
          columns={columns}
          key={'id'}
          loading={isLoading}
          dataSource={data?.data as DeviceDataType[]}
          rowKey="id"
          scroll={{ y: '60vh' }}
          rowClassName={(record: DeviceDataType) =>
            isLoadingAdd || record.status?.id === EIotDeviceStatus.REJECT
              ? 'disabled-td'
              : ''
          }
          pagination={{
            disabled: isLoadingAdd,
            pageSize: data?.paging.limit || 1,
            total: data?.paging.total || 1,
            current: data?.paging.page || 1,
            onChange: (page) => setSearch({ ...search, page }),
          }}
        />
      </Modal>
    );
  },
);

export default DeviceTable;

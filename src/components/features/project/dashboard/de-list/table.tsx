import React, { memo, useState } from 'react';
import useModalAction from '@/utils/helpers/back-action.tsx';
import { DEFAULT_PAGING } from '@constants/common.constant.ts';
import { Modal, Space, Typography } from 'antd';
import { createStyles } from 'antd-style';
import {
  IProjectListingInfo,
  IProjectListingInfoResponse,
} from '@/types/projects';
import MyTable from '@components/common/table/my-table.tsx';

import columns from './column';

type TableProps = {
  setSelect: React.Dispatch<React.SetStateAction<string[]>>;
  selected: string[];
  open: boolean;
  setOpen: (visible: boolean) => void;
  onOk?: () => void;
  deList: () => Promise<void>;
  data?: IProjectListingInfoResponse;
  loading?: boolean;
  setPaging: (page: { page: number; limit: number }) => void;
};
const useStyle = createStyles(() => ({
  'my-modal-mask': {
    boxShadow: `inset 0 0 15px #fff`,
  },
  'my-modal-content': {
    border: '1px solid #333',
  },
}));

const DeListTable = memo(
  ({
    open,
    setOpen,
    data,
    loading,
    setSelect,
    selected,
    setPaging,
    deList,
  }: TableProps) => {
    const { styles } = useStyle();
    const [submitLoading, setSubmitLoading] = useState(false);
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
        maxHeight: '85vh',
      },
    };
    return (
      <Modal
        open={open}
        title={
          <Space size={10}>
            Select for de-list{' '}
            <Typography.Text type="secondary">{`(selected: ${selected.length})`}</Typography.Text>
          </Space>
        }
        style={{
          width: '50%',
          minWidth: '850px',
          maxHeight: '90vh',
        }}
        centered
        destroyOnClose
        maskClosable
        onCancel={() => {
          cancelModal(), setSelect([]);
        }}
        onOk={async () => {
          try {
            setSubmitLoading(true);
            await deList();
          } catch (e) {
            //
          } finally {
            setSubmitLoading(false);
          }
        }}
        onClose={() => setOpen(false)}
        classNames={classNames}
        styles={modalStyles}
        okButtonProps={{
          disabled: loading || selected.length === 0 || submitLoading,
          loading: submitLoading,
        }}
        cancelButtonProps={{ disabled: loading || submitLoading }}
      >
        <MyTable
          loading={loading}
          rowSelection={{
            type: 'checkbox',
            preserveSelectedRowKeys: true,
            columnWidth: 50,
            onChange: (_selectedRowKeys) => {
              setSelect([...(_selectedRowKeys as string[])]);
            },
            getCheckboxProps: (record: IProjectListingInfo) => ({
              disabled: loading || submitLoading,
              name: record.mint,
            }),
          }}
          columns={columns}
          key={'id'}
          dataSource={data?.data || []}
          rowKey="mint"
          scroll={{ y: '60vh' }}
          pagination={{
            disabled: loading || submitLoading,
            showSizeChanger: false,
            defaultPageSize: data?.paging?.limit || DEFAULT_PAGING.limit,
            total: data?.paging?.total || 0,
            current: data?.paging?.page || DEFAULT_PAGING.page,
            onChange: (page) =>
              setPaging({
                page,
                limit: data?.paging?.limit || DEFAULT_PAGING.limit,
              }),
          }}
        />
      </Modal>
    );
  },
);

export default DeListTable;

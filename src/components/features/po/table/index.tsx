import { useState } from 'react';
import { ERROR_MSG, SUCCESS_MSG } from '@/constants';
import { banPo, deletePo } from '@adapters/po.ts';
import {
  useIsFetching,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import MyTable from '@components/common/table/my-table.tsx';
import columns, {
  TLoadingActionState,
} from '@components/features/po/table/column';
import { QUERY_KEYS } from '@utils/constants';
import useModalAction from '@utils/helpers/back-action.tsx';
import useNotification from '@utils/helpers/my-notification.tsx';

const PoTableList = ({ data }: { data: IPoPage }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loadingHandleAction, setLoadingHandleAction] =
    useState<TLoadingActionState>();
  const [myNotification] = useNotification();
  const isFetching = useIsFetching();
  const isLoading = isFetching > 0;

  const handleDeletePo = useMutation({
    mutationFn: deletePo,
    onSuccess: () => {
      myNotification({
        type: 'success',
        description: SUCCESS_MSG.PO.DELETE_SUCCESS,
      });
      queryClient
        .invalidateQueries({
          queryKey: [QUERY_KEYS.GET_PO],
        })
        .then();
    },
    onError: () => {
      myNotification({
        description: ERROR_MSG.PO.DELETE_ERROR,
      });
    },
  });
  const handleBanPo = useMutation({
    mutationFn: banPo,
    onSuccess: () => {
      myNotification({
        type: 'success',
        description: SUCCESS_MSG.PO.BAN_SUCCESS,
      });
      queryClient
        .invalidateQueries({
          queryKey: [QUERY_KEYS.GET_PO],
        })
        .then();
    },
    onError: () => {
      myNotification({
        description: ERROR_MSG.PO.BAN_ERROR,
      });
    },
  });
  const cancelAction = useModalAction({
    danger: true,
  });
  const search = useSearch({ from: '/_auth/po/' });
  const handlePo = async (action: 'ban' | 'delete' | 'unban', id: string) => {
    setLoadingHandleAction({ action, id });
    await cancelAction({
      okFn: async () => {
        try {
          if (action === 'delete') await handleDeletePo.mutateAsync(id);
          else {
            await handleBanPo.mutateAsync({
              id,
              isUnban: action === 'unban',
            });
          }
        } finally {
          setLoadingHandleAction(undefined);
        }
      },
      cancelFn: () => {
        setLoadingHandleAction(undefined);
      },
      content: `Are you sure you want to ${action} this po?`,
    });
  };
  const col = columns({ handlePo, loadingHandleAction });
  return (
    <MyTable
      columns={col}
      rowKey={'id'}
      scroll={{ y: '56vh', x: 800 }}
      tableLayout="auto"
      loading={
        isLoading
          ? {
              spinning: isLoading || !data,
              indicator: <div />,
            }
          : false
      }
      pagination={{
        defaultPageSize: data?.paging?.limit || 12,
        defaultCurrent: 1,
        showSizeChanger: false,
        current: data?.paging?.page,
        total: data?.paging?.total,
      }}
      onChange={(page: any, _filters: any, sorter: any) => {
        return navigate({
          to: '/po',
          search: {
            ...search,
            page: page.current,
            sort_field: sorter.field,
            sort_type: sorter.order === 'ascend' ? 'asc' : 'desc',
          },
        });
      }}
      dataSource={data.data}
    />
  );
};

export default PoTableList;

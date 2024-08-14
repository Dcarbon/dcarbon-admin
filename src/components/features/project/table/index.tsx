import { useState } from 'react';
import { ERROR_MSG, SUCCESS_MSG } from '@/constants';
import { EProjectStatus } from '@/enums';
import { modifyProjectStatus } from '@adapters/project.ts';
import {
  QueryObserverResult,
  RefetchOptions,
  useIsFetching,
  useMutation,
} from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { IProjectPage, ProjectList } from '@/types/projects';
import MyTable from '@components/common/table/my-table.tsx';
import projectColumns from '@components/features/project/table/column';
import useNotification from '@utils/helpers/my-notification.tsx';

const ProjectTableList = ({
  data,
  refetch,
}: {
  data: IProjectPage;
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<any, any>>;
}) => {
  const search = useSearch({ from: '/_auth/project/' });
  const navigate = useNavigate();
  const [modifyStatusLoading, setModifyStatusLoading] = useState('0');
  const isFetching = useIsFetching();
  const isLoading = isFetching > 0;
  const [myNotification] = useNotification();
  const mutation = useMutation({
    mutationFn: modifyProjectStatus,
    onSuccess: () => {
      myNotification({
        type: 'success',
        description: SUCCESS_MSG.PROJECT.MODIFY_STATUS_SUCCESS,
      });
      setModifyStatusLoading('0');
      refetch().then();
    },
    onError: (error: any) => {
      myNotification({
        message: ERROR_MSG.PROJECT.MODIFY_STATUS_ERROR,
        description: error.message || 'Something went wrong',
      });
      setModifyStatusLoading('0');
    },
  });
  const modifyStatus = (projectId: string, status: EProjectStatus) => {
    setModifyStatusLoading(projectId);
    mutation.mutate({
      project_id: projectId,
      status,
    });
  };
  const columns = projectColumns({ modifyStatus, modifyStatusLoading });
  return (
    <MyTable
      columns={columns}
      scroll={{ y: '56vh' }}
      id="id"
      loading={
        isLoading
          ? {
              spinning: isLoading || !data,
              indicator: <div />,
            }
          : false
      }
      rowKey={'id'}
      pagination={{
        pageSize: data?.paging?.limit || 12,
        defaultPageSize: 12,
        total: data?.paging?.total,
        current: data?.paging?.page,
        showSizeChanger: false,
      }}
      onChange={(page: any, _filters: any, sorter: any) => {
        return navigate({
          to: '/project',
          search: {
            ...search,
            page: page.current,
            sort_field: sorter.field,
            sort_type: sorter.order === 'ascend' ? 'asc' : 'desc',
          },
        });
      }}
      dataSource={data.data as ProjectList[]}
    />
  );
};

export default ProjectTableList;

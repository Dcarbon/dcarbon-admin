import { memo } from 'react';
import { getProject } from '@/adapters/project';
import ProjectTableList from '@/components/features/project/table';
import { QUERY_KEYS } from '@/utils/constants';
import { PlusOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import {
  createFileRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { Empty, Flex } from 'antd';
import SubmitButton from '@components/common/button/submit-button.tsx';
import MyInputSearch from '@components/common/input/my-input-search.tsx';

type ProductSearchSortOptions = 'asc' | 'desc';

type ProductSearch = {
  page?: number;
  filter?: string;
  limit?: number;
  sort_field?: string;
  sort_type?: ProductSearchSortOptions;
  keyword?: string;
};
export const Route = createFileRoute('/_auth/project/')({
  validateSearch: (search: Record<string, unknown>): ProductSearch => {
    return {
      page: Number(search?.page ?? 1),
      keyword: (search.keyword as string) || '',
      limit: Number(search?.limit ?? 10),
      sort_field: (search.sort_field as string) || '',
      sort_type: (search.sort_type as ProductSearchSortOptions) || 'asc',
    };
  },
  component: () => <ProjectPage />,
});

const ProjectPage = memo(() => {
  const navigate = useNavigate();
  const search = useSearch({ from: '/_auth/project/' });
  const { data } = useQuery({
    queryKey: [QUERY_KEYS.GET_PROJECT, search],
    queryFn: () =>
      getProject({
        page: search.page,
        limit: search.limit,
        sort_field: search.sort_field,
        sort_type: search.sort_type,
        keyword: search.keyword,
      }),
    enabled:
      !!search.page ||
      !!search.limit ||
      !!search.sort_field ||
      !!search.sort_type ||
      !!search.keyword,
  });
  const handleSearch = (value: string) => {
    return navigate({
      to: '/project',
      search: {
        ...search,
        keyword: value,
      },
    });
  };
  return (
    <div>
      <Flex justify="space-between" className="project-action-bar">
        <MyInputSearch
          placeholder="Input search text"
          allowClear
          className="project-search-bar"
          onSearch={handleSearch}
        />
        <SubmitButton
          icon={<PlusOutlined />}
          onClick={() =>
            navigate({
              to: '/project/create',
            })
          }
        >
          Project
        </SubmitButton>
      </Flex>
      {data ? <ProjectTableList data={data} /> : <Empty />}
    </div>
  );
});

export default ProjectPage;

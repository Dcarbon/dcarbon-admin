import { memo } from 'react';
import { getPo } from '@/adapters/po';
import PoTableList from '@/components/features/po/table';
import { QUERY_KEYS } from '@/utils/constants';
import { PlusOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import {
  createFileRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { Empty, Flex, Select, Space } from 'antd';
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
  status?: string;
};
export const Route = createFileRoute('/_auth/po/')({
  validateSearch: (search: Record<string, unknown>): ProductSearch => {
    return {
      page: Number(search?.page ?? 1),
      keyword: (search.keyword as string) || '',
      limit: Number(search?.limit ?? 10),
      sort_field: (search.sort_field as string) || '',
      sort_type: (search.sort_type as ProductSearchSortOptions) || 'asc',
      status: (search.status as string) || '',
    };
  },
  component: () => <PoPage />,
});

const PoPage = memo(() => {
  const navigate = useNavigate({ from: '/po' });
  const search = useSearch({ from: '/_auth/po/' });
  const { data } = useQuery({
    queryKey: [QUERY_KEYS.GET_PO, search],
    queryFn: () =>
      getPo({
        page: search.page,
        limit: search.limit,
        sort_field: search.sort_field,
        sort_type: search.sort_type,
        keyword: search.keyword,
        status: search.status,
      }),
    enabled:
      !!search.page ||
      !!search.limit ||
      !!search.sort_field ||
      !!search.sort_type ||
      !!search.keyword ||
      !!search.status,
  });
  const handleSearch = (value: string) => {
    return navigate({
      to: '/po',
      search: {
        ...search,
        keyword: value,
      },
    });
  };
  return (
    <div>
      <Flex justify="space-between" className="project-action-bar">
        <Space>
          <MyInputSearch
            placeholder="Input search text"
            allowClear
            className="project-search-bar"
            defaultValue={search.keyword}
            onSearch={handleSearch}
          />
          <Select
            className="po-filter"
            options={[
              {
                label: 'Active',
                value: 'active',
              },
              {
                label: 'Deleted',
                value: 'deleted',
              },
              {
                label: 'Inactive',
                value: 'inactive',
              },
              {
                label: 'Banned',
                value: 'banned',
              },
            ]}
            value={search.status || undefined}
            placeholder="Status filter"
            onChange={(value) => {
              navigate({
                to: '/po',
                search: {
                  ...search,
                  status: value,
                },
              });
            }}
          />
        </Space>
        <SubmitButton
          icon={<PlusOutlined />}
          onClick={() =>
            navigate({
              to: '/po/create',
            })
          }
        >
          PO
        </SubmitButton>
      </Flex>
      {data ? <PoTableList data={data} /> : <Empty />}
    </div>
  );
});

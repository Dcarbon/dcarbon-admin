import { getPo } from '@/adapters/po';
import NavigationBack from '@/components/common/navigation-back';
import PoTableList from '@/components/features/po/table';
import { QUERY_KEYS } from '@/utils/constants';
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
export const Route = createFileRoute('/_auth/po/')({
  validateSearch: (search: Record<string, unknown>): ProductSearch => {
    return {
      page: Number(search?.page ?? 1),
      keyword: (search.keyword as string) || '',
      limit: Number(search?.limit ?? 10),
      sort_field: (search.sort_field as string) || '',
      sort_type: (search.sort_type as ProductSearchSortOptions) || 'asc',
    };
  },
  component: () => <PoPage />,
});

const PoPage = () => {
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
      to: '/po',
      search: {
        ...search,
        keyword: value,
      },
    });
  };
  return (
    <div>
      <NavigationBack />
      <Flex justify="space-between" className="project-action-bar">
        <MyInputSearch
          placeholder="Input search text"
          allowClear
          className="project-search-bar"
          defaultValue={search.keyword}
          onSearch={handleSearch}
        />
        <SubmitButton
          onClick={() =>
            navigate({
              to: '/po/create',
            })
          }
        >
          +Add PO
        </SubmitButton>
      </Flex>
      {data ? <PoTableList data={data} /> : <Empty />}
    </div>
  );
};

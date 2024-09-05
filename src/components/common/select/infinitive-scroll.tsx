import { memo, useCallback } from 'react';
import { getPo } from '@/adapters/po';
import { EUserStatus } from '@/enums';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Form, Select, Spin } from 'antd';
import _ from 'lodash';
import MySelect from '@components/common/input/my-select.tsx';

const { Option } = Select;

interface IProps {
  status?: EUserStatus;
  defaultValue?: {
    id: string;
    profile_name: string;
    user_name: string;
  };
  setValue?: (value: any) => void;
  style: React.CSSProperties;
}

const InfiniteScrollSelect = memo((props: IProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ['items', props?.status],
      queryFn: ({ pageParam = 1 }) =>
        getPo({ page: pageParam, status: props?.status }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        if (
          lastPage.paging.page <
          lastPage.paging.total / lastPage.paging.limit
        ) {
          return lastPage.paging.page + 1;
        } else {
          return;
        }
      },
    });
  const uniqueItems = _.uniqBy(
    data?.pages?.flatMap((page) => page.data),
    'id',
  );
  const loadMoreData = useCallback(() => {
    if (hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage]);

  const handleScroll = useCallback(
    (event: any) => {
      const { target } = event;
      if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
        return loadMoreData();
      }
    },
    [loadMoreData],
  );
  return (
    <Form.Item
      rules={[{ required: true, message: 'Please select an item' }]}
      name="po_id"
      label="PO"
      style={props.style}
    >
      <MySelect
        placeholder="Select an item"
        onPopupScroll={handleScroll}
        notFoundContent={isLoading ? <Spin size="small" /> : null}
        filterOption={false}
        onSelect={(e) => {
          if (props.setValue) {
            const match = uniqueItems.find((info) => info.id === e);
            if (match) props.setValue(match.wallet);
          }
        }}
      >
        {uniqueItems.map((item) => (
          <Option key={item.id} value={item.id}>
            {item.profile_name}
          </Option>
        ))}
        {isFetchingNextPage && (
          <Option disabled key="loading">
            <Spin size="small" />
          </Option>
        )}
      </MySelect>
    </Form.Item>
  );
});

export default InfiniteScrollSelect;

import { memo, useCallback } from 'react';
import { getPo } from '@/adapters/po';
import { EUserStatus } from '@/enums';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Form, Select, Spin } from 'antd';
import MySelect from '@components/common/input/my-select.tsx';

const { Option } = Select;

interface IProps {
  status?: EUserStatus;
  defaultValue?: {
    id: string;
    profile_name: string;
    user_name: string;
  };
}

const InfiniteScrollSelect = memo((props: IProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ['items', props?.status],
      queryFn: ({ pageParam = 1 }) =>
        getPo({ page: pageParam, status: props?.status }),
      initialPageParam: 1,

      getNextPageParam: (lastPage) => {
        if (lastPage.paging.page < lastPage.paging.total) {
          return lastPage.paging.page + 1;
        }
      },
    });

  const loadMoreData = useCallback(() => {
    if (hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage]);

  const handleScroll = useCallback(
    (event: any) => {
      const { target } = event;
      if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
        loadMoreData();
      }
    },
    [loadMoreData],
  );

  return (
    <Form.Item
      rules={[{ required: true, message: 'Please select an item' }]}
      name="po_id"
      label="PO"
      style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
    >
      <MySelect
        placeholder="Select an item"
        style={{ width: 300 }}
        onPopupScroll={handleScroll}
        notFoundContent={isLoading ? <Spin size="small" /> : null}
        filterOption={false}
      >
        {props.defaultValue ? (
          <Option value={props.defaultValue.id}>
            {props.defaultValue.profile_name}
          </Option>
        ) : null}
        {data?.pages.map((page) =>
          page.data
            .filter((e) => e.id !== props.defaultValue?.id)
            .map((item) => (
              <Option key={item.id} value={item.id}>
                {item.profile_name}
              </Option>
            )),
        )}
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

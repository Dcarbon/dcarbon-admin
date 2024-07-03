// GlobalLoading.tsx
import { useIsFetching } from '@tanstack/react-query';
import { Spin } from 'antd';

const GlobalLoading = () => {
  const isFetching = useIsFetching();
  const isLoading = isFetching > 0;

  return isLoading ? <Spin size="large" spinning fullscreen /> : null;
};
export default GlobalLoading;

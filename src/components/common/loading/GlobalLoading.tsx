// GlobalLoading.tsx
import { useIsFetching } from '@tanstack/react-query';
import { Spin } from 'antd';

const GlobalLoading = () => {
  const isFetching = useIsFetching();
  const isLoading = isFetching > 0;

  return isLoading ? (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Spin size="large" spinning tip="Loading..." />
    </div>
  ) : null;
};
export default GlobalLoading;

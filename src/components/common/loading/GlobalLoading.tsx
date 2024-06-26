// GlobalLoading.tsx
import { useIsFetching } from '@tanstack/react-query';
import { Spin } from 'antd';

const GlobalLoading = () => {
  const isFetching = useIsFetching();
  const isLoading = isFetching > 0;
  const style = {
    spin: {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  };

  return isLoading ? <Spin size="large" spinning style={style.spin} /> : null;
};
export default GlobalLoading;

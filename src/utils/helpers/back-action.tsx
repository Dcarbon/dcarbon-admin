import { useRouter } from '@tanstack/react-router';
import { Modal } from 'antd';

const useBackAction = () => {
  const router = useRouter();

  return () => {
    Modal.confirm({
      title: 'Are you sure?',
      centered: true,
      content: 'You will lose all unsaved changes',
      okButtonProps: {
        danger: true,
        style: {
          padding: '16px 32px',
          borderRadius: '4px',
        },
      },
      cancelButtonProps: {
        style: {
          padding: '16px 32px',
          borderRadius: '4px',
        },
      },
      onOk: () => {
        router.history.go(-1);
      },
      onCancel: () => {},
    });
  };
};

export default useBackAction;

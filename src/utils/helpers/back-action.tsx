import { useRouter } from '@tanstack/react-router';
import { Modal } from 'antd';

const useBackAction = () => {
  const router = useRouter();

  const modalBack = () => {
    Modal.confirm({
      title: 'Are you sure?',
      centered: true,
      content: 'You will lose all unsaved changes',
      okButtonProps: { type: 'default', danger: true },
      onOk: () => {
        router.history.go(-1);
      },
      onCancel: () => {},
    });
  };

  return modalBack;
};

export default useBackAction;

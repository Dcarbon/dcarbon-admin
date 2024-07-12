import { useRouter } from '@tanstack/react-router';
import { Modal } from 'antd';
import { ModalProps } from 'antd/es/modal/interface';

interface IOption {
  type?: 'back' | 'no-action';
  title?: string;
  content?: string;
  danger?: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  fn?: Function;
  option?: ModalProps;
}

const useModalAction = (option?: IOption) => {
  const router = useRouter();

  return () => {
    Modal.confirm({
      title: option?.title || 'Are you sure?',
      centered: true,
      content:
        option?.content ||
        (option?.danger ? 'You will lose all unsaved changes' : undefined),
      okButtonProps: {
        danger: option?.danger,
        style: {
          padding: 'var(--button-padding)',
          borderRadius: 'var(--button-radius)',
        },
      },
      cancelButtonProps: {
        style: {
          padding: 'var(--button-padding)',
          borderRadius: 'var(--button-radius)',
        },
      },
      ...(option?.option || {}),
      onOk: () => {
        option?.type === 'back'
          ? router.history.go(-1)
          : option?.fn
            ? option?.fn()
            : {};
      },
      onCancel: () => {},
    });
  };
};

export default useModalAction;

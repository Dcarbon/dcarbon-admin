import { useRouter } from '@tanstack/react-router';
import { Modal } from 'antd';
import { createStyles } from 'antd-style';
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

const useStyle = createStyles(() => ({
  'my-modal-mask': {
    boxShadow: `inset 0 0 15px #fff`,
  },
  'my-modal-content': {
    border: '1px solid #333',
  },
}));

const useModalAction = (option?: IOption) => {
  const router = useRouter();
  const { styles } = useStyle();
  const classNames = {
    mask: styles['my-modal-mask'],
    content: styles['my-modal-content'],
  };

  const modalStyles = {
    mask: {
      backdropFilter: 'blur(10px)',
    },
    content: {
      boxShadow: '0 0 30px #999',
      borderRadius: 'var(--div-radius)',
    },
  };
  return (option2?: {
    // eslint-disable-next-line @typescript-eslint/ban-types
    okFn?: Function;
    // eslint-disable-next-line @typescript-eslint/ban-types
    cancelFn?: Function;
    content?: string;
  }) => {
    Modal.confirm({
      title: option?.title || 'Are you sure?',
      centered: true,
      content:
        option2?.content ||
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
        option2?.okFn
          ? option2.okFn()
          : option?.type === 'back'
            ? router.history.go(-1)
            : option?.fn
              ? option?.fn()
              : {};
      },
      onCancel: () => {
        option2?.cancelFn ? option2.cancelFn() : () => {};
      },
      classNames: classNames,
      styles: modalStyles,
    });
  };
};

export default useModalAction;

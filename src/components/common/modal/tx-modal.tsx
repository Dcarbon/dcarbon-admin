import { Modal, Space, Typography } from 'antd';
import { createStyles } from 'antd-style';
import { BounceLoader } from 'react-spinners';

const useStyle = createStyles(() => ({
  'my-modal-mask': {
    boxShadow: `inset 0 0 15px #fff`,
  },
  'my-modal-content': {
    border: '1px solid #333',
    flexDirection: 'column',
  },
}));

interface IProps {
  setOpen: (status: boolean) => void;
  open?: boolean;
  title?: string;
}

const TxModal = ({ open, title, setOpen }: IProps) => {
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
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  };
  return (
    <>
      <Modal
        open={open}
        title={
          <Space size={10}>
            <Typography.Text type="secondary">
              {title || 'Transaction in progress'}
            </Typography.Text>
          </Space>
        }
        centered
        footer={''}
        maskClosable={false}
        onCancel={() => setOpen(false)}
        onOk={() => setOpen(false)}
        onClose={() => setOpen(false)}
        classNames={classNames}
        styles={modalStyles}
      >
        <div style={{ margin: '15px 15px' }}>
          <BounceLoader color={'var(--main-color)'} />
        </div>
      </Modal>
    </>
  );
};

export default TxModal;

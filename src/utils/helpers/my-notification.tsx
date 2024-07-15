import { notification } from 'antd';
import { ArgsProps } from 'antd/es/notification/interface';

const useMyNotification = () => {
  const openNotification = (props: ArgsProps) => {
    notification.error({
      pauseOnHover: true,
      message: (
        <span className={'my-notification-title'}>
          {props.message || 'Something error'}
        </span>
      ),
      description: (
        <span className={'my-notification-description'}>
          {props.description}
        </span>
      ),
    });
  };
  return [openNotification];
};
export default useMyNotification;

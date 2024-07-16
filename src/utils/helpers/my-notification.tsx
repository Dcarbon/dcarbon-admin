import type * as React from 'react';
import { notification } from 'antd';
import { ArgsProps } from 'antd/es/notification/interface';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
interface IProps extends ArgsProps {
  message?: React.ReactNode | undefined;
  type?: 'error' | 'warning' | 'success';
  isTx?: boolean;
}

const useMyNotification = () => {
  const openNotification = (props: IProps) => {
    let tx;
    if (props.isTx && props.description) {
      tx = `${import.meta.env.VITE_SOLANA_EXPLORER}/tx/${props.description}`;
      if (import.meta.env.VITE_STAGE === 'test') {
        tx += '?cluster=testnet';
      } else if (import.meta.env.VITE_STAGE === 'dev') {
        tx += '?cluster=devnet';
      }
    }
    const commonConfig: Partial<ArgsProps> = {
      pauseOnHover: true,
    };
    if (props.isTx) commonConfig.duration = 30;
    if (props.type === 'warning') {
      notification.warning({
        ...commonConfig,
        message: (
          <span className={'my-notification-title'}>
            {props.message || 'Warning'}
          </span>
        ),
        description: (
          <span className={'my-notification-description'}>
            {props.description}
          </span>
        ),
      });
    } else if (props.type === 'success') {
      notification.success({
        ...commonConfig,
        message: (
          <span className={'my-notification-title'}>
            {props.isTx && !props.message
              ? 'Transaction successfully'
              : props.message || 'Successfully'}
          </span>
        ),
        description: props.isTx ? (
          <a target="_blank" href={tx}>
            View transaction detail
          </a>
        ) : (
          <span className={'my-notification-description'}>
            {props.description}
          </span>
        ),
      });
    } else {
      const message = (
        <span className={'my-notification-title'}>
          {props.isTx && !props.message
            ? 'Transaction error'
            : props.message || 'Something error'}
        </span>
      );
      notification.error({
        ...commonConfig,
        message,
        description:
          props.isTx && tx ? (
            <a target="_blank" href={tx}>
              View transaction detail
            </a>
          ) : (
            <span className={'my-notification-description'}>
              {props.description || 'Something went wrong'}
            </span>
          ),
      });
    }
  };
  return [openNotification];
};
export default useMyNotification;

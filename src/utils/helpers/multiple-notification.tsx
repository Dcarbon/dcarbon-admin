import type * as React from 'react';
import { ReactNode } from 'react';
import { Col, notification, Row } from 'antd';
import { ArgsProps } from 'antd/es/notification/interface';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
interface IProps extends ArgsProps {
  message?: React.ReactNode | undefined;
  type?: 'error' | 'warning' | 'success' | 'reject';
  tx_type?: 'tx' | 'address';
  txs: string[];
  successCount?: number;
}

const useMultipleNotification = () => {
  const openMultipleNotification = (props: IProps) => {
    let tx;
    let listDescription: ReactNode[] = [];
    if (props.tx_type && props.txs && props.txs.length > 0) {
      listDescription = props.txs.map((description, idx) => {
        tx = `${import.meta.env.VITE_SOLANA_EXPLORER}/${props.tx_type}/${description}`;
        if (import.meta.env.VITE_STAGE === 'test') {
          tx += '?cluster=testnet';
        } else if (import.meta.env.VITE_STAGE === 'dev') {
          tx += '?cluster=devnet';
        }
        return (
          <Col span={8}>
            <a target="_blank" href={tx}>
              Tx{' '}
              {props.type === 'success'
                ? idx + 1
                : (props.successCount || 0) + idx + 1}
            </a>
          </Col>
        );
      });
    }
    const commonConfig: Partial<ArgsProps> = {
      pauseOnHover: true,
    };
    commonConfig.duration = 30;
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
            {props.tx_type && !props.message
              ? 'Transaction successfully'
              : props.message || 'Successfully'}
          </span>
        ),
        description: <Row>{listDescription}</Row>,
      });
    } else {
      const message = (
        <span className={'my-notification-title'}>
          {props.tx_type && !props.message
            ? 'Transaction error'
            : props.message || 'Something error'}
        </span>
      );
      notification.error({
        ...commonConfig,
        message,
        description: <Row>{listDescription}</Row>,
      });
    }
  };
  return [openMultipleNotification];
};
export default useMultipleNotification;

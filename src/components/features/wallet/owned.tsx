import { useState } from 'react';
import { formatByEnUsNum } from '@/utils/helpers';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { Card, Col, Row, Space, Typography } from 'antd';

import LineChart from './line-chart';
import TransactionTable from './table';
import logo from '/image/dcarbon-logo-black.svg';

const Owned = () => {
  const chartData = {} as IWallet;
  const [isHidden, setisHidden] = useState(true);
  const transactionData = {} as TransactionPages;
  return (
    <Row gutter={[16, 16]}>
      <Col xl={8}>
        <Card className="wallet-container">
          <Typography.Title level={4}>My Wallet</Typography.Title>
          <span className="wallet-growth-dcarbon">
            {formatByEnUsNum(chartData?.dcarbon || 0)} DCarbon
          </span>
          {chartData ? (
            <LineChart data={chartData?.carbon_chart?.data || []} />
          ) : null}
          <Typography.Title level={4}>
            <Space size={6}>
              Wallet Balance{' '}
              <span onClick={() => setisHidden(!isHidden)}>
                {isHidden ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              </span>
            </Space>
          </Typography.Title>
          <Card className="wallet-balance">
            <span className="neutral-color-700">Crypto</span>
            <Typography.Title level={2}>
              {isHidden ? (
                <Space>********</Space>
              ) : (
                <span>≈ {formatByEnUsNum(chartData?.carbon || 0)} CARBON</span>
              )}
            </Typography.Title>
            <span className="neutral-color-700">
              {isHidden ? (
                <Space>**********</Space>
              ) : (
                <span>
                  ≈ {formatByEnUsNum(chartData?.exchange_rate || 0)}{' '}
                  {chartData?.exchange_rate_currency || 'VND'}
                </span>
              )}
            </span>
            <img
              className="wallet-image"
              width={37}
              height={37}
              src={logo}
              alt="arrow-up"
            />
          </Card>
        </Card>
      </Col>
      <Col xl={16}>
        <Card className="transaction-container">
          <Typography.Title level={4}>Transaction history</Typography.Title>
          <TransactionTable data={transactionData as TransactionPages} />
        </Card>
      </Col>
    </Row>
  );
};

export default Owned;

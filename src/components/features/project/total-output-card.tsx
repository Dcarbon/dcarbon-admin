import { formatByEnUsNum } from '@/utils/helpers';
import { Card, Col, Flex, Space, Statistic, Typography } from 'antd';

import arrowDown from '/image/dashboard/arrow-down.svg';
import arrowUp from '/image/dashboard/arrow-up.svg';
import down from '/image/dashboard/down.svg';
import growth from '/image/dashboard/growth.svg';

interface IGeneralData {
  data: {
    total: number;
    compare_last_week_ratio: number;
  };

  img: string;
  title: string;
}

const TotalOutputCard = ({ img, data, title }: IGeneralData) => {
  const percentCalculate = (value: number) => {
    return value * 100;
  };
  return (
    <Col xxl={7} md={12}>
      <Card>
        <Flex justify="space-between">
          <Flex vertical justify="space-between">
            <Space align="center" size={20}>
              <img src={img} width={38} height={38} alt="icon" />
              <span className="neutral-color-400">{title}</span>
            </Space>
            <Space size={10} align="baseline">
              <span className="primary-color-600 dashboard-project-value">
                {formatByEnUsNum(Number((data.total || 0).toFixed(1)))}
              </span>
              <Typography.Title
                level={4}
                className="dashboard-project-currency"
              >
                CARBON
              </Typography.Title>
            </Space>
          </Flex>
          {data ? (
            <div className="dashboard-total-project">
              <Statistic
                title={
                  <img
                    src={data.compare_last_week_ratio < 0 ? down : growth}
                    height={58}
                    alt="down"
                  />
                }
                value={percentCalculate(data.compare_last_week_ratio)}
                precision={2}
                className="dashboard-statistic"
                prefix={
                  <Flex align="center">
                    <img
                      src={
                        data.compare_last_week_ratio < 0 ? arrowDown : arrowUp
                      }
                      height={30}
                      alt="arrow-up"
                    />
                  </Flex>
                }
                suffix="%"
              />
              <Typography.Text type="secondary">VS Last Week</Typography.Text>
            </div>
          ) : null}
        </Flex>
      </Card>
    </Col>
  );
};

export default TotalOutputCard;

import { formatByEnUsNum } from '@/utils/helpers';
import { Card, Col, Flex, Space, Typography } from 'antd';

interface IGeneralData {
  data: number;
  img: string;
  title: string;
  currency?: string;
}
const AnalyticsCard = ({ data, img, title, currency }: IGeneralData) => {
  return (
    <Col xxl={7} md={12}>
      <Card className="analytics-card">
        <Flex vertical justify="space-between">
          <Space align="center" size={20}>
            <img src={img} width={38} height={38} alt="icon" />
            <span className="neutral-color-400">{title}</span>
          </Space>
          <Space size={10} align="baseline">
            <span className="primary-color-600 dashboard-project-value">
              {formatByEnUsNum(data)}
            </span>
            {currency ? (
              <Typography.Title
                level={4}
                className="dashboard-project-currency"
              >
                {currency}
              </Typography.Title>
            ) : null}
          </Space>
        </Flex>
      </Card>
    </Col>
  );
};

export default AnalyticsCard;

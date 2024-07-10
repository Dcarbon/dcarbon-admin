import { Card, Flex, Typography } from 'antd';

const ProjectDashboard = () => {
  return (
    <Flex className="project-dashboard" gap={20} wrap>
      <Card hoverable className="project-dashboard-card" title="Crypto">
        <Typography.Title level={2}>~12.9</Typography.Title>
      </Card>
      <Card hoverable className="project-dashboard-card" title="revenue - Cost">
        <Typography.Title level={2}>126$</Typography.Title>
      </Card>
      <Card hoverable className="project-dashboard-card" title="Total Assets">
        <Typography.Title level={2}>90</Typography.Title>
      </Card>
      <Card
        hoverable
        className="project-dashboard-card"
        title="Total Carbon minted"
      >
        <Typography.Title level={2}>45</Typography.Title>
      </Card>
      <Card
        hoverable
        className="project-dashboard-card"
        title="Total Carbon Sold"
      >
        <Typography.Title level={2}>45</Typography.Title>
      </Card>
    </Flex>
  );
};

export default ProjectDashboard;

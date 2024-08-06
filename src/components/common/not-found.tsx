import { useNavigate } from '@tanstack/react-router';
import { Button, Flex, Typography } from 'antd';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <Flex
      justify="center"
      vertical
      align="center"
      className="not-found-layout"
      gap={10}
    >
      <Typography.Title level={1} type="danger">
        404
      </Typography.Title>
      <Typography.Title level={2}>Page Not Found</Typography.Title>
      <p>The page you are looking for does not exist.</p>
      <Button type="primary" onClick={() => navigate({ to: '/' })}>
        Go Back
      </Button>
    </Flex>
  );
};

export default NotFoundPage;

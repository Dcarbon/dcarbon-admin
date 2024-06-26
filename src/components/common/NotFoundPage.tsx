import { useNavigate } from '@tanstack/react-router';
import { Button, Flex } from 'antd';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <Flex justify="center" vertical align="center">
      <h1>404 - Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Button type="primary" onClick={() => navigate({ to: '/' })}>
        Go Back
      </Button>
    </Flex>
  );
};

export default NotFoundPage;

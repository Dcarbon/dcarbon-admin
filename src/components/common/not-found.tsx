import { useNavigate } from '@tanstack/react-router';
import { Flex } from 'antd';
import SubmitButton from '@components/common/button/submit-button.tsx';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <Flex justify="center" vertical align="center" className="not-found-layout">
      <h1>404 - Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <SubmitButton onClick={() => navigate({ to: '/po' })}>
        Go Back
      </SubmitButton>
    </Flex>
  );
};

export default NotFoundPage;

import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from '@tanstack/react-router';
import { Button, Typography } from 'antd';

const NavigationBack = ({ href }: { href?: string }) => {
  const navigate = useNavigate();
  return (
    <Button type="link">
      <Typography.Title
        level={5}
        className="navigate-back"
        onClick={() =>
          navigate({
            to: href || '/',
          })
        }
      >
        <ArrowLeftOutlined /> Back
      </Typography.Title>
    </Button>
  );
};

export default NavigationBack;

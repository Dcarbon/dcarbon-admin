import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from '@tanstack/react-router';
import { Typography } from 'antd';

const NavigationBack = ({ href }: { href?: string }) => {
  const navigate = useNavigate();
  return (
    <Typography.Title
      level={3}
      className="navigate-back"
      onClick={() =>
        navigate({
          to: href || '/',
        })
      }
    >
      <ArrowLeftOutlined /> Back
    </Typography.Title>
  );
};

export default NavigationBack;

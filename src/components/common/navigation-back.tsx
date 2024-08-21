import { memo } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { Button, Typography } from 'antd';

const NavigationBack = memo(({ href }: { href?: string }) => {
  const navigate = useNavigate();
  const router = useRouter();
  return (
    <Button type="link">
      <Typography.Title
        level={5}
        className="navigate-back"
        onClick={() =>
          href
            ? navigate({
                to: href,
              })
            : router.history.back()
        }
      >
        <ArrowLeftOutlined /> Back
      </Typography.Title>
    </Button>
  );
});

export default NavigationBack;

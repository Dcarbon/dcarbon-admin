import { ArrowLeftOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const DetailProject = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Typography.Title
        level={3}
        style={{ cursor: 'pointer' }}
        onClick={() => navigate('/dashboard')}
      >
        {<ArrowLeftOutlined style={{ marginRight: 5 }} />} Back
      </Typography.Title>
      DetailProject
    </div>
  );
};

export default DetailProject;

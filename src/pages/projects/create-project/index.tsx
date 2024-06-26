import ProjectForm from '@/components/features/project/admin-project/form';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const CreateProject = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Typography.Title
        level={3}
        style={{ cursor: 'pointer' }}
        onClick={() => navigate('/project')}
      >
        {<ArrowLeftOutlined style={{ marginRight: 5 }} />} Back
      </Typography.Title>
      <ProjectForm />
    </div>
  );
};

export default CreateProject;

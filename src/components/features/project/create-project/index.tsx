import ProjectForm from '@/components/features/project/create-project/form';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from '@tanstack/react-router';
import { Typography } from 'antd';

const CreateProject = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Typography.Title
        level={3}
        style={{ cursor: 'pointer' }}
        onClick={() =>
          navigate({
            to: '/project',
          })
        }
      >
        {<ArrowLeftOutlined style={{ marginRight: 5 }} />} Back
      </Typography.Title>
      <ProjectForm />
    </div>
  );
};

export default CreateProject;

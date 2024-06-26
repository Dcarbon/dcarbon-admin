import ProjectTableList from '@/components/features/project/table';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from '@tanstack/react-router';
import { Button, Flex, Input, Typography } from 'antd';

const ProjectPage = () => {
  const navigate = useNavigate();
  const dataSample: IProject[] = [
    {
      _id: '1',
      name: 'Project 1',
      location: 'HCM',
      startDate: '2021-09-01',
      status: true,
    },
    {
      _id: '2',
      name: 'Project 2',
      location: 'HCM',
      startDate: '2021-09-01',
      status: false,
    },
    {
      _id: '3',
      name: 'Project 3',
      location: 'HCM',
      startDate: '2021-09-01',
      status: true,
    },
    {
      _id: '4',
      name: 'Project 4',
      location: 'HCM',
      startDate: '2021-09-01',
      status: false,
    },
    {
      _id: '5',
      name: 'Project 5',
      location: 'HCM',
      startDate: '2021-09-01',
      status: true,
    },
    {
      _id: '6',
      name: 'Project 6',
      location: 'HCM',
      startDate: '2021-09-01',
      status: false,
    },
    {
      _id: '7',
      name: 'Project 7',
      location: 'HCM',
      startDate: '2021-09-01',
      status: true,
    },
  ];
  const onSearch = (value: string) => console.info(value);
  return (
    <div>
      <Typography.Title
        level={3}
        style={{ cursor: 'pointer' }}
        onClick={() =>
          navigate({
            to: '/',
          })
        }
      >
        {<ArrowLeftOutlined style={{ marginRight: 5 }} />} Back
      </Typography.Title>
      <Flex style={{ margin: '20px 0' }} justify="space-between">
        <Input.Search
          placeholder="input search text"
          allowClear
          onSearch={onSearch}
          style={{ width: 250 }}
        />
        <Button
          type="primary"
          onClick={() =>
            navigate({
              to: '/project/create-project',
            })
          }
        >
          +Add Project
        </Button>
      </Flex>
      <ProjectTableList data={dataSample} />
    </div>
  );
};

export default ProjectPage;

import NavigationBack from '@/components/common/navigation-back';
import ProjectTableList from '@/components/features/project/table';
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { Button, Flex, Input } from 'antd';

const dataSample: IProject[] = [
  {
    id: '1',
    name: 'Project 1',
    location: 'HCM',
    startDate: '2021-09-01',
    status: true,
  },
  {
    id: '2',
    name: 'Project 2',
    location: 'HCM',
    startDate: '2021-09-01',
    status: false,
  },
  {
    id: '3',
    name: 'Project 3',
    location: 'HCM',
    startDate: '2021-09-01',
    status: true,
  },
  {
    id: '4',
    name: 'Project 4',
    location: 'HCM',
    startDate: '2021-09-01',
    status: false,
  },
  {
    id: '5',
    name: 'Project 5',
    location: 'HCM',
    startDate: '2021-09-01',
    status: true,
  },
  {
    id: '6',
    name: 'Project 6',
    location: 'HCM',
    startDate: '2021-09-01',
    status: false,
  },
  {
    id: '7',
    name: 'Project 7',
    location: 'HCM',
    startDate: '2021-09-01',
    status: true,
  },
];
export const Route = createLazyFileRoute('/_auth/project/')({
  component: () => <ProjectPage />,
});

const ProjectPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <NavigationBack />
      <Flex justify="space-between" className="project-action-bar">
        <Input.Search
          placeholder="Input search text"
          allowClear
          className="project-search-bar"
        />
        <Button
          type="primary"
          onClick={() =>
            navigate({
              to: '/project/create',
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

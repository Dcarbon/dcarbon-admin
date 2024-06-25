/* eslint-disable react-refresh/only-export-components */
import React from 'react';

const HomePage = React.lazy(() => import('@/pages/home'));
const UserPage = React.lazy(() => import('@/pages/users'));
const ProjectPage = React.lazy(() => import('@/pages/projects'));
const DetailProject = React.lazy(
  () => import('@/pages/projects/project-detail'),
);
const CreateProject = React.lazy(
  () => import('@/pages/projects/create-project'),
);

const routes = [
  {
    key: 'dashboard',
    path: '/dashboard',
    element: <HomePage />,
  },
  {
    key: 'users',
    path: '/users',
    element: <UserPage />,
  },
  {
    key: 'project',
    path: '/project',
    element: <ProjectPage />,
  },
  {
    key: 'project-detail',
    path: '/project/:slug',
    element: <DetailProject />,
  },
  {
    key: 'create-project',
    path: '/project/create',
    element: <CreateProject />,
  },
];

export default routes;

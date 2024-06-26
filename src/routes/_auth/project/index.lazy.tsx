import ProjectPage from '@/components/features/project';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_auth/project/')({
  component: () => <ProjectPage />,
});

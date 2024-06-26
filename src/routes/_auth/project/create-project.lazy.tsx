import CreateProject from '@/components/features/project/create-project';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_auth/project/create-project')({
  component: () => <CreateProject />,
});

import LoginPage from '@/components/features/login';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/login')({
  component: () => <LoginPage />,
});

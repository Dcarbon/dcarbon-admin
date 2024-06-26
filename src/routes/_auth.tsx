import AdminLayout from '@/components/common/AdminLayout';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth')({
  beforeLoad: ({ context }) => {
    const { isAuthenticated } = context as any;
    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
      });
    }
  },
  component: () => (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  ),
});

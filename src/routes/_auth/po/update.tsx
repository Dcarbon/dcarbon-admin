import { isEmpty } from '@/utils/helpers/common';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/po/update')({
  beforeLoad: ({ params }) => {
    if (isEmpty(params)) {
      return redirect({
        to: '/po',
      });
    }
    return;
  },
  component: () => (
    <>
      <Outlet />
    </>
  ),
});

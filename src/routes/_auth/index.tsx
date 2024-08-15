import { createFileRoute, redirect } from '@tanstack/react-router';
import { ROUTES_URL } from '@utils/constants';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
export const Route = createFileRoute('/_auth/')({
  beforeLoad: ({ context }) => {
    const { auth } = context as any;
    if (!auth.isAuthenticated) {
      throw redirect({
        to: '/signin',
      });
    }
    return redirect({
      to: ROUTES_URL.PROJECT,
    });
  },
  component: () => null,
});

import { createFileRoute, redirect } from '@tanstack/react-router';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
export const Route = createFileRoute('/_auth/')({
  beforeLoad: ({ context }) => {
    const { auth } = context as any;
    if (!auth.isAuthenticated) {
      throw redirect({
        to: '/signin',
      });
    } else {
      return redirect({
        to: '/po',
      });
    }
  },
  component: () => null,
});

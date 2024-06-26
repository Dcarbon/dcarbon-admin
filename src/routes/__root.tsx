/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRootRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      navigate({
        to: '/login',
      });
    }
  }, [isAuthenticated]);
  return (
    <>
      <Outlet />
      {import.meta.env.DEV && (
        <>
          <div style={{ position: 'fixed', zIndex: 99 }}>
            <TanStackRouterDevtools />
          </div>
          <div style={{ position: 'fixed', zIndex: 99 }}>
            <ReactQueryDevtools initialIsOpen={false} />
          </div>
        </>
      )}
    </>
  );
}

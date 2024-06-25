import AdminLayout from '@/components/common/AdminLayout';
import Home from '@/pages/home';
import Login from '@/pages/login';
import ProtectedRoute from '@/routes/ProtectedRoute';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import routes from './Navigations';

const renderRoutes = (routes: any) => {
  return routes.map((route: any) => {
    if (route.children) {
      return <Route {...route}>{renderRoutes(route.children)}</Route>;
    }
    return <Route {...route} />;
  });
};
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Routes>{renderRoutes(routes)}</Routes>
              </AdminLayout>
            </ProtectedRoute>
          }
        >
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

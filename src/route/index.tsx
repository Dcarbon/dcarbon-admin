import AdminLayout from '@/components/common/AdminLayout'
import Home from '@/pages/home'
import Login from '@/pages/login'
import ProtectedRoute from '@/route/ProtectedRoute'
import ErrorBoundary from 'antd/es/alert/ErrorBoundary'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import routes from './routes'

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
                                <Routes>
                                    {routes.map((route, index) => (
                                        <Route
                                            key={index}
                                            errorElement={<ErrorBoundary />}
                                            {...route}
                                        />
                                    ))}
                                </Routes>
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                >
                    <Route path="*" element={<Home />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes

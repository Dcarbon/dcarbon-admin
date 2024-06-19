import { ReactNode } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
    children?: ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated } = useAuth()
    const location = useLocation()
    return isAuthenticated ? (
        children ? (
            children
        ) : (
            <Outlet />
        )
    ) : (
        <Navigate
            to="/login"
            state={{ from: location.pathname, search: location.search }}
        />
    )
}

export default ProtectedRoute

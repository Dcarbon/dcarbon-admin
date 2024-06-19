/* eslint-disable react-refresh/only-export-components */
import React from 'react'

const HomePage = React.lazy(() => import('@/pages/home'))
const UserPage = React.lazy(() => import('@/pages/users'))

const routes = [
    {
        title: 'Dashboard',
        path: '/dashboard',
        element: <HomePage />,
    },
    {
        title: 'Users',
        path: '/users',
        element: <UserPage />,
    },
]

export default routes

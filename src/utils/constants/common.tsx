import {
    ApartmentOutlined,
    ApiOutlined,
    DeploymentUnitOutlined,
} from '@ant-design/icons'

type MenuType = {
    key: string
    label: string
    path: string
    icon: React.ReactNode
    children?: {
        label: string
        path: string
    }[]
}[]
const API_ROUTES = {}

const QUERY_KEYS = {}

const MENU: MenuType = [
    {
        key: '1',
        label: 'Dashboard',
        path: '/dashboard',
        icon: <ApartmentOutlined />,
    },
    {
        key: '2',
        label: 'Users',
        path: '/users',
        icon: <DeploymentUnitOutlined />,
    },
    {
        key: '3',
        label: 'API',
        path: '/api',
        icon: <ApiOutlined />,
        children: [
            {
                label: 'API 1',
                path: '/api/api1',
            },
        ],
    },
]

const NO_IMAGE = '/common/no-avatar.png'
const ACCESS_TOKEN_STORAGE_KEY = 'accessToken'

export { API_ROUTES, NO_IMAGE, ACCESS_TOKEN_STORAGE_KEY, QUERY_KEYS, MENU }

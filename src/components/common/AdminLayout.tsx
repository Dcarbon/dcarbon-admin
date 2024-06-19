import { useAuth } from '@/contexts/AuthContext'
import { Button, Layout, Skeleton } from 'antd'
import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import 'antd/dist/reset.css'
import NavBar from './SideBar'

const { Header, Content, Footer, Sider } = Layout

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    const [collapsed, setCollapsed] = React.useState(false)
    const { logout } = useAuth()
    const navigate = useNavigate()

    const onCollapse = (collapsed: boolean) => {
        setCollapsed(collapsed)
    }

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <Layout style={{ maxHeight: '100vh', height: '100vh', width: '100vw' }}>
            <Sider
                collapsible
                collapsed={collapsed}
                style={{
                    backgroundColor: '#fff',
                    boxShadow: '3px 2px 6px 1px rgba(0,0,0,0.1)',
                }}
                onCollapse={onCollapse}
            >
                <div
                    className="logo"
                    style={{
                        padding: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <img
                        src="/images/vite.svg"
                        alt="logo"
                        width={40}
                        height={40}
                    />
                </div>
                <NavBar />
            </Sider>
            <Layout className="site-layout">
                <Layout style={{ margin: '5px 0' }}>
                    <Header
                        className="site-layout-background"
                        style={{
                            backgroundColor: '#fff',
                            padding: '0 16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                        }}
                    >
                        <Button type="primary" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Header>
                </Layout>
                <Layout>
                    <Content
                        className="site-layout-background"
                        style={{
                            backgroundColor: '#fff',
                            margin: 5,
                            padding: 10,
                            height: '85vh',
                            overflowY: 'auto',
                        }}
                    >
                        <React.Suspense
                            fallback={
                                <Skeleton
                                    active
                                    loading
                                    paragraph={{ rows: 50 }}
                                />
                            }
                        >
                            {children ? children : <Outlet />}
                        </React.Suspense>
                    </Content>
                </Layout>
                <Footer style={{ textAlign: 'center' }}>
                    DCarbon Admin Dashboard ©2024
                </Footer>
            </Layout>
        </Layout>
    )
}

export default AdminLayout

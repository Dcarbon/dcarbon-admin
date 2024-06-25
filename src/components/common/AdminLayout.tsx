import React from 'react';
import { Layout, Skeleton } from 'antd';

import 'antd/dist/reset.css';

import GlobalLoading from '@/components/common/loading/GlobalLoading';
import NavBar from '@/components/common/SideBar';

import Header from './Header';

const { Content, Footer, Sider } = Layout;

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = React.useState(false);

  const onCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed);
  };

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
          <img src="/vite.svg" alt="logo" width={40} height={40} />
        </div>
        <NavBar />
      </Sider>
      <Layout className="site-layout">
        <Header />
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
            <GlobalLoading />
            <React.Suspense
              fallback={<Skeleton active loading paragraph={{ rows: 50 }} />}
            >
              {children}
            </React.Suspense>
          </Content>
        </Layout>
        <Footer style={{ textAlign: 'center' }}>
          DCarbon Admin Dashboard ©2024
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;

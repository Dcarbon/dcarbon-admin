import React from 'react';
import Header from '@/components/common/header';
import GlobalLoading from '@/components/common/loading/global-loading';
import NavBar from '@/components/common/side-bar';
import { Layout } from 'antd';

import Breadcrumbs from './breadcrums';

const { Content, Footer, Sider } = Layout;
const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = React.useState(false);

  const onCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed);
  };

  return (
    <Layout>
      <Header />
      <Layout className="site-layout">
        <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
          <NavBar />
        </Sider>
        <Layout>
          <Breadcrumbs />
          <Layout>
            <Content className="site-layout-background">
              <GlobalLoading />

              {children}
            </Content>
          </Layout>
          <Footer className="footer">DCarbon Admin Dashboard ©2024</Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;

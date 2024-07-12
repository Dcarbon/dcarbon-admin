import ConnectButton from '@/components/common/button/connect-button';
import { useAuth } from '@/contexts/auth-context.tsx';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Flex, Layout, Typography } from 'antd';

import logo from '/image/dcarbon-logo-black.svg';

const Header = () => {
  const { isAuthenticated, user } = useAuth();
  const { Header } = Layout;
  return (
    <Layout>
      <Header className="header-container">
        <Flex justify="center" align="center" gap={10}>
          <img src={logo} alt="logo" width={26} height={26} />
          <Typography.Title className="header-title" level={5}>
            DCARBON
          </Typography.Title>
        </Flex>
        <Flex gap={10} align="center">
          {isAuthenticated && user ? (
            <Flex align={'center'}>
              <Avatar
                size={'default'}
                style={{
                  backgroundColor: 'var(--main-color)',
                  marginRight: '5px',
                }}
                icon={<UserOutlined />}
              />
              <Flex vertical style={{ lineHeight: '20px' }}>
                <span style={{ fontWeight: '500', fontSize: '.8em' }}>
                  {user.profile_name}
                </span>
                <span style={{ fontSize: '.55em', color: 'gray' }}>
                  {user.role?.toUpperCase()}
                </span>
              </Flex>
            </Flex>
          ) : (
            ''
          )}
          <ConnectButton />
        </Flex>
      </Header>
    </Layout>
  );
};

export default Header;

import ConnectButton from '@/components/common/button/connect-button';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Layout } from 'antd';

const Header = () => {
  const { Header } = Layout;
  const { logout } = useAuth();
  return (
    <Layout style={{ margin: '5px 0' }}>
      <Header
        style={{
          backgroundColor: '#fff',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 10,
        }}
      >
        <ConnectButton />
        <Button type="primary" onClick={logout}>
          Logout
        </Button>
      </Header>
    </Layout>
  );
};

export default Header;

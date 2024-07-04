import ConnectButton from '@/components/common/button/connect-button';
import { Flex, Layout, Typography } from 'antd';

import logo from '/dcarbon-logo.svg';

const Header = () => {
  const { Header } = Layout;
  return (
    <Layout>
      <Header className="header-container">
        <Flex justify="center" align="center" gap={10}>
          <img src={logo} alt="logo" width={40} height={40} />
          <Typography.Title className="header-title" level={3}>
            DCARBON
          </Typography.Title>
        </Flex>
        <Flex gap={10}>
          <ConnectButton />
        </Flex>
      </Header>
    </Layout>
  );
};

export default Header;

import ConnectButton from '@/components/common/button/connect-button';
import { Flex, Layout, Typography } from 'antd';

import logo from '/image/dcarbon-logo-black.svg';

const Header = () => {
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
        <Flex gap={10}>
          <ConnectButton />
        </Flex>
      </Header>
    </Layout>
  );
};

export default Header;

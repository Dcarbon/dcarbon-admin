import { memo, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { MENU, ROUTES_URL } from '@/utils/constants';
import { LogoutOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { Menu, MenuProps } from 'antd';

const NavBar = memo(() => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [selectedKey, setSelectedKey] = useState<string>(
    MENU.find((route) => location.pathname.startsWith(route.path))?.key ||
      ROUTES_URL.PROJECT,
  );
  const items: MenuProps['items'] = [
    ...MENU.map((menu: any) => ({
      key: menu.key,
      icon: menu.icon,
      label: menu.label,
      onClick: () => navigate({ to: menu.path }),
    })),
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: () => logout(),
    },
  ];

  useEffect(() => {
    const matchedRoute = MENU.find((route) => {
      return route.path === ROUTES_URL.PROJECT
        ? location.pathname === ROUTES_URL.PROJECT
        : location.pathname.startsWith(route.path);
    });

    setSelectedKey(matchedRoute?.key || ROUTES_URL.PROJECT);
  }, [location]);
  return (
    <Menu
      theme="light"
      selectedKeys={[selectedKey]}
      defaultSelectedKeys={[ROUTES_URL.PROJECT]}
      mode="inline"
      items={items}
    />
  );
});

export default NavBar;

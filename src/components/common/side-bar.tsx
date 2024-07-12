import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { MENU, ROUTES_URL } from '@/utils/constants';
import { LogoutOutlined } from '@ant-design/icons';
import { Link, useLocation } from '@tanstack/react-router';
import { Menu } from 'antd';

const NavBar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const [selectedKey, setSelectedKey] = useState<string>(
    MENU.find((route) => location.pathname.startsWith(route.path))?.key ||
      ROUTES_URL.HOME,
  );
  useEffect(() => {
    const matchedRoute = MENU.find((route) => {
      return route.path === ROUTES_URL.HOME
        ? location.pathname === ROUTES_URL.HOME
        : location.pathname.startsWith(route.path);
    });

    setSelectedKey(matchedRoute?.key || ROUTES_URL.HOME);
  }, [location]);
  return (
    <Menu
      theme="light"
      selectedKeys={[selectedKey]}
      defaultSelectedKeys={[ROUTES_URL.HOME]}
      mode="inline"
    >
      {MENU.map((menu: any) =>
        !menu.children ? (
          <Menu.Item key={menu.key} icon={menu.icon}>
            <Link to={menu.path}>{menu.label}</Link>
          </Menu.Item>
        ) : (
          <Menu.SubMenu
            style={{ padding: 0 }}
            key={menu.key}
            icon={menu.icon}
            title={menu.label}
          >
            {menu?.children?.map(
              (item: { label: string; path: string }, index: number) => (
                <Menu.Item key={'submenu' + index}>
                  <Link to={item.path}>{item.label}</Link>
                </Menu.Item>
              ),
            )}
          </Menu.SubMenu>
        ),
      )}
      <Menu.Item onClick={logout} key="logout" icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );
};

export default NavBar;

import { useEffect, useState } from 'react';
import { MENU } from '@/utils/constants';
import { Link, useLocation } from '@tanstack/react-router';
import { Menu } from 'antd';

const NavBar = () => {
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState(
    MENU?.find((route) => location.pathname.startsWith(route.path))?.key || '1',
  );
  useEffect(() => {
    setSelectedKey(
      MENU?.find((route) => location.pathname.startsWith(route.path))?.key ||
        '1',
    );
  }, [location]);
  return (
    <Menu
      theme="light"
      selectedKeys={[selectedKey]}
      defaultSelectedKeys={['1']}
      mode="inline"
    >
      {MENU.map((menu: any) =>
        !menu.children ? (
          <Menu.Item key={menu.key} icon={menu.icon}>
            <Link to={menu.path}>{menu.label}</Link>
          </Menu.Item>
        ) : (
          <Menu.SubMenu key={menu.key} icon={menu.icon} title={menu.label}>
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
    </Menu>
  );
};

export default NavBar;

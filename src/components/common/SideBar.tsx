import { MENU } from '@/utils/constants'
import { Menu } from 'antd'
import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const NavBar = () => {
    const location = useLocation()
    const [selectedKey, setSelectedKey] = useState(
        MENU?.find((route) => location.pathname.startsWith(route.path))?.key ||
            '1'
    )
    useEffect(() => {
        setSelectedKey(
            MENU?.find((route) => location.pathname.startsWith(route.path))
                ?.key || '1'
        )
    }, [location])
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
                        <NavLink to={menu.path}>{menu.label}</NavLink>
                    </Menu.Item>
                ) : (
                    <Menu.SubMenu
                        key={menu.key}
                        icon={menu.icon}
                        title={menu.label}
                    >
                        {menu?.children?.map(
                            (
                                item: { label: string; path: string },
                                index: number
                            ) => (
                                <Menu.Item key={'submenu' + index}>
                                    <NavLink to={item.path}>
                                        {item.label}
                                    </NavLink>
                                </Menu.Item>
                            )
                        )}
                    </Menu.SubMenu>
                )
            )}
        </Menu>
    )
}

export default NavBar

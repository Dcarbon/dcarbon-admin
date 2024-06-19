import { useAuth } from '@/contexts/AuthContext'
import { LockOutlined, MailOutlined } from '@ant-design/icons'
import { Button, Form, Grid, Input, theme, Typography } from 'antd'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const { useToken } = theme
const { useBreakpoint } = Grid
const { Text, Title } = Typography

const LoginPage = () => {
    const { login, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const { token } = useToken()
    const screens = useBreakpoint()

    const styles = {
        container: {
            margin: '0 auto',
            padding: screens.md
                ? `${token.paddingXL}px`
                : `${token.sizeXXL}px ${token.padding}px`,
            width: '380px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        },
        footer: {
            marginTop: token.marginLG,
            textAlign: 'center',
            width: '100%',
        },
        forgotPassword: {
            float: 'right',
        },
        header: {
            marginBottom: token.marginXL,
        },
        section: {
            alignItems: 'center',
            backgroundColor: token.colorBgContainer,
            display: 'flex',
            height: screens.sm ? '100vh' : 'auto',
            padding: screens.md ? `${token.sizeXXL}px 0px` : '0px',
        },
        text: {
            color: token.colorTextSecondary,
        },
        title: {
            fontSize: screens.md
                ? token.fontSizeHeading2
                : token.fontSizeHeading3,
        },
    }
    useEffect(() => {
        if (isAuthenticated) {
            navigate({
                pathname: location.state?.from || '/dashboard',
                search: location.state?.search || '',
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated])
    return (
        <section style={styles.section}>
            <div style={styles.container}>
                <div style={styles.header}>
                    <Title style={styles.title}>Sign in</Title>
                    <Text style={styles.text}>
                        Welcome back! Please enter your details
                        below to sign in.
                    </Text>
                </div>
                <Form
                    name="normal_login"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={login}
                    layout="vertical"
                    requiredMark="optional"
                >
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                type: 'email',
                                required: true,
                                message: 'Please input your Email!',
                            },
                        ]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Email" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Password!',
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: '0px' }}>
                        <Button type="primary" htmlType="submit">
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </section>
    )
}

export default LoginPage

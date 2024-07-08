import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { getInfoDevice } from '@/utils/helpers/common';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button, Col, Flex, Form, Input, Typography } from 'antd';

import imageLogo from '/image/login/login-image.png';

export const Route = createFileRoute('/signin')({
  component: () => <LoginPage />,
});

const LoginPage = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const [device, setDevice] = useState(getInfoDevice()?.device);
  const { Text, Title } = Typography;
  const navigate = useNavigate();
  const [form] = Form.useForm();
  useEffect(() => {
    if (isAuthenticated) {
      navigate({
        from: '/',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  useEffect(() => {
    const handleResize = () => {
      setDevice(getInfoDevice().device);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <Flex className="login-container" justify="center">
      <Flex justify="center" align="center" className="navbar">
        <Flex align="center" className="navbar-box" gap={20}>
          <img
            src="/image/login/logo-black.png"
            alt="logo"
            width={175}
            height={32}
          />
          <Text className="login-item-active">Sign In</Text>
        </Flex>
      </Flex>
      <Col span={device === 'DESKTOP' ? 14 : 24} className="login-side-left">
        <div className="login-modal">
          <div className="login-title">
            <Title className="login-title-heading">Welcome Back</Title>
            <Text className="login-title-description">
              Enter your email and password to sign in
            </Text>
          </div>
          <Form
            name="normal_login"
            form={form}
            initialValues={{
              remember: true,
            }}
            onFinish={login}
            layout="vertical"
            requiredMark="optional"
          >
            <Form.Item
              name="username"
              label="Email"
              rules={[
                {
                  type: 'email',
                  required: true,
                  whitespace: false,
                },
              ]}
            >
              <Input placeholder="Your email address" allowClear />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input.Password
                type="password"
                placeholder="Your password"
                allowClear
              />
            </Form.Item>

            <Flex justify="center">
              <Button
                className="w-full btn-login"
                type="primary"
                htmlType="submit"
                loading={isLoading}
              >
                Sign In
              </Button>
            </Flex>
          </Form>
        </div>
      </Col>
      {device === 'DESKTOP' ? (
        <Col span={10} className="login-side-right">
          <img
            src={imageLogo}
            alt="login"
            width={'100%'}
            height={'85%'}
            className="login-image"
          />
          <div className="login-side-right-logo">
            <img
              src="/image/login/logo-white.png"
              alt="logo"
              width={'72%'}
              height={'10%'}
            />
          </div>
        </Col>
      ) : null}
    </Flex>
  );
};

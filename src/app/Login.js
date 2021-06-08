import React from 'react';
import {
  Row, Col, Form, Input, Button, message, Image, Space,
} from 'antd';
import { Link, useHistory } from 'react-router-dom';
import AuthService from '../services/jwt.service';
import { setItem } from '../utils/localstorage';

const Login = () => {
  const history = useHistory();

  const onLoginSuccess = (data) => {
    setItem('access_token', data.access);
    setItem('refresh_token', data.refresh);
    history.push('/');
  };

  const onFinish = (values) => {
    AuthService.login({ email: values.email, password: values.password })
      .then(({ data }) => onLoginSuccess(data));
  };

  const onFinishFailed = (errorInfo) => {
    message.error(`Error, ${errorInfo}`);
  };

  return (
    <Row align="middle" justify="center" style={{ height: '100vh' }}>
      <Col span={6}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Image
            width={200}
            src="/howlogo.png"
            preview={false}
          />
        </div>
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Space>
              <Button type="primary" htmlType="submit">
                Login
              </Button>
              or
              <Button htmlType="button" onClick={() => history.push('/register')}>
                Sign Up
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default Login;

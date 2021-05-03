import React from 'react';
import {
  Row, Col, Form, Input, Button, Checkbox, message,
} from 'antd';
import { useHistory } from 'react-router-dom';
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

          <Form.Item wrapperCol={{ offset: 8, span: 16 }} name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default Login;

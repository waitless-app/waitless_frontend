import React from 'react';
import {
  Row, Col, Form, Input, Button, Checkbox,
} from 'antd';
import { History } from 'history';
import AuthService from '../services/jwt.service';
import { setItem } from '../utils/localstorage';

interface LoginProps {
  token?: string,
  history: History,
}

const Login: React.FC<LoginProps> = ({ history }) => {
  const onLoginSuccess = (data: { access: string, refresh: string}) => {
    setItem('access_token', data.access);
    setItem('refresh_token', data.refresh);
    history.push('/dashboard');
  };

  const onFinish = (values: {email: string, password: string, remember: boolean}) => {
    console.log(values);
    AuthService.login({ email: values.email, password: values.password })
      .then(({ data }) => onLoginSuccess(data));
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
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

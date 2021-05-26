import React from 'react';
import {
  Row, Col, Form, Input, Button, Checkbox, message, Space,
} from 'antd';
import { Link, useHistory } from 'react-router-dom';
import AuthService from '../services/jwt.service';

const Register = () => {
  const history = useHistory();

  const onRegisterSuccess = (data) => {
    console.log(data);
    message.success('Your account have been created, you now log in.');
    setTimeout(() => { history.push('/login'); }, 2000);
  };

  const onRegisterFail = (error) => {
    message.error(error.request.response);
  };

  const onFinish = (values) => {
    const { email, password, name } = values;
    console.log(values);
    AuthService.register({ email, password, name })
      .then(({ data }) => onRegisterSuccess(data))
      .catch((error) => onRegisterFail(error));
  };

  const onFinishFailed = () => {
    message.error('Validation Error');
  };

  return (
    <Row align="middle" justify="center" style={{ height: '100vh' }}>
      <Col span={6}>
        <Space direction="vertical" size="large">
          <Link strong onClick={() => history.push('/login')}>← Back to login</Link>
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
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please put your name!' }]}
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
                Register
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </Col>
    </Row>
  );
};

export default Register;

import React from 'react';
import { useQuery } from 'react-query';
import {
  Card, Col, Row, Avatar,
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { UserService } from '../services/api.service';

const Profile = () => {
  const {
    isLoading, data,
  } = useQuery('profile', () => UserService.get(), {
    staleTime: 1000 * 60,
  });
  return (
    <>
      <Row justify="center" style={{ height: '100vh' }}>
        <Col span={6}>
          <Card
            loading={isLoading}
            title={isLoading ? ''
              : <Avatar size={64} icon={<UserOutlined />} />}
            style={{ width: 300 }}
          >
            <p><b>Email</b></p>
            <p>{data?.data.email}</p>
            <p><b>Name</b></p>
            <p>{data?.data.name ? data?.data.name : 'Name not set'}</p>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Profile;

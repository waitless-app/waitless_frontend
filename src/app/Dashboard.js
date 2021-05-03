import React from 'react';
import {
  Layout, Menu, Breadcrumb, Row, Col, Avatar, Dropdown,
} from 'antd';
import {
  ShopOutlined, TagsOutlined, MessageOutlined, UserOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import {
  useHistory,
  Route, useRouteMatch,
} from 'react-router-dom';
import { removeItem } from '../utils/localstorage';
import Premises from '../premises/Premises';

const { Header, Content, Sider } = Layout;

// @ts-ignore
const Dashboard = () => {
  const history = useHistory();
  const match = useRouteMatch();

  const logOut = () => {
    removeItem('access_token');
    history.push('/login');
  };
  const ProfileDropdown = () => (
    <Menu>
      <Menu.Item onClick={logOut}>
        Logout
      </Menu.Item>
    </Menu>
  );
  // @ts-ignore
  return (
    <>
      <Layout style={{ height: '100vh' }}>
        <Header className="header">
          <Row align="middle" justify="end">
            <Col md="auto">
              <Dropdown overlay={ProfileDropdown} placement="bottomRight">
                <Avatar icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
              </Dropdown>
            </Col>
          </Row>
        </Header>
        <Layout>
          <Sider width={200} className="site-layout-background">
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%', borderRight: 0 }}
            >
              <Menu.Item key="home" onClick={() => history.push(`${match.url}`)} icon={<HomeOutlined />}>Home</Menu.Item>
              <Menu.Item key="premises" onClick={() => history.push(`${match.url}/premises`)} icon={<ShopOutlined />}>Premises</Menu.Item>
              <Menu.Item key="products" icon={<TagsOutlined />}>Products</Menu.Item>
              <Menu.Item key="news" icon={<MessageOutlined />}>News</Menu.Item>
              <Menu.Item key="profile" icon={<UserOutlined />}>Profile</Menu.Item>
            </Menu>
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
              <Breadcrumb.Item>Premises</Breadcrumb.Item>
            </Breadcrumb>
            <Content
              className="site-layout-background"
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
              }}
            >
              <Route exact path={`${match.url}/`} render={() => <div>Home</div>} />
              <Route path={`${match.url}/premises`} component={Premises} />
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </>
  );
};

export default Dashboard;

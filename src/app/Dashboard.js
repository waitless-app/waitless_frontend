import React from 'react';
import {
  Layout, Menu, Breadcrumb, Row, Col, Avatar, Dropdown,
} from 'antd';
import {
  ShopOutlined, TagsOutlined, MessageOutlined, UserOutlined,
  HomeOutlined, ContainerOutlined,
} from '@ant-design/icons';
import {
  useHistory,
  Route, useRouteMatch,
} from 'react-router-dom';
import { removeItem } from '../utils/localstorage';
import Premises from '../premises/Premises';
import Menus from '../menu/Menus';
import Product from '../product/Product';
import Profile from "./Profile";

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
              <Menu.Item key="menus" onClick={() => history.push(`${match.url}/menus`)} icon={<ContainerOutlined />}>Menus</Menu.Item>
              <Menu.Item key="products" onClick={() => history.push(`${match.url}/product`)} icon={<TagsOutlined />}>Products</Menu.Item>
              <Menu.Item key="news" disabled icon={<MessageOutlined />}>News</Menu.Item>
              <Menu.Item key="profile" onClick={() => history.push(`${match.url}/profile`)} icon={<UserOutlined />}>Profile</Menu.Item>
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
              <Route path={`${match.url}/menus`} component={Menus} />
              <Route path={`${match.url}/product`} component={Product} />
              <Route path={`${match.url}/profile`} component={Profile} />
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </>
  );
};

export default Dashboard;

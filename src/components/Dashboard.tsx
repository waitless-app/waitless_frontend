import React from 'react';
import {
  Layout, Menu, Breadcrumb, Row, Col, Avatar, Dropdown,
} from 'antd';
import {
  ShopOutlined, TagsOutlined, MessageOutlined, UserOutlined,
} from '@ant-design/icons';
import {
  useHistory,
  Route, useRouteMatch,
} from 'react-router-dom';
import { removeItem } from '../utils/localstorage';
import Premises from './Premises';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

// @ts-ignore
const Dashboard = ({ match }) => {
  const history = useHistory();
  const { path } = useRouteMatch();
  console.log(path);

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
  // @ts-ignore
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
              <SubMenu key="sub1" icon={<ShopOutlined />} title="Premises">
                <Menu.Item key="1">Your premises</Menu.Item>
              </SubMenu>
              <SubMenu key="sub2" icon={<TagsOutlined />} title="Products">
                <Menu.Item key="5">option5</Menu.Item>
                <Menu.Item key="6">option6</Menu.Item>
                <Menu.Item key="7">option7</Menu.Item>
                <Menu.Item key="8">option8</Menu.Item>
              </SubMenu>
              <SubMenu key="sub3" icon={<MessageOutlined />} title="News">
                <Menu.Item key="9">option9</Menu.Item>
                <Menu.Item key="10">option10</Menu.Item>
                <Menu.Item key="11">option11</Menu.Item>
                <Menu.Item key="12">option12</Menu.Item>
              </SubMenu>
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
              <Route path={`${match.url}/premises`} render={() => <div>Hello</div>} />
              <Route path={`${match.url}/premises1`} component={Premises} />
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </>
  );
};

export default Dashboard;

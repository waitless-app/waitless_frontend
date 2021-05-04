/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import {
  Button,
  Card, Menu, Dropdown, Select, Skeleton, Space,
} from 'antd';
import {
  CheckCircleOutlined, EditOutlined, EllipsisOutlined,
} from '@ant-design/icons';
import Meta from 'antd/es/card/Meta';
import Avatar from 'antd/es/avatar/avatar';
import { Route, useHistory, useRouteMatch } from 'react-router-dom';
import { MenuService, PremisesService } from '../services/api.service';
import { CreateMenu } from './CreateMenu';
import { UpdateMenu } from './UpdateMenu';

const Menus = () => {
  // TODO find a way to use cached data if exist if not refetch it
  const [count, setCount] = useState();
  const { path, url } = useRouteMatch();
  const history = useHistory();
  const {
    isFetching: isLoading, data,
  } = useQuery('premises', () => PremisesService.query(), {
    onSuccess({ data: initialPremises }) {
      setCount(initialPremises[0].id);
    },
  });
  const { data: menus, isFetching } = useQuery(
    ['menus', count],
    () => MenuService.query(count),
    {
      // The query will not execute until the userId exists
      enabled: !!count,
    },
  );

  const nameOrEmpty = (premises) => {
    const element = premises?.find(((item) => item.id === count));
    return typeof element === 'object' ? element.name : '';
  };

  const redirectMenuEdit = (menu) => {
    history.push(`${url}/edit/${menu}`);
  };
  const cardDropdownOverlay = (
    <Menu>
      <Menu.Item key="1">Make Default</Menu.Item>
    </Menu>
  );

  const MenusCards = () => (
    // eslint-disable-next-line no-nested-ternary
    isFetching ? (
      <Card
        style={{ width: 300, marginTop: 16 }}
        actions={[
          <EditOutlined key="edit" />,
          <EllipsisOutlined key="ellipsis" />,
        ]}
      >
        <Skeleton loading={isFetching} avatar active>
          <Meta
            avatar={
              <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              }
            title="Card title"
            description="This is the description"
          />
        </Skeleton>
      </Card>
    )
      : !menus?.data.length ? (
        <div>
          {'No available menus for '}
          { nameOrEmpty(data?.data)}
        </div>
      ) : (
        <div>
          { menus?.data.map((menu) => (
            <Card
              title={menu.name}
              extra={menu.is_default ? <CheckCircleOutlined title="This is default menu" /> : ''}
              style={{ width: 300, marginTop: 16 }}
              actions={[
                <EditOutlined onClick={() => redirectMenuEdit(menu.id)} key="edit" />,
                <Dropdown overlay={cardDropdownOverlay}>
                  <EllipsisOutlined key="ellipsis" />
                </Dropdown>,
              ]}
            />
          )) }
        </div>
      )
  );
  // TODO if premises Array is empty, do not display Menu View
  return (
    <>
      <Route exact path={path}>
        <Space>
          <Button type="primary" onClick={() => history.push(`${url}/create`)}>Create New Menu</Button>
          <Select
            style={{ width: 200 }}
            options={data?.data.map((premises) => ({ value: premises.id, label: premises.name }))}
            onSelect={(value) => setCount(value)}
            loading={isLoading}
            defaultValue={data?.data[0].id}
          />
        </Space>
        <MenusCards />
      </Route>
      <Route
        exact
        path={`${path}/create`}
        render={(props) => (
          <CreateMenu {...props} premises={data?.data} defaultPremise={count} />
        )}
      />
      <Route
        exact
        path={`${path}/edit/:id`}
        render={(props) => (
          <UpdateMenu premises={data?.data} {...props} />
        )}
      />
    </>
  );
};
export default Menus;

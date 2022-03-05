/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  Button,
  Card, Menu, Dropdown, Select, Skeleton, Space, Col, Row, message,
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
import { EmptyListWrapper } from '../core/EmptyListWrapper';

const Menus = () => {
  const [premisesId, setPremisesId] = useState();
  const { path, url } = useRouteMatch();
  const history = useHistory();

  const queryClient = useQueryClient();

  const {
    isFetching: isLoading, data,
  } = useQuery('premises', () => PremisesService.query(), {
    onSuccess({ data: initialPremises }) {
      if (initialPremises.length) setPremisesId(initialPremises[0].id);
    },
  });

  const { data: menus, isFetching } = useQuery(
    ['menus', premisesId],
    () => MenuService.query(premisesId),
    {
      enabled: !!premisesId,
    },
  );

  const { mutate: setDefaultMenu } = useMutation((menu) => MenuService.setDefault(menu), {
    onSuccess: () => {
      message.success('Menu set as default');
      queryClient.invalidateQueries(['menus', premisesId]);
    },
    onError: () => {
      message.error('Error setting up menu as default');
    },
  });

  const nameOrEmpty = (premises) => {
    const element = premises?.find(((item) => item.id === premisesId));
    return typeof element === 'object' ? element.name : '';
  };

  const redirectMenuEdit = (menu) => {
    history.push(`${url}/edit/${menu}`);
  };
  const cardDropdownOverlay = (menuId) => (
    <Menu>
      <Menu.Item key="1" onClick={() => setDefaultMenu(menuId)}>Make Default</Menu.Item>
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
          <Row gutter={16}>
            { menus?.data.map((menu) => (
              <Col>
                <Card
                  title={menu.name}
                  extra={menu.is_default ? <CheckCircleOutlined title="This is default menu" /> : ''}
                  style={{ width: 300, marginTop: 16 }}
                  actions={[
                    <EditOutlined onClick={() => redirectMenuEdit(menu.id)} key="edit" />,
                    <Dropdown overlay={cardDropdownOverlay(menu.id)}>
                      <EllipsisOutlined key="ellipsis" />
                    </Dropdown>,
                  ]}
                >
                  { menu.description}
                </Card>
              </Col>
            )) }
          </Row>
        </div>
      )
  );
  return (
    <>
      <Route exact path={path}>
        <EmptyListWrapper list={data?.data} emptyMessage="Please add premises first">
          <Space>
            <Button type="primary" onClick={() => history.push(`${url}/create`)}>Create New Menu</Button>
            <Select
              style={{ width: 200 }}
              options={data?.data?.map((premises) => ({
                value: premises.id,
                label: premises.name,
              }))}
              onSelect={(value) => setPremisesId(value)}
              loading={isLoading}
              defaultValue={data?.data[0]?.id}
            />
          </Space>
          <MenusCards />
        </EmptyListWrapper>
      </Route>
      <Route
        exact
        path={`${path}/create`}
        render={(props) => (
          <CreateMenu {...props} premises={data?.data} defaultPremise={premisesId} />
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

/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  Button, Col, message, Popconfirm, Row, Select, Space, Table,
} from 'antd';
import { Route, useHistory, useRouteMatch } from 'react-router-dom';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import Avatar from 'antd/es/avatar/avatar';
import { MenuService, PremisesService, ProductService } from '../services/api.service';
import { CreateProduct } from './CreateProduct';

const Product = () => {
  const [premises, setPremises] = useState();
  const history = useHistory();
  const { url, path } = useRouteMatch();
  const queryClient = useQueryClient();

  const {
    isFetching: isLoading, data: premisesOptions,
  } = useQuery('premises', () => PremisesService.query(), {
    onSuccess({ data: initialPremises }) {
      setPremises(initialPremises[0].id);
    },
  });

  const fetchMenusByPremises = (premisesID) => useQuery(
    ['menus', premisesID],
    () => MenuService.query({ premises: premisesID }),
    {
      // The query will not execute until the userId exists
      enabled: !!premisesID,
    },
  );

  const removeProductMutation = useMutation((productID) => ProductService.delete(productID), {
    onSuccess: () => {
      message.success('Product removed');
    },
    onError: () => {
      message.error('Error');
    },
    onSettled: () => {
      queryClient.invalidateQueries('products');
    },
  });

  const { data: products, isFetching } = useQuery(
    ['product', premises],
    () => ProductService.query({ premises },
      { enabled: !!premises }),
  );

  const handleProductRemove = (product) => {
    removeProductMutation.mutate(product.id);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (text) => (
        <Avatar src={text} />
      ),
    },
    {
      title: 'Active',
      dataIndex: 'is_active',
      key: 'isActive',
      render: (text, record) => (
        record.is_active ? <CheckCircleOutlined /> : <CloseCircleOutlined />
      ),
    },
    {
      title: 'Group',
      dataIndex: 'group',
      key: 'group',
      render: (text) => (
        text || (<small> Not set</small>)
      ),
    },
    {
      title: 'Menu',
      dataIndex: 'menu',
      key: 'menu',
      render: (text) => (
        text || (<small> Not set</small>)
      ),
    },
    {
      title: 'ECT',
      dataIndex: 'estimated_creation_time',
      key: 'estimated_creation_time',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Popconfirm
            title="Are you sure to delete this premises?"
            onConfirm={() => handleProductRemove(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Remove</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Route exact path={path}>
        <Row justify="space-between">
          <Col style={{ marginBottom: '1em' }}>
            <Select
              style={{ width: 200 }}
              options={premisesOptions?.data.map((option) => ({
                value: option.id,
                label: option.name,
              }))}
              onSelect={(value) => setPremises(value)}
              loading={isLoading}
              defaultValue={premisesOptions?.data[0].id}
            />
          </Col>
          <Col>
            <Button type="primary" onClick={() => history.push(`${url}/create`)}>Create New Product</Button>
          </Col>
        </Row>
        <Table dataSource={products?.data} columns={columns} />
      </Route>
      <Route
        exact
        path={`${path}/create`}
        render={(props) => (
          <CreateProduct {...props} premises={premisesOptions?.data} fetchMenusByPremises={fetchMenusByPremises} />
        )}
      />
    </>
  );
};

export default Product;

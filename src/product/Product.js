/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  Button, Col, message, Popconfirm, Row, Select, Space, Table, Tooltip,
} from 'antd';
import { Route, useHistory, useRouteMatch } from 'react-router-dom';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import Avatar from 'antd/es/avatar/avatar';
import { MenuService, PremisesService, ProductService } from '../services/api.service';
import { CreateProduct } from './CreateProduct';
import { UpdateProduct } from './UpdateProduct';
import { EmptyListWrapper } from '../core/EmptyListWrapper';

const Product = () => {
  const [premises, setPremises] = useState();
  const history = useHistory();
  const { url, path } = useRouteMatch();
  const queryClient = useQueryClient();

  const {
    isFetching: isLoading, data: premisesOptions,
  } = useQuery('premises', () => PremisesService.query(), {
    onSuccess({ data: initialPremises }) {
      if (initialPremises.length) setPremises(initialPremises[0].id);
    },
  });

  const fetchMenusByPremises = (premisesID) => useQuery(
    ['menus', premisesID],
    () => MenuService.query(premisesID),
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
  const {
    mutate: activateProduct,
    isLoading: isActivating,
  } = useMutation((product) => ProductService.update(product.id, { is_active: !product.is_active }),
    {
      onSuccess: (res) => {
        message.success(res?.data.isActive ? 'Product activated' : 'Product deactivated');
        queryClient.invalidateQueries('products');
      },
      onError: () => {
        message.error('Error, Please try again.');
      },
    });

  const { data: products } = useQuery(
    ['products', premises],
    () => ProductService.query({ premises },
      { enabled: !!premises }),
  );

  const handleProductRemove = (product) => {
    removeProductMutation.mutate(product.id);
  };

  const handleProductActivate = (product) => {
    activateProduct(product);
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
        <Tooltip title={record.is_active ? 'Deactivate Product' : 'Activate Product'}>
          <Button
            type="dashed"
            shape="circle"
            icon={record.is_active ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
            loading={isActivating}
            onClick={() => handleProductActivate(record)}
          />
        </Tooltip>
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
          <Button type="primary" onClick={() => history.push(`${url}/edit/${record.id}`)}>Edit</Button>
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
        <EmptyListWrapper list={premisesOptions?.data} emptyMessage="Please add premises first">
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
                defaultValue={premisesOptions?.data[0]?.id}
              />
            </Col>
            <Col>
              <Button type="primary" onClick={() => history.push(`${url}/create`)}>Create New Product</Button>
            </Col>
          </Row>
          <Table dataSource={products?.data} columns={columns} />
        </EmptyListWrapper>
      </Route>
      <Route
        exact
        path={`${path}/create`}
        render={(props) => (
          <CreateProduct
            {...props}
            defaultPremise={premises}
            premises={premisesOptions?.data}
            fetchMenusByPremises={fetchMenusByPremises}
          />
        )}
      />
      <Route
        exact
        path={`${path}/edit/:id`}
        render={(props) => (
          <UpdateProduct
            {...props}
            premises={premisesOptions?.data}
            fetchMenusByPremises={fetchMenusByPremises}
          />
        )}
      />
    </>
  );
};

export default Product;

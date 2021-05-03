/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  Route, useHistory, useRouteMatch,
} from 'react-router-dom';
import {
  Table, Space, Button, Row, Col, message, Popconfirm,
} from 'antd';
import { PremisesService } from '../services/api.service';
import { UpdatePremises } from './UpdatePremises';
import { CreatePremises } from './CreatePremises';

const Premises = () => {
  const history = useHistory();
  const { url, path } = useRouteMatch();
  const queryClient = useQueryClient();
  const handleRedirect = (route) => {
    history.push(route);
  };
  const removePremisesMutation = useMutation((premisesID) => PremisesService.delete(premisesID), {
    onSuccess: () => {
      message.success('Premises removed');
    },
    onError: () => {
      message.error('Error');
    },
    onSettled: () => {
      queryClient.invalidateQueries('premises');
    },
  });

  const {
    isLoading, error, data,
  } = useQuery('premises', () => PremisesService.query());
  if (isLoading) return (<>Loading...</>);

  const handlePremisesRemove = (premises) => {
    removePremisesMutation.mutate(premises.id);
  };

  if (error) {
    return (<div>{`An error has occurred: ${error.message}`}</div>);
  }
  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'owner',
      dataIndex: 'owner',
      key: 'owner',
    },
    {
      title: 'city',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleRedirect(`${url}/edit/${record.id}`)}>Edit</Button>
          <Popconfirm
            title="Are you sure to delete this premises?"
            onConfirm={() => handlePremisesRemove(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Remove</Button>
          </Popconfirm>
        </Space>
      ),
    }];
  return (
    <>
      <Route exact path={path}>
        <Row justify="end">
          <Col style={{ marginBottom: '1em' }}>
            <Button type="primary" onClick={() => handleRedirect(`${url}/create`)}>Create New Premises</Button>
          </Col>
        </Row>
        <Table columns={columns} dataSource={data?.data} />
      </Route>
      <Route
        exact
        path={`${path}/create`}
        render={(props) => (
          <CreatePremises {...props} />
        )}
      />
      <Route
        exact
        path={`${path}/edit/:id`}
        render={(props) => (
          <UpdatePremises {...props} />
        )}
      />
    </>
  );
};
export default Premises;

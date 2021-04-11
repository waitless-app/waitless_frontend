import React from 'react';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {
  Route, useHistory, useRouteMatch,
} from 'react-router-dom';
import {
  Table, Space, Button, Row, Col, message, Popconfirm,
} from 'antd';
import { PremisesService } from '../services/api.service';
import PremisesCreate from './PremisesCreate';

const Premises = ({ match }) => {
  const history = useHistory();
  const queryClient = useQueryClient()
  const handleRedirect = (route) => {
    history.push(route);
  };
  const { path } = useRouteMatch();
    const removePremisesMutation = useMutation(premisesID => PremisesService.delete(premisesID), {
      onSuccess: (data, variables, context) => {
      message.success('Premises removed');
      queryClient.invalidateQueries('premises');
   },
     onError: (data, error, variables, context) => {
       message.error("Error");
     },
      onSettled: () => {
        queryClient.invalidateQueries('premises');
      },
  })
  const mutation = useMutation(premises => PremisesService.post(premises), {
   onSuccess: (data, variables, context) => {
      message.success('Premises created');
      queryClient.invalidateQueries('premises');
      handleRedirect(`${match.url}`);
   },
   onError: (data, error, variables, context) => {
     message.error("Error");
   },
  });
  const {
    isLoading, error, data,
  } = useQuery('premises', () => PremisesService.query());
  if (isLoading) return (<>Loading...</>);

  const handlePremisesRemove = (premises) => {
      removePremisesMutation.mutate(premises.id)
  }

  const handleFormSubmit = (premises) => {
    mutation.mutate(premises);
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
          <Button type="primary">Edit</Button>
          <Popconfirm
            title="Are you sure to delete this premises?"
            onConfirm={() => confirm(record)}
            okText="Yes"
            cancelText="No"
            >
              <Button danger>Remove</Button>
          </Popconfirm>
        </Space>
      ),
    }];

  function confirm(premises) {
    handlePremisesRemove(premises);
  }

  return (
    <>
      <Route exact path={path}>
        <Row justify="end">
          <Col style={{ marginBottom: '1em' }}>
            <Button type="primary" onClick={() => handleRedirect(`${match.url}/create`)}>Create New Premises</Button>
          </Col>
        </Row>
        <Table columns={columns} dataSource={data?.data} />
      </Route>
      <Route exact path={`${path}/create`}
      render={(props) => (
          <PremisesCreate {...props} handleFormSubmit={handleFormSubmit}/>
      )} />
    </>
  );
};

export default Premises;

import React from 'react';
import {useMutation, useQuery} from 'react-query';
import {
  Route, RouteComponentProps, useHistory, useRouteMatch,
} from 'react-router-dom';
import {
  Table, Space, Button, Row, Col, message,
} from 'antd';
import { PremisesService } from '../services/api.service';
import PremisesCreate from './PremisesCreate';

const Premises = ({ match }) => {
  const history = useHistory();
  const handleRedirect = (route) => {
    history.push(route);
  };
  const { path } = useRouteMatch();
  const mutation = useMutation(premises => PremisesService.post(premises), {
   onSuccess: (data, variables, context) => {
      message.success('Todo added!');
   },
   onSettled: (data, error, variables, context) => {
     message.error("error");
   },
  })
  const {
    isLoading, error, data,
  } = useQuery('repoData', () => PremisesService.query());
  if (isLoading) return (<>Loading...</>);
  const handleFormSubmit = (premises) => {
    console.log(premises);
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
      render: () => (
        <Space size="middle">
          <Button type="primary">Edit</Button>
          <Button danger>Remove</Button>
        </Space>
      ),
    }];

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

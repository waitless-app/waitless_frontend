import React from 'react';
import { useQuery } from 'react-query';
import { RouteComponentProps } from 'react-router-dom';
import {
  Table, Space, Button, Row, Col,
} from 'antd';
import { PremisesService } from '../services/api.service';

const Premises: React.FunctionComponent<RouteComponentProps> = () => {
  type TResult = {
    data: Array<object>
  };
  const {
    isLoading, error, data,
  } = useQuery<TResult, Error>('repoData', () => PremisesService.query());
  if (isLoading) return (<>Loading...</>);

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
    <div>
      <>
        <Row justify="end">
          <Col style={{ marginBottom: '1em' }}>
            <Button type="primary">Create New Premises</Button>
          </Col>
        </Row>
        <Table columns={columns} dataSource={data?.data} />
      </>
    </div>
  );
};

export default Premises;

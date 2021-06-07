/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  Route, useHistory, useRouteMatch,
} from 'react-router-dom';
import {
  Table, Space, Button, Row, Col, message, Popconfirm, Tooltip,
} from 'antd';
import { QrcodeOutlined } from '@ant-design/icons';
import Modal from 'antd/es/modal/Modal';
import QRCode from 'qrcode.react';
import PropTypes from 'prop-types';
import { PremisesService } from '../services/api.service';
import { UpdatePremises } from './UpdatePremises';
import { CreatePremises } from './CreatePremises';

const QRCodeModal = ({ record }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const download = (item) => {
    const { name } = item;
    const link = document.createElement('a');
    link.download = `${name}-qr-code.png`;
    link.href = document.getElementById('qr-code').toDataURL();
    link.click();
  };
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const styles = {
    qrcode: {
      textAlign: 'center',
    },
  };
  return (
    <>
      <Tooltip title="Generate QR code">
        <Button type="primary" shape="circle" onClick={showModal} icon={<QrcodeOutlined />} />
      </Tooltip>
      <Modal
        title={`${record.name} QR Code`}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={() => download(record)}>
            Download
          </Button>,
        ]}
      >
        <div style={styles.qrcode}>
          <QRCode
            id="qr-code"
            level="Q"
            size={256}
            renderAs="canvas"
            value={JSON.stringify({
              type: 'premises',
              id: record.id,
            })}
          />
        </div>
      </Modal>
    </>
  );
};

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
  } = useQuery('premises', () => PremisesService.query(), {
    staleTime: 1000 * 60,
  });

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
          <QRCodeModal record={record} />
        </Space>
      ),
    }];
  if (isLoading) return (<>Loading...</>);
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
QRCodeModal.propTypes = {
  record: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
};
export default Premises;

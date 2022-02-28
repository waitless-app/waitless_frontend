import React from 'react';
import {
  Collapse,
  Table,
} from 'antd';
import PropTypes from 'prop-types';
import { parseDate } from '../../utils/utils';
import { EditableCell, EditableRow } from './OrderListEditableRow';

const { Panel } = Collapse;

const OrdersList = ({ orders, handleStatusChange }) => {
  const completedOrders = orders.filter(({ status }) => status === 'COMPLETED');
  const activeOrders = orders.filter(({ status }) => status !== 'COMPLETED');

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      editable: true,
    },
    {
      title: 'Customer',
      dataIndex: ['customer', 'name'],
      key: 'customer',
    },
    {
      title: 'Created At',
      dataIndex: 'created',
      key: 'created',
      render: (text, record) => (
        <div>{ parseDate(record.created)}</div>
      ),
    },
    {
      title: 'Last Update',
      dataIndex: 'updated',
      key: 'updated',
      render: (text, record) => (
        <div>{ parseDate(record.updated)}</div>
      ),
    }];

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const columns1 = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleStatusChange,
      }),
    };
  });

  return (
    <>
      <Collapse defaultActiveKey={['1']} ghost>
        <Panel header="Active Orders" key="1">
          <Table columns={columns1} components={components} dataSource={activeOrders} />
        </Panel>
        <Panel header="Completed Orders" key="2">
          <Table columns={columns} dataSource={completedOrders} />
        </Panel>
      </Collapse>
    </>
  );
};

OrdersList.propTypes = {
  orders: PropTypes.arrayOf(PropTypes.object),
  handleStatusChange: PropTypes.func,
};

OrdersList.defaultProps = {
  orders: [],
  handleStatusChange: () => {},
};
export default OrdersList;

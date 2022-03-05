import React, { useEffect, useState } from 'react';
import {
  Collapse,
  Table,
} from 'antd';
import PropTypes from 'prop-types';
import Avatar from 'antd/es/avatar/avatar';
import { parseDate } from '../../utils/utils';
import { EditableCell, EditableRow } from './OrderListEditableRow';

const { Panel } = Collapse;

const orderProductsNestedTable = ({ order_products: orderProducts }) => {
  const columns = [
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (<div>{record.product.name}</div>),
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (text, record) => (
        <Avatar src={record.product.image} />
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (text, record) => (<div>{record.quantity}</div>),
    },
  ];

  return <Table columns={columns} dataSource={orderProducts} pagination={false} />;
};

const OrdersList = ({ orders, handleStatusChange }) => {
  const [completedOrders, setCompletedOrders] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);

  useEffect(() => {
    setCompletedOrders(orders.filter(({ status }) => status === 'COMPLETED'));
    setActiveOrders(orders.filter(({ status }) => status !== 'COMPLETED'));
  }, [orders]);

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
      sorter: (a, b) => new Date(a.created).getTime() - new Date(b.created).getTime(),
    },
    {
      title: 'Last Update',
      dataIndex: 'updated',
      key: 'updated',
      render: (text, record) => (
        <div>{ parseDate(record.updated)}</div>
      ),
      sorter: (a, b) => new Date(a.updated).getTime() - new Date(b.updated).getTime(),
    }, {
      title: 'Total Cost',
      dataIndex: 'total_cost',
      key: 'total_cost',
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
          <Table
            columns={columns1}
            components={components}
            dataSource={activeOrders}
            rowKey={(record) => record.id}
            pagination={false}
            expandable={{ expandedRowRender: (record) => orderProductsNestedTable(record) }}
          />
        </Panel>
        <Panel header="Completed Orders" key="2">
          <Table columns={columns} dataSource={completedOrders} />
        </Panel>
      </Collapse>
    </>
  );
};

OrdersList.propTypes = {
  orders: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleStatusChange: PropTypes.func,
};

OrdersList.defaultProps = {
  handleStatusChange: () => {},
};
export default OrdersList;

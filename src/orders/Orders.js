import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import {
  Route, useRouteMatch,
} from 'react-router-dom';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import {
  Col, message, Row, Spin, Typography,
} from 'antd';
import { OrderService } from '../services/api.service';
import OrdersList from './OrdersList/OrdersList';
import { WS_URL } from '../utils/constants';
import { getItem } from '../utils/localstorage';
import { mergeArrayWithObject } from '../utils/utils';
import OrderComplete from './OrderComplete/OrderComplete';

const { Text } = Typography;

const Orders = () => {
  const queryClient = useQueryClient();
  const { path } = useRouteMatch();

  const {
    isLoading, error, data: orders,
  } = useQuery('orders', () => OrderService.query(), {
    select: (data) => data.data,
    placeholderData: [],
    staleTime: 1000 * 60,
  });

  const token = getItem('access_token');
  const socketUrl = `${WS_URL}/?token=${token}`;
  const {
    lastMessage,
    readyState,
    sendMessage,
  } = useWebSocket(socketUrl, {
    shouldReconnect: () => true,
    reconnectAttempts: 10,
    reconnectInterval: 3000,
  });

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  const handleWSMessage = ({ type: messageType, data: order }) => {
    if (messageType === 'update_order') {
      const mergedOrders = mergeArrayWithObject(orders, order);
      queryClient.setQueryData('orders', { data: mergedOrders });
      message.info('Order Status Updated');
    }

    if (messageType === 'order.notification') {
      const orderNotExist = !orders.some(({ id }) => id === order.id);
      if (orderNotExist) {
        queryClient.setQueryData('orders', { data: [order, ...orders] });
        message.info('You have new Order!');
      }
    }
  };

  useEffect(() => {
    if (lastMessage) {
      const msg = JSON.parse(lastMessage.data);
      handleWSMessage(msg);
    }
  }, [lastMessage]);

  const updateOrderStatus = (type, order) => {
    const payload = {
      type,
      data: {
        order,
      },
    };
    sendMessage(JSON.stringify(payload));
  };

  const handleStatusChange = (row) => {
    const { status, id: orderId } = row;

    const statuses = {
      ACCEPTED: 'accept.order',
      READY: 'ready.order',
      COMPLETED: 'complete.order',
    };

    if (row.status in statuses) {
      updateOrderStatus(statuses[status], orderId);
    } else {
      message.error(`Update to ${row.status} is not possible yet`);
    }
  };

  const [confirmationOrder, setConfirmationOrder] = useState();
  const onCodeSubmit = async (formValues) => {
    const { data } = await OrderService.confirmPickupCode({ pickup_code: formValues.pickup_code })
      .catch((err) => message.error(err.response.data.message));
    setConfirmationOrder(data);
  };

  if (error) {
    return (<div>{`An error has occurred: ${error.message}`}</div>);
  }

  if (isLoading) {
    return (<Spin tip="Loading..." spinning={isLoading} />);
  }

  return (
    <>
      <Route exact path={path}>
        <Row justify="start">
          <Col style={{ marginBottom: '1em' }}>
            <OrderComplete
              onCodeSubmit={onCodeSubmit}
              order={confirmationOrder}
              onOrderComplete={() => handleStatusChange({ ...confirmationOrder, status: 'COMPLETED' })}
              setConfirmationOrder={setConfirmationOrder}
            />
          </Col>
        </Row>

        <OrdersList
          orders={orders}
          error={error}
          isLoading={isLoading}
          handleStatusChange={handleStatusChange}
        />
        <div>
          <Text disabled>
            Connection is currently&nbsp;
            {connectionStatus}
          </Text>
        </div>
      </Route>
    </>
  );
};

export default Orders;

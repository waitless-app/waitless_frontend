/* eslint-disable react/jsx-props-no-spreading  */
/* eslint-disable react/prop-types  */
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import {
  Route, useRouteMatch,
} from 'react-router-dom';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { Col, message, Row } from 'antd';
import { OrderService } from '../services/api.service';
import OrdersList from './OrdersList/OrdersList';
import { WS_URL } from '../utils/constants';
import { getItem } from '../utils/localstorage';
import { mergeArrayWithObject } from '../utils/utils';
import OrderComplete from './OrderComplete/OrderComplete';

const Orders = () => {
  const { path } = useRouteMatch();

  const [orders, setOrders] = useState([]);
  const [confirmationOrder, setConfirmationOrder] = useState();

  const {
    isLoading, error,
  } = useQuery('orders', () => OrderService.query(), {
    staleTime: 1000 * 60,
    onSuccess: (data) => {
      setOrders(data.data);
    },
  });

  const token = getItem('access_token');
  const [socketUrl] = useState(`${WS_URL}/?token=${token}`);

  const {
    lastMessage,
    readyState,
    sendMessage,
  } = useWebSocket(socketUrl, {
    shouldReconnect: () => true,
    reconnectAttempts: 10,
    reconnectInterval: 3000,
  });

  useEffect(() => {
    if (lastMessage) {
      const msg = JSON.parse(lastMessage.data);
      if (msg.type === 'update_order') {
        setOrders(mergeArrayWithObject(orders, msg.data));
      }
    }
  }, [lastMessage]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  const acceptOrder = (order) => {
    const payload = {
      type: 'accept.order',
      data: {
        order: order.id,
      },
    };
    sendMessage(JSON.stringify(payload));
  };

  const readyOrder = (order) => {
    const payload = {
      type: 'ready.order',
      data: {
        order: order.id,
      },
    };
    sendMessage(JSON.stringify(payload));
  };

  const completeOrder = (order) => {
    const payload = {
      type: 'complete.order',
      data: {
        order: order.id,
      },
    };
    sendMessage(JSON.stringify(payload));
  };

  const handleStatusChange = (row) => {
    console.log(row);
    if (row.status === 'ACCEPTED') {
      acceptOrder(row);
    } else if (row.status === 'READY') {
      readyOrder(row);
    } else if (row.status === 'COMPLETED') {
      completeOrder(row);
    } else {
      message.error(`Update to ${row.status} is not possible yet`);
    }
  };

  if (error) {
    return (<div>{`An error has occurred: ${error.message}`}</div>);
  }

  if (isLoading) {
    return (<div>Data is loading.</div>);
  }

  const onCodeSubmit = async (formValues) => {
    const { data } = await OrderService.confirmPickupCode({ pickup_code: formValues.pickup_code })
      .catch((err) => message.error(err.response.data.message));
    setConfirmationOrder(data);
  };

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
          <span>
            The WebSocket is currently
            {connectionStatus}
          </span>
        </div>
      </Route>
    </>
  );
};

export default Orders;

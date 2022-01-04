/* eslint-disable react/jsx-props-no-spreading  */
/* eslint-disable react/prop-types  */
import React, {
  useCallback, useEffect, useState,
} from 'react';
import { useQuery } from 'react-query';
import {
  Route, useRouteMatch,
} from 'react-router-dom';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { OrderService } from '../services/api.service';
import OrdersList from './OrdersList/OrdersList';
import { WS_URL } from '../utils/constants';
import { getItem } from '../utils/localstorage';

const Orders = () => {
  const { path } = useRouteMatch();

  const [orders, setOrders] = useState([]);
  const {
    isLoading, error,
  } = useQuery('orders', () => OrderService.query(), {
    staleTime: 1000 * 60,
    onSuccess: (data) => {
      setOrders(data.data);
    },
  });

  const token = getItem('access_token');
  const [socketUrl, setSocketUrl] = useState(`${WS_URL}/?token=${token}`);

  const [messageHistory, setMessageHistory] = useState([]);

  const {
    lastMessage,
    readyState,
  } = useWebSocket(socketUrl, {
    shouldReconnect: () => true,
    reconnectAttempts: 10,
    reconnectInterval: 3000,
  });

  useEffect(() => {
    if (lastMessage) {
      const message = JSON.parse(lastMessage.data);
      if (message.type === 'echo.message') {
        setOrders([...orders, message.data]);
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

  const handleStatusChange = (row) => {
    console.log(row);
  };

  if (error) {
    return (<div>{`An error has occurred: ${error.message}`}</div>);
  }

  if (isLoading) {
    return (<div>Data is loading.</div>);
  }

  return (
    <>
      <Route exact path={path}>
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

/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

import './App.scss';
import { ReactQueryDevtools } from 'react-query/devtools';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import * as PropTypes from 'prop-types';
import Login from './app/Login';
import Dashboard from './app/Dashboard';
import { getItem } from './utils/localstorage';

function PrivateRoute({
  component: Component, direction, ...rest
}) {
  return (
    <Route
      {...rest}
      render={
        (props) => (getItem('access_token')
          ? <Component {...props} />
          : <Redirect to={{ pathname: direction }} />)
      }
    />
  );
}
PrivateRoute.propTypes = {
  direction: PropTypes.string,
  component: PropTypes.elementType.isRequired,
};
PrivateRoute.defaultProps = {
  direction: '/login',
};

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Switch>
          <Route exact path="/">
            <Redirect to="/dashboard" />
          </Route>
          <PrivateRoute path="/dashboard" component={Dashboard} />
          <Route path="/login" component={Login} />
        </Switch>
      </Router>
      <ReactQueryDevtools initialIsOpen />
    </QueryClientProvider>
  );
}
export default App;

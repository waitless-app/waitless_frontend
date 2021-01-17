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
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { getItem } from './utils/localstorage';

interface PrivateRouteProps {
  component: any,
  direction?: String,
  [key: string]: any,
}

function PrivateRoute({
  component: Component, direction, login, ...rest
} : PrivateRouteProps) {
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

PrivateRoute.defaultProps = {
  direction: '/login',
};

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Switch>
          <PrivateRoute path="/dashboard" component={Dashboard} />
          <Route path="/login" component={Login} />
        </Switch>
      </Router>
      <ReactQueryDevtools initialIsOpen />
    </QueryClientProvider>
  );
}

export default App;

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
  authed: String | Boolean
  [key: string]: any,
}

function PrivateRoute({ component: Component, authed, ...rest } : PrivateRouteProps) {
  return (
    <Route
      {...rest}
      render={(props) => (authed === true
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/login' }} />)}
    />
  );
}

const queryClient = new QueryClient();
const isAuthenticated = !!getItem('access_token');

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Switch>
          <Route path="/login" component={Login} />
          <PrivateRoute authed={isAuthenticated} path="/" component={Dashboard} />
        </Switch>
      </Router>
      <ReactQueryDevtools initialIsOpen />
    </QueryClientProvider>
  );
}

export default App;

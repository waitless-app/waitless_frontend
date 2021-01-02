import React from 'react';
import logo from './logo.svg';
import './App.scss';
import { ReactQueryDevtools } from "react-query/devtools";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import Login from "./components/Login";

const queryClient = new QueryClient();

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
      <Switch>
        <Route exact path="/" component={Login} />
      </Switch>
      </Router>
      <ReactQueryDevtools initialIsOpen />
    </QueryClientProvider>
  );
}

export default App;

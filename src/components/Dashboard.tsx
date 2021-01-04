import React from 'react';

interface LoginProps {
  token: string;
}

const Dashboard: React.FC<LoginProps> = () => (<h1>Hello from Dashboard</h1>);

export default Dashboard;

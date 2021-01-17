import React from 'react';
import { useQuery } from 'react-query';
import { RouteComponentProps } from 'react-router-dom';
import { PremisesService } from '../services/api.service';

const Premises: React.FunctionComponent<RouteComponentProps> = () => {
  type TResult = {
    data: Array<object>
  };
  const {
    isLoading, error, data,
  } = useQuery<TResult, Error>('repoData', () => PremisesService.query());
  if (isLoading) return (<>Loading...</>);

  if (error) {
    return (<div>{`An error has occurred: ${error.message}`}</div>);
  }

  return (
    <div>
      <>
        {data?.data.map((x: any) => x.name)}
      </>
    </div>
  );
};

export default Premises;

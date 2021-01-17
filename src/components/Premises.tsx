import React from 'react';
import { useQuery } from 'react-query';
import { RouteComponentProps } from 'react-router-dom';
import { PremisesService } from '../services/api.service';

const Premises: React.FunctionComponent<RouteComponentProps> = () => {
  const {
    isLoading, error, data,
  } = useQuery('repoData', () => PremisesService.query());
  if (isLoading) return (<>Loading...</>);

  if (error) {
    // @ts-ignore
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

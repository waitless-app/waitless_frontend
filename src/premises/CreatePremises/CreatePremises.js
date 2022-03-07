import React from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import { message } from 'antd';
import PremisesForm from '../PremisesForm';
import { PremisesService } from '../../services/api.service';
import { toBase64 } from '../../utils/utils';

export const CreatePremises = () => {
  const history = useHistory();
  const queryClient = useQueryClient();
  const {
    mutate: createPremises,
    isLoading,
  } = useMutation((premises) => PremisesService.post(premises), {
    onSuccess: () => {
      message.success('Premises created');
      queryClient.invalidateQueries('premises');
    },
    onError: (error) => {
      message.error(error.response.data.message);
    },
  });

  const onFormSubmit = async (data) => {
    const { image: { file }, ...payload } = data;
    createPremises({ ...payload, image: await toBase64(file) });
    history.push('/dashboard/premises');
  };

  return (
    <PremisesForm onFormSubmit={onFormSubmit} isLoading={isLoading} />
  );
};

export default CreatePremises;

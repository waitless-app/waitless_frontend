import { message, Spin } from 'antd';
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import PremisesForm from '../PremisesForm';
import { PremisesService } from '../../services/api.service';
import { toBase64 } from '../../utils/utils';

export const UpdatePremises = () => {
  const { id } = useParams();
  const history = useHistory();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(['premise', { id }], () => PremisesService.get(id));

  const {
    mutate: updatePremises,
    isLoading: isMutating,
  } = useMutation((premises) => PremisesService.update(premises.id, premises), {
    onSuccess: () => {
      message.success('Premises updated');
      queryClient.invalidateQueries('premises');
      history.push('/dashboard/premises');
    },
    onError: () => {
      message.error('Error, Please try again.');
    },
  });

  const onFormSubmit = async (premises) => {
    const payload = premises;
    // Convert new image to base64 any other way remove property
    if (payload.image && payload.image.file) payload.image = await toBase64(payload.image.file);
    else delete payload.image;
    await updatePremises({ id, ...payload });
  };

  if (isLoading) {
    return (
      <div className="spin"><Spin tip="Loading..." spinning={isLoading} /></div>
    );
  }

  return (
    <PremisesForm defaultValues={data?.data} onFormSubmit={onFormSubmit} isLoading={isMutating} />
  );
};

export default UpdatePremises;

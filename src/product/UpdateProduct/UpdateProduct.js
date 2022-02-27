import { message, Spin } from 'antd';
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import PropTypes from 'prop-types';
import ProductForm from '../ProductForm';
import { ProductService } from '../../services/api.service';
import { toBase64 } from '../../utils/utils';

export const UpdateProduct = ({ fetchMenusByPremises, premises }) => {
  const { id } = useParams();
  const history = useHistory();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(['product', { id }], () => ProductService.get(id));

  const {
    mutate: updatePremises,
    isLoading: isMutating,
  } = useMutation((product) => ProductService.update(product.id, product), {
    onSuccess: () => {
      message.success('Product updated');
      queryClient.invalidateQueries('products');
      history.push('/dashboard/product');
    },
    onError: () => {
      message.error('Error, Please try again.');
    },
  });

  const onFormSubmit = async (product) => {
    const payload = product;
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
    <ProductForm
      premises={premises}
      defaultValues={data?.data}
      defaultPremise={data?.data.premises}
      onFormSubmit={onFormSubmit}
      isLoading={isMutating}
      fetchMenusByPremises={fetchMenusByPremises}
    />
  );
};

UpdateProduct.propTypes = {
  fetchMenusByPremises: PropTypes.func,
  premises: PropTypes.arrayOf(PropTypes.object),
};

UpdateProduct.defaultProps = {
  fetchMenusByPremises: () => {},
  premises: [],
};

export default UpdateProduct;

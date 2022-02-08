import React from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import { message } from 'antd';
import * as PropTypes from 'prop-types';
import ProductForm from '../ProductForm';
import { toBase64 } from '../../utils/utils';
import { ProductService } from '../../services/api.service';

export const CreateProduct = ({ premises, defaultPremise, fetchMenusByPremises }) => {
  const history = useHistory();
  const queryClient = useQueryClient();
  const {
    mutate: createProduct,
    isLoading,
  } = useMutation((product) => ProductService.post(product), {
    onSuccess: () => {
      message.success('Product created');
      queryClient.invalidateQueries('products');
    },
    onError: () => {
      message.error('Error');
    },
  });

  const onFormSubmit = async (data) => {
    const { image: { file }, ...payload } = data;
    createProduct({ ...payload, image: await toBase64(file) });
    history.push('/dashboard/product');
  };

  return (
    <ProductForm
      onFormSubmit={onFormSubmit}
      isLoading={isLoading}
      premises={premises}
      defaultPremise={defaultPremise}
      fetchMenusByPremises={fetchMenusByPremises}
    />
  );
};

CreateProduct.propTypes = {
  premises: PropTypes.arrayOf(PropTypes.object).isRequired,
  defaultPremise: PropTypes.number,
  fetchMenusByPremises: PropTypes.func.isRequired,
};

CreateProduct.defaultProps = {
  defaultPremise: 0,
};

export default CreateProduct;

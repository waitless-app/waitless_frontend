import React from 'react';
import * as PropTypes from 'prop-types';
import { QueryClient, useMutation } from 'react-query';
import { message } from 'antd';
import { useHistory } from 'react-router-dom';
import MenuForm from '../MenuForm';
import { MenuService } from '../../services/api.service';

export const CreateMenu = ({ premises, defaultPremise }) => {
  const queryClient = new QueryClient();
  const history = useHistory();
  const {
    mutate: createMenu,
    isLoading,
  } = useMutation((menu) => MenuService.post(menu), {
    onSuccess: ({ data }) => {
      message.success('Menu created');
      queryClient.invalidateQueries(['menus', data.id]);
      history.push('/dashboard/menus');
    },
    onError: () => {
      message.error('Error');
    },
  });
  const onFormSubmit = async (data) => {
    createMenu(data);
  };
  return (
    <MenuForm
      onFormSubmit={onFormSubmit}
      defaultValues={{ premises: defaultPremise }}
      premises={premises}
      isLoading={isLoading}
    />
  );
};
CreateMenu.propTypes = {
  premises: PropTypes.arrayOf(PropTypes.object).isRequired,
  defaultPremise: PropTypes.number,
};

CreateMenu.defaultProps = {
  defaultPremise: 0,
};
export default CreateMenu;

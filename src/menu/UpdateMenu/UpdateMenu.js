import { message, Spin } from 'antd';
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import * as PropTypes from 'prop-types';
import { MenuService } from '../../services/api.service';
import MenuForm from '../MenuForm';

export const UpdateMenu = ({ premises }) => {
  const { id } = useParams();
  const history = useHistory();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(['menu', id], () => MenuService.get(id));

  const {
    mutate: updateMenu,
    isLoading: isMutating,
  } = useMutation((menu) => MenuService.update(menu.id, menu), {
    onSuccess: () => {
      message.success('Premises updated');
      queryClient.invalidateQueries(['menus', 2]);
      history.push('/dashboard/menus');
    },
    onError: () => {
      message.error('Error, Please try again.');
    },
  });

  const onFormSubmit = async (menu) => {
    updateMenu({ id, ...menu });
  };

  if (isLoading) {
    return (
      <div className="spin"><Spin tip="Loading..." spinning={isLoading} /></div>
    );
  }

  return (
    <MenuForm
      defaultValues={data?.data}
      onFormSubmit={onFormSubmit}
      isLoading={isMutating}
      premises={premises}
    />
  );
};

UpdateMenu.propTypes = {
  premises: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default UpdateMenu;

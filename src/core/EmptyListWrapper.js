import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from 'antd';

const { Title } = Typography;
export const EmptyListWrapper = ({ children, list, emptyMessage }) => (
  <>
    { list?.length ? (<>{ children }</>) : (<Title level={5}>{ emptyMessage }</Title>)}
  </>
);
EmptyListWrapper.propTypes = {
  children: PropTypes.element.isRequired,
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  emptyMessage: PropTypes.string.isRequired,
};

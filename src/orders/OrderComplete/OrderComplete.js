import {
  Button, Form, Input, Modal,
} from 'antd';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

const OrderComplete = ({
  onCodeSubmit, order, onOrderComplete, setConfirmationOrder,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const onFormSubmit = (values) => {
    onCodeSubmit(values);
  };

  const showModal = () => {
    setModalVisible(true);
  };
  const handleCancel = () => {
    setModalVisible(false);
    setConfirmationOrder(null);
  };

  const handleOrderCompletion = () => {
    onOrderComplete();
    setModalVisible(false);
  };

  const StepOne = () => (
    <Form
      form={form}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 14 }}
      layout="horizontal"
      onFinish={onFormSubmit}
    >
      <Form.Item
        label="Pickup Code"
        name="pickup_code"
        rules={[{ required: true, message: 'Pickup Code is required' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item wrapperCol={{ span: 6, offset: 6 }}>
        <Button type="primary" htmlType="submit">
          Check
        </Button>
      </Form.Item>
    </Form>
  );

  const StepTwo = () => (
    <>
      <div>{ order.id }</div>
      <div>{ order.customer.name }</div>
      <div>Order Products</div>
      { order.order_products.map((orderProduct) => (
        <div>
          { orderProduct.product.name }
        </div>
      ))}
      <Button type="primary" htmlType="submit" onClick={handleOrderCompletion}>
        Complete Order
      </Button>
    </>
  );

  return (
    <>
      <Button type="primary" onClick={() => showModal()}>Complete Order</Button>

      <Modal
        title={order ? 'Confirm Order Data' : 'Enter Pickup Code'}
        visible={modalVisible}
        footer={null}
        onCancel={handleCancel}
      >
        { order ? <StepTwo /> : <StepOne />}
      </Modal>
    </>
  );
};

OrderComplete.propTypes = {
  onCodeSubmit: PropTypes.func,
  order: PropTypes.shape({
    id: PropTypes.number,
    customer: PropTypes.shape({
      name: PropTypes.string,
    }),
    order_products: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  onOrderComplete: PropTypes.func,
  setConfirmationOrder: PropTypes.func,
};

OrderComplete.defaultProps = {
  onCodeSubmit: () => {},
  onOrderComplete: () => {},
  setConfirmationOrder: () => {},
};

export default OrderComplete;

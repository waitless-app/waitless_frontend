import React from 'react';
import {
  Form,
  Input,
  Button,
  Select,
} from 'antd';
import PropTypes from 'prop-types';

const MenuForm = ({
  defaultValues, onFormSubmit, isLoading, premises,
}) => {
  const [form] = Form.useForm();
  const onFinish = (values) => {
    onFormSubmit(values);
  };
  return (
    <>
      <Form
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        onFinish={onFinish}
        initialValues={{ ...defaultValues }}
      >
        <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Name is required' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Premises" name="premises" rules={[{ required: true, message: 'City is required' }]}>
          <Select
            style={{ width: 200 }}
            options={premises?.map((premise) => ({ value: premise.id, label: premise.name }))}
            loading={isLoading}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 8, offset: 4 }}>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Submit
          </Button>
        </Form.Item>

      </Form>
    </>
  );
};

MenuForm.propTypes = {
  defaultValues: PropTypes.shape({
    name: PropTypes.string,
    premises: PropTypes.number,
  }),
  onFormSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  premises: PropTypes.arrayOf(PropTypes.object).isRequired,
};

MenuForm.defaultProps = {
  defaultValues: {
    name: '',
    number: -1,
  },
  isLoading: false,
};
export default MenuForm;

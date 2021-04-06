import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  TreeSelect,
  Upload,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const PremisesCreate = () => {
  const [componentSize, setComponentSize] = useState('default');
  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };
  const { TextArea } = Input;
  return (
    <>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        initialValues={{ size: componentSize }}
        onValuesChange={onFormLayoutChange}
        size={componentSize}
      >
        <Form.Item label="Name">
          <Input />
        </Form.Item>
        <Form.Item label="Description">
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="Thumbnail"
          label="Upload"
          valuePropName="fileList"
          extra="Image file up to 5mb"
        >
          <Upload name="logo" action="/upload.do" listType="picture">
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item label="City">
          <TreeSelect
            treeData={[
              { title: 'Gdynia', value: 'Gdynia' },
            ]}
          />
        </Form.Item>
        <Form.Item label="Country">
          <TreeSelect
            treeData={[
              { title: 'Poland', value: 'Poland' },
            ]}
          />
        </Form.Item>
        <Form.Item label="Address">
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 8, offset: 4 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>

      </Form>
    </>
  );
};

export default PremisesCreate;

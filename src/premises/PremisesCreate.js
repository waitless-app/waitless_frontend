import React, { useState } from 'react';
import {
    Form,
    Input,
    Button,
    TreeSelect,
    Upload,
    message, Spin
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import {toBase64} from "../utils/utils";
import {useQuery} from "react-query";

const PremisesCreate = ({handleFormSubmit, match, usePremises }) => {
  const { id } = match.params;
  const { status, data, error, isFetching } = usePremises(id);
  const initialData = id ? data?.data : false;
  const [componentSize, setComponentSize] = useState('default');
  const [file, setFile] = useState();
  const [form] = Form.useForm();
  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };
   const onFinish = async (values) => {
     const { image: { file }, ...payload} = values;
    handleFormSubmit({ ...payload, image: await toBase64(file)});
    form.resetFields();
  };
  const { TextArea } = Input;
  return (
    <>
        { isFetching
        ? ( <div className="spin"><Spin tip="Loading..." spinning={isFetching} /></div> )
        : ( <Form
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        initialValues={{ size: componentSize, ...initialData }}
        onValuesChange={onFormLayoutChange}
        size={componentSize}
        onFinish={onFinish}
      >
        <Form.Item label="Name" name="name" rules={[{ required: true, message: "Name is required"}]}>
          <Input />
        </Form.Item>
        <Form.Item label="Description" name="description" rules={[{ required: true, message: "Description is required"}]}>
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item
          label="Upload Thumbnail"
          name="image"
           rules={[{ required: true, message: "Image is required"}]}
        >
             <Upload accept=".png" beforeUpload={() => false} multiple={false}>
                  <Button icon={<UploadOutlined />}>
                      Click to Upload
                  </Button>
              </Upload>
        </Form.Item>
        <Form.Item label="City" name="city" rules={[{ required: true, message: "City is required"}]}>
          <TreeSelect
            treeData={[
              { title: 'Gdynia', value: 'Gdynia' },
            ]}
          />
        </Form.Item>
        <Form.Item label="Postcode" name="postcode" rules={[{ required: true, message: "Postcode is required"}]}>
          <Input />
        </Form.Item>
        <Form.Item label="Country" name="country" rules={[{ required: true, message: "Country is required"}]}>
          <TreeSelect
            treeData={[
              { title: 'Poland', value: 'Poland' },
            ]}
          />
        </Form.Item>
        <Form.Item name="address" label="Address" rules={[{ required: true, message: "Address is required"}]}>
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 8, offset: 4 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>

      </Form>)}
    </>
  );
};

export default PremisesCreate;

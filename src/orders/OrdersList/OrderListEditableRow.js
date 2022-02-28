import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { Form, Select } from 'antd';
import PropTypes from 'prop-types';
import { Option } from 'antd/es/mentions';

const EditableContext = React.createContext(null);

export const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

EditableRow.propTypes = {
  index: PropTypes.number.isRequired,
};

export const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.info('Save failed:', errInfo);
    }
  };

  let childNode = children;
  const statuses = ['ACCEPTED', 'DECLINED', 'STARTED', 'IN_PROGRESS', 'READY'];
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Select ref={inputRef} style={{ width: 120 }} onChange={save}>
          {statuses.map((status) => <Option key={status} value={status}>{status}</Option>)}
        </Select>

      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
        onKeyUp={toggleEdit}
        role="button"
        tabIndex={0}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

EditableCell.propTypes = {
  title: PropTypes.string,
  editable: PropTypes.bool,
  children: PropTypes.shape({}),
  dataIndex: PropTypes.number,
  record: PropTypes.shape({}),
  handleSave: PropTypes.func,
};

EditableCell.defaultProps = {
  title: '',
  editable: false,
  children: {},
  dataIndex: 0,
  record: {},
  handleSave: () => {},
};

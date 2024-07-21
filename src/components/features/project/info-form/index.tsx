import React, { memo } from 'react';
import { getModelProject } from '@/adapters/project';
import InfiniteScrollSelect from '@/components/common/select/infinitive-scroll';
import { QUERY_KEYS } from '@/utils/constants';
import { useQuery } from '@tanstack/react-query';
import { Col, Flex, Form, Input, InputNumber, Modal, Select } from 'antd';
import { getData, getName } from 'country-list';
import ReactCountryFlag from 'react-country-flag';
import { IProject } from '@/types/projects';
import CancelButtonAction from '@components/common/button/button-cancel.tsx';
import SubmitButtonAction from '@components/common/button/button-submit.tsx';

type InfoFormProps = {
  onFinish: (values: any) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: IProject;
  loading?: boolean;
};

const ProjectInfoForm = memo(
  ({ onFinish, open, setOpen, data, loading }: InfoFormProps) => {
    const [form] = Form.useForm();
    const { data: model } = useQuery({
      queryKey: [QUERY_KEYS.GET_PROJECT_MODEL],
      queryFn: getModelProject,
    });
    return (
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        destroyOnClose
        footer={null}
        width={'50%'}
        maskClosable={!loading}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            ...data,
            iot_models: data.iot_models[0].id,
            spec: JSON.stringify(data.spec),
            po_id: data.manager.id,
          }}
          onFinish={(values) => {
            Object.keys(values).forEach((key) => {
              if (data[key as keyof IProject] === values[key]) {
                delete values[key];
              }
            });
            values.spec = JSON.parse(values.spec);
            values.iot_models = [values.iot_models];
            if (values.po_id === data.manager?.id) {
              delete values.po_id;
            }
            if (values.iot_models[0] === data.iot_models[0].id) {
              delete values.iot_models;
            }
            if (JSON.stringify(values.spec) === JSON.stringify(data.spec)) {
              delete values.spec;
            }
            if (values.country && getName(values.country) === data.country) {
              delete values.country;
            }
            onFinish(values);
          }}
        >
          <Flex gap={20}>
            <Col span={11}>
              <Form.Item
                label="Project name"
                name="project_name"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input placeholder="Project name" max={500} />
              </Form.Item>

              <Form.Item
                name="destination_wallet"
                label="Destination wallet"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input placeholder="Wallet" />
              </Form.Item>
              <Flex flex="auto" gap={10}>
                <Form.Item label="Location" name="location">
                  <Input placeholder="Project location" />
                </Form.Item>
                <Form.Item
                  label="Country"
                  name="country"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Select
                    placeholder="Choose project country"
                    className="project-modal-select"
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? '')
                        .toString()
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    allowClear
                  >
                    {getData()?.map((value) => (
                      <Select.Option
                        key={value.code}
                        value={value.code}
                        label={value.name}
                      >
                        <Flex gap={10} align="center">
                          <ReactCountryFlag countryCode={value.code} svg />
                          {value.name}
                        </Flex>
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Flex>
            </Col>
            <Col span={11}>
              <InfiniteScrollSelect />
              <Form.Item
                label="Model"
                name="iot_models"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select>
                  {model &&
                    model.length > 0 &&
                    model.map((item: any) => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.model_name}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item label="Power" name="power">
                <InputNumber min={0} />
              </Form.Item>
              <Form.Item label="Spec" name="spec">
                <Input.TextArea />
              </Form.Item>
            </Col>
          </Flex>
          <Flex justify="end" gap={10}>
            <SubmitButtonAction loading={loading}>Submit</SubmitButtonAction>
            <CancelButtonAction
              disabled={loading}
              onClick={() => setOpen(false)}
            >
              Cancel
            </CancelButtonAction>
          </Flex>
        </Form>
      </Modal>
    );
  },
);

export default ProjectInfoForm;

import React, { memo } from 'react';
import { getModelProject } from '@/adapters/project';
import MyInputNumber from '@/components/common/input/my-input-number';
import InfiniteScrollSelect from '@/components/common/select/infinitive-scroll';
import { QUERY_KEYS } from '@/utils/constants';
import { useQuery } from '@tanstack/react-query';
import { Col, Flex, Form, Input, InputNumber, Modal, Select } from 'antd';
import { createStyles } from 'antd-style';
import { getData } from 'country-list';
import ReactCountryFlag from 'react-country-flag';
import { IProject } from '@/types/projects';
import CancelButtonAction from '@components/common/button/button-cancel.tsx';
import SubmitButtonAction from '@components/common/button/button-submit.tsx';
import useNotification from '@utils/helpers/my-notification.tsx';

type InfoFormProps = {
  onFinish: (values: any) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: IProject;
  loading?: boolean;
};

const useStyle = createStyles(() => ({
  'my-modal-mask': {
    boxShadow: `inset 0 0 15px #fff`,
  },
  'my-modal-content': {
    border: '1px solid #333',
  },
}));

const ProjectInfoForm = memo(
  ({ onFinish, open, setOpen, data, loading }: InfoFormProps) => {
    const [form] = Form.useForm();
    const [myNotification] = useNotification();
    const { data: types } = useQuery({
      queryKey: [QUERY_KEYS.GET_PROJECT_MODEL],
      queryFn: getModelProject,
    });
    const { styles } = useStyle();
    const classNames = {
      mask: styles['my-modal-mask'],
      content: styles['my-modal-content'],
    };

    const modalStyles = {
      mask: {
        backdropFilter: 'blur(10px)',
      },
      content: {
        boxShadow: '0 0 30px #999',
        borderRadius: 'var(--div-radius)',
      },
    };
    return (
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        destroyOnClose
        footer={null}
        width={'50%'}
        maskClosable={!loading}
        centered
        classNames={classNames}
        styles={modalStyles}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            ...data,
            country_id: data.country?.code,
            type: data.type.code,
            spec: (() => {
              if (data.specs) delete data.specs.id;
              return data.specs ? JSON.stringify(data.specs) : undefined;
            })(),
            po_id: data.manager.id,
          }}
          onFinish={(values) => {
            Object.keys(values).forEach((key) => {
              if (data[key as keyof IProject] === values[key]) {
                delete values[key];
              }
            });
            if (values.spec) {
              values.spec = JSON.parse(values.spec);
            }
            if (values.po_id === data.manager?.id) {
              delete values.po_id;
            }
            if (values.type === data.type.code) {
              delete values.type;
            }
            if (
              values.specs &&
              JSON.stringify(values.spec) === JSON.stringify(data.spec)
            ) {
              delete values.spec;
            }
            if (values.spec) {
              try {
                if (Object.keys(values.spec).length < 1) {
                  throw new Error();
                }
              } catch (e) {
                // eslint-disable-next-line prefer-promise-reject-errors
                myNotification({ description: 'Spec must be json data' });
                return;
              }
            }
            if (values.country_id === data.country?.code) {
              delete values.country_id;
            }
            if (
              values.location.name !== data.location.name ||
              values.location.latitude !== data.location.latitude ||
              values.location.longitude !== data.location.longitude ||
              values.location.iframe !== data.location.iframe
            ) {
              //
            } else delete values.location;
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

              <Form.Item name="destination_wallet" label="Destination wallet">
                <Input placeholder="Wallet" />
              </Form.Item>
              <Flex flex="auto" gap={10}>
                <Form.Item label="Location name" name={['location', 'name']}>
                  <Input placeholder="Project location" />
                </Form.Item>
                <Form.Item
                  label="Country"
                  name={'country_id'}
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
              <Flex gap={10} justify="">
                <Form.Item
                  className="w-full"
                  name={['location', 'latitude']}
                  label="Latitude"
                  rules={[{ required: true }]}
                >
                  <MyInputNumber width="100%" />
                </Form.Item>
                <Form.Item
                  className="w-full"
                  name={['location', 'longitude']}
                  label="Longitude"
                  rules={[{ required: true }]}
                >
                  <MyInputNumber width="100%" />
                </Form.Item>
              </Flex>
              <Form.Item
                className="w-full"
                name={['location', 'iframe']}
                label="Iframe"
              >
                <MyInputNumber width="100%" />
              </Form.Item>
            </Col>
            <Col span={11}>
              <InfiniteScrollSelect />
              <Form.Item
                label="Type"
                name="type"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select>
                  {types &&
                    types.length > 0 &&
                    types.map((item: any) => (
                      <Select.Option key={item.code} value={item.code}>
                        {item.name}
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

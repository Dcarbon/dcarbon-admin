import { useCallback, useState } from 'react';
import {
  createProject,
  getModelProject,
  uploadProjectImage,
} from '@/adapters/project';
import NavigationBack from '@/components/common/navigation-back';
import TextEditor from '@/components/common/rich-editor/quill-editor';
import InfiniteScrollSelect from '@/components/common/select/infinitive-scroll';
import DeviceTable from '@/components/features/project/device-modal/table';
import { QUERY_KEYS } from '@/utils/constants';
import useBackAction from '@/utils/helpers/back-action';
import { PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { Col, Flex, Form, message, Select, Upload } from 'antd';
import { getData } from 'country-list';
import ReactCountryFlag from 'react-country-flag';
import CancelButtonAction from '@components/common/button/button-cancel.tsx';
import SubmitButtonAction from '@components/common/button/button-submit.tsx';
import CancelButton from '@components/common/button/cancel-button.tsx';
import MyInputNumber from '@components/common/input/my-input-number.tsx';
import MyInput from '@components/common/input/my-input.tsx';
import MySelect from '@components/common/input/my-select.tsx';
import MyInputTextArea from '@components/common/input/my-textarea.tsx';

export const Route = createLazyFileRoute('/_auth/project/create')({
  component: () => <CreateProject />,
});

const CreateProject = () => {
  const [form] = Form.useForm();
  const [openModal, setOpenModal] = useState(false);
  const [selectedDevice, setSelectDevice] = useState<DeviceType[]>([]);
  const [thumbnail, setThumbnail] = useState([]);
  const [images, setImages] = useState([]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleThumbnailChange = useCallback(
    ({ fileList }: { fileList: any }) => {
      setThumbnail(fileList);
      form.setFieldsValue({ thumbnail: [fileList[0]?.response?.path] });
    },
    [form],
  );
  const goBack = useBackAction({
    type: 'back',
    danger: true,
  });
  const handleImagesChange = useCallback(
    ({ fileList }: any) => {
      setImages(fileList);
      form.setFieldsValue({
        images: fileList.map((item: any) => item.response?.path),
      });
    },
    [form],
  );
  const handleCreateProject = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      message.success('Create project success');
      form.resetFields();
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_PROJECT],
      });
      navigate({
        to: '/project',
      });
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });
  const beforeUpload = (file: any) => {
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      message.error('Image must smaller than 1MB!');
    }
    return false;
  };
  const handleSave = useMutation({
    mutationFn: uploadProjectImage,
    onSuccess: (data) => {
      const formData = form.getFieldsValue();
      const body = {
        id: data.data.id,
        ...formData,
        thumbnail: data.data.result.find((item) => item.field === 'thumbnail')
          ?.result[0].path,
        images: data.data.result
          .find((item) => item.field === 'images')
          ?.result.map((item) => item.path),
        iot_models: [formData.iot_models],
        spec: formData.spec ? JSON.parse(formData.spec) : {},
        devices: selectedDevice,
      };
      handleCreateProject.mutate(body);
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });

  const { data: model } = useQuery({
    queryKey: [QUERY_KEYS.GET_PROJECT_MODEL],
    queryFn: getModelProject,
  });

  return (
    <div className="project-create-layout">
      <NavigationBack href="/project" />
      <DeviceTable
        open={openModal}
        setOpen={setOpenModal}
        selectedDevice={selectedDevice}
        setSelectDevice={setSelectDevice}
      />
      <Form
        form={form}
        layout="vertical"
        onFinish={() =>
          handleSave.mutate({
            thumbnail: thumbnail,
            images,
            category: 'project',
          })
        }
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
              <MyInput placeholder="Project name" max={500} />
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
              <MyInput placeholder="Wallet" />
            </Form.Item>
            <Flex gap={10}>
              <Form.Item className={'w-full'}>
                <Form.Item
                  label="Location"
                  name="location"
                  style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
                >
                  <MyInput placeholder="Project location" />
                </Form.Item>
                <Form.Item
                  label="Country"
                  name="country"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  style={{
                    display: 'inline-block',
                    width: 'calc(50% - 8px)',
                    margin: '0 8px',
                  }}
                >
                  <MySelect
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
                  </MySelect>
                </Form.Item>
              </Form.Item>
            </Flex>
            <Form.Item
              label="Description"
              name="description"
              rules={[
                {
                  required: true,
                  max: 5000,
                },
              ]}
            >
              <TextEditor
                style={{ backgroundColor: 'var(--main-gray)' }}
                value={form?.getFieldValue('description')}
                onChange={(e) => form?.setFieldValue('description', e)}
              />
            </Form.Item>
            <Flex justify="center" style={{ marginTop: '30px' }} gap={10}>
              <SubmitButtonAction
                loading={handleSave.isPending || handleCreateProject.isPending}
              >
                Submit
              </SubmitButtonAction>
              <CancelButtonAction
                disabled={handleSave.isPending || handleCreateProject.isPending}
                onClick={goBack}
              >
                Cancel
              </CancelButtonAction>
            </Flex>
          </Col>
          <Col span={11}>
            <Form.Item>
              <Form.Item
                label="Thumbnail"
                name="thumbnail"
                rules={[
                  {
                    required: true,
                  },
                ]}
                style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
              >
                <Upload
                  listType="picture-card"
                  fileList={thumbnail}
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  beforeUpload={beforeUpload}
                >
                  {thumbnail.length < 1 && (
                    <div>
                      <PlusOutlined /> Upload
                    </div>
                  )}
                </Upload>
              </Form.Item>
              <Form.Item
                label="Images"
                name="images"
                rules={[
                  {
                    required: true,
                  },
                ]}
                style={{
                  display: 'inline-block',
                  width: 'calc(50% - 8px)',
                  margin: '0 8px',
                }}
              >
                <Upload
                  listType="picture-card"
                  accept="image/*"
                  multiple
                  maxCount={5}
                  fileList={images}
                  onChange={handleImagesChange}
                  beforeUpload={beforeUpload}
                >
                  {images.length < 5 && (
                    <div>
                      <PlusOutlined /> Upload
                    </div>
                  )}
                </Upload>
              </Form.Item>
            </Form.Item>
            <Form.Item>
              <InfiniteScrollSelect />
              <Form.Item
                label="Model"
                name="iot_models"
                rules={[
                  {
                    required: true,
                  },
                ]}
                style={{
                  display: 'inline-block',
                  width: 'calc(50% - 8px)',
                  margin: '0 8px',
                }}
              >
                <MySelect placeholder="Select model">
                  {model &&
                    model.length > 0 &&
                    model.map((item: any) => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.model_name}
                      </Select.Option>
                    ))}
                </MySelect>
              </Form.Item>
            </Form.Item>
            <Flex>
              <Form.Item
                label="Power"
                name="power"
                style={{ display: 'inline-block', width: '100px' }}
              >
                <MyInputNumber min={0} />
              </Form.Item>
              <Form.Item
                label="Spec"
                name="spec"
                style={{
                  display: 'inline-block',
                  margin: '0 8px',
                  flexGrow: 1,
                }}
              >
                <MyInputTextArea rows={1} placeholder="Ex: {'key':'value'}" />
              </Form.Item>
            </Flex>
            <Flex
              gap={10}
              align="center"
              justify={'center'}
              style={{ marginTop: '15px' }}
            >
              <CancelButton
                icon={<PlusOutlined />}
                onClick={() => setOpenModal(true)}
              >
                Add Devices {`(selected: ${selectedDevice.length})`}
              </CancelButton>
            </Flex>
          </Col>
        </Flex>
      </Form>
    </div>
  );
};

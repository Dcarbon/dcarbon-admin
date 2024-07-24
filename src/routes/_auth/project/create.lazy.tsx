import { memo, useCallback, useState } from 'react';
import {
  createProject,
  getModelProject,
  uploadProjectImage,
} from '@/adapters/project';
import TextEditor from '@/components/common/rich-editor/quill-editor';
import InfiniteScrollSelect from '@/components/common/select/infinitive-scroll';
import DeviceTable from '@/components/features/project/device-modal/table';
import { ERROR_MSG, SUCCESS_MSG } from '@/constants';
import { EUserStatus } from '@/enums';
import { QUERY_KEYS } from '@/utils/constants';
import useBackAction from '@/utils/helpers/back-action';
import { PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { Col, Flex, Form, Select, Upload } from 'antd';
import { getData } from 'country-list';
import ReactCountryFlag from 'react-country-flag';
import { DeviceType } from '@/types/projects';
import CancelButtonAction from '@components/common/button/button-cancel.tsx';
import SubmitButtonAction from '@components/common/button/button-submit.tsx';
import CancelButton from '@components/common/button/cancel-button.tsx';
import MyInputNumber from '@components/common/input/my-input-number.tsx';
import MyInput from '@components/common/input/my-input.tsx';
import MySelect from '@components/common/input/my-select.tsx';
import MyInputTextArea from '@components/common/input/my-textarea.tsx';
import useNotification from '@utils/helpers/my-notification.tsx';

export const Route = createLazyFileRoute('/_auth/project/create')({
  component: () => <CreateProject />,
});

const CreateProject = memo(() => {
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
  const [myNotification] = useNotification();
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
      myNotification({
        type: 'success',
        description: SUCCESS_MSG.PROJECT.CREATE_SUCCESS,
      });
      form.resetFields();
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_PROJECT],
      });
      navigate({
        to: '/project',
      });
    },
    onError: (error: any) => {
      myNotification({
        message: ERROR_MSG.PROJECT.CREATE_ERROR,
        description: error.message || 'Something went wrong',
      });
    },
  });
  const beforeUpload = (file: any) => {
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      myNotification({
        description: ERROR_MSG.PROJECT.UPLOAD_IMAGE_LIMIT,
      });
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
          ?.result[0].relative_path,
        images: data.data.result
          .find((item: any) => item.field === 'images')
          ?.result.map((item) => item.relative_path),
        type: formData.type,
        spec:
          formData.spec && Object.keys(formData.spec).length > 0
            ? JSON.parse(formData.spec)
            : undefined,
        devices:
          selectedDevice && selectedDevice.length > 0
            ? selectedDevice
            : undefined,
      };
      handleCreateProject.mutate(body);
    },
    onError: (error: any) => {
      myNotification({
        message: ERROR_MSG.PROJECT.CREATE_ERROR,
        description: error.message || 'Something went wrong',
      });
    },
  });

  const { data: model } = useQuery({
    queryKey: [QUERY_KEYS.GET_PROJECT_MODEL],
    queryFn: getModelProject,
  });

  return (
    <div className="project-create-layout">
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
              <InfiniteScrollSelect status={EUserStatus.ACTIVE} />
              <Form.Item
                label="Model"
                name="type"
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
                    model.map((item) => (
                      <Select.Option key={item.code} value={item.code}>
                        {item.name}
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
});

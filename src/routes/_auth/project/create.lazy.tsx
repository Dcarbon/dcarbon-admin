import { memo, useCallback, useState } from 'react';
import {
  createProject,
  getModelProject,
  uploadProjectImage,
} from '@/adapters/project';
import TextEditor from '@/components/common/rich-editor/quill-editor';
import InfiniteScrollSelect from '@/components/common/select/infinitive-scroll';
import MapOverView from '@/components/features/project/map-overview';
import { ERROR_MSG, SUCCESS_MSG } from '@/constants';
import { EProjectType, EUserStatus } from '@/enums';
import { QUERY_KEYS } from '@/utils/constants';
import useBackAction from '@/utils/helpers/back-action';
import { PlusOutlined } from '@ant-design/icons';
import { MINT_SCHEDULE_TYPE } from '@constants/common.constant.ts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { Col, Flex, Form, Row, Select, Upload } from 'antd';
import ReactCountryFlag from 'react-country-flag';
import CancelButtonAction from '@components/common/button/button-cancel.tsx';
import SubmitButtonAction from '@components/common/button/button-submit.tsx';
import MyInputNumber from '@components/common/input/my-input-number.tsx';
import MyInput from '@components/common/input/my-input.tsx';
import MySelect from '@components/common/input/my-select.tsx';
import MyInputTextArea from '@components/common/input/my-textarea.tsx';
import {
  getAvailableCountries,
  isSolanaWallet,
} from '@utils/helpers/common.tsx';
import useNotification from '@utils/helpers/my-notification.tsx';

export const Route = createLazyFileRoute('/_auth/project/create')({
  component: () => <CreateProject />,
});

const CreateProject = memo(() => {
  const [form] = Form.useForm();
  const [thumbnail, setThumbnail] = useState([]);
  const [images, setImages] = useState([]);
  const [iframe, setIframe] = useState('');
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
    onSuccess: (data) => {
      myNotification({
        type: 'success',
        description: SUCCESS_MSG.PROJECT.CREATE_SUCCESS,
      });
      form.resetFields();
      setImages([]);
      setThumbnail([]);
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_PROJECT],
        }),
      ]).then(() =>
        navigate({
          to: '/project/$slug',
          params: { slug: data.data.slug },
          search: {
            tab: 2,
          },
        }),
      );
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
        ...formData,
        thumbnail: data.data.result.find((item) => item.field === 'thumbnail')
          ?.result[0].relative_path,
        images: data.data.result
          .find((item: any) => item.field === 'images')
          ?.result.map((item) => item.relative_path),
        type: formData.type,
        spec:
          formData.spec && Object.keys(JSON.parse(formData.spec)).length > 0
            ? JSON.parse(formData.spec)
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
  const setPoWallet = (wallet?: string) => {
    form.setFieldValue('po_wallet', wallet);
  };
  return (
    <div className="project-create-layout">
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          if (values.spec) {
            try {
              if (
                Object.keys(values.spec).length < 1 ||
                typeof JSON.parse(values.spec) !== 'object'
              ) {
                throw new Error();
              }
            } catch (e) {
              // eslint-disable-next-line prefer-promise-reject-errors
              myNotification({ description: 'Spec must be json data' });
              return;
            }
          }
          handleSave.mutate({
            thumbnail: thumbnail,
            images,
            category: 'project',
          });
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
              <MyInput placeholder="Project name" max={500} />
            </Form.Item>
            <Form.Item>
              <Form.Item
                label="Thumbnail"
                name="thumbnail"
                rules={[
                  {
                    required: true,
                  },
                ]}
                style={{ display: 'inline-block' }}
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
                  margin: '0 8px',
                }}
              >
                <Upload
                  listType="picture-card"
                  accept="image/*"
                  multiple
                  onPreview={() => null}
                  fileList={images}
                  onChange={handleImagesChange}
                  beforeUpload={beforeUpload}
                >
                  <div>
                    <PlusOutlined /> Upload
                  </div>
                </Upload>
              </Form.Item>
            </Form.Item>
            <Flex>
              <Form.Item
                label="Unit"
                name="power"
                rules={[
                  {
                    required: true,
                  },
                ]}
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
                <MyInputTextArea rows={5} placeholder="Ex: {'key':'value'}" />
              </Form.Item>
            </Flex>
            <Row style={{ margin: '16px 0px' }}>
              <Col span={24}>
                <Form.Item label="Mint Schedule" required={true}>
                  <Form.Item
                    name="mint_schedule"
                    style={{
                      display: 'inline-block',
                      width: 'calc(50% - 8px)',
                      marginRight: '8px',
                    }}
                  >
                    <MySelect
                      placeholder="Schedule type"
                      onSelect={(e) => {
                        const match = MINT_SCHEDULE_TYPE.find(
                          (info) => info.type === e,
                        );
                        if (match) {
                          form.setFieldValue('mint_schedule_time', match.time);
                        }
                      }}
                    >
                      {MINT_SCHEDULE_TYPE.map((item) => (
                        <Select.Option key={item.type} value={item.type}>
                          {item.name}
                        </Select.Option>
                      ))}
                    </MySelect>
                  </Form.Item>
                  <Form.Item
                    name="mint_schedule_time"
                    style={{
                      display: 'inline-block',
                      width: 'calc(50% - 8px)',
                    }}
                  >
                    <MyInput viewMode disabled />
                  </Form.Item>
                </Form.Item>
              </Col>
            </Row>
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
                onClick={() => goBack({ formData: form.getFieldsValue() })}
              >
                Cancel
              </CancelButtonAction>
            </Flex>
          </Col>
          <Col span={11}>
            <Form.Item>
              <Form.Item
                label="Type"
                name="type"
                rules={[
                  {
                    required: true,
                  },
                ]}
                style={{
                  display: 'inline-block',
                  width: 'calc(50% - 8px)',
                }}
              >
                <MySelect placeholder="Select model">
                  {model &&
                    model.length > 0 &&
                    model.map((item) => (
                      <Select.Option
                        key={item.code}
                        value={item.code}
                        disabled={
                          !item.active || item.code === EProjectType.PRJT_DRAFT
                        }
                      >
                        {item.name}
                      </Select.Option>
                    ))}
                </MySelect>
              </Form.Item>
            </Form.Item>
            <Form.Item>
              <InfiniteScrollSelect
                status={EUserStatus.ACTIVE}
                setValue={setPoWallet}
                style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
              />
              <Form.Item
                label="PO Wallet"
                name="po_wallet"
                rules={[
                  {
                    required: true,
                  },
                  {
                    validator: (_, value) => {
                      if (value) {
                        if (!isSolanaWallet(value)) {
                          return Promise.reject(new Error('Invalid PO Wallet'));
                        }
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
                style={{
                  display: 'inline-block',
                  width: 'calc(50% - 8px)',
                  margin: '0 8px',
                }}
              >
                <MyInput />
              </Form.Item>
            </Form.Item>
            <Flex gap={10}>
              <Form.Item className={'w-full'}>
                <Form.Item
                  label="Location name"
                  name={['location', 'name']}
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
                >
                  <MyInput placeholder="Project location" />
                </Form.Item>
                <Form.Item
                  label="Country"
                  name="country_id"
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
                    {getAvailableCountries()?.map((value) => (
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
            <Form.Item name={['location', 'iframe']} label="Iframe">
              <MyInput
                width="100%"
                onChange={(e) => setIframe(e.target.value)}
              />
            </Form.Item>
            {iframe ? <MapOverView src={iframe} /> : null}
          </Col>
        </Flex>
      </Form>
    </div>
  );
});

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
import { PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createLazyFileRoute } from '@tanstack/react-router';
import {
  Button,
  Col,
  Flex,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Space,
  Upload,
} from 'antd';
import { getData } from 'country-list';
import ReactCountryFlag from 'react-country-flag';

export const Route = createLazyFileRoute('/_auth/project/create')({
  component: () => <CreateProject />,
});

const CreateProject = () => {
  const [form] = Form.useForm();
  const [openModal, setOpenModal] = useState(false);
  const [selectedDevice, setSelectDevice] = useState<DeviceType[]>([]);
  const [thumbnail, setThumbnail] = useState([]);
  const [images, setImages] = useState([]);

  const handleThumbnailChange = useCallback(
    ({ fileList }: { fileList: any }) => {
      setThumbnail(fileList);
      form.setFieldsValue({ thumbnail: [fileList[0]?.response?.path] });
    },
    [form],
  );

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
                value={form?.getFieldValue('description')}
                onChange={(e) => form?.setFieldValue('description', e)}
              />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item
              label="Thumbnail"
              name="thumbnail"
              rules={[
                {
                  required: true,
                },
              ]}
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
            >
              <Upload
                listType="picture-card"
                accept="image/*"
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
            <Flex gap={10}>
              <Space>Device</Space>
              <Button type="primary" onClick={() => setOpenModal(true)}>
                Add
              </Button>
            </Flex>
          </Col>
        </Flex>
        <Flex justify="end" gap={10}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button danger htmlType="reset">
            Cancel
          </Button>
        </Flex>
      </Form>
    </div>
  );
};

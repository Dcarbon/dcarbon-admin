import { memo, useCallback, useState } from 'react';
import { updateProject } from '@/adapters/project';
import TextEditor from '@/components/common/rich-editor/quill-editor';
import { QUERY_KEYS } from '@/utils/constants';
import { EditOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Col, Descriptions, Flex, Form, Image, Space, Tag } from 'antd';
import ReactCountryFlag from 'react-country-flag';
import { IProject, IProjectRequest } from '@/types/projects';
import CancelButtonAction from '@components/common/button/button-cancel.tsx';
import SubmitButtonAction from '@components/common/button/button-submit.tsx';

import './overview.css';

import { ERROR_MSG, SUCCESS_MSG } from '@/constants';
import { EProjectStatus } from '@/enums';
import { MINT_SCHEDULE_TYPE } from '@constants/common.constant.ts';
import useNotification from '@utils/helpers/my-notification.tsx';

import ImageGallery from '../image-gallery';
import ProjectInfoForm from '../info-form';
import MapOverView from '../map-overview';
import UpdateImage from '../update-image';

const OverView = memo(({ data }: { data: IProject }) => {
  const [myNotification] = useNotification();
  // const [selectedDevice, setSelectDevice] = useState<DeviceType[]>(
  //   data.devices?.map((data) => ({
  //     iot_device_id: data.iot_device_id,
  //     iot_device_type: data.device_type,
  //   })) || [],
  // );
  // const [openModal, setOpenModal] = useState(false);
  const [form] = Form.useForm();
  const [openForm, setOpenForm] = useState(false);
  const [openEditor, setOpenEditor] = useState(false);
  const [isEditThumbnail, setIsEditThumbnail] = useState(false);
  const [isEditImages, setIsEditImages] = useState(false);

  const queryClient = useQueryClient();
  const handleUpdate = useMutation({
    mutationFn: updateProject,
    onSuccess: () => {
      myNotification({
        type: 'success',
        description: SUCCESS_MSG.PROJECT.UPDATE_SUCCESS,
      });
      queryClient
        .invalidateQueries({
          queryKey: [QUERY_KEYS.GET_PROJECT_BY_SLUG, data.slug],
        })
        .then();
    },
    onError: (error: any) => {
      myNotification({
        message: ERROR_MSG.PROJECT.UPDATE_ERROR,
        description: error.message || ERROR_MSG.COMMON.DEFAULT_ERROR,
      });
    },
  });
  const handleUpdateDescription = useCallback(() => {
    handleUpdate
      .mutateAsync({
        id: data.id,
        description: form.getFieldValue('description'),
      })
      .then((res) => {
        if (res.data.status === 'SUCCESS') {
          setOpenEditor(false);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);
  const handleUpdateInfo = useCallback(
    (values: Partial<IProjectRequest>) => {
      if (Object.keys(values).length === 0) return setOpenForm(false);
      handleUpdate.mutateAsync({ id: data.id, ...values }).then((res) => {
        if (res.data.status === 'SUCCESS') {
          setOpenForm(false);
        }
      });
    },
    [data.id, handleUpdate],
  );
  return (
    <>
      <ProjectInfoForm
        open={openForm}
        setOpen={setOpenForm}
        onFinish={handleUpdateInfo}
        loading={handleUpdate.isPending}
        data={data}
      />
      <Flex className="project-overview" gap={10}>
        <Col span={12} className="project-overview-content">
          <Descriptions
            bordered
            layout="vertical"
            title={
              <Flex justify="space-between" align="center">
                <span className={'project-description'}>
                  Project information
                </span>
                <Button onClick={() => setOpenForm(true)}>
                  <EditOutlined />
                </Button>
              </Flex>
            }
          >
            <Descriptions.Item label="Project name">
              {data.project_name}
            </Descriptions.Item>
            <Descriptions.Item label="Project manager">
              {data.manager?.profile_name}
            </Descriptions.Item>
            <Descriptions.Item label="Country">
              {data.country?.code ? (
                <Flex gap={10} align="center">
                  <ReactCountryFlag
                    countryCode={data.country?.code || 'VN'}
                    svg
                  />
                  {data.country?.name}
                </Flex>
              ) : null}
            </Descriptions.Item>
            <Descriptions.Item label="Location">
              {data.location.name}
            </Descriptions.Item>
            <Descriptions.Item label="Power">{data.power}</Descriptions.Item>
            <Descriptions.Item label="Status">
              {(() => {
                let color = 'red';
                let text = 'Inactive';
                switch (data.status) {
                  case EProjectStatus.PrjS_Register:
                    color = 'blue';
                    text = 'Register';
                    break;
                  case EProjectStatus.PrjS_Success:
                    color = 'green';
                    text = 'Active';
                    break;
                  default:
                }
                return <Tag color={color}>{text}</Tag>;
              })()}
            </Descriptions.Item>
            <Descriptions.Item label="IOT Models">
              <Space>
                <Flex key={data.type.code} gap={10}>
                  <span>{data.type.name}</span>
                </Flex>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Minting Schedule">
              {(() => {
                const match = MINT_SCHEDULE_TYPE.find(
                  (info) => info.type === data.mint_schedule,
                );
                return match ? (
                  <span>
                    <span style={{ fontWeight: '500' }}>{match.name}</span>{' '}
                    <span style={{ fontSize: '.9em', color: 'gray' }}>
                      ({match.time})
                    </span>
                  </span>
                ) : (
                  'Unset'
                );
              })()}
            </Descriptions.Item>
          </Descriptions>
          {data.location.iframe ? (
            <Descriptions className="m-vertical-8">
              <Descriptions.Item label="Location">
                <MapOverView src={data.location.iframe} />
              </Descriptions.Item>
            </Descriptions>
          ) : null}
          <Descriptions layout="vertical" className="m-vertical-8">
            <Descriptions.Item label="Thumbnail">
              {!isEditThumbnail ? (
                <>
                  <Image className="project-image-view" src={data.thumbnail} />{' '}
                  <Button onClick={() => setIsEditThumbnail(true)}>
                    <EditOutlined />
                  </Button>
                </>
              ) : (
                <UpdateImage
                  image={[data.thumbnail]}
                  type="thumbnail"
                  setIsEdit={setIsEditThumbnail}
                />
              )}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions layout="vertical" className="m-vertical-8">
            <Descriptions.Item label="Images">
              {!isEditImages ? (
                <>
                  {/* <Image.PreviewGroup>
                    {data.images.map((image: string, index: number) => (
                      <Image
                        className="project-image-view"
                        key={index}
                        src={image}
                        alt="image"
                      />
                    ))}
                  </Image.PreviewGroup> */}
                  <ImageGallery data={data.images} />
                  <Button onClick={() => setIsEditImages(true)}>
                    <EditOutlined />
                  </Button>
                </>
              ) : (
                <UpdateImage
                  image={data.images}
                  type="list"
                  setIsEdit={setIsEditImages}
                />
              )}
            </Descriptions.Item>
          </Descriptions>
        </Col>
        <Col span={12} className="project-overview-content">
          {!openEditor ? (
            <>
              <Flex align="center" justify="space-between">
                <b>Description</b>{' '}
                <Button onClick={() => setOpenEditor(true)}>
                  <EditOutlined />
                </Button>
              </Flex>
              <div
                className="project-description"
                dangerouslySetInnerHTML={{ __html: data.description }}
              />
            </>
          ) : (
            <>
              <Form form={form}>
                <Form.Item
                  name="description"
                  initialValue={data.description}
                  rules={[
                    {
                      required: true,
                      max: 5000,
                    },
                  ]}
                >
                  <TextEditor
                    value={form.getFieldValue('description')}
                    onChange={(value) =>
                      form.setFieldValue('description', value)
                    }
                  />
                </Form.Item>
              </Form>
              <br />
              <Flex gap={10} justify="end">
                <SubmitButtonAction
                  onClick={handleUpdateDescription}
                  loading={handleUpdate.isPending}
                >
                  Save
                </SubmitButtonAction>
                <CancelButtonAction
                  onClick={() => setOpenEditor(false)}
                  disabled={handleUpdate.isPending}
                >
                  Cancel
                </CancelButtonAction>
              </Flex>
            </>
          )}
          {/* <div>*/}
          {/*  <Flex align="center" gap={20}>*/}
          {/*    {' '}*/}
          {/*    <h4>Devices</h4>{' '}*/}
          {/*    <Button onClick={() => setOpenModal(true)}>*/}
          {/*      <EditOutlined />*/}
          {/*    </Button>*/}
          {/*  </Flex>*/}
          {/* </div>*/}
          {/* <Flex vertical gap={10}>*/}
          {/*  {data.devices?.map((device) => (*/}
          {/*    <Descriptions key={`dv_${device.id}`} bordered layout="vertical">*/}
          {/*      <Descriptions.Item label="Device Id">*/}
          {/*        {device.iot_device_id}*/}
          {/*      </Descriptions.Item>*/}
          {/*      <Descriptions.Item label="Device Type">*/}
          {/*        {device.device_type.name}*/}
          {/*      </Descriptions.Item>*/}
          {/*      <Descriptions.Item label="Device Name">*/}
          {/*        {device.device_name}*/}
          {/*      </Descriptions.Item>*/}
          {/*      <Descriptions.Item label="Device Status">*/}
          {/*        {device.status.name}*/}
          {/*      </Descriptions.Item>*/}
          {/*    </Descriptions>*/}
          {/*  ))}*/}
          {/* </Flex>*/}
        </Col>
      </Flex>
    </>
  );
});

export default OverView;

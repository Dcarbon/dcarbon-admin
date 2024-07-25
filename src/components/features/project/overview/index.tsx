import { memo, useCallback, useRef, useState } from 'react';
import { updateProject } from '@/adapters/project';
import TextEditor from '@/components/common/rich-editor/quill-editor';
import { QUERY_KEYS } from '@/utils/constants';
import { EditOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Col, Descriptions, Flex, Image, Space } from 'antd';
import ReactCountryFlag from 'react-country-flag';
import { IProject, IProjectRequest } from '@/types/projects';
import CancelButtonAction from '@components/common/button/button-cancel.tsx';
import SubmitButtonAction from '@components/common/button/button-submit.tsx';

import './overview.css';

import { ERROR_MSG, SUCCESS_MSG } from '@/constants';
import useNotification from '@utils/helpers/my-notification.tsx';

import ProjectInfoForm from '../info-form';
import MapOverView from '../map-overview';

const OverView = memo(({ data }: { data: IProject }) => {
  const [myNotification] = useNotification();
  const [openForm, setOpenForm] = useState(false);
  const [openEditor, setOpenEditor] = useState(false);
  const DescriptionRef = useRef({
    description: data.description,
  });
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
        description: DescriptionRef.current.description,
      })
      .then((res) => {
        if (res.data.status === 'SUCCESS') {
          setOpenEditor(false);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DescriptionRef.current.description]);
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
            <Descriptions.Item label="Destination wallet">
              {data.destination_wallet}
            </Descriptions.Item>
            <Descriptions.Item label="Power">{data.power}</Descriptions.Item>
            <Descriptions.Item label="Status">{data.status}</Descriptions.Item>
            <Descriptions.Item label="IOT Models">
              <Space>
                <Flex key={data.type.code} gap={10}>
                  <span>{data.type.name}</span>
                </Flex>
              </Space>
            </Descriptions.Item>
          </Descriptions>
          {data.location.iframe ? (
            <Descriptions>
              <Descriptions.Item label="Location">
                <MapOverView src={data.location.iframe} />
              </Descriptions.Item>
            </Descriptions>
          ) : null}
          <Descriptions layout="vertical">
            <Descriptions.Item label="Thumbnail">
              <Image className="project-image-view" src={data.thumbnail} />
            </Descriptions.Item>
          </Descriptions>
          <Descriptions layout="vertical">
            <Descriptions.Item label="Images">
              <Image.PreviewGroup>
                {data.images.map((image: string, index: number) => (
                  <Image
                    className="project-image-view"
                    key={index}
                    src={image}
                    alt="image"
                  />
                ))}
              </Image.PreviewGroup>
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
              <TextEditor
                value={DescriptionRef.current.description}
                onChange={(e) => (DescriptionRef.current.description = e)}
              />
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

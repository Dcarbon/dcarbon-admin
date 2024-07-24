import { memo, useCallback, useRef, useState } from 'react';
import { updateProject } from '@/adapters/project';
import TextEditor from '@/components/common/rich-editor/quill-editor';
import { QUERY_KEYS } from '@/utils/constants';
import { EditOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Col, Descriptions, Flex, Image, message, Space } from 'antd';
import { getCode } from 'country-list';
import ReactCountryFlag from 'react-country-flag';
import { IProject, IProjectRequest } from '@/types/projects';
import CancelButtonAction from '@components/common/button/button-cancel.tsx';
import SubmitButtonAction from '@components/common/button/button-submit.tsx';

import './overview.css';

import ProjectInfoForm from '../info-form';

const OverView = memo(({ data }: { data: IProject }) => {
  // const [selectedDevice, setSelectDevice] = useState<DeviceType[]>(
  //   data.devices?.map((data) => ({
  //     iot_device_id: data.iot_device_id,
  //     iot_device_type: data.device_type,
  //   })) || [],
  // );
  // const [openModal, setOpenModal] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [openEditor, setOpenEditor] = useState(false);
  const DescriptionRef = useRef({
    description: data.description,
  });
  const queryClient = useQueryClient();
  const handleUpdate = useMutation({
    mutationFn: updateProject,
    onSuccess: () => {
      message.success('Update project success');
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_PROJECT_BY_SLUG, data.slug],
      });
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });
  // const handleUpdateDevice = useCallback(async () => {
  //   handleUpdate
  //     .mutateAsync({ id: data.id, devices: selectedDevice })
  //     .then((res) => {
  //       if (res.data.status === 'SUCCESS') {
  //         setOpenModal(false);
  //       }
  //     });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectedDevice]);
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
      {/* <DeviceTable*/}
      {/*  onOk={handleUpdateDevice}*/}
      {/*  open={openModal}*/}
      {/*  setOpen={setOpenModal}*/}
      {/*  selectedDevice={selectedDevice}*/}
      {/*  setSelectDevice={setSelectDevice}*/}
      {/* />*/}
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
              {data.manager?.user_name}
            </Descriptions.Item>
            <Descriptions.Item label="Country">
              {data.country ? (
                <Flex gap={10} align="center">
                  <ReactCountryFlag
                    countryCode={
                      getCode(data.country?.code)?.toString() || 'VN'
                    }
                    svg
                  />
                  {data.country?.name}
                </Flex>
              ) : null}
            </Descriptions.Item>
            <Descriptions.Item label="Location">
              {data.location_name}
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
          <Descriptions layout="vertical">
            <Descriptions.Item label="Thumbnail">
              <Image className="project-image-view" src={data.thumbnail} />
            </Descriptions.Item>
          </Descriptions>
          <Descriptions layout="vertical">
            <Descriptions.Item label="Images">
              <Space>
                {data.images.map((image: string, index: number) => (
                  <Image
                    className="project-image-view"
                    key={index}
                    src={image}
                  />
                ))}
              </Space>
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

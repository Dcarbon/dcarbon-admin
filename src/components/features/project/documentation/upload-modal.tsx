import { memo, useCallback, useEffect, useState } from 'react';
import { ERROR_MSG, SUCCESS_MSG } from '@/constants';
import {
  addProjectDocument,
  getDocumentUploadUrl,
  uploadProjectDocument,
} from '@adapters/project.ts';
import { PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Col, Flex, Form, Row, Upload } from 'antd';
import { UploadFile } from 'antd/es/upload/interface';
import { IPreSignPostResponse } from '@/types/common';
import CancelButton from '@components/common/button/cancel-button.tsx';
import SubmitButton from '@components/common/button/submit-button.tsx';
import MyInput from '@components/common/input/my-input.tsx';
import { QUERY_KEYS } from '@utils/constants';
import useNotification from '@utils/helpers/my-notification.tsx';

interface IFormValues {
  document_name: string;
  document_type: string;
  document?: string[];
}

interface IProps {
  refetchProjectDocuments: () => void;
  slug: string;
  setOpenDocumentUpload: (status: boolean) => void;
}

const UploadModal = memo(
  ({ slug, setOpenDocumentUpload, refetchProjectDocuments }: IProps) => {
    const [document, setDocument] = useState<UploadFile<any>>();
    const [form] = Form.useForm<IFormValues>();
    const [loading, setLoading] = useState(false);
    const [myNotification] = useNotification();
    const [enabledQuery, setEnabledQuery] = useState(false);
    const {
      data: uploadUrlInfo,
      isLoading,
      refetch,
    } = useQuery({
      queryKey: [QUERY_KEYS.PROJECT.DOCUMENT_UPLOAD_URL, slug],
      queryFn: () =>
        getDocumentUploadUrl({
          slug,
          documentName: form.getFieldValue('document_name'),
        }),
      staleTime: 0,
      enabled: enabledQuery,
    });
    const { mutateAsync: uploadDocumentMutateAsync } = useMutation({
      mutationFn: uploadProjectDocument,
      onError: () => {
        myNotification({
          description: ERROR_MSG.PROJECT.UPLOAD_DOCUMENT_ERROR,
        });
      },
    });
    const { mutateAsync: addProjectDocumentMutateAsync } = useMutation({
      mutationFn: addProjectDocument,
      onError: () => {
        myNotification({
          description: ERROR_MSG.PROJECT.ADD_PROJECT_DOCUMENT_ERROR,
        });
      },
    });
    const handleDocumentChange = useCallback(
      ({ fileList }: { fileList: any }) => {
        setDocument(fileList[0]);
        form.setFieldsValue({ document: [fileList[0]?.response?.path] });
      },
      [form],
    );
    const beforeUpload = (file: any) => {
      const isLt30M = file.size / 1024 / 1024 < 30;
      if (!isLt30M) {
        myNotification({
          description: ERROR_MSG.PROJECT.UPLOAD_DOCUMENT_LIMIT,
        });
      }
      return false;
    };
    const submitUpload = async () => {
      if (enabledQuery) refetch().then();
      else setEnabledQuery(true);
    };
    const uploadDocument = async (uploadUrlInfo: IPreSignPostResponse) => {
      setLoading(true);
      try {
        await uploadDocumentMutateAsync({
          url: uploadUrlInfo.url,
          fields: uploadUrlInfo.fields,
          document: document,
        });
        await addProjectDocumentMutateAsync({
          slug,
          input: {
            document_name: form.getFieldValue('document_name'),
            document_type: form.getFieldValue('document_type'),
            document_path: uploadUrlInfo.fields.key,
          },
        }),
          myNotification({
            type: 'success',
            description: SUCCESS_MSG.PROJECT.ADD_DOCUMENT_SUCCESS,
          });
        setOpenDocumentUpload(false);
        refetchProjectDocuments();
      } catch (e) {
        myNotification({
          description: ERROR_MSG.PROJECT.UPLOAD_DOCUMENT_ERROR,
        });
      } finally {
        setLoading(false);
      }
    };
    useEffect(() => {
      if (uploadUrlInfo?.url && form.getFieldValue('document_name')) {
        uploadDocument(uploadUrlInfo).then();
      }
    }, [uploadUrlInfo]);
    return (
      <>
        <Form
          form={form}
          layout="vertical"
          style={{ width: '100%', marginTop: '30px' }}
          onFinish={() => submitUpload()}
        >
          <Row gutter={8}>
            <Col span={16}>
              <Form.Item
                label="Document Name"
                name="document_name"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <MyInput disabled={isLoading || loading} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Document Type"
                name="document_type"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <MyInput disabled={isLoading || loading} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="Document"
            name="document"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Upload
              listType="picture-card"
              fileList={document ? [document] : undefined}
              accept="application/pdf"
              onChange={handleDocumentChange}
              beforeUpload={beforeUpload}
              className={'project-document-upload'}
              disabled={isLoading || loading}
              onDrop={() => setEnabledQuery(false)}
            >
              {!document && (
                <div>
                  <PlusOutlined /> Upload document
                </div>
              )}
            </Upload>
          </Form.Item>
          <Flex justify={'center'}>
            <SubmitButton
              htmlType="submit"
              disabled={loading || !document || isLoading}
              loading={isLoading || loading}
              style={{ marginRight: '5px' }}
            >
              Submit
            </SubmitButton>
            <CancelButton
              disabled={loading || isLoading}
              style={{ marginLeft: '5px' }}
            >
              Cancel
            </CancelButton>
          </Flex>
        </Form>
      </>
    );
  },
);
export default UploadModal;

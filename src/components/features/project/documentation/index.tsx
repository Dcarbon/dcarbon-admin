import { memo, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Flex, Modal } from 'antd';
import { createStyles } from 'antd-style';
import SubmitButton from '@components/common/button/submit-button.tsx';
import MyTable from '@components/common/table/my-table.tsx';
import ProjectDocumentationColumn from '@components/features/project/documentation/column.tsx';
import UploadModal from '@components/features/project/documentation/upload-modal.tsx';

import './project-documentation.css';

import { ERROR_MSG, SUCCESS_MSG } from '@/constants';
import {
  getProjectDocuments,
  removeProjectDocument,
} from '@adapters/project.ts';
import { useMutation, useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@utils/constants';
import useModalAction from '@utils/helpers/back-action.tsx';
import useNotification from '@utils/helpers/my-notification.tsx';

const useStyle = createStyles(() => ({
  'my-modal-mask': {
    boxShadow: `inset 0 0 15px #fff`,
  },
  'my-modal-content': {
    border: '1px solid #333',
  },
}));

const ProjectDocumentation = memo(
  ({ projectSlug }: { projectSlug: string }) => {
    const [openDocumentUpload, setOpenDocumentUpload] = useState(false);
    const [loadingId, setLoadingId] = useState('-1');
    const [myNotification] = useNotification();
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
    const {
      data: projectDocuments,
      isLoading,
      refetch,
    } = useQuery({
      queryKey: [QUERY_KEYS.PROJECT.DOCUMENTS, projectSlug],
      queryFn: () => getProjectDocuments(projectSlug),
      staleTime: 0,
    });
    const { mutateAsync: removeProjectDocumentMutateAsync } = useMutation({
      mutationFn: removeProjectDocument,
      onSuccess: () => {
        myNotification({
          type: 'success',
          description: SUCCESS_MSG.PROJECT.REMOVE_DOCUMENT_SUCCESS,
        });
        refetch().then();
      },
      onError: () => {
        myNotification({
          description: ERROR_MSG.PROJECT.REMOVE_PROJECT_DOCUMENT_ERROR,
        });
      },
    });
    const cancelAction = useModalAction({
      danger: true,
    });
    const removeDocumentSubmit = async (id: string) => {
      setLoadingId(id);
      await cancelAction({
        okFn: async () => {
          try {
            await removeProjectDocumentMutateAsync({
              slug: projectSlug,
              id,
            });
          } finally {
            setLoadingId('-1');
          }
        },
        cancelFn: () => {
          setLoadingId('-1');
        },
        content: `Are you sure you want to remove this document?`,
      });
    };
    const columns = ProjectDocumentationColumn({
      removeDocument: removeDocumentSubmit,
      loadingId,
    });
    return (
      <>
        <Flex justify="end" className="project-action-bar">
          <SubmitButton
            disabled={isLoading}
            icon={<PlusOutlined />}
            onClick={() => setOpenDocumentUpload(true)}
          >
            Document
          </SubmitButton>
        </Flex>
        <Modal
          open={openDocumentUpload}
          title={'Document Upload'}
          centered
          destroyOnClose
          maskClosable={false}
          onCancel={() => setOpenDocumentUpload(false)}
          onOk={() => setOpenDocumentUpload(false)}
          onClose={() => setOpenDocumentUpload(false)}
          footer={null}
          classNames={classNames}
          styles={modalStyles}
        >
          <UploadModal
            slug={projectSlug}
            refetchProjectDocuments={refetch}
            setOpenDocumentUpload={(status: boolean) =>
              setOpenDocumentUpload(status)
            }
          />
        </Modal>
        <MyTable
          columns={columns}
          rowKey={'document_id'}
          key={'document_id'}
          dataSource={projectDocuments || []}
          scroll={{ y: '55vh' }}
          loading={isLoading}
          pagination={false}
        />
      </>
    );
  },
);
export default ProjectDocumentation;

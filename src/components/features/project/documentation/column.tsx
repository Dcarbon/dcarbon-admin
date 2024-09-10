import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Space, TableColumnsType } from 'antd';
import { DeviceDataType } from '@/types/device';
import { IProjectDocumentResponse } from '@/types/projects';

interface IProps {
  removeDocument: (id: string) => void;
  loadingId?: string;
}

const ProjectDocumentationColumn = ({ removeDocument, loadingId }: IProps) => {
  const columns: TableColumnsType<DeviceDataType> = [
    {
      title: 'Document Name',
      dataIndex: 'document_name',
      key: 'document_name',
      render: (name: string) => (
        <span style={{ fontWeight: '500' }}>{name}</span>
      ),
    },
    {
      title: 'Document Type',
      dataIndex: 'document_type',
      key: 'document_type',
    },
    {
      title: 'Upload Time',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (uploadTime: string) => (
        <span>{new Date(uploadTime).toLocaleString()}</span>
      ),
    },
    {
      title: 'Action',
      width: 150,
      align: 'center',
      render: (document: IProjectDocumentResponse) => {
        return (
          <Space size={'middle'}>
            <Button
              icon={<EyeOutlined />}
              size={'middle'}
              disabled={loadingId === document.document_id}
              href={document.document_path}
              target={'_blank'}
            />
            <Button
              type={'primary'}
              danger
              className={'danger-btn'}
              icon={<DeleteOutlined />}
              loading={loadingId === document.document_id}
              disabled={
                loadingId !== '-1' && loadingId !== document.document_id
              }
              size={'middle'}
              onClick={() => removeDocument(document.document_id)}
            />
          </Space>
        );
      },
    },
  ];
  return columns;
};

export default ProjectDocumentationColumn;

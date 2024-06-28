import { UploadOutlined } from '@ant-design/icons';
import { Space, Upload } from 'antd';

const UploadMultiImage = () => {
  return (
    <Space direction="vertical" size="large">
      <Upload
        action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
        listType="picture-card"
        maxCount={5}
        children={
          <div>
            <UploadOutlined />
            Upload
          </div>
        }
      />
    </Space>
  );
};

export default UploadMultiImage;

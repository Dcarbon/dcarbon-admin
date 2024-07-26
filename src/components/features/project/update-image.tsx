import { useCallback, useEffect, useState } from 'react';
import { updateProject, uploadMultipleProjectImage } from '@/adapters/project';
import CancelButtonAction from '@/components/common/button/button-cancel';
import SubmitButtonAction from '@/components/common/button/button-submit';
import { ERROR_MSG } from '@/constants';
import { QUERY_KEYS } from '@/utils/constants';
import { PlusOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { Flex, Form, message, Upload } from 'antd';
import useNotification from '@utils/helpers/my-notification.tsx';

type Props = {
  image: string[];
  type: 'thumbnail' | 'list';
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
};
const UpdateImage = ({ image, type, setIsEdit }: Props) => {
  const [form] = Form.useForm();
  const [images, setImages] = useState<any[]>([]);
  const param = useParams({
    from: '/_auth/project/$slug',
  });
  const [myNotification] = useNotification();
  const queryClient = useQueryClient();
  const handleImagesChange = useCallback(({ fileList }: any) => {
    setImages(fileList);
  }, []);
  useEffect(() => {
    if (image) {
      const list = image.map((item: string) => ({
        url: item,
      }));
      setImages(list);
      form.setFieldValue(type, image);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const beforeUpload = (file: any) => {
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      myNotification({
        description: ERROR_MSG.PROJECT.UPLOAD_IMAGE_LIMIT,
      });
    }
    return false;
  };
  const handleUpdate = useMutation({
    mutationFn: updateProject,
    onSuccess: () => {
      message.success('Update project success');
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_PROJECT_BY_SLUG, param.slug],
      });
    },
    onError: (error: any) => {
      message.error(error.message);
    },
  });
  const handleSave = useMutation({
    mutationFn: uploadMultipleProjectImage,
    onSuccess: (data) => {
      myNotification({
        type: 'success',
        description: 'Update image success',
      });
      const list =
        data?.data?.result
          .find((item: any) => item.field === 'files')
          ?.result.map((item) => item.relative_path) || [];
      setIsEdit(false);
      handleUpdate.mutateAsync({
        id: param.slug,
        [type == 'list' ? 'images' : type]: [
          ...images
            .filter((item) => !item.originFileObj)
            .map((e: any) => e.url),
          ...list,
        ],
      });
    },
    onError: (error: any) => {
      myNotification({
        message: ERROR_MSG.PROJECT.CREATE_ERROR,
        description: error.message || 'Something went wrong',
      });
    },
  });
  return (
    <Form
      form={form}
      initialValues={{
        [type]: image,
      }}
      onFinish={() => {
        return handleSave.mutateAsync({
          image: images.filter((item) => item.originFileObj),
          type,
        });
      }}
    >
      <Form.Item
        name={type}
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
          maxCount={type === 'thumbnail' ? 1 : 5}
          fileList={images}
          onChange={handleImagesChange}
          beforeUpload={beforeUpload}
        >
          {images.length < (type === 'list' ? 5 : 1) && (
            <div>
              <PlusOutlined /> Upload
            </div>
          )}
        </Upload>
        <Flex>
          <SubmitButtonAction>Save</SubmitButtonAction>
          <CancelButtonAction onClick={() => setIsEdit(false)}>
            Cancel
          </CancelButtonAction>
        </Flex>
      </Form.Item>
    </Form>
  );
};

export default UpdateImage;

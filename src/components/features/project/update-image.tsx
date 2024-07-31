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
        message: ERROR_MSG.PROJECT.UPDATE_ERROR,
        description: error.message || 'Something went wrong',
      });
    },
  });
  const handleRemove = (file: any) => {
    if ((file.originFileObj && type === 'list') || type === 'thumbnail') {
      return true;
    }
    return false;
  };
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
          itemRender={(originNode, file) => {
            if (file.url && type === 'list') {
              return (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%',
                  }}
                >
                  <img
                    src={file.url}
                    alt={file.name}
                    style={{ maxWidth: '80px', aspectRatio: '16/9' }}
                  />
                  <span>{file.name}</span>
                </div>
              );
            }
            return originNode;
          }}
          maxCount={type === 'thumbnail' ? 1 : undefined}
          fileList={images}
          onChange={handleImagesChange}
          beforeUpload={beforeUpload}
          onRemove={handleRemove}
        >
          {images.length < (type === 'thumbnail' ? 1 : 99999) && (
            <div>
              <PlusOutlined /> Upload
            </div>
          )}
        </Upload>
        <Flex gap={10} className="m-vertical-8">
          <SubmitButtonAction loading={handleSave.isPending}>
            Save
          </SubmitButtonAction>
          <CancelButtonAction
            disabled={handleSave.isPending}
            onClick={() => setIsEdit(false)}
          >
            Cancel
          </CancelButtonAction>
        </Flex>
      </Form.Item>
    </Form>
  );
};

export default UpdateImage;

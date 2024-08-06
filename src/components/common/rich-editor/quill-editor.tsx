import React, { memo, useCallback, useEffect, useState } from 'react';
import { request } from '@/adapters/xhr';
import { API_ROUTES, REQ_METHODS } from '@/utils/constants';
import Quill from 'quill';
import ImageUploader from 'quill-image-uploader';
import ReactQuill from 'react-quill';

import 'react-quill/dist/quill.snow.css';
import 'quill-image-uploader/dist/quill.imageUploader.min.css';

import { message, notification } from 'antd';

declare global {
  interface Window {
    Quill: any;
  }
}

interface QuillEditorProps {
  value?: string;
  style?: React.CSSProperties;
  onChange?: (value: string) => void;
}
Quill.register('modules/imageUploader', ImageUploader);

interface IUpload {
  id: string;
  result: {
    field: string;
    result: {
      path: string;
      relative_path: string;
    }[];
  }[];
}

const QuillEditor = ({ value, onChange, style }: QuillEditorProps) => {
  const [editorHtml, setEditorHtml] = useState('');
  if (typeof window !== 'undefined') {
    window.Quill = Quill;
  }
  const handleChange = useCallback((html: string) => {
    setEditorHtml(html);
    if (onChange) {
      onChange(html);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (value) {
      setEditorHtml(value);
    }
  }, [value]);
  return (
    <ReactQuill
      value={editorHtml}
      theme="snow"
      onChange={handleChange}
      modules={QuillEditor.modules}
      formats={QuillEditor.formats}
      placeholder="Write something..."
      style={{
        maxHeight: '100%',
        maxWidth: '100%',
        overflow: 'auto',
        scrollbarWidth: 'thin',
        ...style,
      }}
    />
  );
};

QuillEditor.modules = {
  toolbar: [
    [{ font: [] }],
    [{ color: [] }, { background: [] }],
    [{ size: ['small', false, 'large', 'huge'] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    [{ align: [] }],
    ['link', 'image'],
    ['clean'],
  ],
  imageUploader: {
    upload: async (file: File) => {
      if (file.size / 1024 / 1024 > 1) {
        notification.error({
          message: 'Upload failed',
          description: 'File size must be less than 1MB',
        });
        return;
      }
      message.loading('Uploading image...', 0);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'project');
      const res = await request<GeneralResponse<IUpload>>(
        REQ_METHODS.PATCH,
        API_ROUTES.SINGER_UPLOAD,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      if (res.data.data.result[0].result[0]) {
        message.destroy();
        message.success('Upload success');
        return res.data.data.result[0].result[0].path;
      }
      throw new Error('Upload failed');
    },
  },
  history: {
    delay: 2000,
    maxStack: 500,
    userOnly: true,
  },
  clipboard: {
    matchVisual: false,
  },
};

QuillEditor.formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video',
  'align',
  'color',
  'background',
  'font',
];

const TextEditor = memo(QuillEditor);
export default TextEditor;

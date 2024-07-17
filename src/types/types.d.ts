interface GeneralResponse<T = any> {
  data: T;
}

type TUploadCategory = 'project' | 'metadata';
type TUploadType = 'thumbnail' | 'list' | 'icon';

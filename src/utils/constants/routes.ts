const API_ROUTES = {
  SIGN_IN: 'auth/sign-in',
  GET_USER: 'auth/user-info',
  PO_API: 'po',
  PROJECT_API: 'projects',
  PROJECT_MODEL: 'projects/iot-models',
  PROJECT_UPLOAD: 'projects/upload',
  SINGER_UPLOAD: 'common/upload',
  MUTIPLER_UPLOAD: 'common/upload-multiple',
  COMMON: {
    UPLOAD_METADATA: 'common/upload-metadata',
  },
  CONFIG: {
    TOKEN: 'config/token',
  },
  DEVICE: {
    ROOT: 'devices',
    TYPES: 'devices/types',
  },
  PO: {
    BAN: 'po/ban',
    SOFT_DELETE: 'po/soft-delete',
  },
  PROJECT: {
    ADD_DEVICES: 'projects/add-devices',
  },
};
export { API_ROUTES };

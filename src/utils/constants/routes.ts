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
    GET_METADATA_OF_MINT: 'common/mint-metadata',
  },
  CONFIG: {
    TOKEN: 'config/token',
    SPL_TOKEN: 'config/spl-token',
  },
  DEVICE: {
    ROOT: 'devices',
    TYPES: 'devices/types',
    CONTRACT_SETTINGS: 'devices/contract-settings',
  },
  MANAGER: {
    CARBON_LIST: 'managers/carbon-list',
  },
  PO: {
    BAN: 'po/ban',
    SOFT_DELETE: 'po/soft-delete',
  },
  PROJECT: {
    ADD_DEVICES: 'projects/add-devices',
    CARBON_FOR_LISTING: 'carbons-for-listing',
    MODIFY_STATUS: 'projects/modify-status',
    LISTING_INFO: 'projects/{projectId}/listing-info',
    DOCUMENT_UPLOAD_URL: 'projects/{projectId}/document-upload-url',
    ADD_DOCUMENT: 'projects/{projectId}/add-document',
    REMOVE_DOCUMENT: 'projects/{projectId}/remove-document',
    DOCUMENTS: 'projects/{projectId}/documents',
  },
  MINT: {
    ROOT: 'minting',
  },
};
export { API_ROUTES };

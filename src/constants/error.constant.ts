const ERROR_CONTRACT = {
  COMMON: {
    CONNECT_ERROR: {
      message: 'Connect wallet error',
      description: 'Please connect to wallet first!',
    },
    ON_CHAIN_FETCH_ERROR: {
      message: 'On chain fetch error',
      description: 'Something went wrong',
    },
    WALLET_INVALID: {
      message: 'Input invalid',
      description: 'Invalid wallet address',
    },
    TX_ERROR: {
      message: 'Transaction failed',
      description: 'Something went wrong',
    },
  },
  CONTRACT: {
    ROLE: {
      ADMIN_EXISTS: {
        message: 'Input invalid',
        description: 'Admin already exists existing',
      },
      MASTER_IS_CURRENT: {
        message: 'Input invalid',
        description: 'This wallet is already in use',
      },
    },
  },
};
export { ERROR_CONTRACT };

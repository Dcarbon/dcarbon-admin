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
    CONFIG: {
      FEE_EMPTY: {
        message: 'Input invalid',
        description: 'Mint Fee can not be empty',
      },
      RATE_EMPTY: {
        message: 'Input invalid',
        description: 'Rate can not be empty',
      },
      WALLET_EMPTY: {
        message: 'Input invalid',
        description: 'Collect Fee Wallet can not be empty',
      },
      LIMIT_EMPTY: {
        message: 'Input invalid',
        description: 'Device limit can not be empty',
      },
      FEE_EXIST: {
        message: 'Input invalid',
        description: 'Mint Fee equals current value',
      },
      RATE_EXIST: {
        message: 'Input invalid',
        description: 'Rate equals current value',
      },
      WALLET_EXIST: {
        message: 'Input invalid',
        description: 'Collect Fee Wallet equals current value',
      },
    },
  },
};
export { ERROR_CONTRACT };

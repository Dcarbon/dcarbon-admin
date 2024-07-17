export const CARBON_IDL = {
  address: import.meta.env.VITE_CARBON_PROGRAM_ID,
  metadata: {
    name: 'dcarbon_contract',
    version: '0.1.0',
    spec: '0.1.0',
    description: 'Created with Anchor',
  },
  instructions: [
    {
      name: 'add_admin',
      discriminator: [177, 236, 33, 205, 124, 152, 55, 186],
      accounts: [
        {
          name: 'signer',
          writable: true,
          signer: true,
        },
        {
          name: 'master_pda',
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [109, 97, 115, 116, 101, 114],
              },
            ],
          },
        },
        {
          name: 'system_program',
          address: '11111111111111111111111111111111',
        },
      ],
      args: [
        {
          name: 'address',
          type: 'pubkey',
        },
      ],
    },
    {
      name: 'create_ft',
      discriminator: [56, 245, 99, 230, 162, 6, 220, 85],
      accounts: [
        {
          name: 'signer',
          writable: true,
          signer: true,
        },
        {
          name: 'master_pda',
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [109, 97, 115, 116, 101, 114],
              },
            ],
          },
        },
        {
          name: 'authority',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [97, 117, 116, 104, 111, 114, 105, 116, 121],
              },
            ],
          },
        },
        {
          name: 'mint',
          writable: true,
          signer: true,
        },
        {
          name: 'metadata',
          writable: true,
        },
        {
          name: 'token_program',
        },
        {
          name: 'system_program',
          address: '11111111111111111111111111111111',
        },
        {
          name: 'sysvar_program',
        },
        {
          name: 'token_metadata_program',
        },
      ],
      args: [
        {
          name: 'create_ft_args',
          type: {
            defined: {
              name: 'CreateFtArgs',
            },
          },
        },
      ],
    },
    {
      name: 'delete_admin',
      discriminator: [185, 158, 127, 54, 59, 60, 205, 164],
      accounts: [
        {
          name: 'signer',
          writable: true,
          signer: true,
        },
        {
          name: 'master_pda',
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [109, 97, 115, 116, 101, 114],
              },
            ],
          },
        },
        {
          name: 'admin_pda',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [97, 100, 109, 105, 110],
              },
              {
                kind: 'arg',
                path: '_address',
              },
            ],
          },
        },
      ],
      args: [
        {
          name: 'address',
          type: 'pubkey',
        },
      ],
    },
    {
      name: 'init_config',
      discriminator: [23, 235, 115, 232, 168, 96, 1, 231],
      accounts: [
        {
          name: 'signer',
          writable: true,
          signer: true,
        },
        {
          name: 'master_pda',
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [109, 97, 115, 116, 101, 114],
              },
            ],
          },
        },
        {
          name: 'mint',
        },
        {
          name: 'system_program',
          address: '11111111111111111111111111111111',
        },
      ],
      args: [
        {
          name: 'config_args',
          type: {
            defined: {
              name: 'ConfigArgs',
            },
          },
        },
      ],
    },
    {
      name: 'init_master',
      discriminator: [168, 49, 22, 248, 228, 56, 111, 24],
      accounts: [
        {
          name: 'signer',
          writable: true,
          signer: true,
        },
        {
          name: 'system_program',
          address: '11111111111111111111111111111111',
        },
        {
          name: 'program',
          address: import.meta.env.VITE_CARBON_PROGRAM_ID,
        },
        {
          name: 'program_data',
        },
      ],
      args: [
        {
          name: 'address',
          type: 'pubkey',
        },
      ],
    },
    {
      name: 'mint_token',
      discriminator: [172, 137, 183, 14, 207, 110, 234, 56],
      accounts: [
        {
          name: 'signer',
          writable: true,
          signer: true,
        },
        {
          name: 'receiver',
        },
        {
          name: 'to_ata',
          writable: true,
        },
        {
          name: 'device',
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [100, 101, 118, 105, 99, 101],
              },
              {
                kind: 'arg',
                path: 'mint_token_args.project_id',
              },
              {
                kind: 'arg',
                path: 'mint_token_args.device_id',
              },
            ],
          },
        },
        {
          name: 'authority',
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [97, 117, 116, 104, 111, 114, 105, 116, 121],
              },
            ],
          },
        },
        {
          name: 'mint',
          writable: true,
        },
        {
          name: 'metadata',
        },
        {
          name: 'token_program',
        },
        {
          name: 'system_program',
          address: '11111111111111111111111111111111',
        },
        {
          name: 'sysvar_program',
        },
        {
          name: 'token_metadata_program',
        },
        {
          name: 'ata_program',
        },
      ],
      args: [
        {
          name: 'mint_token_args',
          type: {
            defined: {
              name: 'MintTokenArgs',
            },
          },
        },
      ],
    },
    {
      name: 'register_device',
      discriminator: [210, 151, 56, 68, 22, 158, 90, 193],
      accounts: [
        {
          name: 'signer',
          writable: true,
          signer: true,
        },
        {
          name: 'admin_pda',
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [97, 100, 109, 105, 110],
              },
              {
                kind: 'account',
                path: 'signer',
              },
            ],
          },
        },
        {
          name: 'device',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [100, 101, 118, 105, 99, 101],
              },
              {
                kind: 'arg',
                path: 'register_device_args.project_id',
              },
              {
                kind: 'arg',
                path: 'register_device_args.device_id',
              },
            ],
          },
        },
        {
          name: 'device_status',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  100, 101, 118, 105, 99, 101, 95, 115, 116, 97, 116, 117, 115,
                ],
              },
              {
                kind: 'account',
                path: 'device',
              },
            ],
          },
        },
        {
          name: 'authority',
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [97, 117, 116, 104, 111, 114, 105, 116, 121],
              },
            ],
          },
        },
        {
          name: 'mint',
          writable: true,
          signer: true,
        },
        {
          name: 'metadata',
          writable: true,
        },
        {
          name: 'token_program',
        },
        {
          name: 'system_program',
          address: '11111111111111111111111111111111',
        },
        {
          name: 'sysvar_program',
        },
        {
          name: 'token_metadata_program',
        },
      ],
      args: [
        {
          name: 'register_device_args',
          type: {
            defined: {
              name: 'RegisterDeviceArgs',
            },
          },
        },
        {
          name: 'metadata_vec',
          type: 'bytes',
        },
      ],
    },
    {
      name: 'set_active',
      discriminator: [29, 16, 225, 132, 38, 216, 206, 33],
      accounts: [
        {
          name: 'signer',
          writable: true,
          signer: true,
        },
        {
          name: 'admin_pda',
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [97, 100, 109, 105, 110],
              },
              {
                kind: 'account',
                path: 'signer',
              },
            ],
          },
        },
        {
          name: 'device',
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [100, 101, 118, 105, 99, 101],
              },
              {
                kind: 'arg',
                path: '_project_id',
              },
              {
                kind: 'arg',
                path: '_device_id',
              },
            ],
          },
        },
        {
          name: 'device_status',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  100, 101, 118, 105, 99, 101, 95, 115, 116, 97, 116, 117, 115,
                ],
              },
              {
                kind: 'account',
                path: 'device',
              },
            ],
          },
        },
      ],
      args: [
        {
          name: 'project_id',
          type: 'string',
        },
        {
          name: 'device_id',
          type: 'string',
        },
      ],
    },
    {
      name: 'set_minting_fee',
      discriminator: [70, 169, 74, 105, 172, 139, 150, 140],
      accounts: [
        {
          name: 'signer',
          writable: true,
          signer: true,
        },
        {
          name: 'master_pda',
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [109, 97, 115, 116, 101, 114],
              },
            ],
          },
        },
        {
          name: 'contract_config',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  99, 111, 110, 116, 114, 97, 99, 116, 95, 99, 111, 110, 102,
                  105, 103,
                ],
              },
            ],
          },
        },
        {
          name: 'system_program',
          address: '11111111111111111111111111111111',
        },
      ],
      args: [
        {
          name: 'minting_fee',
          type: 'u64',
        },
      ],
    },
    {
      name: 'set_minting_limit',
      discriminator: [176, 22, 114, 19, 165, 220, 246, 52],
      accounts: [
        {
          name: 'signer',
          writable: true,
          signer: true,
        },
        {
          name: 'master_pda',
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [109, 97, 115, 116, 101, 114],
              },
            ],
          },
        },
        {
          name: 'contract_config',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  99, 111, 110, 116, 114, 97, 99, 116, 95, 99, 111, 110, 102,
                  105, 103,
                ],
              },
            ],
          },
        },
        {
          name: 'system_program',
          address: '11111111111111111111111111111111',
        },
      ],
      args: [
        {
          name: 'device_type',
          type: 'u16',
        },
        {
          name: 'limit',
          type: 'u16',
        },
      ],
    },
    {
      name: 'transfer_master_rights',
      discriminator: [230, 240, 167, 33, 38, 45, 180, 155],
      accounts: [
        {
          name: 'signer',
          writable: true,
          signer: true,
        },
        {
          name: 'master_pda',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [109, 97, 115, 116, 101, 114],
              },
            ],
          },
        },
      ],
      args: [
        {
          name: 'new_master_address',
          type: 'pubkey',
        },
      ],
    },
  ],
  accounts: [
    {
      name: 'Admin',
      discriminator: [244, 158, 220, 65, 8, 73, 4, 65],
    },
    {
      name: 'ContractConfig',
      discriminator: [134, 229, 224, 68, 136, 40, 85, 234],
    },
    {
      name: 'Device',
      discriminator: [153, 248, 23, 39, 83, 45, 68, 128],
    },
    {
      name: 'DeviceStatus',
      discriminator: [13, 226, 26, 137, 144, 41, 230, 121],
    },
    {
      name: 'Master',
      discriminator: [168, 213, 193, 12, 77, 162, 58, 235],
    },
  ],
  errors: [
    {
      code: 6000,
      name: 'PublicKeyMismatch',
      msg: 'PublicKey Mismatch',
    },
    {
      code: 6001,
      name: 'InvalidProjectIdLength',
      msg: 'The length of the device Id must be equal to 24',
    },
    {
      code: 6002,
      name: 'MasterIsAlreadyInit',
      msg: 'Master account is already init',
    },
    {
      code: 6003,
      name: 'AdminIsAlreadyInit',
      msg: 'Admin account is already init',
    },
    {
      code: 6004,
      name: 'ContractConfigIsAlreadyInit',
      msg: 'Contract config account is already init',
    },
  ],
  types: [
    {
      name: 'Admin',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'admin_key',
            type: 'pubkey',
          },
        ],
      },
    },
    {
      name: 'ConfigArgs',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'minting_fee',
            type: 'u64',
          },
          {
            name: 'rate',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'ContractConfig',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'rate',
            type: 'u64',
          },
          {
            name: 'minting_fee',
            type: 'u64',
          },
          {
            name: 'mint',
            type: 'pubkey',
          },
          {
            name: 'minting_limits',
            type: {
              vec: {
                defined: {
                  name: 'DeviceLimit',
                },
              },
            },
          },
        ],
      },
    },
    {
      name: 'CreateFtArgs',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'total_supply',
            type: {
              option: 'u64',
            },
          },
          {
            name: 'disable_mint',
            type: 'bool',
          },
          {
            name: 'disable_freeze',
            type: 'bool',
          },
          {
            name: 'data_vec',
            type: 'bytes',
          },
        ],
      },
    },
    {
      name: 'Device',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'id',
            type: 'string',
          },
          {
            name: 'device_type',
            type: 'u16',
          },
          {
            name: 'mint',
            type: 'pubkey',
          },
          {
            name: 'project_id',
            type: 'string',
          },
        ],
      },
    },
    {
      name: 'DeviceLimit',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'device_type',
            type: 'u16',
          },
          {
            name: 'limit',
            type: 'u16',
          },
        ],
      },
    },
    {
      name: 'DeviceStatus',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'device_key',
            type: 'pubkey',
          },
          {
            name: 'is_active',
            type: 'bool',
          },
          {
            name: 'last_mint_time',
            type: 'i64',
          },
          {
            name: 'nonce',
            type: 'u16',
          },
        ],
      },
    },
    {
      name: 'Master',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'master_key',
            type: 'pubkey',
          },
        ],
      },
    },
    {
      name: 'MintTokenArgs',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'project_id',
            type: 'string',
          },
          {
            name: 'device_id',
            type: 'string',
          },
          {
            name: 'mint_data_vec',
            type: 'bytes',
          },
        ],
      },
    },
    {
      name: 'RegisterDeviceArgs',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'project_id',
            type: 'string',
          },
          {
            name: 'device_id',
            type: 'string',
          },
          {
            name: 'device_type',
            type: 'u16',
          },
        ],
      },
    },
  ],
};

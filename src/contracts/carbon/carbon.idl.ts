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
      name: 'burn_sft',
      discriminator: [102, 130, 58, 158, 77, 125, 18, 64],
      accounts: [
        {
          name: 'signer',
          writable: true,
          signer: true,
        },
        {
          name: 'mint_sft',
          writable: true,
        },
        {
          name: 'burn_ata',
          writable: true,
        },
        {
          name: 'metadata_sft',
          writable: true,
        },
        {
          name: 'burning_record',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  98, 117, 114, 110, 105, 110, 103, 95, 114, 101, 99, 111, 114,
                  100,
                ],
              },
              {
                kind: 'account',
                path: 'signer',
              },
              {
                kind: 'account',
                path: 'mint_sft',
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
          name: 'amount',
          type: 'f64',
        },
      ],
    },
    {
      name: 'buy',
      discriminator: [102, 6, 61, 18, 1, 218, 235, 234],
      accounts: [
        {
          name: 'signer',
          signer: true,
        },
        {
          name: 'mint',
        },
        {
          name: 'source_ata',
          writable: true,
        },
        {
          name: 'to_ata',
          writable: true,
        },
        {
          name: 'token_listing_info',
          writable: true,
        },
        {
          name: 'token_owner',
          writable: true,
        },
        {
          name: 'marketplace_delegate',
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [109, 97, 114, 107, 101, 116, 112, 108, 97, 99, 101],
              },
              {
                kind: 'const',
                value: [100, 101, 108, 101, 103, 97, 116, 101],
              },
            ],
          },
        },
        {
          name: 'token_program',
        },
        {
          name: 'system_program',
          address: '11111111111111111111111111111111',
        },
      ],
      args: [
        {
          name: 'amount',
          type: 'f64',
        },
      ],
    },
    {
      name: 'cancel_listing',
      discriminator: [41, 183, 50, 232, 230, 233, 157, 70],
      accounts: [
        {
          name: 'signer',
          writable: true,
          signer: true,
        },
        {
          name: 'mint',
        },
        {
          name: 'token_listing_info',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [109, 97, 114, 107, 101, 116, 112, 108, 97, 99, 101],
              },
              {
                kind: 'account',
                path: 'mint',
              },
              {
                kind: 'account',
                path: 'signer',
              },
              {
                kind: 'arg',
                path: '_nonce',
              },
            ],
          },
        },
      ],
      args: [
        {
          name: 'nonce',
          type: 'u32',
        },
      ],
    },
    {
      name: 'create_collection',
      discriminator: [156, 251, 92, 54, 233, 2, 16, 82],
      accounts: [
        {
          name: 'creator',
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
                path: 'creator',
              },
            ],
          },
        },
        {
          name: 'metadata',
          writable: true,
        },
        {
          name: 'mint',
          writable: true,
          signer: true,
        },
        {
          name: 'collection_token_account',
          writable: true,
        },
        {
          name: 'master_edition',
          writable: true,
        },
        {
          name: 'system_program',
          address: '11111111111111111111111111111111',
        },
        {
          name: 'update_authority',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [
                  117, 112, 100, 97, 116, 101, 95, 97, 117, 116, 104, 111, 114,
                  105, 116, 121,
                ],
              },
            ],
          },
        },
        {
          name: 'token_metadata_program',
        },
        {
          name: 'token_program',
        },
        {
          name: 'associated_token_program',
        },
      ],
      args: [
        {
          name: 'data',
          type: 'bytes',
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
          name: 'governance',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [103, 111, 118, 101, 114, 110, 97, 110, 99, 101],
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
      name: 'listing',
      discriminator: [126, 47, 161, 107, 23, 112, 254, 126],
      accounts: [
        {
          name: 'signer',
          writable: true,
          signer: true,
        },
        {
          name: 'mint',
        },
        {
          name: 'source_ata',
          writable: true,
        },
        {
          name: 'marketplace_delegate',
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [109, 97, 114, 107, 101, 116, 112, 108, 97, 99, 101],
              },
              {
                kind: 'const',
                value: [100, 101, 108, 101, 103, 97, 116, 101],
              },
            ],
          },
        },
        {
          name: 'token_program',
        },
        {
          name: 'system_program',
          address: '11111111111111111111111111111111',
        },
      ],
      args: [
        {
          name: 'listing_args',
          type: {
            defined: {
              name: 'ListingArgs',
            },
          },
        },
      ],
    },
    {
      name: 'mint_nft',
      discriminator: [211, 57, 6, 167, 15, 219, 35, 251],
      accounts: [
        {
          name: 'signer',
          writable: true,
          signer: true,
        },
      ],
      args: [],
    },
    {
      name: 'mint_sft',
      discriminator: [225, 138, 215, 72, 133, 196, 238, 223],
      accounts: [
        {
          name: 'signer',
          writable: true,
          signer: true,
        },
        {
          name: 'device_owner',
        },
        {
          name: 'owner_governance',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [103, 111, 118, 101, 114, 110, 97, 110, 99, 101],
              },
              {
                kind: 'account',
                path: 'device_owner',
              },
            ],
          },
        },
        {
          name: 'governance',
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [103, 111, 118, 101, 114, 110, 97, 110, 99, 101],
              },
            ],
          },
        },
        {
          name: 'contract_config',
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
          name: 'claim',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [99, 108, 97, 105, 109],
              },
              {
                kind: 'account',
                path: 'mint',
              },
            ],
          },
        },
        {
          name: 'owner_ata',
          writable: true,
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
                kind: 'arg',
                path: 'mint_sft_args.device_id',
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
          address: 'Sysvar1nstructions1111111111111111111111111',
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
          name: 'mint_sft_args',
          type: {
            defined: {
              name: 'MintSftArgs',
            },
          },
        },
        {
          name: 'verify_message_args',
          type: {
            defined: {
              name: 'VerifyMessageArgs',
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
                kind: 'arg',
                path: 'register_device_args.device_id',
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
          name: 'register_device_args',
          type: {
            defined: {
              name: 'RegisterDeviceArgs',
            },
          },
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
                kind: 'arg',
                path: '_device_id',
              },
            ],
          },
        },
      ],
      args: [
        {
          name: 'project_id',
          type: 'u16',
        },
        {
          name: 'device_id',
          type: 'u16',
        },
      ],
    },
    {
      name: 'set_coefficient',
      discriminator: [82, 162, 57, 29, 162, 186, 172, 156],
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
          name: 'coefficient',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [99, 111, 101, 102, 102, 105, 99, 105, 101, 110, 116],
              },
              {
                kind: 'arg',
                path: 'key',
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
          name: 'key',
          type: 'string',
        },
        {
          name: 'value',
          type: 'u64',
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
          type: 'f64',
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
          type: 'f64',
        },
      ],
    },
    {
      name: 'set_rate',
      discriminator: [99, 58, 170, 238, 160, 120, 74, 11],
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
          name: 'rate',
          type: 'f64',
        },
      ],
    },
    {
      name: 'swap_sft',
      discriminator: [49, 47, 165, 112, 80, 173, 202, 27],
      accounts: [
        {
          name: 'signer',
          writable: true,
          signer: true,
        },
        {
          name: 'burn_ata',
          writable: true,
        },
        {
          name: 'to_ata',
          writable: true,
        },
        {
          name: 'mint_sft',
          writable: true,
        },
        {
          name: 'mint_ft',
          writable: true,
        },
        {
          name: 'metadata_sft',
          writable: true,
        },
        {
          name: 'metadata_ft',
          writable: true,
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
          name: 'burn_data_vec',
          type: 'bytes',
        },
        {
          name: 'mint_data_vec',
          type: 'bytes',
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
      name: 'BurningRecord',
      discriminator: [156, 23, 40, 15, 223, 187, 233, 47],
    },
    {
      name: 'Claim',
      discriminator: [155, 70, 22, 176, 123, 215, 246, 102],
    },
    {
      name: 'Coefficient',
      discriminator: [2, 50, 46, 101, 246, 105, 23, 251],
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
      name: 'Governance',
      discriminator: [18, 143, 88, 13, 73, 217, 47, 49],
    },
    {
      name: 'Master',
      discriminator: [168, 213, 193, 12, 77, 162, 58, 235],
    },
    {
      name: 'TokenListingInfo',
      discriminator: [224, 170, 101, 201, 223, 183, 148, 105],
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
    {
      code: 6005,
      name: 'DeviceIsNotActive',
      msg: 'Must active this device to mint semi-fungible token',
    },
    {
      code: 6006,
      name: 'SigVerificationFailed',
    },
    {
      code: 6007,
      name: 'InitArgsInvalid',
      msg: 'Init config for contract is invalid',
    },
    {
      code: 6008,
      name: 'InvalidNonce',
      msg: '',
    },
    {
      code: 6009,
      name: 'NotMintTime',
    },
    {
      code: 6010,
      name: 'NotEnoughAmount',
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
      name: 'BurningRecord',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'total_amount',
            type: 'f64',
          },
        ],
      },
    },
    {
      name: 'Claim',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'is_claimed',
            type: 'bool',
          },
          {
            name: 'mint',
            type: 'pubkey',
          },
          {
            name: 'amount',
            type: 'f64',
          },
          {
            name: 'project_id',
            type: 'u16',
          },
        ],
      },
    },
    {
      name: 'Coefficient',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'key',
            type: 'string',
          },
          {
            name: 'value',
            type: 'u64',
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
            type: 'f64',
          },
          {
            name: 'rate',
            type: 'f64',
          },
          {
            name: 'governance_amount',
            type: 'f64',
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
            type: 'f64',
          },
          {
            name: 'minting_fee',
            type: 'f64',
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
          {
            name: 'governance_amount',
            type: 'f64',
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
            type: 'u16',
          },
          {
            name: 'device_type',
            type: 'u16',
          },
          {
            name: 'project_id',
            type: 'u16',
          },
          {
            name: 'owner',
            type: 'pubkey',
          },
          {
            name: 'minter',
            type: 'pubkey',
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
            type: 'f64',
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
      name: 'Governance',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'owner',
            type: 'pubkey',
          },
          {
            name: 'amount',
            type: 'f64',
          },
        ],
      },
    },
    {
      name: 'ListingArgs',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'delegate_amount',
            type: 'f64',
          },
          {
            name: 'price',
            type: 'f64',
          },
          {
            name: 'project_id',
            type: 'u16',
          },
          {
            name: 'currency',
            type: {
              option: 'pubkey',
            },
          },
          {
            name: 'random_id',
            type: 'u16',
          },
          {
            name: 'amount',
            type: 'f64',
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
      name: 'MintSftArgs',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'project_id',
            type: 'u16',
          },
          {
            name: 'device_id',
            type: 'u16',
          },
          {
            name: 'nonce',
            type: 'u16',
          },
          {
            name: 'create_mint_data_vec',
            type: 'bytes',
          },
          {
            name: 'total_amount',
            type: 'f64',
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
            type: 'u16',
          },
          {
            name: 'device_id',
            type: 'u16',
          },
          {
            name: 'device_type',
            type: 'u16',
          },
          {
            name: 'owner',
            type: 'pubkey',
          },
          {
            name: 'minter',
            type: 'pubkey',
          },
        ],
      },
    },
    {
      name: 'TokenListingInfo',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'owner',
            type: 'pubkey',
          },
          {
            name: 'mint',
            type: 'pubkey',
          },
          {
            name: 'amount',
            type: 'f64',
          },
          {
            name: 'price',
            type: 'f64',
          },
          {
            name: 'project_id',
            type: 'u16',
          },
          {
            name: 'currency',
            type: {
              option: 'pubkey',
            },
          },
          {
            name: 'remaining',
            type: 'f64',
          },
        ],
      },
    },
    {
      name: 'VerifyMessageArgs',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'eth_address',
            type: {
              array: ['u8', 20],
            },
          },
          {
            name: 'msg',
            type: 'bytes',
          },
          {
            name: 'sig',
            type: {
              array: ['u8', 64],
            },
          },
          {
            name: 'recovery_id',
            type: 'u8',
          },
        ],
      },
    },
  ],
};

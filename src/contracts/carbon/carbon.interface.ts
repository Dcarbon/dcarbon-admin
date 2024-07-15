/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/dcarbon_contract.json`.
 */
export type ICarbonContract = {
  address: string;
  metadata: {
    name: 'dcarbonContract';
    version: '0.1.0';
    spec: '0.1.0';
    description: 'Created with Anchor';
  };
  instructions: [
    {
      name: 'addAdmin';
      discriminator: [177, 236, 33, 205, 124, 152, 55, 186];
      accounts: [
        {
          name: 'signer';
          writable: true;
          signer: true;
        },
        {
          name: 'masterPda';
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [109, 97, 115, 116, 101, 114];
              },
            ];
          };
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
      ];
      args: [
        {
          name: 'address';
          type: 'pubkey';
        },
      ];
    },
    {
      name: 'createMint';
      discriminator: [69, 44, 215, 132, 253, 214, 41, 45];
      accounts: [
        {
          name: 'creator';
          writable: true;
          signer: true;
        },
        {
          name: 'authority';
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [97, 117, 116, 104, 111, 114, 105, 116, 121];
              },
            ];
          };
        },
        {
          name: 'mint';
          writable: true;
          signer: true;
        },
        {
          name: 'metadata';
          writable: true;
        },
        {
          name: 'tokenProgram';
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
        {
          name: 'sysvarProgram';
        },
        {
          name: 'tokenMetadataProgram';
        },
      ];
      args: [
        {
          name: 'createDataVec';
          type: 'bytes';
        },
      ];
    },
    {
      name: 'deleteAdmin';
      discriminator: [185, 158, 127, 54, 59, 60, 205, 164];
      accounts: [
        {
          name: 'signer';
          writable: true;
          signer: true;
        },
        {
          name: 'masterPda';
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [109, 97, 115, 116, 101, 114];
              },
            ];
          };
        },
        {
          name: 'adminPda';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [97, 100, 109, 105, 110];
              },
              {
                kind: 'arg';
                path: 'address';
              },
            ];
          };
        },
      ];
      args: [
        {
          name: 'address';
          type: 'pubkey';
        },
      ];
    },
    {
      name: 'initConfig';
      discriminator: [23, 235, 115, 232, 168, 96, 1, 231];
      accounts: [
        {
          name: 'signer';
          writable: true;
          signer: true;
        },
        {
          name: 'masterPda';
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [109, 97, 115, 116, 101, 114];
              },
            ];
          };
        },
        {
          name: 'mint';
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
      ];
      args: [
        {
          name: 'configArgs';
          type: {
            defined: {
              name: 'configArgs';
            };
          };
        },
      ];
    },
    {
      name: 'initMaster';
      discriminator: [168, 49, 22, 248, 228, 56, 111, 24];
      accounts: [
        {
          name: 'signer';
          writable: true;
          signer: true;
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
        {
          name: 'program';
          address: string;
        },
        {
          name: 'programData';
        },
      ];
      args: [
        {
          name: 'address';
          type: 'pubkey';
        },
      ];
    },
    {
      name: 'registerDevice';
      discriminator: [210, 151, 56, 68, 22, 158, 90, 193];
      accounts: [
        {
          name: 'signer';
          writable: true;
          signer: true;
        },
        {
          name: 'adminPda';
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [97, 100, 109, 105, 110];
              },
              {
                kind: 'account';
                path: 'signer';
              },
            ];
          };
        },
        {
          name: 'device';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [100, 101, 118, 105, 99, 101];
              },
              {
                kind: 'arg';
                path: 'register_device_args.project_id';
              },
              {
                kind: 'arg';
                path: 'register_device_args.device_id';
              },
            ];
          };
        },
        {
          name: 'deviceStatus';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [
                  100,
                  101,
                  118,
                  105,
                  99,
                  101,
                  95,
                  115,
                  116,
                  97,
                  116,
                  117,
                  115,
                ];
              },
              {
                kind: 'account';
                path: 'device';
              },
            ];
          };
        },
        {
          name: 'authority';
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [97, 117, 116, 104, 111, 114, 105, 116, 121];
              },
            ];
          };
        },
        {
          name: 'mint';
          writable: true;
          signer: true;
        },
        {
          name: 'metadata';
          writable: true;
        },
        {
          name: 'tokenProgram';
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
        {
          name: 'sysvarProgram';
        },
        {
          name: 'tokenMetadataProgram';
        },
      ];
      args: [
        {
          name: 'registerDeviceArgs';
          type: {
            defined: {
              name: 'registerDeviceArgs';
            };
          };
        },
        {
          name: 'metadataVec';
          type: 'bytes';
        },
      ];
    },
    {
      name: 'setActive';
      discriminator: [29, 16, 225, 132, 38, 216, 206, 33];
      accounts: [
        {
          name: 'signer';
          writable: true;
          signer: true;
        },
        {
          name: 'adminPda';
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [97, 100, 109, 105, 110];
              },
              {
                kind: 'account';
                path: 'signer';
              },
            ];
          };
        },
        {
          name: 'device';
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [100, 101, 118, 105, 99, 101];
              },
              {
                kind: 'arg';
                path: 'projectId';
              },
              {
                kind: 'arg';
                path: 'deviceId';
              },
            ];
          };
        },
        {
          name: 'deviceStatus';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [
                  100,
                  101,
                  118,
                  105,
                  99,
                  101,
                  95,
                  115,
                  116,
                  97,
                  116,
                  117,
                  115,
                ];
              },
              {
                kind: 'account';
                path: 'device';
              },
            ];
          };
        },
      ];
      args: [
        {
          name: 'projectId';
          type: 'string';
        },
        {
          name: 'deviceId';
          type: 'string';
        },
      ];
    },
    {
      name: 'setMintingFee';
      discriminator: [70, 169, 74, 105, 172, 139, 150, 140];
      accounts: [
        {
          name: 'signer';
          writable: true;
          signer: true;
        },
        {
          name: 'masterPda';
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [109, 97, 115, 116, 101, 114];
              },
            ];
          };
        },
        {
          name: 'contractConfig';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [
                  99,
                  111,
                  110,
                  116,
                  114,
                  97,
                  99,
                  116,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103,
                ];
              },
            ];
          };
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
      ];
      args: [
        {
          name: 'mintingFee';
          type: 'u64';
        },
      ];
    },
    {
      name: 'setMintingLimit';
      discriminator: [176, 22, 114, 19, 165, 220, 246, 52];
      accounts: [
        {
          name: 'signer';
          writable: true;
          signer: true;
        },
        {
          name: 'masterPda';
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [109, 97, 115, 116, 101, 114];
              },
            ];
          };
        },
        {
          name: 'contractConfig';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [
                  99,
                  111,
                  110,
                  116,
                  114,
                  97,
                  99,
                  116,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103,
                ];
              },
            ];
          };
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
      ];
      args: [
        {
          name: 'deviceType';
          type: 'u16';
        },
        {
          name: 'limit';
          type: 'u16';
        },
      ];
    },
    {
      name: 'transferMasterRights';
      discriminator: [230, 240, 167, 33, 38, 45, 180, 155];
      accounts: [
        {
          name: 'signer';
          writable: true;
          signer: true;
        },
        {
          name: 'masterPda';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [109, 97, 115, 116, 101, 114];
              },
            ];
          };
        },
      ];
      args: [
        {
          name: 'newMasterAddress';
          type: 'pubkey';
        },
      ];
    },
  ];
  accounts: [
    {
      name: 'admin';
      discriminator: [244, 158, 220, 65, 8, 73, 4, 65];
    },
    {
      name: 'contractConfig';
      discriminator: [134, 229, 224, 68, 136, 40, 85, 234];
    },
    {
      name: 'device';
      discriminator: [153, 248, 23, 39, 83, 45, 68, 128];
    },
    {
      name: 'deviceStatus';
      discriminator: [13, 226, 26, 137, 144, 41, 230, 121];
    },
    {
      name: 'master';
      discriminator: [168, 213, 193, 12, 77, 162, 58, 235];
    },
  ];
  errors: [
    {
      code: 6000;
      name: 'invalidProjectIdLength';
      msg: 'The length of the device Id must be equal to 24';
    },
    {
      code: 6001;
      name: 'masterIsAlreadyInit';
      msg: 'Master account is already init';
    },
    {
      code: 6002;
      name: 'adminIsAlreadyInit';
      msg: 'Admin account is already init';
    },
    {
      code: 6003;
      name: 'contractConfigIsAlreadyInit';
      msg: 'Contract config account is already init';
    },
  ];
  types: [
    {
      name: 'admin';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'adminKey';
            type: 'pubkey';
          },
        ];
      };
    },
    {
      name: 'configArgs';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'mintingFee';
            type: 'u64';
          },
          {
            name: 'rate';
            type: 'u64';
          },
        ];
      };
    },
    {
      name: 'contractConfig';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'rate';
            type: 'u64';
          },
          {
            name: 'mintingFee';
            type: 'u64';
          },
          {
            name: 'mint';
            type: 'pubkey';
          },
          {
            name: 'mintingLimits';
            type: {
              vec: {
                defined: {
                  name: 'deviceLimit';
                };
              };
            };
          },
        ];
      };
    },
    {
      name: 'device';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'id';
            type: 'string';
          },
          {
            name: 'deviceType';
            type: 'u16';
          },
          {
            name: 'mint';
            type: 'pubkey';
          },
          {
            name: 'projectId';
            type: 'string';
          },
        ];
      };
    },
    {
      name: 'deviceLimit';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'deviceType';
            type: 'u16';
          },
          {
            name: 'limit';
            type: 'u16';
          },
        ];
      };
    },
    {
      name: 'deviceStatus';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'deviceKey';
            type: 'pubkey';
          },
          {
            name: 'isActive';
            type: 'bool';
          },
          {
            name: 'lastMintTime';
            type: 'i64';
          },
          {
            name: 'nonce';
            type: 'u16';
          },
        ];
      };
    },
    {
      name: 'master';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'masterKey';
            type: 'pubkey';
          },
        ];
      };
    },
    {
      name: 'registerDeviceArgs';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'projectId';
            type: 'string';
          },
          {
            name: 'deviceId';
            type: 'string';
          },
          {
            name: 'deviceType';
            type: 'u16';
          },
        ];
      };
    },
  ];
};

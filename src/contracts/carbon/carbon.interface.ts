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
      name: 'burnSft';
      discriminator: [102, 130, 58, 158, 77, 125, 18, 64];
      accounts: [
        {
          name: 'signer';
          writable: true;
          signer: true;
        },
        {
          name: 'mintSft';
          writable: true;
        },
        {
          name: 'burnAta';
          writable: true;
        },
        {
          name: 'metadataSft';
          writable: true;
        },
        {
          name: 'burningRecord';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [
                  98,
                  117,
                  114,
                  110,
                  105,
                  110,
                  103,
                  95,
                  114,
                  101,
                  99,
                  111,
                  114,
                  100,
                ];
              },
              {
                kind: 'account';
                path: 'signer';
              },
            ];
          };
        },
        {
          name: 'authority';
          writable: true;
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
          name: 'amount';
          type: 'f64';
        },
      ];
    },
    {
      name: 'buy';
      discriminator: [102, 6, 61, 18, 1, 218, 235, 234];
      accounts: [
        {
          name: 'signer';
          signer: true;
        },
        {
          name: 'mint';
        },
        {
          name: 'sourceAta';
          writable: true;
        },
        {
          name: 'toAta';
          writable: true;
        },
        {
          name: 'tokenListingInfo';
          writable: true;
        },
        {
          name: 'tokenOwner';
          writable: true;
        },
        {
          name: 'marketplaceDelegate';
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [109, 97, 114, 107, 101, 116, 112, 108, 97, 99, 101];
              },
              {
                kind: 'const';
                value: [100, 101, 108, 101, 103, 97, 116, 101];
              },
            ];
          };
        },
        {
          name: 'tokenProgram';
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
      ];
      args: [
        {
          name: 'amount';
          type: 'f64';
        },
      ];
    },
    {
      name: 'cancelListing';
      discriminator: [41, 183, 50, 232, 230, 233, 157, 70];
      accounts: [
        {
          name: 'signer';
          writable: true;
          signer: true;
        },
        {
          name: 'mint';
        },
        {
          name: 'tokenListingInfo';
          writable: true;
        },
      ];
      args: [];
    },
    {
      name: 'createCollection';
      discriminator: [156, 251, 92, 54, 233, 2, 16, 82];
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
          name: 'collectionMint';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [67, 111, 108, 108, 101, 99, 116, 105, 111, 110];
              },
            ];
          };
        },
        {
          name: 'metadataAccount';
          writable: true;
        },
        {
          name: 'tokenAccount';
          writable: true;
        },
        {
          name: 'masterEdition';
          writable: true;
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
        {
          name: 'tokenProgram';
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
        },
        {
          name: 'associatedTokenProgram';
          address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL';
        },
        {
          name: 'tokenMetadataProgram';
          address: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s';
        },
        {
          name: 'rent';
          address: 'SysvarRent111111111111111111111111111111111';
        },
      ];
      args: [
        {
          name: 'uri';
          type: 'string';
        },
        {
          name: 'name';
          type: 'string';
        },
        {
          name: 'symbol';
          type: 'string';
        },
      ];
    },
    {
      name: 'createFt';
      discriminator: [56, 245, 99, 230, 162, 6, 220, 85];
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
          name: 'authority';
          writable: true;
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
          name: 'createFtArgs';
          type: {
            defined: {
              name: 'createFtArgs';
            };
          };
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
          name: 'governance';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [103, 111, 118, 101, 114, 110, 97, 110, 99, 101];
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
      name: 'listing';
      discriminator: [126, 47, 161, 107, 23, 112, 254, 126];
      accounts: [
        {
          name: 'signer';
          writable: true;
          signer: true;
        },
        {
          name: 'mint';
        },
        {
          name: 'sourceAta';
          writable: true;
        },
        {
          name: 'tokenListingInfo';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [115, 101, 108, 102];
              },
              {
                kind: 'account';
                path: 'signer';
              },
              {
                kind: 'account';
                path: 'mint';
              },
            ];
          };
        },
        {
          name: 'marketplaceDelegate';
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [109, 97, 114, 107, 101, 116, 112, 108, 97, 99, 101];
              },
              {
                kind: 'const';
                value: [100, 101, 108, 101, 103, 97, 116, 101];
              },
            ];
          };
        },
        {
          name: 'tokenProgram';
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
      ];
      args: [
        {
          name: 'listingArgs';
          type: {
            defined: {
              name: 'listingArgs';
            };
          };
        },
      ];
    },
    {
      name: 'mintNft';
      discriminator: [211, 57, 6, 167, 15, 219, 35, 251];
      accounts: [
        {
          name: 'signer';
          writable: true;
          signer: true;
        },
        {
          name: 'burningRecord';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [
                  98,
                  117,
                  114,
                  110,
                  105,
                  110,
                  103,
                  95,
                  114,
                  101,
                  99,
                  111,
                  114,
                  100,
                ];
              },
              {
                kind: 'account';
                path: 'signer';
              },
            ];
          };
        },
        {
          name: 'collectionMint';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [67, 111, 108, 108, 101, 99, 116, 105, 111, 110];
              },
            ];
          };
        },
        {
          name: 'collectionMetadataAccount';
          writable: true;
        },
        {
          name: 'collectionMasterEdition';
          writable: true;
        },
        {
          name: 'nftMint';
          writable: true;
          signer: true;
        },
        {
          name: 'metadataAccount';
          writable: true;
        },
        {
          name: 'masterEdition';
          writable: true;
        },
        {
          name: 'tokenAccount';
          writable: true;
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
        {
          name: 'tokenProgram';
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
        },
        {
          name: 'associatedTokenProgram';
          address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL';
        },
        {
          name: 'tokenMetadataProgram';
          address: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s';
        },
        {
          name: 'rent';
          address: 'SysvarRent111111111111111111111111111111111';
        },
      ];
      args: [
        {
          name: 'uri';
          type: 'string';
        },
        {
          name: 'name';
          type: 'string';
        },
        {
          name: 'symbol';
          type: 'string';
        },
        {
          name: 'amount';
          type: 'f64';
        },
      ];
    },
    {
      name: 'mintSft';
      discriminator: [225, 138, 215, 72, 133, 196, 238, 223];
      accounts: [
        {
          name: 'signer';
          writable: true;
          signer: true;
        },
        {
          name: 'deviceOwner';
        },
        {
          name: 'ownerGovernance';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [103, 111, 118, 101, 114, 110, 97, 110, 99, 101];
              },
              {
                kind: 'account';
                path: 'deviceOwner';
              },
            ];
          };
        },
        {
          name: 'governance';
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [103, 111, 118, 101, 114, 110, 97, 110, 99, 101];
              },
            ];
          };
        },
        {
          name: 'contractConfig';
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
          name: 'claim';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [99, 108, 97, 105, 109];
              },
              {
                kind: 'account';
                path: 'mint';
              },
            ];
          };
        },
        {
          name: 'ownerAta';
          writable: true;
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
                kind: 'arg';
                path: 'mint_sft_args.device_id';
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
          address: 'Sysvar1nstructions1111111111111111111111111';
        },
        {
          name: 'tokenMetadataProgram';
        },
        {
          name: 'ataProgram';
        },
      ];
      args: [
        {
          name: 'mintSftArgs';
          type: {
            defined: {
              name: 'mintSftArgs';
            };
          };
        },
        {
          name: 'verifyMessageArgs';
          type: {
            defined: {
              name: 'verifyMessageArgs';
            };
          };
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
                kind: 'arg';
                path: 'register_device_args.device_id';
              },
            ];
          };
        },
        {
          name: 'contractConfig';
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
          name: 'registerDeviceArgs';
          type: {
            defined: {
              name: 'registerDeviceArgs';
            };
          };
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
                kind: 'arg';
                path: 'deviceId';
              },
            ];
          };
        },
      ];
      args: [
        {
          name: 'projectId';
          type: 'u16';
        },
        {
          name: 'deviceId';
          type: 'u16';
        },
      ];
    },
    {
      name: 'setCoefficient';
      discriminator: [82, 162, 57, 29, 162, 186, 172, 156];
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
          name: 'coefficient';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [99, 111, 101, 102, 102, 105, 99, 105, 101, 110, 116];
              },
              {
                kind: 'arg';
                path: 'key';
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
          name: 'key';
          type: 'string';
        },
        {
          name: 'value';
          type: 'u64';
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
          type: 'f64';
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
          type: 'f64';
        },
      ];
    },
    {
      name: 'setRate';
      discriminator: [99, 58, 170, 238, 160, 120, 74, 11];
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
          name: 'rate';
          type: 'f64';
        },
      ];
    },
    {
      name: 'swapSft';
      discriminator: [49, 47, 165, 112, 80, 173, 202, 27];
      accounts: [
        {
          name: 'signer';
          writable: true;
          signer: true;
        },
        {
          name: 'burnAta';
          writable: true;
        },
        {
          name: 'toAta';
          writable: true;
        },
        {
          name: 'mintSft';
          writable: true;
        },
        {
          name: 'mintFt';
          writable: true;
        },
        {
          name: 'metadataSft';
          writable: true;
        },
        {
          name: 'metadataFt';
          writable: true;
        },
        {
          name: 'authority';
          writable: true;
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
        {
          name: 'ataProgram';
        },
      ];
      args: [
        {
          name: 'burnDataVec';
          type: 'bytes';
        },
        {
          name: 'mintDataVec';
          type: 'bytes';
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
      name: 'burningRecord';
      discriminator: [156, 23, 40, 15, 223, 187, 233, 47];
    },
    {
      name: 'claim';
      discriminator: [155, 70, 22, 176, 123, 215, 246, 102];
    },
    {
      name: 'coefficient';
      discriminator: [2, 50, 46, 101, 246, 105, 23, 251];
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
      name: 'governance';
      discriminator: [18, 143, 88, 13, 73, 217, 47, 49];
    },
    {
      name: 'master';
      discriminator: [168, 213, 193, 12, 77, 162, 58, 235];
    },
    {
      name: 'tokenListingInfo';
      discriminator: [224, 170, 101, 201, 223, 183, 148, 105];
    },
  ];
  errors: [
    {
      code: 6000;
      name: 'publicKeyMismatch';
      msg: 'PublicKey Mismatch';
    },
    {
      code: 6001;
      name: 'invalidProjectId';
    },
    {
      code: 6002;
      name: 'masterIsAlreadyInit';
      msg: 'Master account is already init';
    },
    {
      code: 6003;
      name: 'adminIsAlreadyInit';
      msg: 'Admin account is already init';
    },
    {
      code: 6004;
      name: 'contractConfigIsAlreadyInit';
      msg: 'Contract config account is already init';
    },
    {
      code: 6005;
      name: 'deviceIsNotActive';
      msg: 'Must active this device to mint semi-fungible token';
    },
    {
      code: 6006;
      name: 'sigVerificationFailed';
    },
    {
      code: 6007;
      name: 'initArgsInvalid';
      msg: 'Init config for contract is invalid';
    },
    {
      code: 6008;
      name: 'invalidNonce';
    },
    {
      code: 6009;
      name: 'notMintTime';
    },
    {
      code: 6010;
      name: 'notEnoughAmount';
    },
    {
      code: 6011;
      name: 'invalidMint';
    },
    {
      code: 6012;
      name: 'invalidAmount';
    },
    {
      code: 6013;
      name: 'invalidValue';
    },
    {
      code: 6014;
      name: 'invalidStringLength';
    },
    {
      code: 6015;
      name: 'invalidNumber';
    },
    {
      code: 6016;
      name: 'invalidDeviceId';
    },
    {
      code: 6017;
      name: 'invalidDeviceType';
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
      name: 'burningRecord';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'totalAmount';
            type: 'f64';
          },
          {
            name: 'remaining';
            type: 'f64';
          },
        ];
      };
    },
    {
      name: 'claim';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'isClaimed';
            type: 'bool';
          },
          {
            name: 'mint';
            type: 'pubkey';
          },
          {
            name: 'amount';
            type: 'f64';
          },
          {
            name: 'projectId';
            type: 'u16';
          },
        ];
      };
    },
    {
      name: 'coefficient';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'key';
            type: 'string';
          },
          {
            name: 'value';
            type: 'u64';
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
            type: 'f64';
          },
          {
            name: 'rate';
            type: 'f64';
          },
          {
            name: 'governanceAmount';
            type: 'f64';
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
            type: 'f64';
          },
          {
            name: 'mintingFee';
            type: 'f64';
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
          {
            name: 'governanceAmount';
            type: 'f64';
          },
        ];
      };
    },
    {
      name: 'createFtArgs';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'totalSupply';
            type: {
              option: 'u64';
            };
          },
          {
            name: 'disableMint';
            type: 'bool';
          },
          {
            name: 'disableFreeze';
            type: 'bool';
          },
          {
            name: 'dataVec';
            type: 'bytes';
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
            type: 'u16';
          },
          {
            name: 'deviceType';
            type: 'u16';
          },
          {
            name: 'projectId';
            type: 'u16';
          },
          {
            name: 'owner';
            type: 'pubkey';
          },
          {
            name: 'minter';
            type: 'pubkey';
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
            type: 'f64';
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
      name: 'governance';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'owner';
            type: 'pubkey';
          },
          {
            name: 'amount';
            type: 'f64';
          },
        ];
      };
    },
    {
      name: 'listingArgs';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'price';
            type: 'f64';
          },
          {
            name: 'projectId';
            type: 'u16';
          },
          {
            name: 'currency';
            type: {
              option: 'pubkey';
            };
          },
          {
            name: 'amount';
            type: 'f64';
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
      name: 'mintSftArgs';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'projectId';
            type: 'u16';
          },
          {
            name: 'deviceId';
            type: 'u16';
          },
          {
            name: 'nonce';
            type: 'u16';
          },
          {
            name: 'createMintDataVec';
            type: 'bytes';
          },
          {
            name: 'totalAmount';
            type: 'f64';
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
            type: 'u16';
          },
          {
            name: 'deviceId';
            type: 'u16';
          },
          {
            name: 'deviceType';
            type: 'u16';
          },
          {
            name: 'owner';
            type: 'pubkey';
          },
          {
            name: 'minter';
            type: 'pubkey';
          },
        ];
      };
    },
    {
      name: 'tokenListingInfo';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'owner';
            type: 'pubkey';
          },
          {
            name: 'mint';
            type: 'pubkey';
          },
          {
            name: 'amount';
            type: 'f64';
          },
          {
            name: 'price';
            type: 'f64';
          },
          {
            name: 'projectId';
            type: 'u16';
          },
          {
            name: 'currency';
            type: {
              option: 'pubkey';
            };
          },
          {
            name: 'remaining';
            type: 'f64';
          },
        ];
      };
    },
    {
      name: 'verifyMessageArgs';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'ethAddress';
            type: {
              array: ['u8', 20];
            };
          },
          {
            name: 'msg';
            type: 'bytes';
          },
          {
            name: 'sig';
            type: {
              array: ['u8', 64];
            };
          },
          {
            name: 'recoveryId';
            type: 'u8';
          },
        ];
      };
    },
  ];
  constants: [
    {
      name: 'seed';
      type: 'string';
      value: '"Collection"';
    },
  ];
};

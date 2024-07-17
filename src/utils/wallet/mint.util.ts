import { CARBON_IDL } from '@contracts/carbon/carbon.idl.ts';
import { ICarbonContract } from '@contracts/carbon/carbon.interface.ts';
import { AnchorProvider, BN, Program } from '@coral-xyz/anchor';
import {
  ASSOCIATED_PROGRAM_ID,
  associatedAddress,
  TOKEN_PROGRAM_ID,
} from '@coral-xyz/anchor/dist/cjs/utils/token';
import {
  CreateArgsArgs,
  getCreateArgsSerializer,
  MPL_TOKEN_METADATA_PROGRAM_ID,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata';
import { percentAmount, some } from '@metaplex-foundation/umi';
import { AnchorWallet, Wallet } from '@solana/wallet-adapter-react';
import {
  Connection,
  Keypair,
  PublicKey,
  SYSVAR_INSTRUCTIONS_PUBKEY,
} from '@solana/web3.js';
import { UseMutationResult } from '@tanstack/react-query';
import {
  CreateFtArgs,
  IFTCreateForm,
} from '@components/features/contract/fungible-token/ft.interface.ts';
import { sendTx } from '@utils/wallet/transaction.util.ts';

interface ICreateMintProps {
  anchorWallet: AnchorWallet;
  connection: Connection;
  publicKey: PublicKey;
  wallet: Wallet;
  uri: string;
  input: IFTCreateForm;
}

interface ICreateMintResponse {
  token: string;
  tx?: string;
  status: 'success' | 'error';
}

const createMetadata = async (
  mutationUploadImage: UseMutationResult<
    GeneralResponse<IUploadImageResponse>,
    Error,
    IUploadImageRequest,
    unknown
  >,
  mutationUploadMetadata: UseMutationResult<
    GeneralResponse<IUploadMetadataResponse>,
    Error,
    IUploadMetadataRequest,
    unknown
  >,
  input: IFTCreateForm,
): Promise<string> => {
  const data = await mutationUploadImage.mutateAsync({
    category: 'metadata',
    type: 'icon',
    file: input.icon[0],
  });
  const image = data.data.result[0].result[0].path;
  const metadata = await mutationUploadMetadata.mutateAsync({
    image,
    name: input.name,
    symbol: input.symbol,
    description: input.description,
  });
  return metadata.data.metadata_path;
};

const createMint = async ({
  anchorWallet,
  connection,
  publicKey,
  wallet,
  uri,
  input,
}: ICreateMintProps): Promise<ICreateMintResponse> => {
  const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
    MPL_TOKEN_METADATA_PROGRAM_ID.toString(),
  );
  const provider = new AnchorProvider(connection, anchorWallet);
  const program = new Program<ICarbonContract>(
    CARBON_IDL as ICarbonContract,
    provider,
  );
  const mint = Keypair.generate();
  const createArgsVec: CreateArgsArgs = {
    __kind: 'V1',
    name: input.name,
    symbol: input.symbol,
    uri,
    sellerFeeBasisPoints: percentAmount(5.5),
    decimals: some(input.decimals),
    creators: null,
    tokenStandard: TokenStandard.Fungible,
  };
  const serialize = getCreateArgsSerializer();
  const data = serialize.serialize(createArgsVec);
  const createFtArgs: CreateFtArgs = {
    disableMint: input.revoke_mint || false,
    disableFreeze: input.revoke_freeze || false,
    totalSupply: new BN(input.supply * 10 ** input.decimals || 0),
    dataVec: Buffer.from(data),
  };

  const [metadata] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('metadata'),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.publicKey.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID,
  );
  const [authority] = PublicKey.findProgramAddressSync(
    [Buffer.from('authority')],
    program.programId,
  );

  const toAta = associatedAddress({
    mint: mint.publicKey,
    owner: authority,
  });
  const mintIntrs = await program.methods
    .createFt(createFtArgs)
    .accounts({
      signer: publicKey,
      mint: mint.publicKey,
      metadata: metadata,
      tokenProgram: TOKEN_PROGRAM_ID,
      sysvarProgram: SYSVAR_INSTRUCTIONS_PUBKEY,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
    })
    .signers([mint])
    .remainingAccounts([
      {
        pubkey: toAta,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: ASSOCIATED_PROGRAM_ID,
        isWritable: false,
        isSigner: false,
      },
    ])
    .instruction();
  const { status, tx } = await sendTx({
    connection,
    wallet,
    payerKey: publicKey,
    txInstructions: mintIntrs,
    otherSigner: mint,
  });
  return {
    tx,
    token: mint.publicKey.toString(),
    status,
  };
};
export { createMetadata, createMint };
export type { ICreateMintResponse };

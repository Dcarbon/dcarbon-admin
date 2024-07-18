import { ICarbonContract } from '@contracts/carbon/carbon.interface.ts';
import { IdlTypes } from '@coral-xyz/anchor';

interface TFungibleTokenInfo {
  mint: string;
  name: string;
  symbol: string;
  description: string;
  decimals: number;
  supply: number;
  icon: string[];
  revoke_freeze: boolean;
  revoke_mint: boolean;
}

interface IFTCreateForm extends TFungibleTokenInfo {}

interface IMintTokenInput {
  uri: string;
}
type CreateFtArgs = IdlTypes<ICarbonContract>['createFtArgs'];

export type {
  IFTCreateForm,
  TFungibleTokenInfo,
  IMintTokenInput,
  CreateFtArgs,
};

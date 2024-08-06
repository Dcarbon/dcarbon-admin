import { SplToken } from '@/types/projects';

interface IConfig {
  rate?: number;
  mint_fee?: number;
  collect_fee_wallet?: string;
  signer_wallet?: string;
  carbon?: SplToken;
  dcarbon?: SplToken;

  [key: string]: any;

  device_limit?: {
    device_type: number;
    limit: number;
  }[];

  coefficients?: {
    key: string;
    value: number;
  }[];
}

export type { IConfig };

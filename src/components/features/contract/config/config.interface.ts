interface IConfig {
  rate?: number;
  mint_fee?: number;
  collect_fee_wallet?: string;
  carbon?: SplToken;
  dcarbon?: SplToken;
  [key: string]: any;
  device_limit?: {
    device_type: number;
    limit: number;
  }[];
}

export type { IConfig };

interface ITransactionTable {
  tx_date_time: string;
  account: string;
  type: string;
  amount: number;
}
interface IWallet {
  wallet: number;
  carbon: number;
  exchange_rate: number;
  exchange_rate_currency: string;
  carbon_chart: {
    labels: string[];
    data: number[];
  };
  dcarbon: number;
}
interface IWalletState {
  tx_id: string;
  tx_date_time: string;
  account: string;
  type: transfer;
  amount: number;
  currency: string;
}
type TransactionPages = {
  data: IWalletState[];
  paging: {
    total: number;
    page: number;
    limit: number;
  };
};
type TransactionPagesRequest = {
  page: number;
  limit: number;
  sort_field: string;
  sort_type: string;
};

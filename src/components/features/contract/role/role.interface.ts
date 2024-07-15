type TContractUserStatus = 'active' | 'draft' | 'default';

interface IContractUser {
  wallet: string;

  status: TContractUserStatus;
}

export type { IContractUser, TContractUserStatus };

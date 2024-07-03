interface IPo {
  id: string;
  profile_name: string;
  user_name: string;
  password: string;
  wallet: string;
  ref_code: string;
  status: 'active' | 'inactive' | 'banned' | 'deleted';
  role?: 'supper_admin' | 'admin' | 'po';
  info: string;
}
interface IPoPage {
  data: PoList[];
  paging: {
    total: number;
    page: number;
    limit: number;
  };
}
interface IPoRequest {
  page?: number;
  limit?: number;
  sort_field?: string;
  sort_type?: string;
  keyword?: string;
}
type PoList = Omit<IPo, 'password' | 'ref_code' | 'role' | 'info'>;

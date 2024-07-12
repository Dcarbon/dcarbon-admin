export interface IUser {
  user_id: string;
  username: string;
  profile_name: string;
}

interface IAuth {
  access_token: string;
  refresh_token: string;
  user_info: IUser;
}

interface IUser {
  username: string;
  role: 'super_admin' | 'po' | null | undefined;
}

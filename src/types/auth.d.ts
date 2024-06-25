interface IAuth {
  access_token: string;
  refresh_token: string;
  user_info: {
    username: string;
    role: 'superadmin' | 'po';
  };
}

interface IUser {
  username: string;
  role: 'superadmin' | 'po' | null | undefined;
}

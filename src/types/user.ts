// export interface User {
//   id: string;
//   aud: string;
//   role: string;
//   email: string;
//   email_confirmed_at: string | null;
//   phone: string | null;
//   confirmed_at: string | null;
//   last_sign_in_at: string | null;
//   app_metadata: {
//     provider: string;
//     providers: string[];
//   };
//   user_metadata: Record<string, any>;
//   identities: any[];
//   created_at: string;
//   updated_at: string;
// }

export interface UserCreateInput {
  email: string;
  password: string;
}

export interface UserLoginInput {
  email: string;
  password: string;
}

export interface GetUserById {
  userId: string;
}

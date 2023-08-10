import { type FetchParams } from "./params";

type User = {
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  password: string;
}

type CurrentUser = Omit<User, 'password'> & {
  accessToken: string;
}

interface FetchUsersParams extends FetchParams {
  role: User['role'];
}

type UserCreateParams = Required<User>

export {
  User,
  CurrentUser,
  FetchUsersParams,
  UserCreateParams,
};

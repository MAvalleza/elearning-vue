import { type FetchParams } from "./params";

type User = {
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  password: string;
}

type Author = User

type CurrentUser = Omit<User, 'password'> & {
  id: string;
  normalizedName: string;
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

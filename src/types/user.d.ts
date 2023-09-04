import { type FetchParams } from './params';

type User = {
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  password: string;
};

type Author = User;

type MappedUser = Omit<User, 'password'> & {
  id: string;
  normalizedName: string;
  isActive: boolean;
};

interface CurrentUser extends MappedUser {
  accessToken: string;
}

interface FetchUsersParams extends FetchParams {
  role?: User['role'];
}

type UserCreateParams = Required<User>;

type UserUpdateParams = {
  firstName?: string;
  lastName?: string;
  role?: string;
  email?: string;
  isActive?: boolean;
};

export {
  User,
  Author,
  MappedUser,
  CurrentUser,
  FetchUsersParams,
  UserCreateParams,
  UserUpdateParams,
};

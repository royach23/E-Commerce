export interface User {
  id?: string;
  username: string;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  email: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface UserJson {
  user_id: string | number;
  username?: string;
  first_name?: string;
  last_name?: string;
  address?: string;
  phone_number?: string;
  email?: string;
}

export function createUserFromJson(jsonData: UserJson): User {
  const formattedUser: User = {
    id: String(jsonData.user_id),
    username: jsonData.username || '',
    firstName: jsonData.first_name || '',
    lastName: jsonData.last_name || '',
    address: jsonData.address || '',
    phoneNumber: jsonData.phone_number || '',
    email: jsonData.email || '',
  };

  return formattedUser;
}
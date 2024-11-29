export interface User{
    id?: number;
    username: string;
    password?: string;
    first_name: string;
    last_name: string;
    address: string;
    phone_number: string;
    email: string;
  }
  
  export interface LoginCredentials {
    username: string;
    password: string;
  }
  
  export interface LoginResponse {
    access_token: string;
    user: User;
  }

  interface UserJson {
    user_id: number;
    username: string;
    first_name: string;
    last_name: string;
    address: string;
    phone_number: string[];
    email: string;
  }


  export function createUserFromJson(jsonData: UserJson): User {

    const formattedUser: User = {
      id: jsonData.user_id,
      username: jsonData.username,
      first_name: jsonData.first_name,
      last_name: jsonData.last_name,
      address: jsonData.address,
      phone_number: jsonData.phone_number[0] || "",
      email: jsonData.email,
    };

    return formattedUser;
  }
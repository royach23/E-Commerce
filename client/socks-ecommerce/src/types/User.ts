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
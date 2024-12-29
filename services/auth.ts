import { api } from '@/libs/axios-instance';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export const authService = {
  login(credentials: LoginRequest) {
    return api.post<LoginResponse>('/Auth/login', credentials);
  },

  logout() {
    return api.post('/Auth/logout');
  },
};

import { api } from '@/libs/axios-instance';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    surname?: string;
  };
  message: string;
}

export interface ProfileUpdateRequest {
  id: string;
  email: string;
  name: string;
  surname: string;
  password?: string;
}

export interface ProfileResponse {
  success: boolean;
  user: {
    id: string;
    email: string;
    name: string;
    surname: string;
  };
  message: string;
}

export const authService = {
  login(credentials: LoginRequest) {
    return api.post<LoginResponse>('/Auth/login', credentials);
  },

  logout() {
    return api.post('/Auth/logout');
  },

  updateProfile(profileData: ProfileUpdateRequest) {
    return api.put<ProfileResponse>('/Auth/profile', profileData);
  },

  getProfile(userId: string) {
    return api.get<ProfileResponse>(`/Auth/profile/${userId}`);
  },
};

import { axiosInstance } from '../services/api.client';
import { UserDto, Role } from '../types/api.types';

interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

interface UpdateUserRoleRequest {
  role: Role;
}

class UserService {
  // Current user endpoints
  async getCurrentUser(): Promise<UserDto> {
    const response = await axiosInstance.get<UserDto>('/users/me');
    return response.data;
  }

  async updateProfile(data: UpdateProfileRequest): Promise<UserDto> {
    const response = await axiosInstance.put<UserDto>('/users/me', data);
    return response.data;
  }

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    await axiosInstance.post('/users/me/change-password', data);
  }

  async deleteAccount(): Promise<void> {
    await axiosInstance.delete('/users/me');
  }

  // User management endpoints (admin)
  async getUsers(farmId?: string): Promise<UserDto[]> {
    const params = farmId ? { farmId } : {};
    const response = await axiosInstance.get<UserDto[]>('/users', { params });
    return response.data;
  }

  async getUser(userId: string): Promise<UserDto> {
    const response = await axiosInstance.get<UserDto>(`/users/${userId}`);
    return response.data;
  }

  async updateUser(userId: string, data: Partial<UpdateProfileRequest>): Promise<UserDto> {
    const response = await axiosInstance.put<UserDto>(`/users/${userId}`, data);
    return response.data;
  }

  async updateUserRole(userId: string, data: UpdateUserRoleRequest): Promise<UserDto> {
    const response = await axiosInstance.put<UserDto>(`/users/${userId}/role`, data);
    return response.data;
  }

  async enableUser(userId: string): Promise<UserDto> {
    const response = await axiosInstance.post<UserDto>(`/users/${userId}/enable`);
    return response.data;
  }

  async disableUser(userId: string): Promise<UserDto> {
    const response = await axiosInstance.post<UserDto>(`/users/${userId}/disable`);
    return response.data;
  }

  async deleteUser(userId: string): Promise<void> {
    await axiosInstance.delete(`/users/${userId}`);
  }

  // User preferences
  async getPreferences(): Promise<Record<string, any>> {
    const response = await axiosInstance.get('/users/me/preferences');
    return response.data;
  }

  async updatePreferences(preferences: Record<string, any>): Promise<Record<string, any>> {
    const response = await axiosInstance.put('/users/me/preferences', preferences);
    return response.data;
  }
}

export const userService = new UserService();
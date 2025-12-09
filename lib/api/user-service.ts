import { AxiosResponse } from 'axios';
import { AdminHttpClient } from '../http';
import { userRoutes } from '../constants/user-routes';
import { UriResponse } from './auth-service';

/**
 * User DTO matching uri-backend User entity
 */
export interface UserDto {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  country?: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  userType: 'CREATIVE' | 'BUSINESS' | 'AGENCY' | 'ADMIN';
  userStatus: 'ACTIVE' | 'INACTIVE' | 'DEACTIVATED' | 'RESTRICTED' | 'LOCKED' | 'DELETED';
  subscriptionStatus?: 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  createdAt?: string;
  updatedAt?: string;
}

/**
 * User service for fetching user data
 */
export class UserService {
  /**
   * Get user by userId
   * GET /api/v1/users/getByUserId?userId={userId}
   */
  static async getByUserIdApi(userId: string): Promise<UriResponse<UserDto>> {
    const response: Awaited<AxiosResponse<UriResponse<UserDto>>> =
      await AdminHttpClient.getClient().get(
        `${userRoutes.getByUserId}/${userId}`
      );
    return response.data;
  }
}

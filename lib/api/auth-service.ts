import { AxiosResponse } from 'axios';
import { AdminHttpClient } from '../http';
import { authRoutes } from '../constants/auth-routes';

/**
 * Response wrapper matching uri-backend format
 */
export interface UriResponse<T> {
  status: boolean;
  responseCode: number;
  responseMessage: string;
  responseData: T;
}

/**
 * Login request DTO
 */
export interface LoginDto {
  email: string;
  password: string;
}

/**
 * Login response DTO
 */
export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
}

/**
 * Refresh token request DTO
 */
export interface RefreshTokenDto {
  refreshToken: string;
}

/**
 * Token response DTO
 */
export interface TokenResponseDto {
  accessToken: string;
  refreshToken: string;
}

/**
 * Change password request DTO
 */
export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

/**
 * Authentication service for admin portal
 * Follows the EXACT same pattern as uri-frontend/src/api/AuthService.ts
 */
export class AuthService {
  /**
   * Admin login
   * POST /api/v1/auth/login
   */
  static async loginApi(data: LoginDto): Promise<UriResponse<LoginResponseDto>> {
    const response: Awaited<AxiosResponse<UriResponse<LoginResponseDto>>> =
      await AdminHttpClient.getClient().post(authRoutes.login, data);
    return response.data;
  }

  /**
   * Refresh access token
   * POST /api/v1/auth/refreshToken
   */
  static async refreshTokenApi(
    data: RefreshTokenDto
  ): Promise<UriResponse<TokenResponseDto>> {
    const response: Awaited<AxiosResponse<UriResponse<TokenResponseDto>>> =
      await AdminHttpClient.getClient().post(authRoutes.refreshToken, data);
    return response.data;
  }

  /**
   * Change password
   * POST /api/v1/auth/changePassword
   */
  static async changePasswordApi(
    data: ChangePasswordDto
  ): Promise<UriResponse<any>> {
    const response: Awaited<AxiosResponse<UriResponse<any>>> =
      await AdminHttpClient.getClient().post(authRoutes.changePassword, data);
    return response.data;
  }
}

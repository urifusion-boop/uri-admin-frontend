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
  role: 'USER' | 'ADMIN';
  userType: 'USER' | 'ADMIN';
  userStatus: 'ACTIVE' | 'INACTIVE' | 'DEACTIVATED' | 'RESTRICTED' | 'LOCKED' | 'DELETED';
  subscriptionStatus?: 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  trialStatus?: 'not_started' | 'active' | 'expired' | 'converted';
  dateCreated?: string;
  lastLogin?: string;
  emailConfirmed?: boolean;
  phoneNumberConfirmed?: boolean;
}

/**
 * User Analytics DTO
 */
export interface UserAnalyticsDto {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  usersByType: {
    creative: number;
    business: number;
    agency: number;
    admin: number;
  };
  usersByStatus: {
    active: number;
    inactive: number;
    deactivated: number;
    restricted: number;
    locked: number;
    deleted: number;
  };
  subscriptionStats: {
    withActiveSubscription: number;
    onTrial: number;
    expired: number;
    noSubscription: number;
  };
  topCountries: Array<{
    country: string;
    count: number;
    percentage: number;
  }>;
  growthRate: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  emailVerificationRate: number;
  phoneVerificationRate: number;
  profileCompletionRate: number;
}

/**
 * User Activity DTO
 */
export interface UserActivityDto {
  userId: string;
  lastLogin: string | null;
  loginCount: number;
  leadsGenerated: number;
  leadsQualified: number;
  leadsConverted: number;
  trialMetrics: {
    status: 'not_started' | 'active' | 'expired' | 'converted';
    leadsGenerated: number;
    signalsUsed: number;
    accountsTracked: number;
    hashtagsTracked: number;
    keywordsTracked: number;
    reportsGenerated: number;
  } | null;
  primaryWorkflow: string | null;
  primaryModule: string | null;
  lastAccessedModule: string | null;
  subscriptionStatus: string | null;
  subscriptionPlan: string | null;
  subscriptionStartDate: string | null;
  subscriptionExpiryDate: string | null;
  totalTransactions: number;
  successfulTransactions: number;
  totalSpent: number;
  engagementScore: number;
}

/**
 * User Growth Trend DTO
 */
export interface UserGrowthTrendDto {
  date: string;
  totalUsers: number;
  newUsers: number;
  creative: number;
  business: number;
  agency: number;
  admin: number;
}

/**
 * User List Filter DTO
 */
export interface UserListFilterDto {
  page?: number;
  pageSize?: number;
  search?: string;
  userType?: string[];
  userStatus?: string[];
  subscriptionStatus?: string[];
  country?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated User List Response DTO
 */
export interface PaginatedUserListDto {
  users: UserDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType?: string;
  signupReferralCode?: string;
  referralCode?: string;
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

  /**
   * Get user analytics
   * GET /api/v1/admin/users/analytics
   */
  static async getUserAnalytics(): Promise<UriResponse<UserAnalyticsDto>> {
    const response: Awaited<AxiosResponse<UriResponse<UserAnalyticsDto>>> =
      await AdminHttpClient.getClient().get('/api/v1/admin/users/analytics');
    return response.data;
  }

  /**
   * Get user growth trend
   * GET /api/v1/admin/users/growth-trend?days={days}
   */
  static async getUserGrowthTrend(days: number = 30): Promise<UriResponse<UserGrowthTrendDto[]>> {
    const response: Awaited<AxiosResponse<UriResponse<UserGrowthTrendDto[]>>> =
      await AdminHttpClient.getClient().get(
        `/api/v1/admin/users/growth-trend?days=${days}`
      );
    return response.data;
  }

  /**
   * Get user activity
   * GET /api/v1/admin/users/:userId/activity
   */
  static async getUserActivity(userId: string): Promise<UriResponse<UserActivityDto>> {
    const response: Awaited<AxiosResponse<UriResponse<UserActivityDto>>> =
      await AdminHttpClient.getClient().get(
        `/api/v1/admin/users/${userId}/activity`
      );
    return response.data;
  }

  /**
   * Get filtered user list
   * GET /api/v1/admin/users/list
   */
  static async getFilteredUserList(filters: UserListFilterDto): Promise<UriResponse<PaginatedUserListDto>> {
    const params = new URLSearchParams();

    if (filters.page) params.append('page', filters.page.toString());
    if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.userType) filters.userType.forEach(t => params.append('userType', t));
    if (filters.userStatus) filters.userStatus.forEach(s => params.append('userStatus', s));
    if (filters.subscriptionStatus) filters.subscriptionStatus.forEach(s => params.append('subscriptionStatus', s));
    if (filters.country) params.append('country', filters.country);
    if (filters.emailVerified !== undefined) params.append('emailVerified', filters.emailVerified.toString());
    if (filters.phoneVerified !== undefined) params.append('phoneVerified', filters.phoneVerified.toString());
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    const response: Awaited<AxiosResponse<UriResponse<PaginatedUserListDto>>> =
      await AdminHttpClient.getClient().get(
        `/api/v1/admin/users/list?${params.toString()}`
      );
    return response.data;
  }

  /**
   * Update user details (admin)
   * PUT /api/v1/admin/users/:userId
   */
  static async updateUser(userId: string, data: Partial<UserDto>): Promise<UriResponse<UserDto>> {
    const response: Awaited<AxiosResponse<UriResponse<UserDto>>> =
      await AdminHttpClient.getClient().put(
        `/api/v1/admin/users/${userId}`,
        data
      );
    return response.data;
  }

  /**
   * Delete user (admin)
   * DELETE /api/v1/admin/users/:userId
   */
  static async deleteUser(userId: string, reason?: string): Promise<UriResponse<void>> {
    const response: Awaited<AxiosResponse<UriResponse<void>>> =
      await AdminHttpClient.getClient().delete(
        `/api/v1/admin/users/${userId}`,
        { data: { reason } }
      );
    return response.data;
  }

  /**
   * Suspend user account (admin)
   * POST /api/v1/admin/users/:userId/suspend
   */
  static async suspendUser(userId: string, reason?: string): Promise<UriResponse<void>> {
    const response: Awaited<AxiosResponse<UriResponse<void>>> =
      await AdminHttpClient.getClient().post(
        `/api/v1/admin/users/${userId}/suspend`,
        { reason }
      );
    return response.data;
  }

  /**
   * Activate user account (admin)
   * POST /api/v1/admin/users/:userId/activate
   */
  static async activateUser(userId: string): Promise<UriResponse<void>> {
    const response: Awaited<AxiosResponse<UriResponse<void>>> =
      await AdminHttpClient.getClient().post(
        `/api/v1/admin/users/${userId}/activate`
      );
    return response.data;
  }

  /**
   * Deactivate user account (admin)
   * POST /api/v1/admin/users/:userId/deactivate
   */
  static async deactivateUser(userId: string, reason?: string): Promise<UriResponse<void>> {
    const response: Awaited<AxiosResponse<UriResponse<void>>> =
      await AdminHttpClient.getClient().post(
        `/api/v1/admin/users/${userId}/deactivate`,
        { reason }
      );
    return response.data;
  }

  /**
   * Send email to user (admin)
   * POST /api/v1/admin/users/:userId/send-email
   */
  static async sendEmail(userId: string, subject: string, message: string): Promise<UriResponse<void>> {
    const response: Awaited<AxiosResponse<UriResponse<void>>> =
      await AdminHttpClient.getClient().post(
        `/api/v1/admin/users/${userId}/send-email`,
        { subject, message }
      );
    return response.data;
  }

  /**
   * Send password reset email (admin)
   * POST /api/v1/admin/users/:userId/reset-password
   */
  static async resetPassword(userId: string): Promise<UriResponse<void>> {
    const response: Awaited<AxiosResponse<UriResponse<void>>> =
      await AdminHttpClient.getClient().post(
        `/api/v1/admin/users/${userId}/reset-password`
      );
    return response.data;
  }

  static async createUser(data: CreateUserPayload): Promise<UriResponse<UserDto>> {
    const response: Awaited<AxiosResponse<UriResponse<UserDto>>> =
      await AdminHttpClient.getClient().post(`/api/v1/auth/signup`, data);
    return response.data;
  }
}

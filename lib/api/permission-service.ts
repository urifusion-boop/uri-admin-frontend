import { AdminHttpClient } from '../http';
import { BackendUrlEnum } from '../constants/backend-urls';
import { UriResponse } from './auth-service';
import { AxiosResponse } from 'axios';

// Types
export enum PermissionEnum {
  // USER MANAGEMENT
  USERS_VIEW = 'users:view',
  USERS_CREATE = 'users:create',
  USERS_EDIT = 'users:edit',
  USERS_DELETE = 'users:delete',
  USERS_ASSIGN_ROLES = 'users:assign_roles',
  USERS_MANAGE_ADMINS = 'users:manage_admins',
  USERS_VIEW_SENSITIVE = 'users:view_sensitive',
  USERS_EXPORT = 'users:export',
  USERS_BULK_OPERATIONS = 'users:bulk_operations',

  // ROLE MANAGEMENT
  ROLES_VIEW = 'roles:view',
  ROLES_CREATE = 'roles:create',
  ROLES_EDIT = 'roles:edit',
  ROLES_DELETE = 'roles:delete',
  ROLES_ASSIGN = 'roles:assign',
  ROLES_MANAGE_PERMISSIONS = 'roles:manage_permissions',

  // PERMISSION MANAGEMENT
  PERMISSIONS_VIEW = 'permissions:view',
  PERMISSIONS_ASSIGN = 'permissions:assign',
  PERMISSIONS_REVOKE = 'permissions:revoke',
  PERMISSIONS_VIEW_ALL = 'permissions:view_all',

  // DASHBOARD
  DASHBOARD_VIEW = 'dashboard:view',
  DASHBOARD_VIEW_METRICS = 'dashboard:view_metrics',
  DASHBOARD_VIEW_ANALYTICS = 'dashboard:view_analytics',
  DASHBOARD_VIEW_REPORTS = 'dashboard:view_reports',
  DASHBOARD_EXPORT = 'dashboard:export',

  // FINANCE
  FINANCE_VIEW = 'finance:view',
  FINANCE_VIEW_REVENUE = 'finance:view_revenue',
  FINANCE_VIEW_TRANSACTIONS = 'finance:view_transactions',
  FINANCE_MANAGE_SUBSCRIPTIONS = 'finance:manage_subscriptions',
  FINANCE_MANAGE_REFUNDS = 'finance:manage_refunds',
  FINANCE_EXPORT = 'finance:export',

  // LEADS
  LEADS_VIEW = 'leads:view',
  LEADS_VIEW_ALL = 'leads:view_all',
  LEADS_EDIT = 'leads:edit',
  LEADS_DELETE = 'leads:delete',
  LEADS_EXPORT = 'leads:export',
  LEADS_VIEW_ANALYTICS = 'leads:view_analytics',

  // CONTENT
  CONTENT_VIEW = 'content:view',
  CONTENT_CREATE = 'content:create',
  CONTENT_EDIT = 'content:edit',
  CONTENT_DELETE = 'content:delete',
  CONTENT_PUBLISH = 'content:publish',
  CONTENT_MODERATE = 'content:moderate',

  // AUDIT LOGS
  AUDIT_VIEW = 'audit:view',
  AUDIT_VIEW_ALL = 'audit:view_all',
  AUDIT_EXPORT = 'audit:export',

  // SYSTEM MONITORING
  SYSTEM_VIEW = 'system:view',
  SYSTEM_VIEW_LOGS = 'system:view_logs',
  SYSTEM_MANAGE_HEALTH = 'system:manage_health',
  SYSTEM_MANAGE_CACHE = 'system:manage_cache',

  // SUPPORT
  SUPPORT_VIEW = 'support:view',
  SUPPORT_MANAGE = 'support:manage',
  SUPPORT_VIEW_TICKETS = 'support:view_tickets',
  SUPPORT_RESPOND = 'support:respond',

  // ANALYTICS
  ANALYTICS_VIEW = 'analytics:view',
  ANALYTICS_VIEW_USER = 'analytics:view_user',
  ANALYTICS_VIEW_FINANCE = 'analytics:view_finance',
  ANALYTICS_VIEW_CONTENT = 'analytics:view_content',
  ANALYTICS_EXPORT = 'analytics:export',

  // SETTINGS
  SETTINGS_VIEW = 'settings:view',
  SETTINGS_MANAGE = 'settings:manage',
  SETTINGS_MANAGE_SYSTEM = 'settings:manage_system',
}

export enum RoleEnum {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum PermissionTemplateEnum {
  USER_MANAGER = 'USER_MANAGER',
  LEAD_MANAGER = 'LEAD_MANAGER',
  FINANCE_VIEWER = 'FINANCE_VIEWER',
  CONTENT_MODERATOR = 'CONTENT_MODERATOR',
  SUPPORT_AGENT = 'SUPPORT_AGENT',
  ANALYTICS_VIEWER = 'ANALYTICS_VIEWER',
  SYSTEM_MONITOR = 'SYSTEM_MONITOR',
}

export interface UserPermissionsResponse {
  userId: string;
  role: RoleEnum;
  rolePermissions: PermissionEnum[];
  customPermissions: PermissionEnum[];
  allPermissions: PermissionEnum[];
  grantedBy?: string;
  grantedAt?: Date;
  notes?: string;
  expiresAt?: Date;
}

export interface AssignPermissionsDto {
  userId: string;
  permissions: PermissionEnum[];
  notes?: string;
  expiresAt?: string;
}

export interface RevokePermissionsDto {
  userId: string;
  permissions: PermissionEnum[];
}

export interface AssignRoleDto {
  userId: string;
  role: RoleEnum;
}

export interface ApplyPermissionTemplateDto {
  userId: string;
  template: PermissionTemplateEnum;
}

export interface BulkAssignPermissionsDto {
  userIds: string[];
  permissions: PermissionEnum[];
  notes?: string;
  expiresAt?: string;
}

export class PermissionService {
  /**
   * Get user's complete permission set
   */
  static async getUserPermissions(
    userId: string
  ): Promise<UriResponse<UserPermissionsResponse>> {
    const response: Awaited<AxiosResponse<UriResponse<UserPermissionsResponse>>> =
      await AdminHttpClient.getClient().get(
        `${BackendUrlEnum.BACKEND}/admin/permissions/user/${userId}`
      );
    return response.data;
  }

  /**
   * Check if user has a specific permission
   */
  static async checkUserPermission(
    userId: string,
    permission: PermissionEnum
  ): Promise<UriResponse<{ hasPermission: boolean }>> {
    const response: Awaited<AxiosResponse<UriResponse<{ hasPermission: boolean }>>> =
      await AdminHttpClient.getClient().get(
        `${BackendUrlEnum.BACKEND}/admin/permissions/user/${userId}/check/${permission}`
      );
    return response.data;
  }

  /**
   * Assign custom permissions to a user
   */
  static async assignPermissions(
    dto: AssignPermissionsDto
  ): Promise<UriResponse<UserPermissionsResponse>> {
    const response: Awaited<AxiosResponse<UriResponse<UserPermissionsResponse>>> =
      await AdminHttpClient.getClient().post(
        `${BackendUrlEnum.BACKEND}/admin/permissions/assign`,
        dto
      );
    return response.data;
  }

  /**
   * Revoke custom permissions from a user
   */
  static async revokePermissions(
    dto: RevokePermissionsDto
  ): Promise<UriResponse<UserPermissionsResponse>> {
    const response: Awaited<AxiosResponse<UriResponse<UserPermissionsResponse>>> =
      await AdminHttpClient.getClient().post(
        `${BackendUrlEnum.BACKEND}/admin/permissions/revoke`,
        dto
      );
    return response.data;
  }

  /**
   * Assign a role to a user
   */
  static async assignRole(
    dto: AssignRoleDto
  ): Promise<UriResponse<UserPermissionsResponse>> {
    const response: Awaited<AxiosResponse<UriResponse<UserPermissionsResponse>>> =
      await AdminHttpClient.getClient().put(
        `${BackendUrlEnum.BACKEND}/admin/permissions/role`,
        dto
      );
    return response.data;
  }

  /**
   * Apply a permission template to a user
   */
  static async applyPermissionTemplate(
    dto: ApplyPermissionTemplateDto
  ): Promise<UriResponse<UserPermissionsResponse>> {
    const response: Awaited<AxiosResponse<UriResponse<UserPermissionsResponse>>> =
      await AdminHttpClient.getClient().post(
        `${BackendUrlEnum.BACKEND}/admin/permissions/template`,
        dto
      );
    return response.data;
  }

  /**
   * Bulk assign permissions to multiple users
   */
  static async bulkAssignPermissions(
    dto: BulkAssignPermissionsDto
  ): Promise<UriResponse<UserPermissionsResponse[]>> {
    const response: Awaited<AxiosResponse<UriResponse<UserPermissionsResponse[]>>> =
      await AdminHttpClient.getClient().post(
        `${BackendUrlEnum.BACKEND}/admin/permissions/bulk-assign`,
        dto
      );
    return response.data;
  }

  /**
   * Clear all custom permissions from a user
   */
  static async clearCustomPermissions(
    userId: string
  ): Promise<UriResponse<UserPermissionsResponse>> {
    const response: Awaited<AxiosResponse<UriResponse<UserPermissionsResponse>>> =
      await AdminHttpClient.getClient().delete(
        `${BackendUrlEnum.BACKEND}/admin/permissions/user/${userId}/clear`
      );
    return response.data;
  }

  /**
   * Get all users with custom permissions
   */
  static async getAllUsersWithCustomPermissions(): Promise<
    UriResponse<UserPermissionsResponse[]>
  > {
    const response: Awaited<AxiosResponse<UriResponse<UserPermissionsResponse[]>>> =
      await AdminHttpClient.getClient().get(
        `${BackendUrlEnum.BACKEND}/admin/permissions/all-custom`
      );
    return response.data;
  }

  /**
   * Cleanup all expired permissions
   */
  static async cleanupExpiredPermissions(): Promise<UriResponse<{ count: number }>> {
    const response: Awaited<AxiosResponse<UriResponse<{ count: number }>>> =
      await AdminHttpClient.getClient().delete(
        `${BackendUrlEnum.BACKEND}/admin/permissions/cleanup-expired`
      );
    return response.data;
  }
}

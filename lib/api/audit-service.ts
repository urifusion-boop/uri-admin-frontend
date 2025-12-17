import { AxiosResponse } from 'axios';
import { AdminHttpClient } from '../http';
import { UriResponse } from './auth-service';

/**
 * Audit Log DTO
 */
export interface AuditLogDto {
  auditLogId?: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
  action: string;
  eventType: 'AUTH' | 'SECURITY' | 'USER_ACTION' | 'SYSTEM' | 'DATA_ACCESS' | 'API' | 'ADMIN_ACTION';
  status: 'SUCCESS' | 'FAILED' | 'WARNING' | 'PENDING';
  method?: string;
  endpoint?: string;
  ipAddress?: string;
  userAgent?: string;
  statusCode?: number;
  responseTime?: number;
  details?: any;
  metadata?: any;
  errorMessage?: string;
  errorStack?: string;
  isSuspicious?: boolean;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timestamp?: string;
  dateCreated?: string;
  dateModified?: string;
}

/**
 * Audit Analytics DTO
 */
export interface AuditAnalyticsDto {
  totalEvents: number;
  totalEventsChange: number;
  securityEvents: number;
  securityEventsChange: number;
  authAttempts: number;
  authAttemptsChange: number;
  alerts: number;
  alertsChange: number;
  eventsByType: {
    auth: number;
    security: number;
    userAction: number;
    system: number;
    dataAccess: number;
    api: number;
    adminAction: number;
  };
  eventsByStatus: {
    success: number;
    failed: number;
    warning: number;
    pending: number;
  };
  eventsByRiskLevel: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  topUsers: Array<{
    userId: string;
    userName: string;
    userEmail: string;
    eventCount: number;
  }>;
  topEndpoints: Array<{
    endpoint: string;
    count: number;
    avgResponseTime: number;
  }>;
  topIpAddresses: Array<{
    ipAddress: string;
    count: number;
    uniqueUsers: number;
  }>;
  suspiciousActivities: number;
  failedAuthAttempts: number;
  dataAccessEvents: number;
}

/**
 * Audit Event Trend DTO
 */
export interface AuditEventTrendDto {
  date: string;
  totalEvents: number;
  authEvents: number;
  securityEvents: number;
  userActionEvents: number;
  systemEvents: number;
  dataAccessEvents: number;
  apiEvents: number;
  adminActionEvents: number;
  successfulEvents: number;
  failedEvents: number;
  warningEvents: number;
}

/**
 * Audit Log Filter DTO
 */
export interface AuditLogFilterDto {
  page?: number;
  pageSize?: number;
  search?: string;
  userId?: string;
  eventType?: string[];
  status?: string[];
  riskLevel?: string[];
  isSuspicious?: boolean;
  ipAddress?: string;
  endpoint?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated Audit Log DTO
 */
export interface PaginatedAuditLogDto {
  logs: AuditLogDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Audit service for fetching audit log data
 */
export class AuditService {
  /**
   * Get audit analytics
   * GET /api/v1/admin/audit/analytics
   */
  static async getAuditAnalytics(): Promise<UriResponse<AuditAnalyticsDto>> {
    const response: Awaited<AxiosResponse<UriResponse<AuditAnalyticsDto>>> =
      await AdminHttpClient.getClient().get('/api/v1/admin/audit/analytics');
    return response.data;
  }

  /**
   * Get audit event trend
   * GET /api/v1/admin/audit/event-trend?days={days}
   */
  static async getAuditEventTrend(days: number = 30): Promise<UriResponse<AuditEventTrendDto[]>> {
    const response: Awaited<AxiosResponse<UriResponse<AuditEventTrendDto[]>>> =
      await AdminHttpClient.getClient().get(
        `/api/v1/admin/audit/event-trend?days=${days}`
      );
    return response.data;
  }

  /**
   * Get filtered audit logs
   * GET /api/v1/admin/audit/logs
   */
  static async getFilteredAuditLogs(filters: AuditLogFilterDto): Promise<UriResponse<PaginatedAuditLogDto>> {
    const params = new URLSearchParams();

    if (filters.page) params.append('page', filters.page.toString());
    if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.userId) params.append('userId', filters.userId);
    if (filters.eventType) filters.eventType.forEach(t => params.append('eventType', t));
    if (filters.status) filters.status.forEach(s => params.append('status', s));
    if (filters.riskLevel) filters.riskLevel.forEach(r => params.append('riskLevel', r));
    if (filters.isSuspicious !== undefined) params.append('isSuspicious', filters.isSuspicious.toString());
    if (filters.ipAddress) params.append('ipAddress', filters.ipAddress);
    if (filters.endpoint) params.append('endpoint', filters.endpoint);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    const response: Awaited<AxiosResponse<UriResponse<PaginatedAuditLogDto>>> =
      await AdminHttpClient.getClient().get(
        `/api/v1/admin/audit/logs?${params.toString()}`
      );
    return response.data;
  }

  /**
   * Get audit log by ID
   * GET /api/v1/admin/audit/logs/:auditLogId
   */
  static async getAuditLogById(auditLogId: string): Promise<UriResponse<AuditLogDto>> {
    const response: Awaited<AxiosResponse<UriResponse<AuditLogDto>>> =
      await AdminHttpClient.getClient().get(
        `/api/v1/admin/audit/logs/${auditLogId}`
      );
    return response.data;
  }

  /**
   * Delete old audit logs
   * DELETE /api/v1/admin/audit/logs/cleanup/:days
   */
  static async deleteOldAuditLogs(days: number): Promise<UriResponse<{ deletedCount: number }>> {
    const response: Awaited<AxiosResponse<UriResponse<{ deletedCount: number }>>> =
      await AdminHttpClient.getClient().delete(
        `/api/v1/admin/audit/logs/cleanup/${days}`
      );
    return response.data;
  }
}

import { AxiosResponse } from 'axios';
import { AdminHttpClient } from '../http';
import { UriResponse } from './auth-service';

export interface ExceptionLogDto {
  logId: string;
  userId: string;
  exceptionDate: string;
  method: string;
  url: string;
  status: number;
  exception: string;
  serviceType: string;
}

export interface ExceptionLogsResponse {
  logs: ExceptionLogDto[];
  total: number;
  page: number;
  pageSize: number;
}

export interface RecentActivityDto {
  activityId: string;
  userId: string;
  userName: string;
  userEmail: string;
  action: string;
  resourceType: string;
  timestamp: string;
  details?: string;
}

export interface SystemHealthDto {
  healthScore: number;
  status: 'healthy' | 'warning' | 'critical';
  errorRate: number;
  exceptionsLastHour: number;
  servicesStatus: {
    uriBackend: 'up' | 'down' | 'unknown';
    uriInsights: 'up' | 'down' | 'unknown';
    uriTaskManager: 'up' | 'down' | 'unknown';
    uriTransaction: 'up' | 'down' | 'unknown';
    mongoDB: 'up' | 'down' | 'unknown';
    adminFrontend: 'up' | 'down' | 'unknown';
    userFrontend: 'up' | 'down' | 'unknown';
  };
}

export class SystemService {
  static async getExceptionLogs(
    pageNumber: number = 1,
    pageSize: number = 50,
    serviceType?: string,
    userId?: string
  ): Promise<UriResponse<ExceptionLogsResponse>> {
    let url = `/api/v1/admin/system/exception-logs?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    if (serviceType) {
      url += `&serviceType=${encodeURIComponent(serviceType)}`;
    }
    if (userId) {
      url += `&userId=${encodeURIComponent(userId)}`;
    }
    const response: Awaited<AxiosResponse<UriResponse<ExceptionLogsResponse>>> =
      await AdminHttpClient.getClient().get(url);
    return response.data;
  }

  static async getRecentActivity(limit: number = 20): Promise<UriResponse<RecentActivityDto[]>> {
    const response: Awaited<AxiosResponse<UriResponse<RecentActivityDto[]>>> =
      await AdminHttpClient.getClient().get(`/api/v1/admin/system/recent-activity?limit=${limit}`);
    return response.data;
  }

  static async getSystemHealth(): Promise<UriResponse<SystemHealthDto>> {
    const response: Awaited<AxiosResponse<UriResponse<SystemHealthDto>>> =
      await AdminHttpClient.getClient().get('/api/v1/admin/system/health');
    return response.data;
  }

  static async getServicesMetrics(): Promise<UriResponse<any[]>> {
    const response: Awaited<AxiosResponse<UriResponse<any[]>>> =
      await AdminHttpClient.getClient().get('/api/v1/admin/system/services-metrics');
    return response.data;
  }
}

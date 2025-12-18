import { AxiosResponse } from 'axios';
import { AdminHttpClient } from '../http';
import { UriResponse } from './auth-service';
import { BackendUrlEnum } from '../constants/backend-urls';

/**
 * Dashboard Metrics DTO
 */
export interface DashboardMetricsDto {
  totalUsers: number;
  totalUsersChange: number;
  activeUsers: number;
  activeUsersChange: number;
  monthlyRecurringRevenue: number;
  mrrChange: number;
  mrrCurrency: string;
  leadsGeneratedToday: number;
  leadsGeneratedThisWeek: number;
  leadsGeneratedThisMonth: number;
  leadsChange: number;
  systemHealthScore: number;
  systemHealthStatus: 'healthy' | 'warning' | 'critical';
  userBreakdown: {
    creative: number;
    business: number;
    agency: number;
    admin: number;
  };
  subscriptionBreakdown: {
    active: number;
    inactive: number;
    trial: number;
    expired: number;
  };
}

/**
 * Chart Data Point DTO
 */
export interface ChartDataPointDto {
  date: string;
  value: number;
  label?: string;
}

/**
 * Chart Data DTO
 */
export interface ChartDataDto {
  data: ChartDataPointDto[];
  total?: number;
  average?: number;
  peak?: number;
  lowest?: number;
}

/**
 * Alert DTO
 */
export interface AlertDto {
  id: string;
  type: 'error' | 'warning' | 'info';
  severity: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  source: string;
  count?: number;
  timestamp: Date;
  actionRequired: boolean;
}

/**
 * Dashboard service for fetching dashboard metrics and analytics
 */
export class DashboardService {
  /**
   * Get dashboard overview metrics
   * GET /api/v1/admin/dashboard/metrics
   */
  static async getOverviewMetrics(): Promise<UriResponse<DashboardMetricsDto>> {
    const response: Awaited<AxiosResponse<UriResponse<DashboardMetricsDto>>> =
      await AdminHttpClient.getClient().get(`${BackendUrlEnum.BACKEND}/admin/dashboard/metrics`);
    return response.data;
  }

  /**
   * Get user growth trend chart data
   * GET /api/v1/admin/dashboard/user-growth?days={days}
   */
  static async getUserGrowthTrend(days: number = 30): Promise<UriResponse<ChartDataDto>> {
    const response: Awaited<AxiosResponse<UriResponse<ChartDataDto>>> =
      await AdminHttpClient.getClient().get(
        `${BackendUrlEnum.BACKEND}/admin/dashboard/user-growth?days=${days}`
      );
    return response.data;
  }

  /**
   * Get dashboard alerts
   * GET /api/v1/admin/dashboard/alerts
   */
  static async getDashboardAlerts(): Promise<UriResponse<AlertDto[]>> {
    const response: Awaited<AxiosResponse<UriResponse<AlertDto[]>>> =
      await AdminHttpClient.getClient().get(`${BackendUrlEnum.BACKEND}/admin/dashboard/alerts`);
    return response.data;
  }

  /**
   * Get system health
   * GET /api/v1/admin/dashboard/system-health
   */
  static async getSystemHealth(): Promise<UriResponse<unknown>> {
    const response: Awaited<AxiosResponse<UriResponse<unknown>>> =
      await AdminHttpClient.getClient().get(`${BackendUrlEnum.BACKEND}/admin/dashboard/system-health`);
    return response.data;
  }
}

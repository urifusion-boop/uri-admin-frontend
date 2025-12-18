import { AxiosResponse } from 'axios';
import { AdminHttpClient } from '../http';
import { UriResponse } from './auth-service';
import { BackendUrlEnum } from '../constants/backend-urls';

/**
 * Admin Lead Overview Response
 */
export interface AdminLeadOverviewDto {
  total_leads: number;
  status_breakdown: {
    new: number;
    contacted: number;
    qualified: number;
    unqualified: number;
    converted: number;
  };
  platform_breakdown: Record<string, number>;
  top_users: Array<{
    user_id: string;
    email: string;
    name: string;
    lead_count: number;
  }>;
  conversion_metrics: {
    total_leads: number;
    qualified_leads: number;
    converted_leads: number;
    qualification_rate: number;
    conversion_rate: number;
  };
  date_range: {
    start: string;
    end: string;
    filter: string;
  };
}

/**
 * User-specific Lead Analytics
 */
export interface UserLeadAnalyticsDto {
  new_leads: number;
  contacted: number;
  qualified: number;
  unqualified: number;
  converted: number;
  lead_sources_breakdown: Record<string, number>;
  leads_by_industry: Record<string, number>;
  interest_by_platform: Record<string, Record<string, number>>;
}

/**
 * Recent Lead DTO
 */
export interface RecentLeadDto {
  lead_id: string;
  name: string;
  email?: string;
  platform: string;
  status: string;
  interest_level: string;
  intent_score?: number;
  relevance_score?: number;
  created_date: string;
  assigned_to?: string;
  user_email?: string;
  user_name?: string;
}

/**
 * Recent Leads Response with Pagination
 */
export interface RecentLeadsResponse {
  leads: RecentLeadDto[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

/**
 * Top User DTO
 */
export interface TopUserDto {
  user_id: string;
  email: string;
  name: string;
  total_leads: number;
  qualified_leads: number;
  converted_leads: number;
  conversion_rate: number;
}

/**
 * Lead Trends DTO
 */
export interface LeadTrendDto {
  date: string;
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  converted: number;
}

/**
 * Conversion Funnel DTO
 */
export interface ConversionFunnelDto {
  stages: Array<{
    stage: string;
    count: number;
    percentage: number;
    conversion_from_previous?: number;
  }>;
  total_leads: number;
}

/**
 * Platform Performance DTO
 */
export interface PlatformPerformanceDto {
  platform: string;
  total_leads: number;
  avg_intent_score: number;
  avg_relevance_score: number;
  conversion_rate: number;
}

/**
 * Admin Leads Service
 * Professional admin analytics endpoints for lead management
 */
export class LeadsService {
  /**
   * Get comprehensive lead overview across all users
   * GET /admin/leads/overview
   */
  static async getLeadOverview(
    dateFilter: string = 'LAST_1_MONTH'
  ): Promise<UriResponse<AdminLeadOverviewDto>> {
    const response: Awaited<AxiosResponse<UriResponse<AdminLeadOverviewDto>>> =
      await AdminHttpClient.getClient().get(
        `${BackendUrlEnum.INSIGHTS}/admin/leads/overview?date_filter=${dateFilter}`
      );
    return response.data;
  }

  /**
   * Get detailed analytics for a specific user
   * GET /admin/leads/by-user/{user_id}
   */
  static async getUserLeadAnalytics(
    userId: string,
    dateFilter: string = 'LAST_1_MONTH'
  ): Promise<UriResponse<UserLeadAnalyticsDto>> {
    const response: Awaited<AxiosResponse<UriResponse<UserLeadAnalyticsDto>>> =
      await AdminHttpClient.getClient().get(
        `${BackendUrlEnum.INSIGHTS}/admin/leads/by-user/${userId}?date_filter=${dateFilter}`
      );
    return response.data;
  }

  /**
   * Get recent leads across all users with filters
   * GET /admin/leads/recent
   */
  static async getRecentLeads(
    limit: number = 50,
    skip: number = 0,
    status?: string,
    platform?: string,
    userId?: string
  ): Promise<UriResponse<RecentLeadsResponse>> {
    let url = `${BackendUrlEnum.INSIGHTS}/admin/leads/recent?limit=${limit}&skip=${skip}`;
    if (status) url += `&status=${encodeURIComponent(status)}`;
    if (platform) url += `&platform=${encodeURIComponent(platform)}`;
    if (userId) url += `&user_id=${encodeURIComponent(userId)}`;

    const response: Awaited<AxiosResponse<UriResponse<RecentLeadsResponse>>> =
      await AdminHttpClient.getClient().get(url);
    return response.data;
  }

  /**
   * Get top users by lead generation metrics
   * GET /admin/leads/top-users
   */
  static async getTopUsers(
    dateFilter: string = 'LAST_1_MONTH',
    limit: number = 10
  ): Promise<UriResponse<{ users: TopUserDto[]; count: number }>> {
    const response: Awaited<AxiosResponse<UriResponse<{ users: TopUserDto[]; count: number }>>> =
      await AdminHttpClient.getClient().get(
        `${BackendUrlEnum.INSIGHTS}/admin/leads/top-users?date_filter=${dateFilter}&limit=${limit}`
      );
    return response.data;
  }

  /**
   * Get lead generation trends over time
   * GET /admin/leads/trends
   */
  static async getLeadTrends(
    days: number = 30
  ): Promise<UriResponse<{ trends: LeadTrendDto[]; period: any }>> {
    const response: Awaited<AxiosResponse<UriResponse<{ trends: LeadTrendDto[]; period: any }>>> =
      await AdminHttpClient.getClient().get(
        `${BackendUrlEnum.INSIGHTS}/admin/leads/trends?days=${days}`
      );
    return response.data;
  }

  /**
   * Get conversion funnel analytics
   * GET /admin/leads/conversion-funnel
   */
  static async getConversionFunnel(
    dateFilter: string = 'LAST_1_MONTH',
    userId?: string
  ): Promise<UriResponse<ConversionFunnelDto>> {
    let url = `${BackendUrlEnum.INSIGHTS}/admin/leads/conversion-funnel?date_filter=${dateFilter}`;
    if (userId) url += `&user_id=${encodeURIComponent(userId)}`;

    const response: Awaited<AxiosResponse<UriResponse<ConversionFunnelDto>>> =
      await AdminHttpClient.getClient().get(url);
    return response.data;
  }

  /**
   * Get platform performance metrics
   * GET /admin/leads/platform-performance
   */
  static async getPlatformPerformance(
    dateFilter: string = 'LAST_1_MONTH'
  ): Promise<UriResponse<{ platforms: PlatformPerformanceDto[]; date_range: any }>> {
    const response: Awaited<
      AxiosResponse<UriResponse<{ platforms: PlatformPerformanceDto[]; date_range: any }>>
    > = await AdminHttpClient.getClient().get(
      `${BackendUrlEnum.INSIGHTS}/admin/leads/platform-performance?date_filter=${dateFilter}`
    );
    return response.data;
  }
}


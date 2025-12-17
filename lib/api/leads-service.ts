import { AxiosResponse } from 'axios';
import { AdminHttpClient } from '../http';
import { UriResponse } from './auth-service';

export interface LeadAnalyticsDto {
  new_leads: number;
  contacted: number;
  qualified: number;
  unqualified: number;
  converted: number;
  lead_sources_breakdown: Record<string, number>;
  leads_by_industry: Record<string, number>;
  interest_by_platform: Record<string, Record<string, number>>;
}

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
}

export interface LeadsByFiltersResponse {
  leads: RecentLeadDto[];
  total: number;
  page: number;
  page_size: number;
}

export class LeadsService {
  static async getLeadAnalytics(
    userId: string,
    dateFilter: string = 'LAST_30_DAYS',
    leadType?: string
  ): Promise<UriResponse<LeadAnalyticsDto>> {
    let url = `/uri-insights/lead/analytics?user_id=${encodeURIComponent(userId)}&date_filter=${encodeURIComponent(
      dateFilter
    )}`;
    if (leadType) {
      url += `&lead_type=${encodeURIComponent(leadType)}`;
    }
    const response: Awaited<AxiosResponse<UriResponse<LeadAnalyticsDto>>> =
      await AdminHttpClient.getClient().get(url);
    return response.data;
  }

  static async getRecentLeads(
    userId: string,
    limit: number = 50,
    skip: number = 0,
    status?: string
  ): Promise<UriResponse<LeadsByFiltersResponse>> {
    let url = `/uri-insights/lead/getByFilters?user_id=${encodeURIComponent(userId)}&limit=${limit}&skip=${skip}`;
    if (status) {
      url += `&status=${encodeURIComponent(status)}`;
    }
    const response: Awaited<AxiosResponse<UriResponse<LeadsByFiltersResponse>>> =
      await AdminHttpClient.getClient().get(url);
    return response.data;
  }
}


'use client';

import { useQuery } from '@tanstack/react-query';
import {
  LeadsService,
  AdminLeadOverviewDto,
  UserLeadAnalyticsDto,
  RecentLeadsResponse,
  TopUserDto,
  LeadTrendDto,
  ConversionFunnelDto,
  PlatformPerformanceDto
} from '@/lib/api/leads-service';

/**
 * Hook for admin lead overview analytics
 * Gets aggregated data across all users
 */
export function useLeadOverview(dateFilter: string = 'LAST_1_MONTH') {
  return useQuery<AdminLeadOverviewDto | undefined>({
    queryKey: ['leads', 'overview', dateFilter],
    queryFn: async () => {
      const response = await LeadsService.getLeadOverview(dateFilter);
      if (!response.status) {
        throw new Error(response.responseMessage || 'Failed to fetch lead overview');
      }
      return response.responseData;
    },
    refetchInterval: 120000,
    staleTime: 60000,
  });
}

/**
 * Hook for user-specific lead analytics
 */
export function useUserLeadAnalytics(userId?: string, dateFilter: string = 'LAST_1_MONTH') {
  return useQuery<UserLeadAnalyticsDto | undefined>({
    queryKey: ['leads', 'user-analytics', userId, dateFilter],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) return undefined;
      const response = await LeadsService.getUserLeadAnalytics(userId, dateFilter);
      if (!response.status) {
        throw new Error(response.responseMessage || 'Failed to fetch user lead analytics');
      }
      return response.responseData;
    },
    refetchInterval: 120000,
    staleTime: 60000,
  });
}

/**
 * Hook for recent leads across all users with filters
 */
export function useRecentLeads(
  limit: number = 50,
  skip: number = 0,
  status?: string,
  platform?: string,
  userId?: string
) {
  return useQuery<RecentLeadsResponse | undefined>({
    queryKey: ['leads', 'recent', limit, skip, status, platform, userId],
    queryFn: async () => {
      const response = await LeadsService.getRecentLeads(limit, skip, status, platform, userId);
      if (!response.status) {
        throw new Error(response.responseMessage || 'Failed to fetch recent leads');
      }
      return response.responseData;
    },
    refetchInterval: 60000,
    staleTime: 30000,
  });
}

/**
 * Hook for top users by lead generation
 */
export function useTopUsers(dateFilter: string = 'LAST_1_MONTH', limit: number = 10) {
  return useQuery<TopUserDto[] | undefined>({
    queryKey: ['leads', 'top-users', dateFilter, limit],
    queryFn: async () => {
      const response = await LeadsService.getTopUsers(dateFilter, limit);
      if (!response.status) {
        throw new Error(response.responseMessage || 'Failed to fetch top users');
      }
      return response.responseData.users;
    },
    refetchInterval: 120000,
    staleTime: 60000,
  });
}

/**
 * Hook for lead generation trends
 */
export function useLeadTrends(days: number = 30) {
  return useQuery<LeadTrendDto[] | undefined>({
    queryKey: ['leads', 'trends', days],
    queryFn: async () => {
      const response = await LeadsService.getLeadTrends(days);
      if (!response.status) {
        throw new Error(response.responseMessage || 'Failed to fetch lead trends');
      }
      return response.responseData.trends;
    },
    refetchInterval: 300000, // 5 minutes
    staleTime: 120000,
  });
}

/**
 * Hook for conversion funnel analytics
 */
export function useConversionFunnel(dateFilter: string = 'LAST_1_MONTH', userId?: string) {
  return useQuery<ConversionFunnelDto | undefined>({
    queryKey: ['leads', 'conversion-funnel', dateFilter, userId],
    queryFn: async () => {
      const response = await LeadsService.getConversionFunnel(dateFilter, userId);
      if (!response.status) {
        throw new Error(response.responseMessage || 'Failed to fetch conversion funnel');
      }
      return response.responseData;
    },
    refetchInterval: 120000,
    staleTime: 60000,
  });
}

/**
 * Hook for platform performance metrics
 */
export function usePlatformPerformance(dateFilter: string = 'LAST_1_MONTH') {
  return useQuery<PlatformPerformanceDto[] | undefined>({
    queryKey: ['leads', 'platform-performance', dateFilter],
    queryFn: async () => {
      const response = await LeadsService.getPlatformPerformance(dateFilter);
      if (!response.status) {
        throw new Error(response.responseMessage || 'Failed to fetch platform performance');
      }
      return response.responseData.platforms;
    },
    refetchInterval: 120000,
    staleTime: 60000,
  });
}

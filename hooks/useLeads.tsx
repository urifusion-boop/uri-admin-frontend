'use client';

import { useQuery } from '@tanstack/react-query';
import { LeadsService, LeadAnalyticsDto, LeadsByFiltersResponse } from '@/lib/api/leads-service';
import { useAuth } from '@/hooks/useAuth';

export function useLeadAnalytics(dateFilter: string = 'LAST_30_DAYS', leadType?: string) {
  const { user } = useAuth();

  return useQuery<LeadAnalyticsDto | undefined>({
    queryKey: ['leads', 'analytics', user?.userId, dateFilter, leadType],
    enabled: !!user?.userId,
    queryFn: async () => {
      if (!user?.userId) return undefined;
      const response = await LeadsService.getLeadAnalytics(user.userId, dateFilter, leadType);
      if (!response.status) {
        throw new Error(response.responseMessage || 'Failed to fetch lead analytics');
      }
      return response.responseData;
    },
    refetchInterval: 120000,
    staleTime: 60000,
  });
}

export function useRecentLeads(limit: number = 50, skip: number = 0, status?: string) {
  const { user } = useAuth();

  return useQuery<LeadsByFiltersResponse | undefined>({
    queryKey: ['leads', 'recent', user?.userId, limit, skip, status],
    enabled: !!user?.userId,
    queryFn: async () => {
      if (!user?.userId) return undefined;
      const response = await LeadsService.getRecentLeads(user.userId, limit, skip, status);
      if (!response.status) {
        throw new Error(response.responseMessage || 'Failed to fetch recent leads');
      }
      return response.responseData;
    },
    refetchInterval: 60000,
    staleTime: 30000,
  });
}

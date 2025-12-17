'use client';

import { useQuery } from '@tanstack/react-query';
import { SystemService, ExceptionLogsResponse, RecentActivityDto, SystemHealthDto } from '@/lib/api/system-service';

export function useExceptionLogs(
  pageNumber: number = 1,
  pageSize: number = 50,
  serviceType?: string,
  userId?: string
) {
  return useQuery<ExceptionLogsResponse | undefined>({
    queryKey: ['system', 'exception-logs', pageNumber, pageSize, serviceType, userId],
    queryFn: async () => {
      const response = await SystemService.getExceptionLogs(pageNumber, pageSize, serviceType, userId);
      if (!response.status) {
        throw new Error(response.responseMessage || 'Failed to fetch exception logs');
      }
      return response.responseData;
    },
    refetchInterval: 60000,
    staleTime: 30000,
  });
}

export function useRecentActivity(limit: number = 20) {
  return useQuery<RecentActivityDto[] | undefined>({
    queryKey: ['system', 'recent-activity', limit],
    queryFn: async () => {
      const response = await SystemService.getRecentActivity(limit);
      if (!response.status) {
        throw new Error(response.responseMessage || 'Failed to fetch recent activity');
      }
      return response.responseData;
    },
    refetchInterval: 30000,
    staleTime: 15000,
  });
}

export function useSystemHealth() {
  return useQuery<SystemHealthDto | undefined>({
    queryKey: ['system', 'health'],
    queryFn: async () => {
      const response = await SystemService.getSystemHealth();
      if (!response.status) {
        throw new Error(response.responseMessage || 'Failed to fetch system health');
      }
      return response.responseData;
    },
    refetchInterval: 30000,
    staleTime: 15000,
  });
}

export function useServicesMetrics() {
  return useQuery<any[] | undefined>({
    queryKey: ['system', 'services-metrics'],
    queryFn: async () => {
      const response = await SystemService.getServicesMetrics();
      if (!response.status) {
        throw new Error(response.responseMessage || 'Failed to fetch services metrics');
      }
      return response.responseData;
    },
    refetchInterval: 60000,
    staleTime: 30000,
  });
}

'use client';

import { useQuery } from '@tanstack/react-query';
import { DashboardService } from '@/lib/api/dashboard-service';

/**
 * Hook to fetch dashboard overview metrics
 */
export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['dashboard', 'metrics'],
    queryFn: async () => {
      const response = await DashboardService.getOverviewMetrics();
      if (!response.status) {
        throw new Error(response.responseMessage || 'Failed to fetch dashboard metrics');
      }
      return response.responseData;
    },
    refetchInterval: 60000, // Refetch every 60 seconds
    staleTime: 30000, // Consider data stale after 30 seconds
  });
}

/**
 * Hook to fetch user growth trend chart data
 */
export function useUserGrowthTrend(days: number = 30) {
  return useQuery({
    queryKey: ['dashboard', 'user-growth', days],
    queryFn: async () => {
      const response = await DashboardService.getUserGrowthTrend(days);
      if (!response.status) {
        throw new Error(response.responseMessage || 'Failed to fetch user growth trend');
      }
      return response.responseData;
    },
    refetchInterval: 300000, // Refetch every 5 minutes
    staleTime: 120000, // Consider data stale after 2 minutes
  });
}

/**
 * Hook to fetch dashboard alerts
 */
export function useDashboardAlerts() {
  return useQuery({
    queryKey: ['dashboard', 'alerts'],
    queryFn: async () => {
      const response = await DashboardService.getDashboardAlerts();
      if (!response.status) {
        throw new Error(response.responseMessage || 'Failed to fetch dashboard alerts');
      }
      return response.responseData;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 15000, // Consider data stale after 15 seconds
  });
}

/**
 * Hook to fetch system health
 */
export function useSystemHealth() {
  return useQuery({
    queryKey: ['dashboard', 'system-health'],
    queryFn: async () => {
      const response = await DashboardService.getSystemHealth();
      if (!response.status) {
        throw new Error(response.responseMessage || 'Failed to fetch system health');
      }
      return response.responseData;
    },
    refetchInterval: 60000, // Refetch every 60 seconds
    staleTime: 30000, // Consider data stale after 30 seconds
  });
}

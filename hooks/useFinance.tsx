'use client';

import { useQuery } from '@tanstack/react-query';
import { FinanceService } from '@/lib/api/finance-service';

/**
 * Hook to fetch finance overview
 */
export function useFinanceOverview() {
  return useQuery({
    queryKey: ['finance', 'overview'],
    queryFn: async () => {
      const response = await FinanceService.getFinanceOverview();
      if (!response.status) {
        throw new Error(response.responseMessage || 'Failed to fetch finance overview');
      }
      return response.responseData;
    },
    refetchInterval: 120000, // Refetch every 2 minutes
    staleTime: 60000, // Consider data stale after 1 minute
  });
}

/**
 * Hook to fetch revenue trend
 */
export function useRevenueTrend(days: number = 30) {
  return useQuery({
    queryKey: ['finance', 'revenue-trend', days],
    queryFn: async () => {
      const response = await FinanceService.getRevenueTrend(days);
      if (!response.status) {
        throw new Error(response.responseMessage || 'Failed to fetch revenue trend');
      }
      return response.responseData;
    },
    refetchInterval: 300000, // Refetch every 5 minutes
    staleTime: 120000, // Consider data stale after 2 minutes
  });
}

/**
 * Hook to fetch transaction volume
 */
export function useTransactionVolume() {
  return useQuery({
    queryKey: ['finance', 'transaction-volume'],
    queryFn: async () => {
      const response = await FinanceService.getTransactionVolume();
      if (!response.status) {
        throw new Error(response.responseMessage || 'Failed to fetch transaction volume');
      }
      return response.responseData;
    },
    refetchInterval: 300000, // Refetch every 5 minutes
    staleTime: 120000, // Consider data stale after 2 minutes
  });
}

/**
 * Hook to fetch top revenue plans
 */
export function useTopRevenuePlans(limit: number = 5) {
  return useQuery({
    queryKey: ['finance', 'top-revenue-plans', limit],
    queryFn: async () => {
      const response = await FinanceService.getTopRevenuePlans(limit);
      if (!response.status) {
        throw new Error(response.responseMessage || 'Failed to fetch top revenue plans');
      }
      return response.responseData;
    },
    refetchInterval: 300000, // Refetch every 5 minutes
    staleTime: 120000, // Consider data stale after 2 minutes
  });
}

/**
 * Hook to fetch recent transactions
 */
export function useRecentTransactions(limit: number = 10) {
  return useQuery({
    queryKey: ['finance', 'recent-transactions', limit],
    queryFn: async () => {
      const response = await FinanceService.getRecentTransactions(limit);
      if (!response.status) {
        throw new Error(response.responseMessage || 'Failed to fetch recent transactions');
      }
      return response.responseData;
    },
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Consider data stale after 30 seconds
  });
}

/**
 * Hook to fetch failed payments
 */
export function useFailedPayments() {
  return useQuery({
    queryKey: ['finance', 'failed-payments'],
    queryFn: async () => {
      const response = await FinanceService.getFailedPayments();
      if (!response.status) {
        throw new Error(response.responseMessage || 'Failed to fetch failed payments');
      }
      return response.responseData;
    },
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Consider data stale after 30 seconds
  });
}

/**
 * Hook to fetch subscriptions expiring soon
 */
export function useSubscriptionsExpiringSoon(days: number = 7) {
  return useQuery({
    queryKey: ['finance', 'subscriptions-expiring-soon', days],
    queryFn: async () => {
      const response = await FinanceService.getSubscriptionsExpiringSoon(days);
      if (!response.status) {
        throw new Error(response.responseMessage || 'Failed to fetch subscriptions expiring soon');
      }
      return response.responseData;
    },
    refetchInterval: 300000, // Refetch every 5 minutes
    staleTime: 120000, // Consider data stale after 2 minutes
  });
}

/**
 * Hook to fetch trial conversion funnel
 */
export function useTrialConversionFunnel() {
  return useQuery({
    queryKey: ['finance', 'trial-conversion-funnel'],
    queryFn: async () => {
      const response = await FinanceService.getTrialConversionFunnel();
      if (!response.status) {
        throw new Error(response.responseMessage || 'Failed to fetch trial conversion funnel');
      }
      return response.responseData;
    },
    refetchInterval: 300000, // Refetch every 5 minutes
    staleTime: 120000, // Consider data stale after 2 minutes
  });
}

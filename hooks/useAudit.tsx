'use client';

import { useQuery } from '@tanstack/react-query';
import { AuditService, AuditLogFilterDto } from '@/lib/api/audit-service';

/**
 * Hook to fetch audit analytics
 */
export function useAuditAnalytics() {
  return useQuery({
    queryKey: ['audit', 'analytics'],
    queryFn: async () => {
      console.log('[useAuditAnalytics] Fetching audit analytics');
      const response = await AuditService.getAuditAnalytics();
      console.log('[useAuditAnalytics] Response:', response);
      if (!response.status) {
        console.error('[useAuditAnalytics] API returned status false:', response.responseMessage);
        throw new Error(response.responseMessage || 'Failed to fetch audit analytics');
      }
      console.log('[useAuditAnalytics] Returning data:', response.responseData);
      return response.responseData;
    },
    refetchInterval: 120000, // Refetch every 2 minutes
    staleTime: 60000, // Consider data stale after 1 minute
  });
}

/**
 * Hook to fetch audit event trend
 */
export function useAuditEventTrend(days: number = 30) {
  return useQuery({
    queryKey: ['audit', 'event-trend', days],
    queryFn: async () => {
      console.log('[useAuditEventTrend] Fetching event trend for', days, 'days');
      const response = await AuditService.getAuditEventTrend(days);
      console.log('[useAuditEventTrend] Response:', response);
      if (!response.status) {
        console.error('[useAuditEventTrend] API returned status false:', response.responseMessage);
        throw new Error(response.responseMessage || 'Failed to fetch audit event trend');
      }
      console.log('[useAuditEventTrend] Returning data:', response.responseData);
      return response.responseData;
    },
    refetchInterval: 300000, // Refetch every 5 minutes
    staleTime: 120000, // Consider data stale after 2 minutes
  });
}

/**
 * Hook to fetch filtered audit logs
 */
export function useAuditLogs(filters: AuditLogFilterDto) {
  return useQuery({
    queryKey: ['audit', 'logs', filters],
    queryFn: async () => {
      console.log('[useAuditLogs] Fetching with filters:', filters);
      const response = await AuditService.getFilteredAuditLogs(filters);
      console.log('[useAuditLogs] Response:', response);
      if (!response.status) {
        console.error('[useAuditLogs] API returned status false:', response.responseMessage);
        throw new Error(response.responseMessage || 'Failed to fetch audit logs');
      }
      console.log('[useAuditLogs] Returning data:', response.responseData);
      return response.responseData;
    },
    staleTime: 30000, // Consider data stale after 30 seconds
    refetchOnWindowFocus: true, // Refetch when user returns to tab
  });
}

/**
 * Hook to fetch single audit log by ID
 */
export function useAuditLog(auditLogId: string) {
  return useQuery({
    queryKey: ['audit', 'log', auditLogId],
    queryFn: async () => {
      console.log('[useAuditLog] Fetching audit log:', auditLogId);
      const response = await AuditService.getAuditLogById(auditLogId);
      console.log('[useAuditLog] Response:', response);
      if (!response.status) {
        console.error('[useAuditLog] API returned status false:', response.responseMessage);
        throw new Error(response.responseMessage || 'Failed to fetch audit log');
      }
      console.log('[useAuditLog] Returning data:', response.responseData);
      return response.responseData;
    },
    enabled: !!auditLogId, // Only fetch if auditLogId is provided
    staleTime: 60000, // Consider data stale after 1 minute
  });
}

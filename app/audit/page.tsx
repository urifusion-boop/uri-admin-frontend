'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useAuditAnalytics } from '@/hooks/useAudit';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { MetricCard } from '@/components/dashboard/overview/cards';
import { AuditLogsTable } from '@/components/dashboard/audit/tables';
import { Loader2, Shield, Eye, Lock, AlertTriangle } from 'lucide-react';

export default function AuditPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { data: analytics, isLoading: analyticsLoading } = useAuditAnalytics();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Audit Logs</h1>
        <p className="text-muted-foreground mt-2">
          Track system activities, security events, and user actions
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Events"
          value={analyticsLoading ? '...' : analytics?.totalEvents.toLocaleString() || '0'}
          change={analytics?.totalEventsChange || 0}
          icon={Eye}
          iconColor="#3b82f6"
          index={0}
        />
        <MetricCard
          title="Security Events"
          value={analyticsLoading ? '...' : analytics?.securityEvents.toLocaleString() || '0'}
          change={analytics?.securityEventsChange || 0}
          icon={Shield}
          iconColor="#10b981"
          index={1}
        />
        <MetricCard
          title="Auth Attempts"
          value={analyticsLoading ? '...' : analytics?.authAttempts.toLocaleString() || '0'}
          change={analytics?.authAttemptsChange || 0}
          icon={Lock}
          iconColor="#CD1B78"
          index={2}
        />
        <MetricCard
          title="Alerts"
          value={analyticsLoading ? '...' : analytics?.alerts.toLocaleString() || '0'}
          change={analytics?.alertsChange || 0}
          icon={AlertTriangle}
          iconColor="#f59e0b"
          index={3}
        />
      </div>

      {/* Audit Logs Table */}
      <AuditLogsTable />
    </AdminLayout>
  );
}

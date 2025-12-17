'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { MetricCard } from '@/components/dashboard/overview/cards';
import { ServiceStatusCard } from '@/components/dashboard/system/cards';
import { ExceptionLogsTable } from '@/components/dashboard/system/tables';
import { useSystemHealth, useExceptionLogs } from '@/hooks/useSystem';
import { Loader2, Server, AlertCircle, Database, Activity } from 'lucide-react';

export default function SystemPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { data: healthData, isLoading: healthLoading } = useSystemHealth();
  const { data: exceptionsData, isLoading: exceptionsLoading } = useExceptionLogs(1, 100);

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

  // Calculate metrics from real data
  const healthScore = healthData?.healthScore ?? 0;
  const exceptionsLastHour = healthData?.exceptionsLastHour ?? 0;
  const totalExceptions = exceptionsData?.total ?? 0;

  // Determine status color
  const statusColor = healthScore >= 95 ? '#10b981' : healthScore >= 85 ? '#f59e0b' : '#ef4444';
  const statusText = healthScore >= 95 ? 'Healthy' : healthScore >= 85 ? 'Warning' : 'Critical';

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">System Monitoring</h1>
        <p className="text-muted-foreground mt-2">
          Monitor system health, performance, and API status
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="System Health"
          value={healthLoading ? '...' : statusText}
          icon={Server}
          iconColor={statusColor}
          index={0}
        />
        <MetricCard
          title="Health Score"
          value={healthLoading ? '...' : `${healthScore}%`}
          icon={Activity}
          iconColor={statusColor}
          index={1}
        />
        <MetricCard
          title="Exceptions/Hour"
          value={healthLoading ? '...' : exceptionsLastHour.toString()}
          icon={AlertCircle}
          iconColor={exceptionsLastHour > 10 ? '#ef4444' : exceptionsLastHour > 5 ? '#f59e0b' : '#10b981'}
          index={2}
        />
        <MetricCard
          title="Total Exceptions"
          value={exceptionsLoading ? '...' : totalExceptions.toLocaleString()}
          icon={Database}
          iconColor="#CD1B78"
          index={3}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <ServiceStatusCard />
        <ExceptionLogsTable />
      </div>
    </AdminLayout>
  );
}

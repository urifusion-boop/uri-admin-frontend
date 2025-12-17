'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { MetricCard } from '@/components/dashboard/overview/cards';
import { AuditLogsTable } from '@/components/dashboard/audit/tables';
import { Loader2, Shield, Eye, Lock, AlertTriangle } from 'lucide-react';

export default function AuditPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

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
          value="45,234"
          change={8.2}
          icon={Eye}
          iconColor="#3b82f6"
          index={0}
        />
        <MetricCard
          title="Security Events"
          value="324"
          change={-12.5}
          icon={Shield}
          iconColor="#10b981"
          index={1}
        />
        <MetricCard
          title="Auth Attempts"
          value="12,543"
          change={5.3}
          icon={Lock}
          iconColor="#CD1B78"
          index={2}
        />
        <MetricCard
          title="Alerts"
          value="8"
          change={-3.2}
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

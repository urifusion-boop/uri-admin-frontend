'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { MetricCard } from '@/components/dashboard/overview/cards';
import { ServiceStatusCard } from '@/components/dashboard/system/cards';
import { ExceptionLogsTable } from '@/components/dashboard/system/tables';
import { Loader2, Server, Cpu, Database, Activity } from 'lucide-react';

export default function SystemPage() {
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
        <h1 className="text-3xl font-bold text-foreground">System Monitoring</h1>
        <p className="text-muted-foreground mt-2">
          Monitor system health, performance, and API status
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Server Status"
          value="Healthy"
          icon={Server}
          iconColor="#10b981"
          index={0}
        />
        <MetricCard
          title="CPU Usage"
          value="42%"
          icon={Cpu}
          iconColor="#3b82f6"
          index={1}
        />
        <MetricCard
          title="Memory Usage"
          value="68%"
          icon={Database}
          iconColor="#CD1B78"
          index={2}
        />
        <MetricCard
          title="Uptime"
          value="99.9%"
          icon={Activity}
          iconColor="#10b981"
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

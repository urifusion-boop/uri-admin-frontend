'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { MetricCard } from '@/components/dashboard/overview/cards';
import { LeadStatusChart, LeadsByPlatformChart } from '@/components/dashboard/leads/charts';
import { RecentLeadsTable } from '@/components/dashboard/leads/tables';
import { Loader2, Target, TrendingUp, CheckCircle, Clock } from 'lucide-react';

export default function LeadsPage() {
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
        <h1 className="text-3xl font-bold text-foreground">Leads Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Track and manage lead generation and conversion
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Leads"
          value="326"
          change={18.3}
          icon={Target}
          iconColor="#CD1B78"
          index={0}
        />
        <MetricCard
          title="Qualified Leads"
          value="67"
          change={8.2}
          icon={CheckCircle}
          iconColor="#10b981"
          index={1}
        />
        <MetricCard
          title="Conversion Rate"
          value="20.5%"
          change={-2.3}
          icon={TrendingUp}
          iconColor="#f59e0b"
          index={2}
        />
        <MetricCard
          title="Avg Intent Score"
          value="0.84"
          change={5.4}
          icon={Clock}
          iconColor="#3b82f6"
          index={3}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <LeadStatusChart />
        <LeadsByPlatformChart />
      </div>

      <RecentLeadsTable />
    </AdminLayout>
  );
}

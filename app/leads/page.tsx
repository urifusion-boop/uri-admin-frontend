'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { MetricCard } from '@/components/dashboard/overview/cards';
import { LeadStatusChart, LeadTypeChart } from '@/components/dashboard/leads/charts';
import { UserPerformanceTable } from '@/components/dashboard/leads/UserPerformanceTable';
import { PlatformPerformanceCard } from '@/components/dashboard/leads/PlatformPerformanceCard';
import { Loader2, Target, TrendingUp, CheckCircle, Users } from 'lucide-react';
import { useLeadOverview } from '@/hooks/useLeads';

export default function LeadsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { data: overview, isLoading: analyticsLoading } = useLeadOverview('LAST_1_MONTH');

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

  const topUsersCount = overview?.top_users?.length || 0;

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Lead Generation Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Monitor user performance, lead quality, and conversion metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Leads"
          value={analyticsLoading ? '...' : (overview?.total_leads || 0).toLocaleString()}
          change={0}
          icon={Target}
          iconColor="#CD1B78"
          index={0}
        />
        <MetricCard
          title="Active Users"
          value={analyticsLoading ? '...' : topUsersCount.toLocaleString()}
          change={0}
          icon={Users}
          iconColor="#3b82f6"
          index={1}
        />
        <MetricCard
          title="Qualified Leads"
          value={analyticsLoading ? '...' : (overview?.conversion_metrics?.qualified_leads || 0).toLocaleString()}
          change={0}
          icon={CheckCircle}
          iconColor="#10b981"
          index={2}
        />
        <MetricCard
          title="Conversion Rate"
          value={analyticsLoading ? '...' : `${overview?.conversion_metrics?.conversion_rate || 0}%`}
          change={0}
          icon={TrendingUp}
          iconColor="#f59e0b"
          index={3}
        />
      </div>

      {/* Lead Distribution Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <LeadStatusChart
          data={(() => {
            const status = overview?.status_breakdown;
            if (!status) return [];
            return [
              { name: 'New', value: status.new || 0, color: '#3b82f6' },
              { name: 'Contacted', value: status.contacted || 0, color: '#10b981' },
              { name: 'Qualified', value: status.qualified || 0, color: '#f59e0b' },
              { name: 'Converted', value: status.converted || 0, color: '#CD1B78' },
            ];
          })()}
        />
        <LeadTypeChart />
      </div>

      {/* Platform Performance */}
      <div className="mb-8">
        <PlatformPerformanceCard />
      </div>

      {/* User Performance Table */}
      <UserPerformanceTable />
    </AdminLayout>
  );
}

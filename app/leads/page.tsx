'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { MetricCard } from '@/components/dashboard/overview/cards';
import { LeadStatusChart, LeadsByPlatformChart } from '@/components/dashboard/leads/charts';
import { RecentLeadsTable } from '@/components/dashboard/leads/tables';
import { Loader2, Target, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { useLeadAnalytics } from '@/hooks/useLeads';

export default function LeadsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { data: analytics, isLoading: analyticsLoading } = useLeadAnalytics('LAST_30_DAYS');

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
          value={(() => {
            if (analyticsLoading) return '...';
            const total = (analytics?.new_leads || 0) + (analytics?.contacted || 0) + (analytics?.qualified || 0) + (analytics?.unqualified || 0) + (analytics?.converted || 0);
            return total.toLocaleString();
          })()}
          change={0}
          icon={Target}
          iconColor="#CD1B78"
          index={0}
        />
        <MetricCard
          title="Qualified Leads"
          value={analyticsLoading ? '...' : (analytics?.qualified || 0).toLocaleString()}
          change={0}
          icon={CheckCircle}
          iconColor="#10b981"
          index={1}
        />
        <MetricCard
          title="Conversion Rate"
          value={(() => {
            if (analyticsLoading) return '...';
            const qualified = analytics?.qualified || 0;
            const converted = analytics?.converted || 0;
            const rate = qualified > 0 ? (converted / qualified) * 100 : 0;
            return `${rate.toFixed(1)}%`;
          })()}
          change={0}
          icon={TrendingUp}
          iconColor="#f59e0b"
          index={2}
        />
        <MetricCard
          title="Avg Intent Score"
          value={(() => {
            if (analyticsLoading) return '...';
            const interest = analytics?.interest_by_platform || {};
            let total = 0;
            let weighted = 0;
            const scoreMap: Record<string, number> = { High: 1, Medium: 0.5, Low: 0 };
            Object.values(interest).forEach((levels) => {
              Object.entries(levels).forEach(([level, count]) => {
                const c = typeof count === 'number' ? count : 0;
                total += c;
                weighted += c * (scoreMap[level] ?? 0);
              });
            });
            const avg = total > 0 ? weighted / total : 0;
            return avg.toFixed(2);
          })()}
          change={0}
          icon={Clock}
          iconColor="#3b82f6"
          index={3}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <LeadStatusChart
          data={(() => {
            const d = analytics;
            return [
              { name: 'New', value: d?.new_leads || 0, color: '#3b82f6' },
              { name: 'Contacted', value: d?.contacted || 0, color: '#10b981' },
              { name: 'Qualified', value: d?.qualified || 0, color: '#f59e0b' },
              { name: 'Converted', value: d?.converted || 0, color: '#CD1B78' },
            ];
          })()}
        />
        <LeadsByPlatformChart
          data={(() => {
            const breakdown = analytics?.lead_sources_breakdown || {};
            return Object.entries(breakdown).map(([platform, count]) => ({ platform, count: typeof count === 'number' ? count : 0 }));
          })()}
        />
      </div>

      <RecentLeadsTable />
    </AdminLayout>
  );
}

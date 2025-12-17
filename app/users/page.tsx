'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUserGrowthTrend } from '@/hooks/useUsers';
import { useDashboardMetrics } from '@/hooks/useDashboard';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { MetricCard } from '@/components/dashboard/overview/cards';
import { UsersDataTable } from '@/components/dashboard/users/tables';
import { UserGrowthChart, UsersByRoleChart } from '@/components/dashboard/users/charts';
import { Loader2, Users, UserPlus, UserCheck, UserX } from 'lucide-react';

export default function UsersPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { data: growthTrend, isLoading: growthLoading } = useUserGrowthTrend(30);
  const { data: dashboardMetrics, isLoading: metricsLoading } = useDashboardMetrics();

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
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage all user accounts, roles, and permissions
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Users"
          value={metricsLoading ? '...' : dashboardMetrics?.totalUsers.toLocaleString() || '0'}
          change={dashboardMetrics?.totalUsersChange || 0}
          icon={Users}
          iconColor="#3b82f6"
          index={0}
        />
        <MetricCard
          title="New This Month"
          value={(() => {
            if (growthLoading) return '...';
            const now = new Date();
            const month = now.getMonth();
            const year = now.getFullYear();
            const count = (growthTrend || [])
              .filter((d) => {
                const dt = new Date(d.date);
                return dt.getMonth() === month && dt.getFullYear() === year;
              })
              .reduce((sum, d) => sum + (d.newUsers || 0), 0);
            return count.toLocaleString();
          })()}
          change={dashboardMetrics?.totalUsersChange || 0}
          icon={UserPlus}
          iconColor="#10b981"
          index={1}
        />
        <MetricCard
          title="Active Users"
          value={metricsLoading ? '...' : dashboardMetrics?.activeUsers.toLocaleString() || '0'}
          change={0}
          icon={UserCheck}
          iconColor="#CD1B78"
          index={2}
        />
        <MetricCard
          title="Inactive Users"
          value={(() => {
            if (metricsLoading) return '...';
            const total = dashboardMetrics?.totalUsers || 0;
            const active = dashboardMetrics?.activeUsers || 0;
            const inactive = Math.max(total - active, 0);
            return inactive.toLocaleString();
          })()}
          change={0}
          icon={UserX}
          iconColor="#f59e0b"
          index={3}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <UserGrowthChart data={growthTrend?.map((d) => ({ date: d.date, totalUsers: d.totalUsers, newUsers: d.newUsers }))} isLoading={growthLoading} />
        <UsersByRoleChart usersByType={dashboardMetrics?.userBreakdown} />
      </div>

      {/* Users Table */}
      <UsersDataTable />
    </AdminLayout>
  );
}

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { MetricCard, DashboardHero } from '@/components/dashboard/overview/cards';
import { RevenueChart, UserGrowthChart } from '@/components/dashboard/overview/charts';
import { RecentActivityTable } from '@/components/dashboard/overview/tables';
import { Loader2, Users, DollarSign, TrendingUp, Target } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

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

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <AdminLayout>
      {/* Hero Card */}
      <DashboardHero />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Users"
          value="12,543"
          change={12.5}
          icon={Users}
          iconColor="#3b82f6"
          iconBgColor="rgba(59, 130, 246, 0.1)"
          index={0}
        />
        <MetricCard
          title="Monthly Revenue"
          value="$95,420"
          change={8.2}
          icon={DollarSign}
          iconColor="#10b981"
          iconBgColor="rgba(16, 185, 129, 0.1)"
          index={1}
        />
        <MetricCard
          title="Active Subscriptions"
          value="3,842"
          change={15.3}
          icon={TrendingUp}
          iconColor="#CD1B78"
          iconBgColor="rgba(205, 27, 120, 0.1)"
          index={2}
        />
        <MetricCard
          title="New Leads"
          value="234"
          change={-3.1}
          icon={Target}
          iconColor="#8b5cf6"
          iconBgColor="rgba(139, 92, 246, 0.1)"
          index={3}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <RevenueChart />
        <UserGrowthChart />
      </div>

      {/* Activity Table */}
      <RecentActivityTable />
    </AdminLayout>
  );
}

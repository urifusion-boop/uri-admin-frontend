'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useFinanceOverview } from '@/hooks/useFinance';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { MetricCard } from '@/components/dashboard/overview/cards';
import { TransactionsTable } from '@/components/dashboard/finance/tables';
import { RevenueBreakdownChart, SubscriptionGrowthChart } from '@/components/dashboard/finance/charts';
import { RevenueChart } from '@/components/dashboard/overview/charts';
import { Loader2, DollarSign, TrendingUp, CreditCard, RefreshCw } from 'lucide-react';

export default function FinancePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { data: financeData, isLoading: financeLoading } = useFinanceOverview();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Format currency helper
  const formatCurrency = (amount: number, currency: string = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

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
        <h1 className="text-3xl font-bold text-foreground">Finance & Subscriptions</h1>
        <p className="text-muted-foreground mt-2">
          Monitor revenue, transactions, and subscription metrics
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Revenue"
          value={financeLoading ? '...' : formatCurrency(financeData?.totalRevenue || 0, financeData?.currency)}
          change={financeData?.totalRevenueChange || 0}
          icon={DollarSign}
          iconColor="#10b981"
          index={0}
        />
        <MetricCard
          title="MRR"
          value={financeLoading ? '...' : formatCurrency(financeData?.monthlyRecurringRevenue || 0, financeData?.currency)}
          change={financeData?.mrrChange || 0}
          icon={TrendingUp}
          iconColor="#CD1B78"
          index={1}
        />
        <MetricCard
          title="Active Subscriptions"
          value={financeLoading ? '...' : financeData?.activeSubscriptions.toLocaleString() || '0'}
          change={financeData?.activeSubscriptionsChange || 0}
          icon={CreditCard}
          iconColor="#3b82f6"
          index={2}
        />
        <MetricCard
          title="ARPU"
          value={financeLoading ? '...' : formatCurrency(financeData?.averageRevenuePerUser || 0, financeData?.currency)}
          change={financeData?.arpuChange || 0}
          icon={RefreshCw}
          iconColor="#f59e0b"
          index={3}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <div className="xl:col-span-2">
          <RevenueChart />
        </div>
        <div className="xl:col-span-1">
          <RevenueBreakdownChart />
        </div>
      </div>

      {/* Subscription Growth Chart */}
      <div className="mb-8">
        <SubscriptionGrowthChart />
      </div>

      {/* Transactions Table */}
      <TransactionsTable />
    </AdminLayout>
  );
}

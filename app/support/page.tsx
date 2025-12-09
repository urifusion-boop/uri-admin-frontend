'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { MetricCard } from '@/components/dashboard/overview/cards';
import { TicketsTable } from '@/components/dashboard/support/tables';
import { TicketStatusChart } from '@/components/dashboard/support/charts';
import { Loader2, MessageSquare, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export default function SupportPage() {
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
        <h1 className="text-3xl font-bold text-foreground">Support & Tickets</h1>
        <p className="text-muted-foreground mt-2">
          Manage customer support tickets and inquiries
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Tickets"
          value="1,535"
          change={5.2}
          icon={MessageSquare}
          iconColor="#3b82f6"
          index={0}
        />
        <MetricCard
          title="Open"
          value="142"
          change={-8.3}
          icon={Clock}
          iconColor="#f59e0b"
          index={1}
        />
        <MetricCard
          title="Resolved"
          value="1,092"
          change={12.5}
          icon={CheckCircle}
          iconColor="#10b981"
          index={2}
        />
        <MetricCard
          title="Urgent"
          value="12"
          change={-2.1}
          icon={AlertCircle}
          iconColor="#ef4444"
          index={3}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <TicketStatusChart />
        <div
          style={{
            background: '#fff',
            borderRadius: '20px',
            boxShadow: '1px 1px 6px 3px rgba(0, 0, 0, 0.07)',
            border: '1px solid #F0F0F0',
            padding: '24px',
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0d0e0f', marginBottom: '4px' }}>
            Response Time Stats
          </h3>
          <p style={{ fontSize: '14px', color: '#6C727F', marginBottom: '24px' }}>Average response metrics</p>
          <div style={{ display: 'grid', gap: '16px' }}>
            {[
              { label: 'Avg First Response', value: '2.5 hrs', color: '#CD1B78' },
              { label: 'Avg Resolution Time', value: '18 hrs', color: '#10b981' },
              { label: 'Customer Satisfaction', value: '4.7/5.0', color: '#f59e0b' },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  padding: '20px',
                  borderRadius: '12px',
                  backgroundColor: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                }}
              >
                <p style={{ fontSize: '13px', color: '#6C727F', marginBottom: '8px' }}>{stat.label}</p>
                <p style={{ fontSize: '24px', fontWeight: 700, color: stat.color, margin: 0 }}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <TicketsTable />
    </AdminLayout>
  );
}

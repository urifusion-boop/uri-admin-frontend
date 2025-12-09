'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { MetricCard } from '@/components/dashboard/overview/cards';
import { ContentTable } from '@/components/dashboard/content/tables';
import { Loader2, FileText, Image, Video, FolderOpen } from 'lucide-react';

export default function ContentPage() {
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
        <h1 className="text-3xl font-bold text-foreground">Content Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage portfolios, media, and user-generated content
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Portfolios"
          value="5,432"
          change={14.2}
          icon={FolderOpen}
          iconColor="#8b5cf6"
          index={0}
        />
        <MetricCard
          title="Images"
          value="42,156"
          change={8.5}
          icon={Image}
          iconColor="#3b82f6"
          index={1}
        />
        <MetricCard
          title="Videos"
          value="3,842"
          change={12.1}
          icon={Video}
          iconColor="#CD1B78"
          index={2}
        />
        <MetricCard
          title="Documents"
          value="1,234"
          change={6.3}
          icon={FileText}
          iconColor="#10b981"
          index={3}
        />
      </div>

      {/* Content Table */}
      <ContentTable />
    </AdminLayout>
  );
}

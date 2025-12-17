'use client';

import { motion } from 'framer-motion';
import { useServicesMetrics } from '@/hooks/useSystem';
import { Loader2 } from 'lucide-react';

interface Service {
  name: string;
  status: 'online' | 'offline' | 'degraded';
  uptime: string;
  responseTime: string;
}

const statusColors = {
  online: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981', dot: '#10b981' },
  offline: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', dot: '#ef4444' },
  degraded: { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', dot: '#f59e0b' },
};

const serviceNameMap: Record<string, string> = {
  URI_BACKEND: 'URI Backend',
  URI_INSIGHTS: 'URI Insights',
  URI_TASK_MANAGER: 'URI Task Manager',
  URI_TRANSACTION: 'URI Transaction',
  MONGODB: 'MongoDB',
  ADMIN_FRONTEND: 'Admin Frontend',
  USER_FRONTEND: 'User Frontend',
};

export function ServiceStatusCard() {
  const { data: metricsData, isLoading } = useServicesMetrics();

  // Map backend service status to frontend format
  const mapStatus = (status?: string): 'online' | 'offline' | 'degraded' => {
    if (status === 'UP') return 'online';
    if (status === 'DOWN') return 'offline';
    return 'degraded';
  };

  const services: Service[] = (metricsData || []).map((metric: any) => ({
    name: serviceNameMap[metric.serviceName] || metric.serviceName,
    status: mapStatus(metric.status),
    uptime: `${metric.uptime}%`,
    responseTime: metric.avgResponseTime > 0 ? `${metric.avgResponseTime}ms` : 'N/A',
  }));

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '20px',
        boxShadow: '1px 1px 6px 3px rgba(0, 0, 0, 0.07)',
        border: '1px solid #F0F0F0',
        padding: '24px',
      }}
    >
      <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0d0e0f', marginBottom: '4px' }}>Service Status</h3>
      <p style={{ fontSize: '14px', color: '#6C727F', marginBottom: '24px' }}>Real-time status of all services</p>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {services.map((service, index) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                borderRadius: '12px',
                backgroundColor: '#F9FAFB',
                border: '1px solid #E5E7EB',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: statusColors[service.status].dot,
                    boxShadow: `0 0 8px ${statusColors[service.status].dot}`,
                  }}
                />
                <span style={{ fontSize: '15px', fontWeight: 600, color: '#0d0e0f' }}>{service.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '12px', color: '#6C727F', margin: 0 }}>Uptime</p>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0e0f', margin: 0 }}>{service.uptime}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '12px', color: '#6C727F', margin: 0 }}>Response</p>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0e0f', margin: 0 }}>{service.responseTime}</p>
                </div>
                <span
                  style={{
                    padding: '4px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    backgroundColor: statusColors[service.status].bg,
                    color: statusColors[service.status].text,
                    borderRadius: '6px',
                    textTransform: 'capitalize',
                  }}
                >
                  {service.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

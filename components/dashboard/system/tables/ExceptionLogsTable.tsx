'use client';

import { useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { SystemLogsModal } from '../modals/SystemLogsModal';
import { LogDetailsModal } from '../modals/LogDetailsModal';
import { useExceptionLogs } from '@/hooks/useSystem';
import { formatDistanceToNow } from 'date-fns';

interface ExceptionLog {
  id: string;
  service: string;
  message: string;
  method: string;
  timestamp: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

const severityColors = {
  critical: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', border: '#fecaca' },
  high: { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', border: '#fef3c7' },
  medium: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6', border: '#dbeafe' },
  low: { bg: 'rgba(156, 163, 175, 0.1)', text: '#6b7280', border: '#e5e7eb' },
};

function getSeverity(status: number): 'critical' | 'high' | 'medium' | 'low' {
  if (status >= 500) return 'critical';
  if (status >= 400 && status < 500) return 'high';
  if (status >= 300) return 'medium';
  return 'low';
}

export function ExceptionLogsTable() {
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState<ExceptionLog | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const { data: logsData, isLoading } = useExceptionLogs(1, 10);

  const exceptionLogs: ExceptionLog[] = (logsData?.logs || []).map(log => ({
    id: log.logId,
    service: log.serviceType || 'Unknown',
    message: log.exception.substring(0, 100),
    method: `${log.method} ${log.url}`,
    timestamp: log.exceptionDate,
    severity: getSeverity(log.status),
  }));

  const handleLogClick = (log: ExceptionLog) => {
    setSelectedLog(log);
    setShowDetailsModal(true);
  };

  return (
    <>
      <div
        style={{
          background: '#fff',
          borderRadius: '20px',
          boxShadow: '1px 1px 6px 3px rgba(0, 0, 0, 0.07)',
          border: '1px solid #F0F0F0',
          padding: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0d0e0f', marginBottom: '4px' }}>Exception Logs</h3>
            <p style={{ fontSize: '14px', color: '#6C727F' }}>Recent system errors and exceptions</p>
          </div>
          <button
            onClick={() => setShowLogsModal(true)}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              backgroundColor: '#fff',
              color: '#0d0e0f',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F9FAFB';
              e.currentTarget.style.borderColor = '#CD1B78';
              e.currentTarget.style.color = '#CD1B78';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fff';
              e.currentTarget.style.borderColor = '#E5E7EB';
              e.currentTarget.style.color = '#0d0e0f';
            }}
          >
            View All Logs
          </button>
        </div>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : exceptionLogs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6C727F' }}>
          <p>No exception logs found</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {exceptionLogs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleLogClick(log)}
              style={{
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                backgroundColor: '#F9FAFB',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F3F4F6';
                e.currentTarget.style.borderColor = '#CD1B78';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(205, 27, 120, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#F9FAFB';
                e.currentTarget.style.borderColor = '#E5E7EB';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <AlertCircle size={16} style={{ color: severityColors[log.severity].text }} />
                    <span style={{ fontSize: '15px', fontWeight: 600, color: '#0d0e0f' }}>{log.message}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#6C727F', margin: 0 }}>
                    {log.service} • {log.method}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span
                    style={{
                      padding: '4px 10px',
                      fontSize: '11px',
                      fontWeight: 600,
                      backgroundColor: severityColors[log.severity].bg,
                      color: severityColors[log.severity].text,
                      borderRadius: '6px',
                      textTransform: 'uppercase',
                      border: `1px solid ${severityColors[log.severity].border}`,
                    }}
                  >
                    {log.severity}
                  </span>
                  <span style={{ fontSize: '13px', color: '#9EA3AE' }}>
                    {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>

    <SystemLogsModal isOpen={showLogsModal} onClose={() => setShowLogsModal(false)} />

    {selectedLog && (
      <LogDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedLog(null);
        }}
        log={selectedLog}
      />
    )}
  </>
  );
}

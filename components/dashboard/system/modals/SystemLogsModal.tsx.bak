'use client';

import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Search, X, AlertCircle, Filter, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SystemLog {
  id: string;
  service: string;
  message: string;
  method: string;
  timestamp: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  statusCode?: number;
  endpoint?: string;
  stackTrace?: string;
  userAgent?: string;
  ipAddress?: string;
}

interface SystemLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const allLogs: SystemLog[] = [
  {
    id: 'LOG-001',
    service: 'URI Backend',
    message: 'Database connection timeout',
    method: 'POST /api/v1/users',
    timestamp: '2024-12-08 14:23:45',
    severity: 'critical',
    statusCode: 500,
    endpoint: '/api/v1/users',
    stackTrace: 'Error: Connection timeout at Database.connect() at UserService.createUser()',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    ipAddress: '192.168.1.100',
  },
  {
    id: 'LOG-002',
    service: 'URI Insights',
    message: 'Rate limit exceeded',
    method: 'GET /api/v1/leads',
    timestamp: '2024-12-08 14:08:12',
    severity: 'medium',
    statusCode: 429,
    endpoint: '/api/v1/leads',
    stackTrace: 'Error: Too many requests from this IP',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    ipAddress: '10.0.0.45',
  },
  {
    id: 'LOG-003',
    service: 'URI Transaction',
    message: 'Payment gateway timeout',
    method: 'POST /api/v1/transactions',
    timestamp: '2024-12-08 13:45:30',
    severity: 'high',
    statusCode: 504,
    endpoint: '/api/v1/transactions',
    stackTrace: 'Error: Gateway timeout while processing payment',
    userAgent: 'PostmanRuntime/7.32.3',
    ipAddress: '172.16.0.12',
  },
  {
    id: 'LOG-004',
    service: 'URI Backend',
    message: 'Invalid authentication token',
    method: 'GET /api/v1/profile',
    timestamp: '2024-12-08 13:30:15',
    severity: 'low',
    statusCode: 401,
    endpoint: '/api/v1/profile',
    stackTrace: 'Error: JWT token expired or invalid',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1)',
    ipAddress: '192.168.1.50',
  },
  {
    id: 'LOG-005',
    service: 'URI Insights',
    message: 'Memory allocation failed',
    method: 'POST /api/v1/analytics',
    timestamp: '2024-12-08 13:15:00',
    severity: 'critical',
    statusCode: 500,
    endpoint: '/api/v1/analytics',
    stackTrace: 'Error: Out of memory while processing large dataset',
    userAgent: 'Python/3.9 requests/2.28.1',
    ipAddress: '10.0.1.200',
  },
  {
    id: 'LOG-006',
    service: 'URI Backend',
    message: 'File upload size exceeded',
    method: 'POST /api/v1/media',
    timestamp: '2024-12-08 12:50:22',
    severity: 'medium',
    statusCode: 413,
    endpoint: '/api/v1/media',
    stackTrace: 'Error: Request entity too large (max 10MB)',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    ipAddress: '192.168.2.33',
  },
];

const severityColors = {
  critical: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', border: '#fecaca' },
  high: { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', border: '#fef3c7' },
  medium: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6', border: '#dbeafe' },
  low: { bg: 'rgba(156, 163, 175, 0.1)', text: '#6b7280', border: '#e5e7eb' },
};

export function SystemLogsModal({ isOpen, onClose }: SystemLogsModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLog, setSelectedLog] = useState<SystemLog | null>(null);

  const filteredLogs = allLogs.filter((log) => {
    const matchesSearch =
      log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.method.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const activeFiltersCount = severityFilter !== 'all' ? 1 : 0;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="System Exception Logs" size="xl">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Search and Filters */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9EA3AE',
                }}
              />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 36px 9px 36px',
                  border: '1px solid #E5E5E5',
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X size={14} style={{ color: '#6C727F' }} />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 16px',
                background: showFilters ? '#F9FAFB' : '#fff',
                border: '1px solid #E5E5E5',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 500,
                color: '#0d0e0f',
                cursor: 'pointer',
              }}
            >
              <Filter size={16} />
              Filters
              {activeFiltersCount > 0 && (
                <span
                  style={{
                    background: '#CD1B78',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '2px 6px',
                    borderRadius: '10px',
                    minWidth: '18px',
                    textAlign: 'center',
                  }}
                >
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 16px',
                background: '#fff',
                border: '1px solid #E5E5E5',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 500,
                color: '#0d0e0f',
                cursor: 'pointer',
              }}
            >
              <Download size={16} />
              Export
            </button>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ overflow: 'hidden' }}
              >
                <div
                  style={{
                    padding: '14px',
                    background: '#F9FAFB',
                    borderRadius: '10px',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>
                      Severity
                    </label>
                    <select
                      value={severityFilter}
                      onChange={(e) => setSeverityFilter(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #E5E5E5',
                        borderRadius: '8px',
                        fontSize: '14px',
                        background: '#fff',
                        cursor: 'pointer',
                        outline: 'none',
                      }}
                    >
                      <option value="all">All Severities</option>
                      <option value="critical">Critical</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>

                  {activeFiltersCount > 0 && (
                    <button
                      onClick={() => setSeverityFilter('all')}
                      style={{
                        padding: '8px 16px',
                        background: '#fff',
                        border: '1px solid #E5E5E5',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 500,
                        color: '#6C727F',
                        cursor: 'pointer',
                        marginTop: '20px',
                      }}
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Logs List */}
          <div style={{ display: 'grid', gap: '10px', maxHeight: '400px', overflowY: 'auto' }} className="logs-scroll">
            {filteredLogs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => setSelectedLog(log)}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid #E5E7EB',
                  backgroundColor: selectedLog?.id === log.id ? 'rgba(205, 27, 120, 0.05)' : '#F9FAFB',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (selectedLog?.id !== log.id) {
                    e.currentTarget.style.backgroundColor = '#F3F4F6';
                    e.currentTarget.style.borderColor = '#D1D5DB';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedLog?.id !== log.id) {
                    e.currentTarget.style.backgroundColor = '#F9FAFB';
                    e.currentTarget.style.borderColor = '#E5E7EB';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <AlertCircle size={14} style={{ color: severityColors[log.severity].text }} />
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#0d0e0f' }}>{log.message}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '12px', color: '#6C727F', fontFamily: 'monospace' }}>{log.id}</span>
                      <span style={{ fontSize: '12px', color: '#9EA3AE' }}>•</span>
                      <span style={{ fontSize: '12px', color: '#6C727F' }}>{log.service}</span>
                      <span style={{ fontSize: '12px', color: '#9EA3AE' }}>•</span>
                      <span style={{ fontSize: '12px', color: '#6C727F', fontFamily: 'monospace' }}>{log.method}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '12px' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        fontSize: '10px',
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
                    <span style={{ fontSize: '12px', color: '#9EA3AE', whiteSpace: 'nowrap' }}>{log.timestamp}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Log Details */}
          {selectedLog && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: '16px',
                borderRadius: '12px',
                border: '2px solid #CD1B78',
                backgroundColor: '#fff',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#0d0e0f', margin: 0 }}>Log Details</h4>
                <button
                  onClick={() => setSelectedLog(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    color: '#6C727F',
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '4px' }}>
                    LOG ID
                  </label>
                  <p style={{ fontSize: '13px', color: '#0d0e0f', margin: 0, fontFamily: 'monospace' }}>{selectedLog.id}</p>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '4px' }}>
                    TIMESTAMP
                  </label>
                  <p style={{ fontSize: '13px', color: '#0d0e0f', margin: 0 }}>{selectedLog.timestamp}</p>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '4px' }}>
                    SERVICE
                  </label>
                  <p style={{ fontSize: '13px', color: '#0d0e0f', margin: 0 }}>{selectedLog.service}</p>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '4px' }}>
                    STATUS CODE
                  </label>
                  <p style={{ fontSize: '13px', color: '#0d0e0f', margin: 0, fontFamily: 'monospace' }}>{selectedLog.statusCode}</p>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '4px' }}>
                    ENDPOINT
                  </label>
                  <p style={{ fontSize: '13px', color: '#0d0e0f', margin: 0, fontFamily: 'monospace' }}>{selectedLog.endpoint}</p>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '4px' }}>
                    IP ADDRESS
                  </label>
                  <p style={{ fontSize: '13px', color: '#0d0e0f', margin: 0, fontFamily: 'monospace' }}>{selectedLog.ipAddress}</p>
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '4px' }}>
                  USER AGENT
                </label>
                <p style={{ fontSize: '13px', color: '#0d0e0f', margin: 0, wordBreak: 'break-all' }}>{selectedLog.userAgent}</p>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '4px' }}>
                  STACK TRACE
                </label>
                <div
                  style={{
                    padding: '10px',
                    backgroundColor: '#F9FAFB',
                    borderRadius: '8px',
                    border: '1px solid #E5E5E5',
                  }}
                >
                  <pre
                    style={{
                      fontSize: '12px',
                      color: '#ef4444',
                      margin: 0,
                      fontFamily: 'monospace',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {selectedLog.stackTrace}
                  </pre>
                </div>
              </div>
            </motion.div>
          )}

          <style jsx>{`
            .logs-scroll::-webkit-scrollbar {
              width: 6px;
            }
            .logs-scroll::-webkit-scrollbar-track {
              background: #F2F2F2;
              border-radius: 10px;
            }
            .logs-scroll::-webkit-scrollbar-thumb {
              background: #CD1B78;
              border-radius: 10px;
            }
            .logs-scroll::-webkit-scrollbar-thumb:hover {
              background: #a01560;
            }

            /* Firefox */
            .logs-scroll {
              scrollbar-width: thin;
              scrollbar-color: #CD1B78 #F2F2F2;
            }
          `}</style>
        </div>
      </Modal>
    </>
  );
}

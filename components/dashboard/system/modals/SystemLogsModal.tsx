'use client';

import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Search, X, AlertCircle, Filter, Download, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExceptionLogs } from '@/hooks/useSystem';
import { formatDistanceToNow } from 'date-fns';

interface SystemLog {
  logId?: string;
  userId?: string;
  userEmail?: string;
  exception: string;
  method?: string;
  url?: string;
  status?: number;
  serviceType?: string;
  exceptionDate?: string | Date;
  severity?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  stackTrace?: string;
  userAgent?: string;
  ipAddress?: string;
}

interface SystemLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const severityColors = {
  CRITICAL: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', border: '#fecaca' },
  HIGH: { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', border: '#fef3c7' },
  MEDIUM: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6', border: '#dbeafe' },
  LOW: { bg: 'rgba(156, 163, 175, 0.1)', text: '#6b7280', border: '#e5e7eb' },
};

function getSeverity(status?: number): 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' {
  if (!status) return 'MEDIUM';
  if (status >= 500) return 'CRITICAL';
  if (status >= 400 && status < 500) return 'HIGH';
  if (status >= 300) return 'MEDIUM';
  return 'LOW';
}

export function SystemLogsModal({ isOpen, onClose }: SystemLogsModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLog, setSelectedLog] = useState<SystemLog | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: logsData, isLoading } = useExceptionLogs(currentPage, 50);

  const allLogs: SystemLog[] = (logsData?.logs || []).map((log: any) => ({
    ...log,
    severity: log.severity || getSeverity(log.status),
  }));

  const filteredLogs = allLogs.filter((log) => {
    const matchesSearch =
      (log.logId?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (log.serviceType?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (log.exception?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (log.method?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (log.url?.toLowerCase() || '').includes(searchQuery.toLowerCase());
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

            <div style={{ marginLeft: 'auto', fontSize: '13px', color: '#6C727F' }}>
              Total: {logsData?.total || 0} logs
            </div>
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
                      <option value="CRITICAL">Critical</option>
                      <option value="HIGH">High</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="LOW">Low</option>
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
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredLogs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6C727F' }}>
              <p>No exception logs found</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '10px', maxHeight: '400px', overflowY: 'auto' }} className="logs-scroll">
              {filteredLogs.map((log, index) => (
                <motion.div
                  key={log.logId || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => setSelectedLog(log)}
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    border: '1px solid #E5E7EB',
                    backgroundColor: selectedLog?.logId === log.logId ? 'rgba(205, 27, 120, 0.05)' : '#F9FAFB',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedLog?.logId !== log.logId) {
                      e.currentTarget.style.backgroundColor = '#F3F4F6';
                      e.currentTarget.style.borderColor = '#D1D5DB';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedLog?.logId !== log.logId) {
                      e.currentTarget.style.backgroundColor = '#F9FAFB';
                      e.currentTarget.style.borderColor = '#E5E7EB';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <AlertCircle size={14} style={{ color: severityColors[log.severity || 'MEDIUM'].text }} />
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#0d0e0f' }}>
                          {log.exception?.substring(0, 100) || 'Unknown error'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '12px', color: '#6C727F', fontFamily: 'monospace' }}>
                          {log.logId || 'N/A'}
                        </span>
                        <span style={{ fontSize: '12px', color: '#9EA3AE' }}>•</span>
                        <span style={{ fontSize: '12px', color: '#6C727F' }}>{log.serviceType || 'Unknown'}</span>
                        <span style={{ fontSize: '12px', color: '#9EA3AE' }}>•</span>
                        <span style={{ fontSize: '12px', color: '#6C727F', fontFamily: 'monospace' }}>
                          {log.method} {log.url}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '12px' }}>
                      <span
                        style={{
                          padding: '3px 8px',
                          fontSize: '10px',
                          fontWeight: 600,
                          backgroundColor: severityColors[log.severity || 'MEDIUM'].bg,
                          color: severityColors[log.severity || 'MEDIUM'].text,
                          borderRadius: '6px',
                          textTransform: 'uppercase',
                          border: `1px solid ${severityColors[log.severity || 'MEDIUM'].border}`,
                        }}
                      >
                        {log.severity || 'MEDIUM'}
                      </span>
                      <span style={{ fontSize: '12px', color: '#9EA3AE', whiteSpace: 'nowrap' }}>
                        {log.exceptionDate
                          ? formatDistanceToNow(new Date(log.exceptionDate), { addSuffix: true })
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && filteredLogs.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', paddingTop: '8px' }}>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '6px 12px',
                  border: '1px solid #E5E5E5',
                  borderRadius: '8px',
                  background: currentPage === 1 ? '#F9FAFB' : '#fff',
                  color: currentPage === 1 ? '#9EA3AE' : '#0d0e0f',
                  fontSize: '13px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                }}
              >
                Previous
              </button>
              <span style={{ padding: '6px 12px', fontSize: '13px', color: '#6C727F' }}>
                Page {currentPage} of {Math.ceil((logsData?.total || 0) / 50)}
              </span>
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage >= Math.ceil((logsData?.total || 0) / 50)}
                style={{
                  padding: '6px 12px',
                  border: '1px solid #E5E5E5',
                  borderRadius: '8px',
                  background: currentPage >= Math.ceil((logsData?.total || 0) / 50) ? '#F9FAFB' : '#fff',
                  color: currentPage >= Math.ceil((logsData?.total || 0) / 50) ? '#9EA3AE' : '#0d0e0f',
                  fontSize: '13px',
                  cursor: currentPage >= Math.ceil((logsData?.total || 0) / 50) ? 'not-allowed' : 'pointer',
                }}
              >
                Next
              </button>
            </div>
          )}

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
                  <p style={{ fontSize: '13px', color: '#0d0e0f', margin: 0, fontFamily: 'monospace' }}>
                    {selectedLog.logId || 'N/A'}
                  </p>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '4px' }}>
                    TIMESTAMP
                  </label>
                  <p style={{ fontSize: '13px', color: '#0d0e0f', margin: 0 }}>
                    {selectedLog.exceptionDate ? new Date(selectedLog.exceptionDate).toLocaleString() : 'N/A'}
                  </p>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '4px' }}>
                    SERVICE
                  </label>
                  <p style={{ fontSize: '13px', color: '#0d0e0f', margin: 0 }}>{selectedLog.serviceType || 'Unknown'}</p>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '4px' }}>
                    STATUS CODE
                  </label>
                  <p style={{ fontSize: '13px', color: '#0d0e0f', margin: 0, fontFamily: 'monospace' }}>
                    {selectedLog.status || 'N/A'}
                  </p>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '4px' }}>
                    ENDPOINT
                  </label>
                  <p style={{ fontSize: '13px', color: '#0d0e0f', margin: 0, fontFamily: 'monospace' }}>
                    {selectedLog.method} {selectedLog.url}
                  </p>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '4px' }}>
                    IP ADDRESS
                  </label>
                  <p style={{ fontSize: '13px', color: '#0d0e0f', margin: 0, fontFamily: 'monospace' }}>
                    {selectedLog.ipAddress || 'N/A'}
                  </p>
                </div>
              </div>

              {selectedLog.userAgent && (
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '4px' }}>
                    USER AGENT
                  </label>
                  <p style={{ fontSize: '13px', color: '#0d0e0f', margin: 0, wordBreak: 'break-all' }}>
                    {selectedLog.userAgent}
                  </p>
                </div>
              )}

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '4px' }}>
                  EXCEPTION MESSAGE
                </label>
                <div
                  style={{
                    padding: '10px',
                    backgroundColor: '#F9FAFB',
                    borderRadius: '8px',
                    border: '1px solid #E5E5E5',
                    marginBottom: '12px',
                  }}
                >
                  <p
                    style={{
                      fontSize: '12px',
                      color: '#ef4444',
                      margin: 0,
                      fontFamily: 'monospace',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {selectedLog.exception}
                  </p>
                </div>
              </div>

              {selectedLog.stackTrace && (
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
                        fontSize: '11px',
                        color: '#6C727F',
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
              )}
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

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Eye, Shield, Lock, UserCheck, Database, AlertTriangle, Download, FileText } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { Dropdown } from '@/components/common/Dropdown';
import { toast } from 'sonner';

interface AuditLog {
  id: string;
  event: string;
  eventType: 'auth' | 'security' | 'user_action' | 'system' | 'data_access';
  user: string;
  userEmail: string;
  ipAddress: string;
  timestamp: string;
  status: 'success' | 'failed' | 'warning';
  details: string;
}

const auditLogs: AuditLog[] = [
  { id: 'AUD-001', event: 'User Login', eventType: 'auth', user: 'admin@uri.com', userEmail: 'admin@uri.com', ipAddress: '192.168.1.100', timestamp: '2024-12-07 10:32:15', status: 'success', details: 'Successful admin login from Chrome browser' },
  { id: 'AUD-002', event: 'Failed Login Attempt', eventType: 'security', user: 'unknown@example.com', userEmail: 'unknown@example.com', ipAddress: '45.123.45.67', timestamp: '2024-12-07 10:15:42', status: 'failed', details: 'Invalid credentials - 3 consecutive failed attempts' },
  { id: 'AUD-003', event: 'User Profile Updated', eventType: 'user_action', user: 'sarah@example.com', userEmail: 'sarah@example.com', ipAddress: '192.168.1.105', timestamp: '2024-12-07 09:45:22', status: 'success', details: 'User modified profile information including email and phone' },
  { id: 'AUD-004', event: 'Database Backup', eventType: 'system', user: 'System', userEmail: 'system@uri.com', ipAddress: '127.0.0.1', timestamp: '2024-12-07 03:00:00', status: 'success', details: 'Automated daily backup completed successfully - 2.4GB' },
  { id: 'AUD-005', event: 'Sensitive Data Access', eventType: 'data_access', user: 'admin@uri.com', userEmail: 'admin@uri.com', ipAddress: '192.168.1.100', timestamp: '2024-12-07 08:20:31', status: 'warning', details: 'Admin accessed user payment information for support ticket' },
  { id: 'AUD-006', event: 'Permission Change', eventType: 'security', user: 'superadmin@uri.com', userEmail: 'superadmin@uri.com', ipAddress: '192.168.1.101', timestamp: '2024-12-06 16:45:00', status: 'success', details: 'User role elevated from USER to ADMIN' },
];

const eventTypeConfig = {
  auth: { icon: Lock, bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6', border: '#dbeafe' },
  security: { icon: Shield, bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', border: '#fecaca' },
  user_action: { icon: UserCheck, bg: 'rgba(139, 92, 246, 0.1)', text: '#8b5cf6', border: '#ede9fe' },
  system: { icon: Database, bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981', border: '#d1fae5' },
  data_access: { icon: Eye, bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', border: '#fef3c7' },
};

const statusConfig = {
  success: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981', border: '#d1fae5' },
  failed: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', border: '#fecaca' },
  warning: { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', border: '#fef3c7' },
};

export function AuditLogsTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch = log.event.toLowerCase().includes(searchQuery.toLowerCase()) || log.user.toLowerCase().includes(searchQuery.toLowerCase()) || log.id.toLowerCase().includes(searchQuery.toLowerCase()) || log.ipAddress.includes(searchQuery);
    const matchesEventType = eventTypeFilter === 'all' || log.eventType === eventTypeFilter;
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    return matchesSearch && matchesEventType && matchesStatus;
  });

  const activeFiltersCount = (eventTypeFilter !== 'all' ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0);

  const clearFilters = () => {
    setEventTypeFilter('all');
    setStatusFilter('all');
  };

  const handleViewLog = (log: AuditLog) => {
    setSelectedLog(log);
    setShowViewModal(true);
  };

  const handleExportLog = (log: AuditLog) => {
    toast.success(`Exporting log ${log.id}...`);
  };

  const handleExportAll = () => {
    toast.success('Exporting all audit logs...');
  };

  return (
    <>
      <div style={{ background: '#fff', borderRadius: '20px', boxShadow: '1px 1px 6px 3px rgba(0, 0, 0, 0.07)', border: '1px solid #F0F0F0', padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0d0e0f' }}>Activity Logs</h3>
              <p style={{ fontSize: '14px', color: '#6C727F', marginTop: '4px' }}>Monitor system events, security alerts, and user actions</p>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ position: 'relative', width: '280px' }}>
                <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#9EA3AE' }} />
                <input type="text" placeholder="Search logs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '100%', padding: '10px 36px 10px 40px', border: '1px solid #E5E5E5', borderRadius: '12px', fontSize: '14px', outline: 'none' }} />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F2F2F2')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>
                    <X style={{ width: '14px', height: '14px', color: '#6C727F' }} />
                  </button>
                )}
              </div>
              <button onClick={() => setShowFilters(!showFilters)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: showFilters ? '#F9FAFB' : '#fff', border: '1px solid #E5E5E5', borderRadius: '12px', fontSize: '14px', fontWeight: 500, color: '#0d0e0f', cursor: 'pointer' }}
                onMouseEnter={(e) => { if (!showFilters) e.currentTarget.style.backgroundColor = '#F9FAFB'; }} onMouseLeave={(e) => { if (!showFilters) e.currentTarget.style.backgroundColor = '#fff'; }}>
                <Filter style={{ width: '16px', height: '16px' }} />
                Filters
                {activeFiltersCount > 0 && (<span style={{ background: '#CD1B78', color: '#fff', fontSize: '11px', fontWeight: 600, padding: '2px 6px', borderRadius: '10px', minWidth: '18px', textAlign: 'center' }}>{activeFiltersCount}</span>)}
              </button>
              <button onClick={handleExportAll} style={{ padding: '10px 16px', background: '#CD1B78', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 600, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#A81563')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#CD1B78')}>
                <Download style={{ width: '16px', height: '16px' }} />
                Export All
              </button>
            </div>
          </div>
          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} style={{ overflow: 'hidden' }}>
                <div style={{ padding: '16px', background: '#F9FAFB', borderRadius: '12px', marginTop: '16px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ flex: '1', minWidth: '200px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>Event Type</label>
                    <select value={eventTypeFilter} onChange={(e) => setEventTypeFilter(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: '8px', fontSize: '14px', background: '#fff', cursor: 'pointer', outline: 'none' }}>
                      <option value="all">All Event Types</option>
                      <option value="auth">Authentication</option>
                      <option value="security">Security</option>
                      <option value="user_action">User Action</option>
                      <option value="system">System</option>
                      <option value="data_access">Data Access</option>
                    </select>
                  </div>
                  <div style={{ flex: '1', minWidth: '200px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>Status</label>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: '8px', fontSize: '14px', background: '#fff', cursor: 'pointer', outline: 'none' }}>
                      <option value="all">All Statuses</option>
                      <option value="success">Success</option>
                      <option value="failed">Failed</option>
                      <option value="warning">Warning</option>
                    </select>
                  </div>
                  {activeFiltersCount > 0 && (
                    <button onClick={clearFilters} style={{ padding: '8px 16px', background: '#fff', border: '1px solid #E5E5E5', borderRadius: '8px', fontSize: '13px', fontWeight: 500, color: '#6C727F', cursor: 'pointer', marginTop: '20px' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F2F2F2')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}>Clear Filters</button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F', borderBottom: '1px solid #E5E5E5' }}>Log ID</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F', borderBottom: '1px solid #E5E5E5' }}>Event</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F', borderBottom: '1px solid #E5E5E5' }}>User</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F', borderBottom: '1px solid #E5E5E5' }}>Event Type</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F', borderBottom: '1px solid #E5E5E5' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F', borderBottom: '1px solid #E5E5E5' }}>Timestamp</th>
                <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F', borderBottom: '1px solid #E5E5E5' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, index) => {
                const EventIcon = eventTypeConfig[log.eventType].icon;
                return (
                  <motion.tr key={log.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                    style={{ background: '#fff', border: '1px solid #F0F0F0', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => { const row = e.currentTarget; row.style.backgroundColor = '#F9FAFB'; row.style.transform = 'scale(1.01)'; row.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)'; }}
                    onMouseLeave={(e) => { const row = e.currentTarget; row.style.backgroundColor = '#fff'; row.style.transform = 'scale(1)'; row.style.boxShadow = 'none'; }}>
                    <td style={{ padding: '16px', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}><span style={{ fontSize: '13px', fontWeight: 600, color: '#0d0e0f', fontFamily: 'monospace' }}>{log.id}</span></td>
                    <td style={{ padding: '16px' }}><div><p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0e0f', marginBottom: '4px' }}>{log.event}</p><p style={{ fontSize: '13px', color: '#6C727F', margin: 0 }}>{log.details}</p></div></td>
                    <td style={{ padding: '16px' }}><div><p style={{ fontSize: '13px', fontWeight: 500, color: '#0d0e0f', marginBottom: '2px' }}>{log.user}</p><p style={{ fontSize: '12px', color: '#6C727F', margin: 0, fontFamily: 'monospace' }}>{log.ipAddress}</p></div></td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ padding: '4px 12px', fontSize: '12px', fontWeight: 600, backgroundColor: eventTypeConfig[log.eventType].bg, color: eventTypeConfig[log.eventType].text, borderRadius: '8px', border: `1px solid ${eventTypeConfig[log.eventType].border}`, display: 'inline-flex', alignItems: 'center', gap: '6px', textTransform: 'capitalize' }}>
                        <EventIcon style={{ width: '12px', height: '12px' }} />
                        {log.eventType.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ padding: '4px 12px', fontSize: '12px', fontWeight: 600, backgroundColor: statusConfig[log.status].bg, color: statusConfig[log.status].text, borderRadius: '8px', border: `1px solid ${statusConfig[log.status].border}`, display: 'inline-block', textTransform: 'capitalize' }}>{log.status}</span>
                    </td>
                    <td style={{ padding: '16px' }}><span style={{ fontSize: '13px', color: '#6C727F', fontFamily: 'monospace' }}>{log.timestamp}</span></td>
                    <td style={{ padding: '16px', textAlign: 'right', borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button onClick={() => handleViewLog(log)} style={{ padding: '8px 12px', background: '#fff', border: '1px solid #E5E5E5', borderRadius: '8px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 500, color: '#6C727F' }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F2F2F2'; e.currentTarget.style.borderColor = '#D1D5DB'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.borderColor = '#E5E5E5'; }}>
                          <Eye style={{ width: '14px', height: '14px' }} />
                          Details
                        </button>
                        <Dropdown
                          trigger={<button style={{ padding: '8px', background: '#fff', border: '1px solid #E5E5E5', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F2F2F2'; e.currentTarget.style.borderColor = '#D1D5DB'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.borderColor = '#E5E5E5'; }}>
                            <FileText style={{ width: '16px', height: '16px', color: '#6C727F' }} />
                          </button>}
                          items={[{ label: 'Export This Log', icon: <Download style={{ width: '16px', height: '16px' }} />, onClick: () => handleExportLog(log) }]}
                        />
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #E5E5E5', flexWrap: 'wrap', gap: '16px' }}>
          <p style={{ fontSize: '14px', color: '#6C727F' }}>Showing {filteredLogs.length} of {auditLogs.length} logs</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button disabled style={{ padding: '8px 16px', fontSize: '14px', fontWeight: 500, color: '#9EA3AE', background: 'transparent', border: '1px solid #E5E5E5', borderRadius: '8px', cursor: 'not-allowed' }}>Previous</button>
            <button style={{ padding: '8px 16px', fontSize: '14px', fontWeight: 500, color: '#0d0e0f', background: 'transparent', border: '1px solid #E5E5E5', borderRadius: '8px', cursor: 'pointer' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F2F2F2')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>Next</button>
          </div>
        </div>
      </div>

      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Audit Log Details" size="lg">
        {selectedLog && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', paddingBottom: '24px', borderBottom: '1px solid #E5E5E5' }}>
              <div><label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>Log ID</label><p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0e0f', margin: 0, fontFamily: 'monospace' }}>{selectedLog.id}</p></div>
              <div><label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>Status</label>
                <span style={{ padding: '4px 12px', fontSize: '12px', fontWeight: 600, backgroundColor: statusConfig[selectedLog.status].bg, color: statusConfig[selectedLog.status].text, borderRadius: '8px', border: `1px solid ${statusConfig[selectedLog.status].border}`, display: 'inline-block', textTransform: 'capitalize' }}>{selectedLog.status}</span>
              </div>
              <div><label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>Event Type</label>
                <span style={{ padding: '4px 12px', fontSize: '12px', fontWeight: 600, backgroundColor: eventTypeConfig[selectedLog.eventType].bg, color: eventTypeConfig[selectedLog.eventType].text, borderRadius: '8px', border: `1px solid ${eventTypeConfig[selectedLog.eventType].border}`, display: 'inline-block', textTransform: 'capitalize' }}>{selectedLog.eventType.replace('_', ' ')}</span>
              </div>
              <div><label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>Timestamp</label><p style={{ fontSize: '14px', color: '#0d0e0f', margin: 0, fontFamily: 'monospace' }}>{selectedLog.timestamp}</p></div>
              <div><label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>User</label><p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0e0f', margin: 0 }}>{selectedLog.user}</p><p style={{ fontSize: '13px', color: '#6C727F', margin: 0 }}>{selectedLog.userEmail}</p></div>
              <div><label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>IP Address</label><p style={{ fontSize: '14px', color: '#0d0e0f', margin: 0, fontFamily: 'monospace' }}>{selectedLog.ipAddress}</p></div>
            </div>
            <div><label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>Event</label><p style={{ fontSize: '16px', fontWeight: 600, color: '#0d0e0f', margin: 0 }}>{selectedLog.event}</p></div>
            <div><label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>Details</label><p style={{ fontSize: '14px', color: '#0d0e0f', margin: 0, lineHeight: '1.6' }}>{selectedLog.details}</p></div>
            <div style={{ display: 'flex', gap: '12px', paddingTop: '16px', borderTop: '1px solid #E5E5E5' }}>
              <button onClick={() => handleExportLog(selectedLog)} style={{ flex: 1, padding: '12px 20px', background: '#CD1B78', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 600, color: '#fff', cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#A81563')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#CD1B78')}>Export Log</button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

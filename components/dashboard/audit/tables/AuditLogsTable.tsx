'use client';

import { useState } from 'react';
import { useAuditLogs } from '@/hooks/useAudit';
import { Loader2 } from 'lucide-react';

export function AuditLogsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading } = useAuditLogs({ page: currentPage, pageSize: 20 });

  if (isLoading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#CD1B78', display: 'inline-block' }} />
      </div>
    );
  }

  const logs = data?.logs || [];
  
  return (
    <div style={{ background: '#fff', borderRadius: '20px', boxShadow: '1px 1px 6px 3px rgba(0, 0, 0, 0.07)', border: '1px solid #F0F0F0', padding: '24px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0d0e0f', marginBottom: '24px' }}>Audit Logs</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #E5E5E5' }}>
            <th style={{ textAlign: 'left', padding: '12px', fontSize: '13px', fontWeight: 600, color: '#6C727F' }}>Event</th>
            <th style={{ textAlign: 'left', padding: '12px', fontSize: '13px', fontWeight: 600, color: '#6C727F' }}>User</th>
            <th style={{ textAlign: 'left', padding: '12px', fontSize: '13px', fontWeight: 600, color: '#6C727F' }}>Type</th>
            <th style={{ textAlign: 'left', padding: '12px', fontSize: '13px', fontWeight: 600, color: '#6C727F' }}>Status</th>
            <th style={{ textAlign: 'left', padding: '12px', fontSize: '13px', fontWeight: 600, color: '#6C727F' }}>Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log: any) => (
            <tr key={log.auditLogId} style={{ borderBottom: '1px solid #F0F0F0' }}>
              <td style={{ padding: '12px', fontSize: '14px' }}>{log.action}</td>
              <td style={{ padding: '12px', fontSize: '14px' }}>{log.userEmail || 'System'}</td>
              <td style={{ padding: '12px', fontSize: '14px' }}>{log.eventType}</td>
              <td style={{ padding: '12px', fontSize: '14px' }}>{log.status}</td>
              <td style={{ padding: '12px', fontSize: '14px' }}>{new Date(log.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p>Showing {logs.length} of {data?.total || 0} logs</p>
        <div>
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ padding: '8px 16px', marginRight: '8px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}>Previous</button>
          <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= (data?.totalPages || 1)} style={{ padding: '8px 16px', cursor: currentPage >= (data?.totalPages || 1) ? 'not-allowed' : 'pointer' }}>Next</button>
        </div>
      </div>
    </div>
  );
}

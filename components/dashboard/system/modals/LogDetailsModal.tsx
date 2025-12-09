'use client';

import { Modal } from '@/components/common/Modal';
import { X } from 'lucide-react';

interface LogDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: {
    id: string;
    service: string;
    message: string;
    method: string;
    timestamp: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
  };
}

// Extended log details
const getLogDetails = (logId: string) => {
  const detailsMap: { [key: string]: any } = {
    '1': {
      statusCode: 500,
      endpoint: '/api/v1/users',
      stackTrace: 'Error: Connection timeout\n    at Database.connect (database.js:45:12)\n    at UserService.createUser (userService.js:23:8)\n    at async UserController.create (userController.js:15:5)',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      ipAddress: '192.168.1.100',
      fullTimestamp: '2024-12-08 14:23:45 UTC',
      requestBody: '{"name": "John Doe", "email": "john@example.com"}',
      responseTime: '5000ms',
    },
    '2': {
      statusCode: 429,
      endpoint: '/api/v1/leads',
      stackTrace: 'Error: Too many requests from this IP\n    at RateLimiter.check (rateLimiter.js:34:10)\n    at LeadController.getLeads (leadController.js:12:5)',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      ipAddress: '10.0.0.45',
      fullTimestamp: '2024-12-08 14:08:12 UTC',
      requestBody: null,
      responseTime: '120ms',
    },
    '3': {
      statusCode: 504,
      endpoint: '/api/v1/transactions',
      stackTrace: 'Error: Gateway timeout while processing payment\n    at PaymentGateway.process (gateway.js:78:15)\n    at TransactionService.create (transactionService.js:45:10)\n    at async TransactionController.create (transactionController.js:20:7)',
      userAgent: 'PostmanRuntime/7.32.3',
      ipAddress: '172.16.0.12',
      fullTimestamp: '2024-12-08 13:45:30 UTC',
      requestBody: '{"amount": 99.99, "currency": "USD", "paymentMethod": "card"}',
      responseTime: '30000ms',
    },
  };

  return detailsMap[logId] || {
    statusCode: 500,
    endpoint: '/api/unknown',
    stackTrace: 'Stack trace not available',
    userAgent: 'Unknown',
    ipAddress: 'Unknown',
    fullTimestamp: 'Unknown',
    requestBody: null,
    responseTime: 'Unknown',
  };
};

const severityColors = {
  critical: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', border: '#fecaca' },
  high: { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', border: '#fef3c7' },
  medium: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6', border: '#dbeafe' },
  low: { bg: 'rgba(156, 163, 175, 0.1)', text: '#6b7280', border: '#e5e7eb' },
};

export function LogDetailsModal({ isOpen, onClose, log }: LogDetailsModalProps) {
  const details = getLogDetails(log.id);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Exception Log Details" size="lg">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Header Info */}
        <div
          style={{
            padding: '14px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(205, 27, 120, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)',
            border: '1px solid rgba(205, 27, 120, 0.2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#0d0e0f', margin: 0 }}>{log.message}</h4>
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
          </div>
          <p style={{ fontSize: '13px', color: '#6C727F', margin: 0 }}>
            {log.service} • {log.method}
          </p>
        </div>

        {/* Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '4px' }}>
              LOG ID
            </label>
            <p style={{ fontSize: '13px', color: '#0d0e0f', margin: 0, fontFamily: 'monospace' }}>LOG-00{log.id}</p>
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '4px' }}>
              TIMESTAMP
            </label>
            <p style={{ fontSize: '13px', color: '#0d0e0f', margin: 0 }}>{details.fullTimestamp}</p>
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '4px' }}>
              STATUS CODE
            </label>
            <p style={{ fontSize: '13px', color: '#0d0e0f', margin: 0, fontFamily: 'monospace' }}>
              {details.statusCode}
            </p>
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '4px' }}>
              RESPONSE TIME
            </label>
            <p style={{ fontSize: '13px', color: '#0d0e0f', margin: 0, fontFamily: 'monospace' }}>
              {details.responseTime}
            </p>
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '4px' }}>
              ENDPOINT
            </label>
            <p style={{ fontSize: '13px', color: '#0d0e0f', margin: 0, fontFamily: 'monospace' }}>{details.endpoint}</p>
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '4px' }}>
              IP ADDRESS
            </label>
            <p style={{ fontSize: '13px', color: '#0d0e0f', margin: 0, fontFamily: 'monospace' }}>{details.ipAddress}</p>
          </div>
        </div>

        {/* User Agent */}
        <div>
          <label style={{ fontSize: '11px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '4px' }}>
            USER AGENT
          </label>
          <p style={{ fontSize: '13px', color: '#0d0e0f', margin: 0, wordBreak: 'break-all' }}>{details.userAgent}</p>
        </div>

        {/* Request Body */}
        {details.requestBody && (
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '4px' }}>
              REQUEST BODY
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
                  color: '#0d0e0f',
                  margin: 0,
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {details.requestBody}
              </pre>
            </div>
          </div>
        )}

        {/* Stack Trace */}
        <div>
          <label style={{ fontSize: '11px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '4px' }}>
            STACK TRACE
          </label>
          <div
            style={{
              padding: '12px',
              backgroundColor: '#FEF2F2',
              borderRadius: '8px',
              border: '1px solid #FECACA',
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
                lineHeight: 1.6,
              }}
            >
              {details.stackTrace}
            </pre>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '4px', paddingTop: '16px', borderTop: '1px solid #E5E5E5' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '11px',
              borderRadius: '10px',
              border: '1px solid #E5E5E5',
              backgroundColor: '#fff',
              color: '#0d0e0f',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F2F2F2';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fff';
            }}
          >
            Close
          </button>
          <button
            style={{
              flex: 1,
              padding: '11px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: '#CD1B78',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#a01560';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#CD1B78';
            }}
          >
            Export Log
          </button>
        </div>
      </div>
    </Modal>
  );
}

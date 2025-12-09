'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Download, Filter, MoreVertical, Eye, RefreshCw, CheckCircle, XCircle, Clock, CreditCard, X, Trash2, Send } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { Dropdown } from '@/components/common/Dropdown';
import { ConfirmationModal } from '@/components/common/ConfirmationModal';
import { toast } from 'sonner';

interface Transaction {
  id: string;
  user: string;
  email: string;
  type: 'subscription' | 'refund' | 'payment';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  plan?: string;
  date: string;
  method: string;
}

const mockTransactions: Transaction[] = [
  { id: 'TXN-001', user: 'Sarah Johnson', email: 'sarah.j@example.com', type: 'subscription', amount: 49.99, status: 'completed', plan: 'Pro Plan', date: '2024-12-06', method: 'Visa ****4242' },
  { id: 'TXN-002', user: 'Michael Chen', email: 'm.chen@business.com', type: 'subscription', amount: 99.99, status: 'completed', plan: 'Enterprise', date: '2024-12-05', method: 'Mastercard ****8888' },
  { id: 'TXN-003', user: 'Emma Davis', email: 'emma.d@agency.com', type: 'payment', amount: 199.00, status: 'pending', plan: 'Custom Package', date: '2024-12-05', method: 'PayPal' },
  { id: 'TXN-004', user: 'James Wilson', email: 'james.w@mail.com', type: 'refund', amount: -29.99, status: 'completed', plan: 'Basic Plan', date: '2024-12-04', method: 'Visa ****1234' },
  { id: 'TXN-005', user: 'Lisa Anderson', email: 'lisa.a@startup.io', type: 'subscription', amount: 49.99, status: 'failed', plan: 'Pro Plan', date: '2024-12-04', method: 'Visa ****5678' },
  { id: 'TXN-006', user: 'David Brown', email: 'david.b@tech.com', type: 'subscription', amount: 79.99, status: 'completed', plan: 'Pro Plus', date: '2024-12-03', method: 'Amex ****3333' },
  { id: 'TXN-007', user: 'Sophie Taylor', email: 'sophie.t@design.co', type: 'payment', amount: 149.00, status: 'completed', plan: 'One-time Payment', date: '2024-12-03', method: 'PayPal' },
  { id: 'TXN-008', user: 'Alex Martinez', email: 'alex.m@company.com', type: 'subscription', amount: 29.99, status: 'pending', plan: 'Basic Plan', date: '2024-12-02', method: 'Visa ****9876' },
];

const statusConfig = {
  completed: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981', border: '#d1fae5', icon: CheckCircle },
  pending: { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', border: '#fef3c7', icon: Clock },
  failed: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', border: '#fecaca', icon: XCircle },
};

const typeConfig = {
  subscription: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6', border: '#dbeafe' },
  payment: { bg: 'rgba(205, 27, 120, 0.1)', text: '#CD1B78', border: '#fce4ec' },
  refund: { bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280', border: '#e5e7eb' },
};

export function TransactionsTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRefundConfirm, setShowRefundConfirm] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [transactionToRefund, setTransactionToRefund] = useState<Transaction | null>(null);

  const filteredTransactions = mockTransactions.filter((txn) => {
    const matchesSearch =
      txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || txn.status === statusFilter;
    const matchesType = typeFilter === 'all' || txn.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const activeFiltersCount = (statusFilter !== 'all' ? 1 : 0) + (typeFilter !== 'all' ? 1 : 0);

  const clearFilters = () => {
    setStatusFilter('all');
    setTypeFilter('all');
  };

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowViewModal(true);
  };

  const handleRetryTransaction = (transaction: Transaction) => {
    toast.success(`Retrying transaction ${transaction.id}...`);
  };

  const handleRefundClick = (transaction: Transaction) => {
    setTransactionToRefund(transaction);
    setShowRefundConfirm(true);
  };

  const confirmRefund = () => {
    if (transactionToRefund) {
      toast.success(`Refund processed for ${transactionToRefund.id}`);
      setTransactionToRefund(null);
    }
  };

  const handleSendReceipt = (transaction: Transaction) => {
    toast.success(`Receipt sent to ${transaction.email}`);
  };

  const handleDownloadInvoice = (transaction: Transaction) => {
    toast.success(`Downloading invoice for ${transaction.id}...`);
  };

  const handleDeleteClick = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (transactionToDelete) {
      toast.success(`Transaction ${transactionToDelete.id} deleted`);
      setTransactionToDelete(null);
    }
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
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0d0e0f' }}>Recent Transactions</h3>
              <p style={{ fontSize: '14px', color: '#6C727F', marginTop: '4px' }}>
                View and manage all payment transactions
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {/* Search */}
              <div style={{ position: 'relative', width: '280px' }}>
                <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#9EA3AE' }} />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 36px 10px 40px',
                    border: '1px solid #E5E5E5',
                    borderRadius: '12px',
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
                      borderRadius: '6px',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F2F2F2')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <X style={{ width: '14px', height: '14px', color: '#6C727F' }} />
                  </button>
                )}
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  background: showFilters ? '#F9FAFB' : '#fff',
                  border: '1px solid #E5E5E5',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#0d0e0f',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  if (!showFilters) e.currentTarget.style.backgroundColor = '#F9FAFB';
                }}
                onMouseLeave={(e) => {
                  if (!showFilters) e.currentTarget.style.backgroundColor = '#fff';
                }}
              >
                <Filter style={{ width: '16px', height: '16px' }} />
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
                    padding: '16px',
                    background: '#F9FAFB',
                    borderRadius: '12px',
                    marginTop: '16px',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ flex: '1', minWidth: '200px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>
                      Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
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
                      <option value="all">All Statuses</option>
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>

                  <div style={{ flex: '1', minWidth: '200px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>
                      Type
                    </label>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
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
                      <option value="all">All Types</option>
                      <option value="subscription">Subscription</option>
                      <option value="payment">Payment</option>
                      <option value="refund">Refund</option>
                    </select>
                  </div>

                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
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
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F2F2F2')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F', borderBottom: '1px solid #E5E5E5' }}>Transaction ID</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F', borderBottom: '1px solid #E5E5E5' }}>User</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F', borderBottom: '1px solid #E5E5E5' }}>Type</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F', borderBottom: '1px solid #E5E5E5' }}>Amount</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F', borderBottom: '1px solid #E5E5E5' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F', borderBottom: '1px solid #E5E5E5' }}>Date</th>
                <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F', borderBottom: '1px solid #E5E5E5' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction, index) => {
                const StatusIcon = statusConfig[transaction.status].icon;
                return (
                  <motion.tr
                    key={transaction.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    style={{
                      background: '#fff',
                      border: '1px solid #F0F0F0',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      const row = e.currentTarget;
                      row.style.backgroundColor = '#F9FAFB';
                      row.style.transform = 'scale(1.01)';
                      row.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      const row = e.currentTarget;
                      row.style.backgroundColor = '#fff';
                      row.style.transform = 'scale(1)';
                      row.style.boxShadow = 'none';
                    }}
                  >
                    <td style={{ padding: '16px', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#0d0e0f', fontFamily: 'monospace' }}>
                        {transaction.id}
                      </span>
                    </td>

                    <td style={{ padding: '16px' }}>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0e0f', marginBottom: '4px' }}>
                          {transaction.user}
                        </p>
                        <p style={{ fontSize: '13px', color: '#6C727F', margin: 0 }}>{transaction.email}</p>
                      </div>
                    </td>

                    <td style={{ padding: '16px' }}>
                      <span
                        style={{
                          padding: '4px 12px',
                          fontSize: '12px',
                          fontWeight: 600,
                          backgroundColor: typeConfig[transaction.type].bg,
                          color: typeConfig[transaction.type].text,
                          borderRadius: '8px',
                          border: `1px solid ${typeConfig[transaction.type].border}`,
                          display: 'inline-block',
                          textTransform: 'capitalize',
                        }}
                      >
                        {transaction.type}
                      </span>
                    </td>

                    <td style={{ padding: '16px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: transaction.amount < 0 ? '#ef4444' : '#0d0e0f', fontFamily: 'monospace' }}>
                        ${Math.abs(transaction.amount).toFixed(2)}
                      </span>
                    </td>

                    <td style={{ padding: '16px' }}>
                      <span
                        style={{
                          padding: '4px 12px',
                          fontSize: '12px',
                          fontWeight: 600,
                          backgroundColor: statusConfig[transaction.status].bg,
                          color: statusConfig[transaction.status].text,
                          borderRadius: '8px',
                          border: `1px solid ${statusConfig[transaction.status].border}`,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          textTransform: 'capitalize',
                        }}
                      >
                        <StatusIcon style={{ width: '12px', height: '12px' }} />
                        {transaction.status}
                      </span>
                    </td>

                    <td style={{ padding: '16px' }}>
                      <span style={{ fontSize: '13px', color: '#6C727F' }}>
                        {new Date(transaction.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </td>

                    <td style={{ padding: '16px', textAlign: 'right', borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleViewTransaction(transaction)}
                          style={{
                            padding: '8px 12px',
                            background: '#fff',
                            border: '1px solid #E5E5E5',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '13px',
                            fontWeight: 500,
                            color: '#6C727F',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#F2F2F2';
                            e.currentTarget.style.borderColor = '#D1D5DB';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#fff';
                            e.currentTarget.style.borderColor = '#E5E5E5';
                          }}
                        >
                          <Eye style={{ width: '14px', height: '14px' }} />
                          View
                        </button>

                        <Dropdown
                          trigger={
                            <button
                              style={{
                                padding: '8px',
                                background: '#fff',
                                border: '1px solid #E5E5E5',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#F2F2F2';
                                e.currentTarget.style.borderColor = '#D1D5DB';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#fff';
                                e.currentTarget.style.borderColor = '#E5E5E5';
                              }}
                            >
                              <MoreVertical style={{ width: '16px', height: '16px', color: '#6C727F' }} />
                            </button>
                          }
                          items={[
                            {
                              label: 'Download Invoice',
                              icon: <Download style={{ width: '16px', height: '16px' }} />,
                              onClick: () => handleDownloadInvoice(transaction),
                            },
                            {
                              label: 'Send Receipt',
                              icon: <Send style={{ width: '16px', height: '16px' }} />,
                              onClick: () => handleSendReceipt(transaction),
                            },
                            ...(transaction.status === 'failed'
                              ? [
                                  {
                                    label: 'Retry Payment',
                                    icon: <RefreshCw style={{ width: '16px', height: '16px' }} />,
                                    onClick: () => handleRetryTransaction(transaction),
                                  },
                                ]
                              : []),
                            ...(transaction.status === 'completed' && transaction.type !== 'refund'
                              ? [
                                  {
                                    label: 'Process Refund',
                                    icon: <CreditCard style={{ width: '16px', height: '16px' }} />,
                                    onClick: () => handleRefundClick(transaction),
                                  },
                                ]
                              : []),
                            {
                              label: 'Delete',
                              icon: <Trash2 style={{ width: '16px', height: '16px' }} />,
                              onClick: () => handleDeleteClick(transaction),
                              variant: 'danger' as const,
                            },
                          ]}
                        />
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #E5E5E5', flexWrap: 'wrap', gap: '16px' }}>
          <p style={{ fontSize: '14px', color: '#6C727F' }}>
            Showing {filteredTransactions.length} of {mockTransactions.length} transactions
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              disabled
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: 500,
                color: '#9EA3AE',
                background: 'transparent',
                border: '1px solid #E5E5E5',
                borderRadius: '8px',
                cursor: 'not-allowed',
              }}
            >
              Previous
            </button>
            <button
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: 500,
                color: '#0d0e0f',
                background: 'transparent',
                border: '1px solid #E5E5E5',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F2F2F2')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* View Transaction Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Transaction Details"
        size="md"
      >
        {selectedTransaction && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>
                  Transaction ID
                </label>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0e0f', margin: 0, fontFamily: 'monospace' }}>
                  {selectedTransaction.id}
                </p>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>
                  Status
                </label>
                <span
                  style={{
                    padding: '4px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    backgroundColor: statusConfig[selectedTransaction.status].bg,
                    color: statusConfig[selectedTransaction.status].text,
                    borderRadius: '8px',
                    border: `1px solid ${statusConfig[selectedTransaction.status].border}`,
                    display: 'inline-block',
                    textTransform: 'capitalize',
                  }}
                >
                  {selectedTransaction.status}
                </span>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>
                  User
                </label>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0e0f', margin: 0 }}>
                  {selectedTransaction.user}
                </p>
                <p style={{ fontSize: '13px', color: '#6C727F', margin: 0 }}>{selectedTransaction.email}</p>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>
                  Amount
                </label>
                <p style={{ fontSize: '18px', fontWeight: 700, color: selectedTransaction.amount < 0 ? '#ef4444' : '#0d0e0f', margin: 0, fontFamily: 'monospace' }}>
                  ${Math.abs(selectedTransaction.amount).toFixed(2)}
                </p>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>
                  Type
                </label>
                <span
                  style={{
                    padding: '4px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    backgroundColor: typeConfig[selectedTransaction.type].bg,
                    color: typeConfig[selectedTransaction.type].text,
                    borderRadius: '8px',
                    border: `1px solid ${typeConfig[selectedTransaction.type].border}`,
                    display: 'inline-block',
                    textTransform: 'capitalize',
                  }}
                >
                  {selectedTransaction.type}
                </span>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>
                  Date
                </label>
                <p style={{ fontSize: '14px', color: '#0d0e0f', margin: 0 }}>
                  {new Date(selectedTransaction.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>
                  Plan
                </label>
                <p style={{ fontSize: '14px', color: '#0d0e0f', margin: 0 }}>
                  {selectedTransaction.plan || 'N/A'}
                </p>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>
                  Payment Method
                </label>
                <p style={{ fontSize: '14px', color: '#0d0e0f', margin: 0 }}>
                  {selectedTransaction.method}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', paddingTop: '16px', borderTop: '1px solid #E5E5E5' }}>
              <button
                onClick={() => handleDownloadInvoice(selectedTransaction)}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  background: '#fff',
                  border: '1px solid #E5E5E5',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#0d0e0f',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F2F2F2')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
              >
                Download Invoice
              </button>
              <button
                onClick={() => handleSendReceipt(selectedTransaction)}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  background: '#CD1B78',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#fff',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#A81563')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#CD1B78')}
              >
                Send Receipt
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setTransactionToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Transaction"
        message={`Are you sure you want to delete transaction ${transactionToDelete?.id}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Refund Confirmation Modal */}
      <ConfirmationModal
        isOpen={showRefundConfirm}
        onClose={() => {
          setShowRefundConfirm(false);
          setTransactionToRefund(null);
        }}
        onConfirm={confirmRefund}
        title="Process Refund"
        message={`Are you sure you want to process a refund of $${transactionToRefund?.amount.toFixed(2)} for transaction ${transactionToRefund?.id}? This will refund the payment to the customer.`}
        confirmText="Process Refund"
        cancelText="Cancel"
        variant="warning"
      />
    </>
  );
}

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Download, Filter, MoreVertical, Eye, RefreshCw, CheckCircle, XCircle, Clock, CreditCard, X, Trash2, Send, Loader2 } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { Dropdown } from '@/components/common/Dropdown';
import { ConfirmationModal } from '@/components/common/ConfirmationModal';
import { toast } from 'sonner';
import { useRecentTransactions } from '@/hooks/useFinance';
import type { RecentTransactionDto } from '@/lib/api/finance-service';
import type { ElementType } from 'react';

const statusConfig: Record<string, { bg: string; text: string; border: string; icon: ElementType }> = {
  success: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981', border: '#d1fae5', icon: CheckCircle },
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
  const { data: transactionsData, isLoading } = useRecentTransactions(50);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<RecentTransactionDto | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRefundConfirm, setShowRefundConfirm] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<RecentTransactionDto | null>(null);
  const [transactionToRefund, setTransactionToRefund] = useState<RecentTransactionDto | null>(null);

  // Transform API transactions to component format
  const allTransactions = transactionsData?.transactions || [];

  const filteredTransactions = allTransactions.filter((txn) => {
    const matchesSearch =
      txn.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.userEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || txn.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesType = typeFilter === 'all' || txn.channel.toLowerCase().includes(typeFilter.toLowerCase());
    return matchesSearch && matchesStatus && matchesType;
  });

  const activeFiltersCount = (statusFilter !== 'all' ? 1 : 0) + (typeFilter !== 'all' ? 1 : 0);

  const clearFilters = () => {
    setStatusFilter('all');
    setTypeFilter('all');
  };

  const handleViewTransaction = (transaction: RecentTransactionDto) => {
    setSelectedTransaction(transaction);
    setShowViewModal(true);
  };

  const handleRetryTransaction = (transaction: RecentTransactionDto) => {
    toast.success(`Retrying transaction ${transaction.transactionId}...`);
  };

  const handleRefundClick = (transaction: RecentTransactionDto) => {
    setTransactionToRefund(transaction);
    setShowRefundConfirm(true);
  };

  const confirmRefund = () => {
    if (transactionToRefund) {
      toast.success(`Refund processed for ${transactionToRefund.transactionId}`);
      setTransactionToRefund(null);
    }
  };

  const handleSendReceipt = (transaction: RecentTransactionDto) => {
    toast.success(`Receipt sent to ${transaction.userEmail}`);
  };

  const handleDownloadInvoice = (transaction: RecentTransactionDto) => {
    toast.success(`Downloading invoice for ${transaction.transactionId}...`);
  };

  const handleDeleteClick = (transaction: RecentTransactionDto) => {
    setTransactionToDelete(transaction);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (transactionToDelete) {
      toast.success(`Transaction ${transactionToDelete.transactionId} deleted`);
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
        {isLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 0' }}>
            <Loader2 className="h-8 w-8 animate-spin text-primary" style={{ color: '#CD1B78' }} />
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 0' }}>
            <p style={{ fontSize: '14px', color: '#6C727F' }}>No transactions found</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F', borderBottom: '1px solid #E5E5E5' }}>Transaction ID</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F', borderBottom: '1px solid #E5E5E5' }}>User</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F', borderBottom: '1px solid #E5E5E5' }}>Channel</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F', borderBottom: '1px solid #E5E5E5' }}>Amount</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F', borderBottom: '1px solid #E5E5E5' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F', borderBottom: '1px solid #E5E5E5' }}>Date</th>
                  <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F', borderBottom: '1px solid #E5E5E5' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction, index) => {
                  const statusKey = transaction.status.toLowerCase();
                  const StatusIcon = statusConfig[statusKey]?.icon || CheckCircle;
                  return (
                    <motion.tr
                      key={transaction.transactionId}
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
                          {transaction.transactionId}
                        </span>
                      </td>

                      <td style={{ padding: '16px' }}>
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0e0f', marginBottom: '4px' }}>
                            {transaction.userName}
                          </p>
                          <p style={{ fontSize: '13px', color: '#6C727F', margin: 0 }}>{transaction.userEmail}</p>
                        </div>
                      </td>

                      <td style={{ padding: '16px' }}>
                        <span
                          style={{
                            padding: '4px 12px',
                            fontSize: '12px',
                            fontWeight: 600,
                            backgroundColor: typeConfig.payment.bg,
                            color: typeConfig.payment.text,
                            borderRadius: '8px',
                            border: `1px solid ${typeConfig.payment.border}`,
                            display: 'inline-block',
                            textTransform: 'capitalize',
                          }}
                        >
                          {transaction.channel}
                        </span>
                      </td>

                      <td style={{ padding: '16px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: '#0d0e0f', fontFamily: 'monospace' }}>
                          {transaction.currency} {transaction.amount.toLocaleString()}
                        </span>
                      </td>

                      <td style={{ padding: '16px' }}>
                        <span
                          style={{
                            padding: '4px 12px',
                            fontSize: '12px',
                            fontWeight: 600,
                            backgroundColor: statusConfig[statusKey]?.bg || statusConfig.completed.bg,
                            color: statusConfig[statusKey]?.text || statusConfig.completed.text,
                            borderRadius: '8px',
                            border: `1px solid ${statusConfig[statusKey]?.border || statusConfig.completed.border}`,
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
                          {new Date(transaction.createdAt).toLocaleDateString('en-US', {
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
                              ...(statusKey === 'failed'
                                ? [
                                  {
                                    label: 'Retry Payment',
                                    icon: <RefreshCw style={{ width: '16px', height: '16px' }} />,
                                    onClick: () => handleRetryTransaction(transaction),
                                  },
                                ]
                                : []),
                              ...(statusKey === 'success' || statusKey === 'completed'
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
        )}

        {/* Pagination */}
        {!isLoading && filteredTransactions.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #E5E5E5', flexWrap: 'wrap', gap: '16px' }}>
            <p style={{ fontSize: '14px', color: '#6C727F' }}>
              Showing {filteredTransactions.length} of {transactionsData?.total || 0} transactions
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
        )}
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
                  {selectedTransaction.transactionId}
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
                    backgroundColor: statusConfig[selectedTransaction.status.toLowerCase()]?.bg || statusConfig.completed.bg,
                    color: statusConfig[selectedTransaction.status.toLowerCase()]?.text || statusConfig.completed.text,
                    borderRadius: '8px',
                    border: `1px solid ${statusConfig[selectedTransaction.status.toLowerCase()]?.border || statusConfig.completed.border}`,
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
                  {selectedTransaction.userName}
                </p>
                <p style={{ fontSize: '13px', color: '#6C727F', margin: 0 }}>{selectedTransaction.userEmail}</p>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>
                  Amount
                </label>
                <p style={{ fontSize: '18px', fontWeight: 700, color: '#0d0e0f', margin: 0, fontFamily: 'monospace' }}>
                  {selectedTransaction.currency} {selectedTransaction.amount.toLocaleString()}
                </p>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>
                  Channel
                </label>
                <span
                  style={{
                    padding: '4px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    backgroundColor: typeConfig.payment.bg,
                    color: typeConfig.payment.text,
                    borderRadius: '8px',
                    border: `1px solid ${typeConfig.payment.border}`,
                    display: 'inline-block',
                    textTransform: 'capitalize',
                  }}
                >
                  {selectedTransaction.channel}
                </span>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>
                  Date
                </label>
                <p style={{ fontSize: '14px', color: '#0d0e0f', margin: 0 }}>
                  {new Date(selectedTransaction.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>
                  Reference
                </label>
                <p style={{ fontSize: '14px', color: '#0d0e0f', margin: 0 }}>
                  {selectedTransaction.reference || 'N/A'}
                </p>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>
                  Narration
                </label>
                <p style={{ fontSize: '14px', color: '#0d0e0f', margin: 0 }}>
                  {selectedTransaction.narration || 'N/A'}
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
        message={`Are you sure you want to delete transaction ${transactionToDelete?.transactionId}? This action cannot be undone.`}
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
        message={`Are you sure you want to process a refund of ${transactionToRefund?.currency} ${transactionToRefund?.amount.toLocaleString()} for transaction ${transactionToRefund?.transactionId}? This will refund the payment to the customer.`}
        confirmText="Process Refund"
        cancelText="Cancel"
        variant="warning"
      />
    </>
  );
}

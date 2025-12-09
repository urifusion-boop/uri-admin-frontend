'use client';

import { useState } from 'react';
import { Search, Filter, Clock, CheckCircle, AlertCircle, X, Eye, MoreVertical, XCircle, MessageCircle, Edit, UserCheck, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '@/components/common/Modal';
import { Dropdown } from '@/components/common/Dropdown';
import { ConfirmationModal } from '@/components/common/ConfirmationModal';
import { EditTicketModal } from '../modals/EditTicketModal';
import { toast } from 'sonner';

interface Ticket {
  id: string;
  subject: string;
  user: string;
  email: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  createdAt: string;
  category: string;
  description: string;
}

const tickets: Ticket[] = [
  {
    id: 'TCK-001',
    subject: 'Unable to process payment',
    user: 'John Doe',
    email: 'john@example.com',
    status: 'Open',
    priority: 'Urgent',
    createdAt: '2 hours ago',
    category: 'Payment',
    description: 'Customer is unable to complete payment checkout. Error occurs at the final step.',
  },
  {
    id: 'TCK-002',
    subject: 'Lead generation not working',
    user: 'Sarah Smith',
    email: 'sarah@business.com',
    status: 'In Progress',
    priority: 'High',
    createdAt: '5 hours ago',
    category: 'Leads',
    description: 'Lead form is not capturing submissions properly. Multiple customers reported this issue.',
  },
  {
    id: 'TCK-003',
    subject: 'Profile image upload failed',
    user: 'Mike Johnson',
    email: 'mike@creative.com',
    status: 'Resolved',
    priority: 'Medium',
    createdAt: '1 day ago',
    category: 'Profile',
    description: 'User cannot upload profile picture. System shows generic error message.',
  },
  {
    id: 'TCK-004',
    subject: 'Dashboard loading slowly',
    user: 'Emma Wilson',
    email: 'emma@agency.com',
    status: 'Open',
    priority: 'Low',
    createdAt: '2 days ago',
    category: 'Performance',
    description: 'Dashboard takes over 10 seconds to load. User has fast internet connection.',
  },
  {
    id: 'TCK-005',
    subject: 'Cannot connect Instagram account',
    user: 'Alex Brown',
    email: 'alex@creative.com',
    status: 'In Progress',
    priority: 'High',
    createdAt: '3 hours ago',
    category: 'Integration',
    description: 'OAuth connection fails when linking Instagram account. Returns 401 error.',
  },
];

const statusConfig = {
  'Open': {
    icon: Clock,
    bg: 'rgba(59, 130, 246, 0.1)',
    text: '#3b82f6',
    border: '#dbeafe',
  },
  'In Progress': {
    icon: AlertCircle,
    bg: 'rgba(245, 158, 11, 0.1)',
    text: '#f59e0b',
    border: '#fef3c7',
  },
  'Resolved': {
    icon: CheckCircle,
    bg: 'rgba(16, 185, 129, 0.1)',
    text: '#10b981',
    border: '#d1fae5',
  },
  'Closed': {
    icon: XCircle,
    bg: 'rgba(156, 163, 175, 0.1)',
    text: '#6b7280',
    border: '#e5e7eb',
  },
};

const priorityConfig = {
  'Low': { bg: 'rgba(156, 163, 175, 0.1)', text: '#6b7280', border: '#e5e7eb' },
  'Medium': { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6', border: '#dbeafe' },
  'High': { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', border: '#fef3c7' },
  'Urgent': { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', border: '#fecaca' },
};

export function TicketsTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<Ticket | null>(null);
  const [ticketToClose, setTicketToClose] = useState<Ticket | null>(null);

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const activeFiltersCount = (statusFilter !== 'all' ? 1 : 0) + (priorityFilter !== 'all' ? 1 : 0);

  const clearFilters = () => {
    setStatusFilter('all');
    setPriorityFilter('all');
  };

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowViewModal(true);
  };

  const handleEditClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowEditModal(true);
  };

  const handleReplyTicket = (ticket: Ticket) => {
    toast.success(`Opening reply for ${ticket.id}...`);
  };

  const handleAssignTicket = (ticket: Ticket) => {
    toast.success(`Assigning ticket ${ticket.id}...`);
  };

  const handleCloseClick = (ticket: Ticket) => {
    setTicketToClose(ticket);
    setShowCloseConfirm(true);
  };

  const confirmClose = () => {
    if (ticketToClose) {
      toast.success(`Ticket ${ticketToClose.id} has been closed`);
      setTicketToClose(null);
    }
  };

  const handleDeleteClick = (ticket: Ticket) => {
    setTicketToDelete(ticket);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (ticketToDelete) {
      toast.success(`Ticket ${ticketToDelete.id} has been deleted`);
      setTicketToDelete(null);
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
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0d0e0f' }}>Support Tickets</h3>
              <p style={{ fontSize: '14px', color: '#6C727F', marginTop: '4px' }}>
                Manage customer support requests and issues
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Search */}
              <div style={{ position: 'relative', width: '280px' }}>
                <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#9EA3AE' }} />
                <input
                  type="text"
                  placeholder="Search tickets..."
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
                  position: 'relative',
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

              {/* New Ticket Button */}
              <button
                onClick={() => toast.success('Creating new ticket...')}
                style={{
                  padding: '10px 20px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: '#CD1B78',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#A81563';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#CD1B78';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                New Ticket
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
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  <div style={{ flex: '1', minWidth: '200px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>
                      Priority
                    </label>
                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
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
                      <option value="all">All Priorities</option>
                      <option value="urgent">Urgent</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
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
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F', borderBottom: '1px solid #E5E5E5' }}>
                  Ticket ID
                </th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F', borderBottom: '1px solid #E5E5E5' }}>
                  Subject & User
                </th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F', borderBottom: '1px solid #E5E5E5' }}>
                  Priority
                </th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F', borderBottom: '1px solid #E5E5E5' }}>
                  Status
                </th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F', borderBottom: '1px solid #E5E5E5' }}>
                  Created
                </th>
                <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F', borderBottom: '1px solid #E5E5E5' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket, index) => {
                const StatusIcon = statusConfig[ticket.status].icon;
                return (
                  <motion.tr
                    key={ticket.id}
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
                    {/* Ticket ID */}
                    <td style={{ padding: '16px', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#0d0e0f', fontFamily: 'monospace' }}>
                        {ticket.id}
                      </span>
                    </td>

                    {/* Subject & User */}
                    <td style={{ padding: '16px' }}>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0e0f', marginBottom: '4px' }}>
                          {ticket.subject}
                        </p>
                        <p style={{ fontSize: '13px', color: '#6C727F', margin: 0 }}>
                          {ticket.user} • {ticket.category}
                        </p>
                      </div>
                    </td>

                    {/* Priority */}
                    <td style={{ padding: '16px' }}>
                      <span
                        style={{
                          padding: '4px 10px',
                          fontSize: '12px',
                          fontWeight: 600,
                          backgroundColor: priorityConfig[ticket.priority].bg,
                          color: priorityConfig[ticket.priority].text,
                          borderRadius: '8px',
                          border: `1px solid ${priorityConfig[ticket.priority].border}`,
                          textTransform: 'capitalize',
                          display: 'inline-block',
                        }}
                      >
                        {ticket.priority}
                      </span>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '16px' }}>
                      <span
                        style={{
                          padding: '4px 12px',
                          fontSize: '12px',
                          fontWeight: 600,
                          backgroundColor: statusConfig[ticket.status].bg,
                          color: statusConfig[ticket.status].text,
                          borderRadius: '8px',
                          border: `1px solid ${statusConfig[ticket.status].border}`,
                          textTransform: 'capitalize',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <StatusIcon style={{ width: '12px', height: '12px' }} />
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Created */}
                    <td style={{ padding: '16px' }}>
                      <span style={{ fontSize: '13px', color: '#6C727F' }}>{ticket.createdAt}</span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '16px', textAlign: 'right', borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleViewTicket(ticket)}
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
                              label: 'Reply to Ticket',
                              icon: <MessageCircle style={{ width: '16px', height: '16px' }} />,
                              onClick: () => handleReplyTicket(ticket),
                            },
                            {
                              label: 'Edit Ticket',
                              icon: <Edit style={{ width: '16px', height: '16px' }} />,
                              onClick: () => handleEditClick(ticket),
                            },
                            {
                              label: 'Assign Agent',
                              icon: <UserCheck style={{ width: '16px', height: '16px' }} />,
                              onClick: () => handleAssignTicket(ticket),
                            },
                            ...(ticket.status !== 'Closed'
                              ? [
                                  {
                                    label: 'Close Ticket',
                                    icon: <CheckCircle style={{ width: '16px', height: '16px' }} />,
                                    onClick: () => handleCloseClick(ticket),
                                  },
                                ]
                              : []),
                            {
                              label: 'Delete Ticket',
                              icon: <Trash2 style={{ width: '16px', height: '16px' }} />,
                              onClick: () => handleDeleteClick(ticket),
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
            Showing {filteredTickets.length} of {tickets.length} tickets
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

      {/* View Ticket Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Ticket Details"
        size="lg"
      >
        {selectedTicket && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', paddingBottom: '24px', borderBottom: '1px solid #E5E5E5' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>
                  Ticket ID
                </label>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0e0f', margin: 0, fontFamily: 'monospace' }}>
                  {selectedTicket.id}
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
                    backgroundColor: statusConfig[selectedTicket.status].bg,
                    color: statusConfig[selectedTicket.status].text,
                    borderRadius: '8px',
                    border: `1px solid ${statusConfig[selectedTicket.status].border}`,
                    display: 'inline-block',
                    textTransform: 'capitalize',
                  }}
                >
                  {selectedTicket.status.replace('_', ' ')}
                </span>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>
                  Priority
                </label>
                <span
                  style={{
                    padding: '4px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    backgroundColor: priorityConfig[selectedTicket.priority].bg,
                    color: priorityConfig[selectedTicket.priority].text,
                    borderRadius: '8px',
                    border: `1px solid ${priorityConfig[selectedTicket.priority].border}`,
                    display: 'inline-block',
                    textTransform: 'capitalize',
                  }}
                >
                  {selectedTicket.priority}
                </span>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>
                  Category
                </label>
                <p style={{ fontSize: '14px', color: '#0d0e0f', margin: 0 }}>
                  {selectedTicket.category}
                </p>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>
                  Submitted By
                </label>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0e0f', margin: 0 }}>
                  {selectedTicket.user}
                </p>
                <p style={{ fontSize: '13px', color: '#6C727F', margin: 0 }}>{selectedTicket.email}</p>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>
                  Created
                </label>
                <p style={{ fontSize: '14px', color: '#0d0e0f', margin: 0 }}>
                  {selectedTicket.createdAt}
                </p>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>
                Subject
              </label>
              <p style={{ fontSize: '16px', fontWeight: 600, color: '#0d0e0f', margin: 0 }}>
                {selectedTicket.subject}
              </p>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>
                Description
              </label>
              <p style={{ fontSize: '14px', color: '#0d0e0f', margin: 0, lineHeight: '1.6' }}>
                {selectedTicket.description || 'No description provided.'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', paddingTop: '16px', borderTop: '1px solid #E5E5E5' }}>
              <button
                onClick={() => handleReplyTicket(selectedTicket)}
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
                Reply
              </button>
              <button
                onClick={() => handleAssignTicket(selectedTicket)}
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
                Assign Agent
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Ticket Modal */}
      {selectedTicket && (
        <EditTicketModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          ticket={selectedTicket}
        />
      )}

      {/* Close Ticket Confirmation */}
      <ConfirmationModal
        isOpen={showCloseConfirm}
        onClose={() => setShowCloseConfirm(false)}
        onConfirm={confirmClose}
        title="Close Ticket"
        message={`Are you sure you want to close ticket ${ticketToClose?.id}? This action can be reversed later.`}
        confirmText="Close Ticket"
        variant="warning"
      />

      {/* Delete Ticket Confirmation */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete Ticket"
        message={`Are you sure you want to delete ticket ${ticketToDelete?.id}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </>
  );
}

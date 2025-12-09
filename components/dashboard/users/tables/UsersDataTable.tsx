'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MoreVertical, Eye, Filter, X, CheckCircle, Clock, XCircle, Edit, Ban, Mail, Key, Trash2 } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { Dropdown } from '@/components/common/Dropdown';
import { ConfirmationModal } from '@/components/common/ConfirmationModal';
import { EditUserModal } from '../modals/EditUserModal';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: 'Active' | 'Suspended' | 'Pending';
  subscription: string;
  joinDate: string;
}

const mockUsers: User[] = [
  {
    id: 'USR-001',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+1 (555) 123-4567',
    role: 'Influencer',
    status: 'Active',
    subscription: 'Pro Plan',
    joinDate: '2024-01-15',
  },
  {
    id: 'USR-002',
    name: 'Michael Chen',
    email: 'michael@business.com',
    phone: '+1 (555) 234-5678',
    role: 'Business',
    status: 'Active',
    subscription: 'Enterprise',
    joinDate: '2024-02-20',
  },
  {
    id: 'USR-003',
    name: 'Emma Davis',
    email: 'emma@agency.com',
    phone: '+1 (555) 345-6789',
    role: 'Admin',
    status: 'Active',
    subscription: 'Premium',
    joinDate: '2024-03-10',
  },
  {
    id: 'USR-004',
    name: 'James Wilson',
    email: 'james@creative.com',
    phone: '+1 (555) 999-9999',
    role: 'Influencer',
    status: 'Pending',
    subscription: 'Free',
    joinDate: '2024-11-28',
  },
  {
    id: 'USR-005',
    name: 'Lisa Anderson',
    email: 'lisa@business.com',
    phone: '+1 (555) 456-7890',
    role: 'Business',
    status: 'Suspended',
    subscription: 'Pro Plan',
    joinDate: '2023-12-05',
  },
  {
    id: 'USR-006',
    name: 'David Martinez',
    email: 'david@agency.com',
    phone: '+1 (555) 567-8901',
    role: 'Admin',
    status: 'Active',
    subscription: 'Enterprise',
    joinDate: '2024-04-12',
  },
  {
    id: 'USR-007',
    name: 'Sophie Turner',
    email: 'sophie@creative.com',
    phone: '+1 (555) 888-8888',
    role: 'Influencer',
    status: 'Active',
    subscription: 'Premium',
    joinDate: '2024-05-22',
  },
  {
    id: 'USR-008',
    name: 'Ryan Brooks',
    email: 'ryan@business.com',
    phone: '+1 (555) 678-9012',
    role: 'Business',
    status: 'Pending',
    subscription: 'Free',
    joinDate: '2024-11-30',
  },
];

const statusConfig = {
  Active: {
    icon: CheckCircle,
    bg: 'rgba(16, 185, 129, 0.1)',
    text: '#10b981',
    border: '#d1fae5'
  },
  Suspended: {
    icon: XCircle,
    bg: 'rgba(239, 68, 68, 0.1)',
    text: '#ef4444',
    border: '#fecaca'
  },
  Pending: {
    icon: Clock,
    bg: 'rgba(245, 158, 11, 0.1)',
    text: '#f59e0b',
    border: '#fef3c7'
  },
};

const roleColors = {
  Influencer: { bg: 'rgba(139, 92, 246, 0.1)', text: '#8b5cf6', border: '#ede9fe' },
  Business: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6', border: '#dbeafe' },
  Admin: { bg: 'rgba(205, 27, 120, 0.1)', text: '#CD1B78', border: '#fce7f3' },
};

export function UsersDataTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuspendConfirm, setShowSuspendConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToSuspend, setUserToSuspend] = useState<User | null>(null);

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const activeFiltersCount = (roleFilter !== 'all' ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0);

  const clearFilters = () => {
    setRoleFilter('all');
    setStatusFilter('all');
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleSendEmail = (user: User) => {
    toast.success(`Email sent to ${user.email}`);
  };

  const handleResetPassword = (user: User) => {
    toast.success(`Password reset link sent to ${user.email}`);
  };

  const handleSuspendClick = (user: User) => {
    setUserToSuspend(user);
    setShowSuspendConfirm(true);
  };

  const confirmSuspend = () => {
    if (userToSuspend) {
      toast.success(`User ${userToSuspend.name} has been suspended`);
      setUserToSuspend(null);
    }
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      toast.success(`User ${userToDelete.name} has been deleted`);
      setUserToDelete(null);
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
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0d0e0f' }}>All Users</h3>
              <p style={{ fontSize: '14px', color: '#6C727F', marginTop: '4px' }}>
                Manage and monitor user accounts
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {/* Search */}
              <div style={{ position: 'relative', width: '280px' }}>
                <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#9EA3AE' }} />
                <input
                  type="text"
                  placeholder="Search users..."
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
                      Role
                    </label>
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
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
                      <option value="all">All Roles</option>
                      <option value="Influencer">Influencer</option>
                      <option value="Business">Business</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>

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
                      <option value="Active">Active</option>
                      <option value="Suspended">Suspended</option>
                      <option value="Pending">Pending</option>
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
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F', borderBottom: '1px solid #E5E5E5' }}>User</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F', borderBottom: '1px solid #E5E5E5' }}>User ID</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F', borderBottom: '1px solid #E5E5E5' }}>Role</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F', borderBottom: '1px solid #E5E5E5' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F', borderBottom: '1px solid #E5E5E5' }}>Subscription</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F', borderBottom: '1px solid #E5E5E5' }}>Joined</th>
                <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F', borderBottom: '1px solid #E5E5E5' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => {
                const StatusIcon = statusConfig[user.status].icon;
                return (
                  <motion.tr
                    key={user.id}
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
                    {/* User */}
                    <td style={{ padding: '16px', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(205, 27, 120, 0.1)',
                            color: '#CD1B78',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 600,
                            fontSize: '14px',
                            flexShrink: 0,
                          }}
                        >
                          {user.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontWeight: 600, fontSize: '14px', color: '#0d0e0f' }}>{user.name}</p>
                          <p style={{ fontSize: '13px', color: '#6C727F' }}>{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* User ID */}
                    <td style={{ padding: '16px' }}>
                      <span style={{ fontSize: '13px', color: '#6C727F', fontFamily: 'monospace' }}>{user.id}</span>
                    </td>

                    {/* Role */}
                    <td style={{ padding: '16px' }}>
                      <span
                        style={{
                          padding: '4px 12px',
                          fontSize: '12px',
                          fontWeight: 600,
                          backgroundColor: roleColors[user.role].bg,
                          color: roleColors[user.role].text,
                          borderRadius: '8px',
                          border: `1px solid ${roleColors[user.role].border}`,
                          display: 'inline-block',
                        }}
                      >
                        {user.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '16px' }}>
                      <span
                        style={{
                          padding: '4px 12px',
                          fontSize: '12px',
                          fontWeight: 600,
                          backgroundColor: statusConfig[user.status].bg,
                          color: statusConfig[user.status].text,
                          borderRadius: '8px',
                          border: `1px solid ${statusConfig[user.status].border}`,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <StatusIcon style={{ width: '12px', height: '12px' }} />
                        {user.status}
                      </span>
                    </td>

                    {/* Subscription */}
                    <td style={{ padding: '16px' }}>
                      <span style={{ fontSize: '14px', color: '#0d0e0f', fontWeight: 500 }}>{user.subscription}</span>
                    </td>

                    {/* Joined */}
                    <td style={{ padding: '16px' }}>
                      <span style={{ fontSize: '13px', color: '#6C727F' }}>
                        {new Date(user.joinDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '16px', textAlign: 'right', borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleViewUser(user)}
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
                              label: 'Edit User',
                              icon: <Edit style={{ width: '16px', height: '16px' }} />,
                              onClick: () => handleEditClick(user),
                            },
                            {
                              label: 'Send Email',
                              icon: <Mail style={{ width: '16px', height: '16px' }} />,
                              onClick: () => handleSendEmail(user),
                            },
                            {
                              label: 'Reset Password',
                              icon: <Key style={{ width: '16px', height: '16px' }} />,
                              onClick: () => handleResetPassword(user),
                            },
                            {
                              label: 'Suspend Account',
                              icon: <Ban style={{ width: '16px', height: '16px' }} />,
                              onClick: () => handleSuspendClick(user),
                            },
                            {
                              label: 'Delete User',
                              icon: <Trash2 style={{ width: '16px', height: '16px' }} />,
                              onClick: () => handleDeleteClick(user),
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
            Showing {filteredUsers.length} of {mockUsers.length} users
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

      {/* View User Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="User Details"
        size="md"
      >
        {selectedUser && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '24px', borderBottom: '1px solid #E5E5E5' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(205, 27, 120, 0.1)',
                  color: '#CD1B78',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '24px',
                }}
              >
                {selectedUser.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0d0e0f', margin: 0 }}>
                  {selectedUser.name}
                </h3>
                <p style={{ fontSize: '14px', color: '#6C727F', margin: 0 }}>{selectedUser.email}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>
                  User ID
                </label>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0e0f', margin: 0, fontFamily: 'monospace' }}>
                  {selectedUser.id}
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
                    backgroundColor: statusConfig[selectedUser.status].bg,
                    color: statusConfig[selectedUser.status].text,
                    borderRadius: '8px',
                    border: `1px solid ${statusConfig[selectedUser.status].border}`,
                    display: 'inline-block',
                  }}
                >
                  {selectedUser.status}
                </span>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>
                  Role
                </label>
                <span
                  style={{
                    padding: '4px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    backgroundColor: roleColors[selectedUser.role].bg,
                    color: roleColors[selectedUser.role].text,
                    borderRadius: '8px',
                    border: `1px solid ${roleColors[selectedUser.role].border}`,
                    display: 'inline-block',
                  }}
                >
                  {selectedUser.role}
                </span>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>
                  Subscription
                </label>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0e0f', margin: 0 }}>
                  {selectedUser.subscription}
                </p>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>
                  Phone
                </label>
                <p style={{ fontSize: '14px', color: '#0d0e0f', margin: 0 }}>
                  {selectedUser.phone || 'Not provided'}
                </p>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>
                  Joined Date
                </label>
                <p style={{ fontSize: '14px', color: '#0d0e0f', margin: 0 }}>
                  {new Date(selectedUser.joinDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', paddingTop: '16px', borderTop: '1px solid #E5E5E5' }}>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleEditClick(selectedUser);
                }}
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
                Edit User
              </button>
              <button
                onClick={() => handleSendEmail(selectedUser)}
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
                Send Email
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit User Modal */}
      {selectedUser && (
        <EditUserModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setUserToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${userToDelete?.name}? This action cannot be undone and will permanently remove all user data.`}
        confirmText="Delete User"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Suspend Confirmation Modal */}
      <ConfirmationModal
        isOpen={showSuspendConfirm}
        onClose={() => {
          setShowSuspendConfirm(false);
          setUserToSuspend(null);
        }}
        onConfirm={confirmSuspend}
        title="Suspend User Account"
        message={`Are you sure you want to suspend ${userToSuspend?.name}'s account? They will not be able to access the platform until reactivated.`}
        confirmText="Suspend Account"
        cancelText="Cancel"
        variant="warning"
      />
    </>
  );
}

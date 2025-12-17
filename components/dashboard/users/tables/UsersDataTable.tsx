'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MoreVertical, Eye, Filter, X, CheckCircle, XCircle, Edit, Ban, Mail, Key, Trash2, Loader2, UserPlus } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { Dropdown } from '@/components/common/Dropdown';
import { ConfirmationModal } from '@/components/common/ConfirmationModal';
import { EditUserModal } from '../modals/EditUserModal';
import { SendEmailModal } from '../modals/SendEmailModal';
import { toast } from 'sonner';
import { useUserList, useDeleteUser, useSuspendUser, useResetPassword, useUpdateUser, useActivateUser } from '@/hooks/useUsers';
import type { ElementType } from 'react';
import { CreateUserModal } from '../modals/CreateUserModal';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DEACTIVATED' | 'RESTRICTED' | 'LOCKED' | 'DELETED';
  subscription: string;
  joinDate: string;
}

const statusConfig: Record<string, { icon: ElementType; bg: string; text: string; border: string }> = {
  ACTIVE: {
    icon: CheckCircle,
    bg: 'rgba(16, 185, 129, 0.1)',
    text: '#10b981',
    border: '#d1fae5'
  },
  INACTIVE: {
    icon: XCircle,
    bg: 'rgba(239, 68, 68, 0.1)',
    text: '#ef4444',
    border: '#fecaca'
  },
  DEACTIVATED: {
    icon: Ban,
    bg: 'rgba(239, 68, 68, 0.1)',
    text: '#ef4444',
    border: '#fecaca'
  },
  RESTRICTED: {
    icon: XCircle,
    bg: 'rgba(245, 158, 11, 0.1)',
    text: '#f59e0b',
    border: '#fef3c7'
  },
  LOCKED: {
    icon: XCircle,
    bg: 'rgba(239, 68, 68, 0.1)',
    text: '#ef4444',
    border: '#fecaca'
  },
  DELETED: {
    icon: Trash2,
    bg: 'rgba(107, 114, 128, 0.1)',
    text: '#6b7280',
    border: '#e5e7eb'
  },
};

const roleColors: Record<string, { bg: string; text: string; border: string }> = {
  USER: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6', border: '#dbeafe' },
  ADMIN: { bg: 'rgba(205, 27, 120, 0.1)', text: '#CD1B78', border: '#fce7f3' },
  CREATIVE: { bg: 'rgba(139, 92, 246, 0.1)', text: '#8b5cf6', border: '#ede9fe' },
  BUSINESS: { bg: 'rgba(56, 189, 248, 0.1)', text: '#38bdf8', border: '#e0f2fe' },
  AGENCY: { bg: 'rgba(99, 102, 241, 0.1)', text: '#6366f1', border: '#e0e7ff' },
};

export function UsersDataTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [subscriptionFilter, setSubscriptionFilter] = useState<string>('all');
  const [countryFilter, setCountryFilter] = useState<string>('');
  const [emailVerifiedFilter, setEmailVerifiedFilter] = useState<string>('all'); // all | verified | unverified
  const [phoneVerifiedFilter, setPhoneVerifiedFilter] = useState<string>('all'); // all | verified | unverified
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuspendConfirm, setShowSuspendConfirm] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [showSendEmailModal, setShowSendEmailModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToSuspend, setUserToSuspend] = useState<User | null>(null);
  const [userToDeactivate, setUserToDeactivate] = useState<User | null>(null);

  // Fetch real users from API
  const { data: usersData, isLoading, error } = useUserList({
    page: currentPage,
    pageSize: 10,
    search: searchQuery || undefined,
    userType: roleFilter !== 'all' ? [roleFilter] : undefined,
    userStatus: statusFilter !== 'all' ? [statusFilter] : undefined,
    subscriptionStatus: subscriptionFilter !== 'all' ? [subscriptionFilter] : undefined,
    country: countryFilter || undefined,
    emailVerified:
      emailVerifiedFilter === 'all'
        ? undefined
        : emailVerifiedFilter === 'verified'
        ? true
        : false,
    phoneVerified:
      phoneVerifiedFilter === 'all'
        ? undefined
        : phoneVerifiedFilter === 'verified'
        ? true
        : false,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    sortBy: sortBy || undefined,
    sortOrder,
  });

  console.log('[UsersDataTable] usersData:', usersData);
  console.log('[UsersDataTable] isLoading:', isLoading);
  console.log('[UsersDataTable] error:', error);

  const users: User[] = (usersData?.users || []).map(user => ({
    id: user.userId,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    phone: user.phoneNumber || 'Not provided',
    role: user.userType,
    status: user.userStatus as User['status'],
    subscription: user.subscriptionStatus || 'No subscription',
    joinDate: user.dateCreated || '',
  }));

  console.log('[UsersDataTable] mapped users:', users);

  const totalUsers = usersData?.total || 0;
  const totalPages = usersData?.totalPages || 1;

  const activeFiltersCount =
    (roleFilter !== 'all' ? 1 : 0) +
    (statusFilter !== 'all' ? 1 : 0) +
    (subscriptionFilter !== 'all' ? 1 : 0) +
    (countryFilter ? 1 : 0) +
    (emailVerifiedFilter !== 'all' ? 1 : 0) +
    (phoneVerifiedFilter !== 'all' ? 1 : 0) +
    (dateFrom ? 1 : 0) +
    (dateTo ? 1 : 0) +
    (sortBy ? 1 : 0);

  const clearFilters = () => {
    setRoleFilter('all');
    setStatusFilter('all');
    setSubscriptionFilter('all');
    setCountryFilter('');
    setEmailVerifiedFilter('all');
    setPhoneVerifiedFilter('all');
    setDateFrom('');
    setDateTo('');
    setSortBy('');
    setSortOrder('desc');
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
    setSelectedUser(user);
    setShowSendEmailModal(true);
  };

  const resetPasswordMutation = useResetPassword();

  const handleResetPassword = async (user: User) => {
    try {
      await resetPasswordMutation.mutateAsync(user.id);
      toast.success(`Password reset link sent to ${user.email}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send password reset email');
    }
  };

  const handleSuspendClick = (user: User) => {
    setUserToSuspend(user);
    setShowSuspendConfirm(true);
  };

  const suspendUserMutation = useSuspendUser();

  const confirmSuspend = async () => {
    if (userToSuspend) {
      try {
        await suspendUserMutation.mutateAsync({
          userId: userToSuspend.id,
          reason: 'Account suspended by administrator',
        });
        toast.success(`User ${userToSuspend.name} has been suspended successfully`);
        setUserToSuspend(null);
        setShowSuspendConfirm(false);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to suspend user');
      }
    }
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const deleteUserMutation = useDeleteUser();

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUserMutation.mutateAsync({
          userId: userToDelete.id,
          reason: 'Deleted by administrator',
        });
        toast.success(`User ${userToDelete.name} has been deleted successfully`);
        setUserToDelete(null);
        setShowDeleteConfirm(false);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to delete user');
      }
    }
  };

  const updateUserMutation = useUpdateUser();
  const activateUserMutation = useActivateUser();

  const handleDeactivateClick = (user: User) => {
    setUserToDeactivate(user);
    setShowDeactivateConfirm(true);
  };

  const confirmDeactivate = async () => {
    if (userToDeactivate) {
      try {
        await updateUserMutation.mutateAsync({
          userId: userToDeactivate.id,
          data: { userStatus: 'DEACTIVATED' },
        });
        toast.success(`User ${userToDeactivate.name} has been deactivated successfully`);
        setUserToDeactivate(null);
        setShowDeactivateConfirm(false);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to deactivate user');
      }
    }
  };

  const handleActivateClick = async (user: User) => {
    try {
      await activateUserMutation.mutateAsync(user.id);
      toast.success(`User ${user.name} has been activated successfully`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to activate user');
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
              {/* Add User */}
              <button
                onClick={() => setShowCreateModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  background: '#CD1B78',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#fff',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#A81563')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#CD1B78')}
              >
                <UserPlus style={{ width: '16px', height: '16px' }} />
                Add User
              </button>
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
                      User Type
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
                      <option value="all">All Types</option>
                      <option value="CREATIVE">Creative</option>
                      <option value="BUSINESS">Business</option>
                      <option value="AGENCY">Agency</option>
                      <option value="ADMIN">Admin</option>
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
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                      <option value="DEACTIVATED">Deactivated</option>
                      <option value="RESTRICTED">Restricted</option>
                      <option value="LOCKED">Locked</option>
                      <option value="DELETED">Deleted</option>
                    </select>
                  </div>

                  <div style={{ flex: '1', minWidth: '200px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>
                      Subscription
                    </label>
                    <select
                      value={subscriptionFilter}
                      onChange={(e) => setSubscriptionFilter(e.target.value)}
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
                      <option value="all">All Subscriptions</option>
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                      <option value="PENDING">Pending</option>
                      <option value="EXPIRED">Expired</option>
                    </select>
                  </div>

                  <div style={{ flex: '1', minWidth: '200px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>
                      Country
                    </label>
                    <input
                      type="text"
                      value={countryFilter}
                      onChange={(e) => setCountryFilter(e.target.value)}
                      placeholder="e.g. Nigeria"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #E5E5E5',
                        borderRadius: '8px',
                        fontSize: '14px',
                        background: '#fff',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div style={{ flex: '1', minWidth: '200px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>
                      Email Verified
                    </label>
                    <select
                      value={emailVerifiedFilter}
                      onChange={(e) => setEmailVerifiedFilter(e.target.value)}
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
                      <option value="all">All</option>
                      <option value="verified">Verified</option>
                      <option value="unverified">Unverified</option>
                    </select>
                  </div>

                  <div style={{ flex: '1', minWidth: '200px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>
                      Phone Verified
                    </label>
                    <select
                      value={phoneVerifiedFilter}
                      onChange={(e) => setPhoneVerifiedFilter(e.target.value)}
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
                      <option value="all">All</option>
                      <option value="verified">Verified</option>
                      <option value="unverified">Unverified</option>
                    </select>
                  </div>

                  <div style={{ flex: '1', minWidth: '200px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>
                      Date From
                    </label>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #E5E5E5',
                        borderRadius: '8px',
                        fontSize: '14px',
                        background: '#fff',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div style={{ flex: '1', minWidth: '200px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>
                      Date To
                    </label>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #E5E5E5',
                        borderRadius: '8px',
                        fontSize: '14px',
                        background: '#fff',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div style={{ flex: '1', minWidth: '200px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
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
                      <option value="">Default</option>
                      <option value="dateCreated">Joined Date</option>
                      <option value="firstName">First Name</option>
                      <option value="lastName">Last Name</option>
                      <option value="email">Email</option>
                      <option value="userType">Role</option>
                      <option value="userStatus">Status</option>
                    </select>
                  </div>

                  <div style={{ flex: '1', minWidth: '200px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>
                      Sort Order
                    </label>
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
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
                      <option value="asc">Ascending</option>
                      <option value="desc">Descending</option>
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
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F', borderBottom: '1px solid #E5E5E5' }}>Type</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F', borderBottom: '1px solid #E5E5E5' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F', borderBottom: '1px solid #E5E5E5' }}>Subscription</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F', borderBottom: '1px solid #E5E5E5' }}>Joined</th>
                <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F', borderBottom: '1px solid #E5E5E5' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} style={{ padding: '40px', textAlign: 'center' }}>
                    <Loader2 className="h-8 w-8 animate-spin text-primary" style={{ color: '#CD1B78', display: 'inline-block' }} />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#6C727F' }}>
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user, index) => {
                const StatusIcon = statusConfig[user.status]?.icon || CheckCircle;
                const roleColor = roleColors[user.role] || { bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280', border: '#e5e7eb' };
                const statusColor = statusConfig[user.status] || statusConfig.ACTIVE;
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
                          backgroundColor: roleColor.bg,
                          color: roleColor.text,
                          borderRadius: '8px',
                          border: `1px solid ${roleColor.border}`,
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
                          backgroundColor: statusColor.bg,
                          color: statusColor.text,
                          borderRadius: '8px',
                          border: `1px solid ${statusColor.border}`,
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
                            ...(user.status !== 'DEACTIVATED'
                              ? [{
                                label: 'Deactivate Account',
                                icon: <XCircle style={{ width: '16px', height: '16px' }} />,
                                onClick: () => handleDeactivateClick(user),
                              }] : [{
                                label: 'Activate Account',
                                icon: <CheckCircle style={{ width: '16px', height: '16px' }} />,
                                onClick: () => handleActivateClick(user),
                              }]),
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
              })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #E5E5E5', flexWrap: 'wrap', gap: '16px' }}>
          <p style={{ fontSize: '14px', color: '#6C727F' }}>
            Showing {users.length} of {totalUsers} users (Page {currentPage} of {totalPages})
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setCurrentPage(p => p - 1)}
              disabled={currentPage === 1}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: 500,
                color: currentPage === 1 ? '#9EA3AE' : '#0d0e0f',
                background: 'transparent',
                border: '1px solid #E5E5E5',
                borderRadius: '8px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => {
                if (currentPage !== 1) e.currentTarget.style.backgroundColor = '#F2F2F2';
              }}
              onMouseLeave={(e) => {
                if (currentPage !== 1) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage >= totalPages}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: 500,
                color: currentPage >= totalPages ? '#9EA3AE' : '#0d0e0f',
                background: 'transparent',
                border: '1px solid #E5E5E5',
                borderRadius: '8px',
                cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => {
                if (currentPage < totalPages) e.currentTarget.style.backgroundColor = '#F2F2F2';
              }}
              onMouseLeave={(e) => {
                if (currentPage < totalPages) e.currentTarget.style.backgroundColor = 'transparent';
              }}
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
                    backgroundColor: (statusConfig[selectedUser.status] || statusConfig.ACTIVE).bg,
                    color: (statusConfig[selectedUser.status] || statusConfig.ACTIVE).text,
                    borderRadius: '8px',
                    border: `1px solid ${(statusConfig[selectedUser.status] || statusConfig.ACTIVE).border}`,
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
                    backgroundColor: (roleColors[selectedUser.role] || { bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280', border: '#e5e7eb' }).bg,
                    color: (roleColors[selectedUser.role] || { bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280', border: '#e5e7eb' }).text,
                    borderRadius: '8px',
                    border: `1px solid ${(roleColors[selectedUser.role] || { bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280', border: '#e5e7eb' }).border}`,
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

      {/* Send Email Modal */}
      {selectedUser && (
        <SendEmailModal
          isOpen={showSendEmailModal}
          onClose={() => {
            setShowSendEmailModal(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
        />
      )}

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

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

      {/* Deactivate Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeactivateConfirm}
        onClose={() => {
          setShowDeactivateConfirm(false);
          setUserToDeactivate(null);
        }}
        onConfirm={confirmDeactivate}
        title="Deactivate User Account"
        message={`Are you sure you want to deactivate ${userToDeactivate?.name}'s account? They will not be able to access the platform until activated.`}
        confirmText="Deactivate Account"
        cancelText="Cancel"
        variant="warning"
      />
    </>
  );
}

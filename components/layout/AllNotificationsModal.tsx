'use client';

import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Search, Filter, X, CheckCheck, Trash2, AlertCircle, DollarSign, Users, MessageSquare, Shield, Target, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Notification } from './NotificationDropdown';

const notificationIcons = {
  info: AlertCircle,
  success: CheckCheck,
  warning: AlertCircle,
  error: AlertCircle,
  payment: DollarSign,
  user: Users,
  ticket: MessageSquare,
  security: Shield,
  lead: Target,
};

const notificationColors = {
  info: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6', border: '#dbeafe' },
  success: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981', border: '#d1fae5' },
  warning: { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', border: '#fef3c7' },
  error: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', border: '#fecaca' },
  payment: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981', border: '#d1fae5' },
  user: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6', border: '#dbeafe' },
  ticket: { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', border: '#fef3c7' },
  security: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', border: '#fecaca' },
  lead: { bg: 'rgba(205, 27, 120, 0.1)', text: '#CD1B78', border: '#fce7f3' },
};

interface AllNotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
}

export function AllNotificationsModal({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
}: AllNotificationsModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'unread' ? !notification.read : notification.read);
    return matchesSearch && matchesType && matchesStatus;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const activeFiltersCount = (typeFilter !== 'all' ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0);

  const clearFilters = () => {
    setTypeFilter('all');
    setStatusFilter('all');
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="All Notifications" size="xl">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Header Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <p style={{ fontSize: '13px', color: '#6C727F', margin: 0 }}>
                {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
              </p>
              {unreadCount > 0 && (
                <span
                  style={{
                    padding: '3px 8px',
                    fontSize: '11px',
                    fontWeight: 600,
                    backgroundColor: 'rgba(205, 27, 120, 0.1)',
                    color: '#CD1B78',
                    borderRadius: '10px',
                  }}
                >
                  {unreadCount} unread
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                style={{
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#CD1B78',
                  background: 'rgba(205, 27, 120, 0.1)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(205, 27, 120, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(205, 27, 120, 0.1)';
                }}
              >
                <CheckCheck size={14} />
                Mark All as Read
              </button>
            )}
          </div>

          {/* Search and Filters */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {/* Search */}
            <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
              <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', color: '#9EA3AE' }} />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 32px 8px 34px',
                  border: '1px solid #E5E5E5',
                  borderRadius: '8px',
                  fontSize: '13px',
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
                gap: '6px',
                padding: '8px 14px',
                background: showFilters ? '#F9FAFB' : '#fff',
                border: '1px solid #E5E5E5',
                borderRadius: '8px',
                fontSize: '13px',
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
              <Filter style={{ width: '15px', height: '15px' }} />
              Filters
              {activeFiltersCount > 0 && (
                <span
                  style={{
                    background: '#CD1B78',
                    color: '#fff',
                    fontSize: '10px',
                    fontWeight: 600,
                    padding: '2px 5px',
                    borderRadius: '8px',
                    minWidth: '16px',
                    textAlign: 'center',
                  }}
                >
                  {activeFiltersCount}
                </span>
              )}
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
                    padding: '12px',
                    background: '#F9FAFB',
                    borderRadius: '10px',
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ flex: '1', minWidth: '180px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '5px' }}>
                      Type
                    </label>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '7px 10px',
                        border: '1px solid #E5E5E5',
                        borderRadius: '7px',
                        fontSize: '13px',
                        background: '#fff',
                        cursor: 'pointer',
                        outline: 'none',
                      }}
                    >
                      <option value="all">All Types</option>
                      <option value="payment">Payment</option>
                      <option value="user">User</option>
                      <option value="ticket">Ticket</option>
                      <option value="security">Security</option>
                      <option value="lead">Lead</option>
                      <option value="info">Info</option>
                      <option value="warning">Warning</option>
                      <option value="error">Error</option>
                    </select>
                  </div>

                  <div style={{ flex: '1', minWidth: '180px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '5px' }}>
                      Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '7px 10px',
                        border: '1px solid #E5E5E5',
                        borderRadius: '7px',
                        fontSize: '13px',
                        background: '#fff',
                        cursor: 'pointer',
                        outline: 'none',
                      }}
                    >
                      <option value="all">All Status</option>
                      <option value="unread">Unread</option>
                      <option value="read">Read</option>
                    </select>
                  </div>

                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      style={{
                        padding: '7px 14px',
                        background: '#fff',
                        border: '1px solid #E5E5E5',
                        borderRadius: '7px',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: '#6C727F',
                        cursor: 'pointer',
                        marginTop: '16px',
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

          {/* Notifications List */}
          <div
            style={{
              maxHeight: '450px',
              overflowY: 'auto',
            }}
            className="notification-modal-scroll"
          >
            {filteredNotifications.length === 0 ? (
              <div
                style={{
                  padding: '50px 20px',
                  textAlign: 'center',
                  color: '#9EA3AE',
                }}
              >
                <AlertCircle size={42} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                <p style={{ fontSize: '13px', margin: 0 }}>No notifications found</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {filteredNotifications.map((notification, index) => {
                  const Icon = notificationIcons[notification.type];
                  const colors = notificationColors[notification.type];

                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      style={{
                        padding: '12px',
                        borderRadius: '10px',
                        backgroundColor: notification.read ? '#fff' : '#FAFAFA',
                        border: `1px solid ${notification.read ? '#E5E5E5' : colors.border}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#F9FAFB';
                        e.currentTarget.style.transform = 'translateX(4px)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = notification.read ? '#fff' : '#FAFAFA';
                        e.currentTarget.style.transform = 'translateX(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      onClick={() => setSelectedNotification(notification)}
                    >
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        {/* Icon */}
                        <div
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '10px',
                            backgroundColor: colors.bg,
                            border: `1px solid ${colors.border}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Icon size={18} style={{ color: colors.text }} />
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '4px' }}>
                            <div style={{ flex: 1 }}>
                              <h4
                                style={{
                                  fontSize: '14px',
                                  fontWeight: 600,
                                  color: '#0d0e0f',
                                  margin: 0,
                                  marginBottom: '3px',
                                  lineHeight: '1.4',
                                }}
                              >
                                {notification.title}
                              </h4>
                              <p
                                style={{
                                  fontSize: '13px',
                                  color: '#6C727F',
                                  margin: 0,
                                  lineHeight: '1.4',
                                }}
                              >
                                {notification.message}
                              </p>
                            </div>
                            {!notification.read && (
                              <span
                                style={{
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '50%',
                                  backgroundColor: '#CD1B78',
                                  flexShrink: 0,
                                  marginTop: '3px',
                                }}
                              />
                            )}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span style={{ fontSize: '11px', color: '#9EA3AE' }}>
                                {notification.timestamp}
                              </span>
                              <span
                                style={{
                                  fontSize: '10px',
                                  fontWeight: 600,
                                  color: colors.text,
                                  backgroundColor: colors.bg,
                                  padding: '2px 7px',
                                  borderRadius: '5px',
                                  textTransform: 'capitalize',
                                }}
                              >
                                {notification.type}
                              </span>
                            </div>

                            <div style={{ display: 'flex', gap: '4px' }}>
                              {!notification.read && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onMarkAsRead(notification.id);
                                  }}
                                  style={{
                                    padding: '5px',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderRadius: '5px',
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(205, 27, 120, 0.1)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                  }}
                                  title="Mark as read"
                                >
                                  <CheckCheck size={14} style={{ color: '#CD1B78' }} />
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDelete(notification.id);
                                }}
                                style={{
                                  padding: '5px',
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  borderRadius: '5px',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = '#FEF2F2';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                                title="Delete"
                              >
                                <Trash2 size={14} style={{ color: '#ef4444' }} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <style jsx>{`
          .notification-modal-scroll::-webkit-scrollbar {
            width: 8px;
          }
          .notification-modal-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
          .notification-modal-scroll::-webkit-scrollbar-thumb {
            background: #CD1B78;
            border-radius: 10px;
          }
          .notification-modal-scroll::-webkit-scrollbar-thumb:hover {
            background: #a01560;
          }
        `}</style>
      </Modal>

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <Modal
          isOpen={!!selectedNotification}
          onClose={() => setSelectedNotification(null)}
          title="Notification Details"
          size="md"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                padding: '16px',
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${notificationColors[selectedNotification.type].bg} 0%, ${notificationColors[selectedNotification.type].bg} 100%)`,
                border: `1px solid ${notificationColors[selectedNotification.type].border}`,
              }}
            >
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: '#fff',
                    border: `2px solid ${notificationColors[selectedNotification.type].border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {(() => {
                    const Icon = notificationIcons[selectedNotification.type];
                    return <Icon size={22} style={{ color: notificationColors[selectedNotification.type].text }} />;
                  })()}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0d0e0f', margin: 0, marginBottom: '6px' }}>
                    {selectedNotification.title}
                  </h3>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: notificationColors[selectedNotification.type].text,
                      textTransform: 'capitalize',
                    }}
                  >
                    {selectedNotification.type}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '8px' }}>
                Message
              </label>
              <p style={{ fontSize: '15px', color: '#0d0e0f', margin: 0, lineHeight: '1.6' }}>
                {selectedNotification.message}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>
                  Time
                </label>
                <p style={{ fontSize: '14px', color: '#0d0e0f', margin: 0 }}>
                  {selectedNotification.timestamp}
                </p>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>
                  Status
                </label>
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: '12px',
                    fontWeight: 600,
                    padding: '4px 10px',
                    borderRadius: '8px',
                    backgroundColor: selectedNotification.read ? 'rgba(156, 163, 175, 0.1)' : 'rgba(205, 27, 120, 0.1)',
                    color: selectedNotification.read ? '#6b7280' : '#CD1B78',
                  }}
                >
                  {selectedNotification.read ? 'Read' : 'Unread'}
                </span>
              </div>
            </div>

            {selectedNotification.actionUrl && (
              <div style={{ paddingTop: '16px', borderTop: '1px solid #E5E5E5' }}>
                <button
                  onClick={() => {
                    window.location.href = selectedNotification.actionUrl!;
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#fff',
                    backgroundColor: '#CD1B78',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#a01560';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#CD1B78';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <Eye size={16} />
                  View Details
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}

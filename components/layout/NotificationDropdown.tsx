'use client';

import { useState } from 'react';
import { Bell, Check, CheckCheck, Trash2, Settings, X, AlertCircle, DollarSign, Users, MessageSquare, Shield, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AllNotificationsModal } from './AllNotificationsModal';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'payment' | 'user' | 'ticket' | 'security' | 'lead';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

const mockNotifications: Notification[] = [
  {
    id: 'NOT-001',
    type: 'payment',
    title: 'New Payment Received',
    message: 'Payment of $499.99 received from Sarah Johnson',
    timestamp: '2 minutes ago',
    read: false,
    actionUrl: '/finance',
  },
  {
    id: 'NOT-002',
    type: 'user',
    title: 'New User Registration',
    message: '5 new users registered in the last hour',
    timestamp: '15 minutes ago',
    read: false,
    actionUrl: '/users',
  },
  {
    id: 'NOT-003',
    type: 'ticket',
    title: 'Urgent Support Ticket',
    message: 'High priority ticket #TCK-089 requires immediate attention',
    timestamp: '1 hour ago',
    read: false,
    actionUrl: '/support',
  },
  {
    id: 'NOT-004',
    type: 'security',
    title: 'Security Alert',
    message: 'Multiple failed login attempts detected from IP 192.168.1.100',
    timestamp: '2 hours ago',
    read: true,
    actionUrl: '/audit',
  },
  {
    id: 'NOT-005',
    type: 'lead',
    title: 'New Leads Generated',
    message: '12 new leads captured from Instagram campaign',
    timestamp: '3 hours ago',
    read: true,
    actionUrl: '/leads',
  },
];

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

interface NotificationDropdownProps {
  onClose?: () => void;
  onViewAll?: () => void;
}

export function NotificationDropdown({ onClose, onViewAll }: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const recentNotifications = notifications.slice(0, 5);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        style={{
          position: 'absolute',
          top: '60px',
          right: '80px',
          width: '380px',
          maxHeight: '520px',
          backgroundColor: '#fff',
          borderRadius: '14px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
          border: '1px solid #E5E5E5',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '14px 16px',
            borderBottom: '1px solid #E5E5E5',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0d0e0f', margin: 0 }}>
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span
                style={{
                  padding: '2px 7px',
                  fontSize: '11px',
                  fontWeight: 600,
                  backgroundColor: '#CD1B78',
                  color: '#fff',
                  borderRadius: '10px',
                }}
              >
                {unreadCount}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  padding: '5px 10px',
                  fontSize: '11px',
                  fontWeight: 500,
                  color: '#CD1B78',
                  background: 'rgba(205, 27, 120, 0.1)',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(205, 27, 120, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(205, 27, 120, 0.1)';
                }}
              >
                <CheckCheck size={12} />
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                padding: '4px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                borderRadius: '6px',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F2F2F2')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <X size={16} style={{ color: '#6C727F' }} />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            maxHeight: '380px',
          }}
          className="notification-scroll"
        >
          {recentNotifications.length === 0 ? (
            <div
              style={{
                padding: '40px 20px',
                textAlign: 'center',
                color: '#9EA3AE',
              }}
            >
              <Bell size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
              <p style={{ fontSize: '13px', margin: 0 }}>No notifications</p>
            </div>
          ) : (
            <div style={{ padding: '6px' }}>
              {recentNotifications.map((notification, index) => {
                const Icon = notificationIcons[notification.type];
                const colors = notificationColors[notification.type];

                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    style={{
                      padding: '10px',
                      borderRadius: '10px',
                      marginBottom: '4px',
                      backgroundColor: notification.read ? '#fff' : '#FAFAFA',
                      border: `1px solid ${notification.read ? '#F0F0F0' : colors.border}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      position: 'relative',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#F9FAFB';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = notification.read ? '#fff' : '#FAFAFA';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      {/* Icon */}
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          backgroundColor: colors.bg,
                          border: `1px solid ${colors.border}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={16} style={{ color: colors.text }} />
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '6px', marginBottom: '2px' }}>
                          <h4
                            style={{
                              fontSize: '13px',
                              fontWeight: 600,
                              color: '#0d0e0f',
                              margin: 0,
                              lineHeight: '1.4',
                            }}
                          >
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <span
                              style={{
                                width: '7px',
                                height: '7px',
                                borderRadius: '50%',
                                backgroundColor: '#CD1B78',
                                flexShrink: 0,
                                marginTop: '3px',
                              }}
                            />
                          )}
                        </div>
                        <p
                          style={{
                            fontSize: '12px',
                            color: '#6C727F',
                            margin: 0,
                            marginBottom: '5px',
                            lineHeight: '1.4',
                          }}
                        >
                          {notification.message}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '11px', color: '#9EA3AE' }}>
                            {notification.timestamp}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            style={{
                              padding: '3px',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              borderRadius: '4px',
                              opacity: 0.6,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#FEF2F2';
                              e.currentTarget.style.opacity = '1';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.opacity = '0.6';
                            }}
                          >
                            <Trash2 size={12} style={{ color: '#ef4444' }} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div
            style={{
              padding: '12px 14px',
              borderTop: '1px solid #E5E5E5',
              display: 'flex',
              gap: '8px',
            }}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onViewAll?.();
                onClose?.();
              }}
              style={{
                flex: 1,
                padding: '10px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#fff',
                backgroundColor: '#CD1B78',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
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
              View All Notifications
            </button>
            <button
              style={{
                padding: '10px',
                fontSize: '13px',
                fontWeight: 500,
                color: '#6C727F',
                backgroundColor: '#F9FAFB',
                border: '1px solid #E5E5E5',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F2F2F2';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#F9FAFB';
              }}
            >
              <Settings size={15} />
            </button>
          </div>
        )}

        <style jsx>{`
          .notification-scroll::-webkit-scrollbar {
            width: 6px;
          }
          .notification-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
          .notification-scroll::-webkit-scrollbar-thumb {
            background: #CD1B78;
            border-radius: 10px;
          }
          .notification-scroll::-webkit-scrollbar-thumb:hover {
            background: #a01560;
          }
        `}</style>
      </motion.div>
    </>
  );
}

// Export mock notifications and helper functions for use in AdminHeader
export { mockNotifications };

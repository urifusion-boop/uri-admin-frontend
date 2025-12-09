'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Menu, Bell, Settings, HelpCircle, LogOut } from 'lucide-react';
import Link from 'next/link';
import { AnimatePresence } from 'framer-motion';
import { NotificationDropdown, mockNotifications, type Notification } from './NotificationDropdown';
import { AllNotificationsModal } from './AllNotificationsModal';

interface AdminHeaderProps {
  toggleSideNav: () => void;
}

export function AdminHeader({ toggleSideNav }: AdminHeaderProps) {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAllNotificationsModal, setShowAllNotificationsModal] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const userInitials = user?.email?.substring(0, 2).toUpperCase() || 'SA';

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        padding: '16px 60px 16px 20px',
        borderBottom: '1px solid #E5E5E5',
        backgroundColor: '#fff',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Left: Menu Icon */}
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <button
            onClick={toggleSideNav}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Menu
              style={{
                color: '#353F50',
                width: '24px',
                height: '24px',
              }}
            />
          </button>
        </div>

        {/* Right: Notifications & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '16px', position: 'relative' }}>
          {/* Notifications */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              padding: '8px',
              borderRadius: '8px',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F2F2F2')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <Bell style={{ width: '20px', height: '20px', color: '#6C727F' }} />
            <span
              style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '8px',
                height: '8px',
                backgroundColor: '#CD1B78',
                borderRadius: '50%',
              }}
            />
          </button>

          {/* Notification Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <>
                {/* Backdrop */}
                <div
                  onClick={() => setShowNotifications(false)}
                  style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 40,
                  }}
                />
                <NotificationDropdown
                  onClose={() => setShowNotifications(false)}
                  onViewAll={() => setShowAllNotificationsModal(true)}
                />
              </>
            )}
          </AnimatePresence>

          {/* Profile */}
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: '#CD1B78',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                border: '1.5px solid #E5E5E5',
              }}
            >
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#fff',
                  textTransform: 'uppercase',
                }}
              >
                {userInitials}
              </span>
            </div>

            <div className="hidden sm:block" style={{ textAlign: 'left' }}>
              <p style={{ fontWeight: 600, margin: 0, fontSize: '14px', color: '#0d0e0f' }}>
                {user?.email?.split('@')[0] || 'Admin'}
              </p>
            </div>
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <>
              {/* Backdrop */}
              <div
                onClick={() => setShowProfileMenu(false)}
                style={{
                  position: 'fixed',
                  inset: 0,
                  zIndex: 40,
                }}
              />
              
              {/* Dropdown */}
              <div
                style={{
                  position: 'absolute',
                  top: '68px',
                  right: '20px',
                  width: '250px',
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                  zIndex: 50,
                  padding: '16px 0',
                  border: '1px solid #E5E5E5',
                }}
              >
                {/* Profile Info */}
                <div style={{ padding: '0px 16px 12px 16px', marginBottom: '12px', borderBottom: '1px solid #E5E5E5' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#CD1B78',
                        color: '#fff',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontWeight: 600,
                        fontSize: '14px',
                      }}
                    >
                      {userInitials}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '14px', fontWeight: 600, margin: 0, color: '#0d0e0f', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user?.email || 'admin@uri.com'}
                      </p>
                      <p style={{ fontSize: '12px', margin: 0, color: '#6C727F', marginTop: '2px' }}>
                        Super Admin
                      </p>
                    </div>
                  </div>
                </div>

                {/* Account Section */}
                <div style={{ marginBottom: '8px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 600, color: '#9EA3AE', padding: '0px 16px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Account
                  </p>

                  <Link href="/settings" onClick={() => setShowProfileMenu(false)}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 16px',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F2F2F2')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <Settings style={{ width: '18px', height: '18px', color: '#CD1B78' }} />
                      <span style={{ fontSize: '14px', fontWeight: 500, color: '#0d0e0f' }}>Settings</span>
                    </div>
                  </Link>
                </div>

                {/* Support Section */}
                <div style={{ marginBottom: '8px', paddingTop: '8px', borderTop: '1px solid #E5E5E5' }}>
                  <p style={{ fontSize: '11px', fontWeight: 600, color: '#9EA3AE', padding: '0px 16px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Support
                  </p>

                  <Link href="/help" onClick={() => setShowProfileMenu(false)}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 16px',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F2F2F2')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <HelpCircle style={{ width: '18px', height: '18px', color: '#CD1B78' }} />
                      <span style={{ fontSize: '14px', fontWeight: 500, color: '#0d0e0f' }}>Help & Support</span>
                    </div>
                  </Link>
                </div>

                {/* Logout */}
                <div style={{ paddingTop: '8px', borderTop: '1px solid #E5E5E5' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 16px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                    }}
                    onClick={logout}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FEF2F2')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <LogOut style={{ width: '18px', height: '18px', color: '#ef4444' }} />
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#ef4444' }}>Log Out</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* All Notifications Modal */}
      <AllNotificationsModal
        isOpen={showAllNotificationsModal}
        onClose={() => setShowAllNotificationsModal(false)}
        notifications={notifications}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
        onDelete={deleteNotification}
      />
    </div>
  );
}

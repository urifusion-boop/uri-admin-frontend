'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Loader2, Settings, Database, Shield, Bell } from 'lucide-react';

type ToggleSettingProps = {
  label: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
};

const ToggleSetting = ({ label, description, enabled, onChange }: ToggleSettingProps) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px',
      borderRadius: '12px',
      backgroundColor: '#F9FAFB',
      marginBottom: '12px',
    }}
  >
    <div style={{ flex: 1 }}>
      <p style={{ fontSize: '15px', fontWeight: 600, color: '#0d0e0f', marginBottom: '4px' }}>{label}</p>
      <p style={{ fontSize: '13px', color: '#6C727F' }}>{description}</p>
    </div>
    <button
      onClick={() => onChange(!enabled)}
      style={{
        position: 'relative',
        width: '52px',
        height: '28px',
        borderRadius: '14px',
        backgroundColor: enabled ? '#CD1B78' : '#E5E7EB',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '2px',
          left: enabled ? '26px' : '2px',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          backgroundColor: '#fff',
          transition: 'left 0.2s',
        }}
      />
    </button>
  </div>
);

export default function SettingsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure system settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Security Settings */}
        <div
          style={{
            background: '#fff',
            borderRadius: '20px',
            boxShadow: '1px 1px 6px 3px rgba(0, 0, 0, 0.07)',
            border: '1px solid #F0F0F0',
            padding: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'rgba(205, 27, 120, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Shield size={20} style={{ color: '#CD1B78' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0d0e0f', marginBottom: '2px' }}>
                Security & Authentication
              </h3>
              <p style={{ fontSize: '13px', color: '#6C727F' }}>Configure security policies</p>
            </div>
          </div>
          <ToggleSetting
            label="Two-Factor Authentication"
            description="Require 2FA for all admin accounts"
            enabled={twoFactorAuth}
            onChange={setTwoFactorAuth}
          />
          <ToggleSetting
            label="IP Whitelisting"
            description="Restrict admin access to specific IPs"
            enabled={false}
            onChange={() => { }}
          />
        </div>

        {/* Notifications */}
        <div
          style={{
            background: '#fff',
            borderRadius: '20px',
            boxShadow: '1px 1px 6px 3px rgba(0, 0, 0, 0.07)',
            border: '1px solid #F0F0F0',
            padding: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Bell size={20} style={{ color: '#3b82f6' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0d0e0f', marginBottom: '2px' }}>
                Notifications
              </h3>
              <p style={{ fontSize: '13px', color: '#6C727F' }}>Manage notification preferences</p>
            </div>
          </div>
          <ToggleSetting
            label="Email Notifications"
            description="Receive email alerts for critical events"
            enabled={emailNotifications}
            onChange={setEmailNotifications}
          />
          <ToggleSetting
            label="Failed Payment Alerts"
            description="Get notified when payments fail"
            enabled={true}
            onChange={() => { }}
          />
        </div>

        {/* System Configuration */}
        <div
          style={{
            background: '#fff',
            borderRadius: '20px',
            boxShadow: '1px 1px 6px 3px rgba(0, 0, 0, 0.07)',
            border: '1px solid #F0F0F0',
            padding: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Settings size={20} style={{ color: '#10b981' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0d0e0f', marginBottom: '2px' }}>
                System Configuration
              </h3>
              <p style={{ fontSize: '13px', color: '#6C727F' }}>Core system settings</p>
            </div>
          </div>
          <ToggleSetting
            label="Maintenance Mode"
            description="Enable maintenance mode"
            enabled={maintenanceMode}
            onChange={setMaintenanceMode}
          />
          <ToggleSetting
            label="Automatic Backups"
            description="Backup database every 24 hours"
            enabled={true}
            onChange={() => { }}
          />
        </div>

        {/* Database Status */}
        <div
          style={{
            background: '#fff',
            borderRadius: '20px',
            boxShadow: '1px 1px 6px 3px rgba(0, 0, 0, 0.07)',
            border: '1px solid #F0F0F0',
            padding: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Database size={20} style={{ color: '#f59e0b' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0d0e0f', marginBottom: '2px' }}>
                Database Status
              </h3>
              <p style={{ fontSize: '13px', color: '#6C727F' }}>Database connections</p>
            </div>
          </div>
          <div style={{ display: 'grid', gap: '12px' }}>
            {[
              { name: 'MongoDB', status: 'Connected', color: '#10b981' },
              { name: 'PostgreSQL', status: 'Connected', color: '#10b981' },
            ].map((db) => (
              <div
                key={db.name}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ fontSize: '15px', fontWeight: 600, color: '#0d0e0f' }}>{db.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: db.color }} />
                  <span style={{ fontSize: '14px', color: '#6C727F' }}>{db.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
        <button
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#CD1B78',
            color: '#fff',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Save Changes
        </button>
      </div>
    </AdminLayout>
  );
}

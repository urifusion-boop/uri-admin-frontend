'use client';

import { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F2F2F2' }}>
      <AdminSidebar open={sidebarOpen} />

      <div
        style={{
          flex: 1,
          marginLeft: sidebarOpen ? '280px' : '80px',
          transition: 'margin-left 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <AdminHeader toggleSideNav={() => setSidebarOpen(!sidebarOpen)} />

        {/* Content wrapper with white background like uri-frontend */}
        <div style={{ flex: 1, padding: '16px', maxWidth: '1800px', width: '100%', margin: '0 auto' }}>
          <div
            style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '24px',
              minHeight: 'calc(100vh - 120px)',
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

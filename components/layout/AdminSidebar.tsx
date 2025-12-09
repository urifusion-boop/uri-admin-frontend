'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Target,
  Settings,
  FileText,
  MessageSquare,
  Shield,
  ChevronDown,
  HelpCircle,
} from 'lucide-react';
import Image from 'next/image';

interface NavItem {
  label: string;
  icon: React.ElementType;
  route: string;
  badge?: string;
  subLinkers?: { label: string; route: string; icon: React.ElementType }[];
}

const navItems: NavItem[] = [
  { label: 'Overview', icon: LayoutDashboard, route: '/dashboard' },
  { label: 'Users', icon: Users, route: '/users', badge: '1.2K' },
  { label: 'Finance', icon: DollarSign, route: '/finance' },
  { label: 'Leads', icon: Target, route: '/leads', badge: '234' },
  { label: 'System', icon: Settings, route: '/system' },
  { label: 'Content', icon: FileText, route: '/content' },
  { label: 'Support', icon: MessageSquare, route: '/support' },
  { label: 'Audit', icon: Shield, route: '/audit' },
];

const bottomLinks: NavItem[] = [
  { label: 'Help', icon: HelpCircle, route: '/help' },
  { label: 'Settings', icon: Settings, route: '/settings' },
];

interface AdminSidebarProps {
  open: boolean;
}

export function AdminSidebar({ open }: AdminSidebarProps) {
  const pathname = usePathname();
  const [expandedLinks, setExpandedLinks] = useState<{ [key: string]: boolean }>({});

  const activeLink = (route: string) => pathname === route || pathname?.startsWith(route + '/');

  const toggleLink = (linkName: string) => {
    setExpandedLinks((prev) => ({
      ...prev,
      [linkName]: !prev[linkName],
    }));
  };

  return (
    <div
      style={{
        width: open ? '280px' : '80px',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        transition: 'all 0.3s ease',
        zIndex: 100,
        overflow: 'hidden',
        backgroundColor: '#fff',
        borderRight: '1px solid #E5E5E5',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5E5E5', display: 'flex', alignItems: 'center', justifyContent: open ? 'flex-start' : 'center', height: '72px' }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center' }}>
          <Image
            src="/logo.png"
            alt="URI"
            width={open ? 70 : 30}
            height={open ? 24 : 24}
            style={{ objectFit: 'contain' }}
          />
        </Link>
      </div>

      {/* Navigation */}
      <div
        style={{
          height: 'calc(100vh - 100px)',
          overflowY: 'auto',
          scrollbarWidth: 'thin',
        }}
      >
        <div style={{ padding: '16px 0' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeLink(item.route);

            return (
              <Link key={item.route} href={item.route}>
                <div style={{ padding: `0px ${open ? '16px' : '12px'}`, marginBottom: '4px' }}>
                  <div
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      backgroundColor: isActive ? '#CD1B78' : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: open ? 'flex-start' : 'center',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = '#F2F2F2';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Icon
                      style={{
                        width: '20px',
                        height: '20px',
                        color: isActive ? 'white' : '#6C727F',
                        flexShrink: 0,
                      }}
                    />
                    {open && (
                      <>
                        <span
                          style={{
                            marginLeft: '12px',
                            fontSize: '14px',
                            fontWeight: 500,
                            color: isActive ? 'white' : '#0d0e0f',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item.label}
                        </span>
                        {item.badge && (
                          <span
                            style={{
                              marginLeft: 'auto',
                              padding: '2px 8px',
                              fontSize: '11px',
                              fontWeight: 600,
                              backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(205, 27, 120, 0.1)',
                              color: isActive ? 'white' : '#CD1B78',
                              borderRadius: '12px',
                            }}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom Links */}
        <div style={{ padding: '16px 0', borderTop: '1px solid #E5E5E5', marginTop: '16px' }}>
          {bottomLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activeLink(item.route);

            return (
              <Link key={item.route} href={item.route}>
                <div style={{ padding: `0px ${open ? '16px' : '12px'}`, marginBottom: '4px' }}>
                  <div
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      backgroundColor: isActive ? '#CD1B78' : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: open ? 'flex-start' : 'center',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = '#F2F2F2';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Icon
                      style={{
                        width: '20px',
                        height: '20px',
                        color: isActive ? 'white' : '#6C727F',
                      }}
                    />
                    {open && (
                      <span
                        style={{
                          marginLeft: '12px',
                          fontSize: '14px',
                          fontWeight: 500,
                          color: isActive ? 'white' : '#0d0e0f',
                        }}
                      >
                        {item.label}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        div::-webkit-scrollbar {
          width: 6px;
        }
        div::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        div::-webkit-scrollbar-thumb {
          background: #ddd;
          border-radius: 3px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: #ccc;
        }
      `}</style>
    </div>
  );
}

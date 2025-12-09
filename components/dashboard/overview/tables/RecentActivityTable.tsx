'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AllActivitiesModal } from '../modals/AllActivitiesModal';
import { ArrowUpRight } from 'lucide-react';

interface Activity {
  id: string;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  action: string;
  type: 'subscription' | 'user' | 'lead' | 'content' | 'system';
  timestamp: string;
  metadata?: string;
}

const activities: Activity[] = [
  {
    id: '1',
    user: { name: 'Sarah Johnson', email: 'sarah@example.com' },
    action: 'Upgraded to Pro Plan',
    type: 'subscription',
    timestamp: '2 minutes ago',
    metadata: '$49.99/mo',
  },
  {
    id: '2',
    user: { name: 'Michael Chen', email: 'michael@business.com' },
    action: 'New business account created',
    type: 'user',
    timestamp: '15 minutes ago',
  },
  {
    id: '3',
    user: { name: 'Emma Davis', email: 'emma@agency.com' },
    action: 'Submitted new lead',
    type: 'lead',
    timestamp: '1 hour ago',
    metadata: 'Fashion Campaign',
  },
  {
    id: '4',
    user: { name: 'James Wilson', email: 'james@creative.com' },
    action: 'Published new portfolio',
    type: 'content',
    timestamp: '2 hours ago',
  },
  {
    id: '5',
    user: { name: 'System', email: 'system@uri.com' },
    action: 'Database backup completed',
    type: 'system',
    timestamp: '3 hours ago',
  },
];

const typeColors = {
  subscription: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981', border: '#d1fae5' },
  user: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6', border: '#dbeafe' },
  lead: { bg: 'rgba(139, 92, 246, 0.1)', text: '#8b5cf6', border: '#ede9fe' },
  content: { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', border: '#fef3c7' },
  system: { bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280', border: '#e5e7eb' },
};

export function RecentActivityTable() {
  const [showAllActivities, setShowAllActivities] = useState(false);

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
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0d0e0f' }}>
            Recent Activity
          </h3>
          <p style={{ fontSize: '14px', color: '#6C727F', marginTop: '4px' }}>
            Latest actions and events across the platform
          </p>
        </div>

        <div style={{ display: 'grid', gap: '10px' }}>
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px',
                borderRadius: '12px',
                border: '1px solid #F0F0F0',
                backgroundColor: '#FAFAFA',
                transition: 'all 0.2s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F3F4F6';
                e.currentTarget.style.borderColor = '#CD1B78';
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FAFAFA';
                e.currentTarget.style.borderColor = '#F0F0F0';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #CD1B78 0%, #9333ea 100%)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: '14px',
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(205, 27, 120, 0.2)',
                }}
              >
                {activity.user.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
              </div>

              {/* Details */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px', flexWrap: 'wrap' }}>
                  <p style={{ fontWeight: 600, fontSize: '14px', color: '#0d0e0f', margin: 0 }}>
                    {activity.user.name}
                  </p>
                  <span
                    style={{
                      padding: '3px 8px',
                      fontSize: '10px',
                      fontWeight: 600,
                      backgroundColor: typeColors[activity.type].bg,
                      color: typeColors[activity.type].text,
                      borderRadius: '6px',
                      border: `1px solid ${typeColors[activity.type].border}`,
                      textTransform: 'uppercase',
                    }}
                  >
                    {activity.type}
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#0d0e0f', margin: '0 0 2px 0' }}>{activity.action}</p>
                {activity.metadata && (
                  <p style={{ fontSize: '12px', color: '#9EA3AE', margin: 0, fontWeight: 500 }}>
                    {activity.metadata}
                  </p>
                )}
              </div>

              {/* Timestamp with arrow */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#9EA3AE', whiteSpace: 'nowrap' }}>
                <span>{activity.timestamp}</span>
                <ArrowUpRight size={14} style={{ color: '#CD1B78', opacity: 0.7 }} />
              </div>
            </motion.div>
          ))}
        </div>

        <button
          onClick={() => setShowAllActivities(true)}
          style={{
            width: '100%',
            marginTop: '16px',
            padding: '12px',
            fontSize: '14px',
            fontWeight: 600,
            color: '#CD1B78',
            background: 'transparent',
            border: '1px solid transparent',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(205, 27, 120, 0.05)';
            e.currentTarget.style.borderColor = '#CD1B78';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = 'transparent';
          }}
        >
          View all activity
          <ArrowUpRight size={16} />
        </button>
      </div>

      <AllActivitiesModal isOpen={showAllActivities} onClose={() => setShowAllActivities(false)} />
    </>
  );
}

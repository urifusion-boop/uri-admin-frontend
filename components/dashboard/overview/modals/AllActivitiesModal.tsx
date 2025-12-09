'use client';

import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Search, Filter, X, Download, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  ipAddress?: string;
  device?: string;
  location?: string;
}

interface AllActivitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const allActivities: Activity[] = [
  {
    id: 'ACT-001',
    user: { name: 'Sarah Johnson', email: 'sarah@example.com' },
    action: 'Upgraded to Pro Plan',
    type: 'subscription',
    timestamp: '2024-12-08 14:23:45',
    metadata: '$49.99/mo',
    ipAddress: '192.168.1.100',
    device: 'Chrome on Windows',
    location: 'New York, USA',
  },
  {
    id: 'ACT-002',
    user: { name: 'Michael Chen', email: 'michael@business.com' },
    action: 'New business account created',
    type: 'user',
    timestamp: '2024-12-08 14:08:12',
    ipAddress: '10.0.0.45',
    device: 'Safari on macOS',
    location: 'San Francisco, USA',
  },
  {
    id: 'ACT-003',
    user: { name: 'Emma Davis', email: 'emma@agency.com' },
    action: 'Submitted new lead',
    type: 'lead',
    timestamp: '2024-12-08 13:45:30',
    metadata: 'Fashion Campaign',
    ipAddress: '172.16.0.12',
    device: 'Chrome on Android',
    location: 'London, UK',
  },
  {
    id: 'ACT-004',
    user: { name: 'James Wilson', email: 'james@creative.com' },
    action: 'Published new portfolio',
    type: 'content',
    timestamp: '2024-12-08 12:30:15',
    ipAddress: '192.168.1.50',
    device: 'Firefox on Windows',
    location: 'Toronto, Canada',
  },
  {
    id: 'ACT-005',
    user: { name: 'System', email: 'system@uri.com' },
    action: 'Database backup completed',
    type: 'system',
    timestamp: '2024-12-08 11:15:00',
    ipAddress: '127.0.0.1',
    device: 'Server',
    location: 'AWS us-east-1',
  },
  {
    id: 'ACT-006',
    user: { name: 'Lisa Anderson', email: 'lisa@startup.io' },
    action: 'Cancelled subscription',
    type: 'subscription',
    timestamp: '2024-12-08 10:50:22',
    ipAddress: '192.168.2.33',
    device: 'Chrome on macOS',
    location: 'Austin, USA',
  },
  {
    id: 'ACT-007',
    user: { name: 'David Brown', email: 'david@tech.com' },
    action: 'Updated profile information',
    type: 'user',
    timestamp: '2024-12-08 10:20:10',
    ipAddress: '10.0.1.200',
    device: 'Edge on Windows',
    location: 'Seattle, USA',
  },
  {
    id: 'ACT-008',
    user: { name: 'Sophie Taylor', email: 'sophie@design.co' },
    action: 'Uploaded new content',
    type: 'content',
    timestamp: '2024-12-08 09:45:55',
    metadata: 'Brand Assets',
    ipAddress: '192.168.3.100',
    device: 'Safari on iOS',
    location: 'Los Angeles, USA',
  },
];

const typeColors = {
  subscription: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981', border: '#d1fae5' },
  user: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6', border: '#dbeafe' },
  lead: { bg: 'rgba(139, 92, 246, 0.1)', text: '#8b5cf6', border: '#ede9fe' },
  content: { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', border: '#fef3c7' },
  system: { bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280', border: '#e5e7eb' },
};

export function AllActivitiesModal({ isOpen, onClose }: AllActivitiesModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const filteredActivities = allActivities.filter((activity) => {
    const matchesSearch =
      activity.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.action.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || activity.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const activeFiltersCount = typeFilter !== 'all' ? 1 : 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="All Platform Activities" size="xl">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Search and Filters */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9EA3AE',
              }}
            />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 36px 9px 36px',
                border: '1px solid #E5E5E5',
                borderRadius: '10px',
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
                }}
              >
                <X size={14} style={{ color: '#6C727F' }} />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 16px',
              background: showFilters ? '#F9FAFB' : '#fff',
              border: '1px solid #E5E5E5',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 500,
              color: '#0d0e0f',
              cursor: 'pointer',
            }}
          >
            <Filter size={16} />
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

          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 16px',
              background: '#fff',
              border: '1px solid #E5E5E5',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 500,
              color: '#0d0e0f',
              cursor: 'pointer',
            }}
          >
            <Download size={16} />
            Export
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
                  padding: '14px',
                  background: '#F9FAFB',
                  borderRadius: '10px',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                }}
              >
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>
                    Activity Type
                  </label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
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
                    <option value="subscription">Subscription</option>
                    <option value="user">User</option>
                    <option value="lead">Lead</option>
                    <option value="content">Content</option>
                    <option value="system">System</option>
                  </select>
                </div>

                {activeFiltersCount > 0 && (
                  <button
                    onClick={() => setTypeFilter('all')}
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
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Activities List */}
        <div style={{ maxHeight: '450px', overflowY: 'auto' }} className="activities-scroll">
          {filteredActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => setSelectedActivity(activity)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px',
                marginBottom: '8px',
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                backgroundColor: selectedActivity?.id === activity.id ? 'rgba(205, 27, 120, 0.05)' : '#F9FAFB',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (selectedActivity?.id !== activity.id) {
                  e.currentTarget.style.backgroundColor = '#F3F4F6';
                  e.currentTarget.style.borderColor = '#D1D5DB';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedActivity?.id !== activity.id) {
                  e.currentTarget.style.backgroundColor = '#F9FAFB';
                  e.currentTarget.style.borderColor = '#E5E7EB';
                }
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #CD1B78 0%, #9333ea 100%)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: '14px',
                  flexShrink: 0,
                }}
              >
                {activity.user.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
              </div>

              {/* Details */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
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
                <p style={{ fontSize: '12px', color: '#6C727F', margin: 0, fontFamily: 'monospace' }}>{activity.id}</p>
              </div>

              {/* Timestamp */}
              <div style={{ fontSize: '12px', color: '#9EA3AE', whiteSpace: 'nowrap', textAlign: 'right' }}>
                {activity.timestamp}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Activity Details */}
        {selectedActivity && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: '16px',
              borderRadius: '12px',
              border: '2px solid #CD1B78',
              backgroundColor: '#fff',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#0d0e0f', margin: 0 }}>Activity Details</h4>
              <button
                onClick={() => setSelectedActivity(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  color: '#6C727F',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '4px' }}>
                  ACTIVITY ID
                </label>
                <p style={{ fontSize: '13px', color: '#0d0e0f', margin: 0, fontFamily: 'monospace' }}>{selectedActivity.id}</p>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '4px' }}>
                  TIMESTAMP
                </label>
                <p style={{ fontSize: '13px', color: '#0d0e0f', margin: 0 }}>{selectedActivity.timestamp}</p>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '4px' }}>
                  USER
                </label>
                <p style={{ fontSize: '13px', color: '#0d0e0f', margin: 0 }}>{selectedActivity.user.name}</p>
                <p style={{ fontSize: '12px', color: '#6C727F', margin: 0 }}>{selectedActivity.user.email}</p>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '4px' }}>
                  IP ADDRESS
                </label>
                <p style={{ fontSize: '13px', color: '#0d0e0f', margin: 0, fontFamily: 'monospace' }}>{selectedActivity.ipAddress}</p>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '4px' }}>
                  DEVICE
                </label>
                <p style={{ fontSize: '13px', color: '#0d0e0f', margin: 0 }}>{selectedActivity.device}</p>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '4px' }}>
                  LOCATION
                </label>
                <p style={{ fontSize: '13px', color: '#0d0e0f', margin: 0 }}>{selectedActivity.location}</p>
              </div>
            </div>

            {selectedActivity.metadata && (
              <div style={{ marginTop: '12px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '4px' }}>
                  ADDITIONAL INFO
                </label>
                <p style={{ fontSize: '13px', color: '#0d0e0f', margin: 0 }}>{selectedActivity.metadata}</p>
              </div>
            )}
          </motion.div>
        )}

        <style jsx>{`
          .activities-scroll::-webkit-scrollbar {
            width: 6px;
          }
          .activities-scroll::-webkit-scrollbar-track {
            background: #F2F2F2;
            border-radius: 10px;
          }
          .activities-scroll::-webkit-scrollbar-thumb {
            background: #CD1B78;
            border-radius: 10px;
          }
          .activities-scroll::-webkit-scrollbar-thumb:hover {
            background: #a01560;
          }

          /* Firefox */
          .activities-scroll {
            scrollbar-width: thin;
            scrollbar-color: #CD1B78 #F2F2F2;
          }
        `}</style>
      </div>
    </Modal>
  );
}

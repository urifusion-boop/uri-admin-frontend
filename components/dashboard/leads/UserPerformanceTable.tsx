'use client';

import { useState } from 'react';
import { Search, TrendingUp, TrendingDown, ChevronRight, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTopUsers } from '@/hooks/useLeads';
import { UserLeadsModal } from './UserLeadsModal';

interface UserPerformance {
  user_id: string;
  email: string;
  name: string;
  total_leads: number;
  qualified_leads: number;
  converted_leads: number;
  conversion_rate: number;
}

export function UserPerformanceTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserPerformance | null>(null);
  const { data: topUsers, isLoading } = useTopUsers('LAST_1_MONTH', 50);

  const users: UserPerformance[] = topUsers || [];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getPerformanceColor = (rate: number) => {
    if (rate >= 40) return '#10b981'; // Green - Excellent
    if (rate >= 25) return '#f59e0b'; // Orange - Good
    return '#ef4444'; // Red - Needs Improvement
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0d0e0f', marginBottom: '4px' }}>
              User Performance
            </h3>
            <p style={{ fontSize: '14px', color: '#6C727F' }}>
              Lead generation performance by user
            </p>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ position: 'relative' }}>
            <Search
              size={18}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}
            />
            <input
              type="text"
              placeholder="Search by user name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px 10px 40px',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                fontSize: '14px',
                color: '#0d0e0f',
              }}
            />
          </div>
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6C727F' }}>
            <User size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <p>No users found</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E5E5E5' }}>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F' }}>
                    User
                  </th>
                  <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F' }}>
                    Total Leads
                  </th>
                  <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F' }}>
                    Qualified
                  </th>
                  <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F' }}>
                    Converted
                  </th>
                  <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F' }}>
                    Conversion Rate
                  </th>
                  <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.user_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    style={{
                      cursor: 'pointer',
                      borderBottom: '1px solid #F0F0F0',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    onClick={() => setSelectedUser(user)}
                  >
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #CD1B78 0%, #9333ea 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontSize: '16px',
                            fontWeight: 600,
                          }}
                        >
                          {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0e0f', marginBottom: '2px' }}>
                            {user.name || 'Unknown User'}
                          </p>
                          <p style={{ fontSize: '12px', color: '#9EA3AE', margin: 0 }}>{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <span style={{ fontSize: '16px', fontWeight: 700, color: '#0d0e0f' }}>
                        {user.total_leads.toLocaleString()}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#10b981' }}>
                        {user.qualified_leads.toLocaleString()}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#CD1B78' }}>
                        {user.converted_leads.toLocaleString()}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                        <div
                          style={{
                            width: '100px',
                            height: '8px',
                            backgroundColor: '#E5E7EB',
                            borderRadius: '4px',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: `${Math.min(user.conversion_rate, 100)}%`,
                              height: '100%',
                              backgroundColor: getPerformanceColor(user.conversion_rate),
                              borderRadius: '4px',
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: '14px',
                            fontWeight: 700,
                            color: getPerformanceColor(user.conversion_rate),
                            minWidth: '50px',
                          }}
                        >
                          {user.conversion_rate.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <button
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: '1px solid #E5E7EB',
                          backgroundColor: '#fff',
                          color: '#0d0e0f',
                          fontSize: '13px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          marginLeft: 'auto',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUser(user);
                        }}
                      >
                        View Details
                        <ChevronRight size={14} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Summary Footer */}
        {!isLoading && filteredUsers.length > 0 && (
          <div
            style={{
              marginTop: '20px',
              padding: '16px',
              borderTop: '2px solid #F0F0F0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <p style={{ fontSize: '14px', color: '#6C727F' }}>
              Showing <strong>{filteredUsers.length}</strong> user{filteredUsers.length !== 1 ? 's' : ''}
            </p>
            <div style={{ display: 'flex', gap: '24px' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '12px', color: '#6C727F', marginBottom: '4px' }}>Total Leads</p>
                <p style={{ fontSize: '18px', fontWeight: 700, color: '#0d0e0f' }}>
                  {filteredUsers.reduce((sum, u) => sum + u.total_leads, 0).toLocaleString()}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '12px', color: '#6C727F', marginBottom: '4px' }}>Avg Conversion</p>
                <p style={{ fontSize: '18px', fontWeight: 700, color: '#CD1B78' }}>
                  {(filteredUsers.reduce((sum, u) => sum + u.conversion_rate, 0) / filteredUsers.length).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      <AnimatePresence>
        {selectedUser && (
          <UserLeadsModal user={selectedUser} onClose={() => setSelectedUser(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

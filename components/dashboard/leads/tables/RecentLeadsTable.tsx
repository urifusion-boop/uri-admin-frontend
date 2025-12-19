'use client';

import { useState } from 'react';
import { Search, Filter, Download, Twitter, Facebook, Instagram, Linkedin, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRecentLeads } from '@/hooks/useLeads';
import { formatDistanceToNow } from 'date-fns';

interface Lead {
  id: string;
  name: string;
  platform: string;
  intentScore: number;
  relevanceScore: number;
  status: string;
  createdDate: string;
  email?: string;
  userEmail?: string;
  userName?: string;
}

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  NEW: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6', border: '#dbeafe' },
  CONTACTED: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981', border: '#d1fae5' },
  QUALIFIED: { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', border: '#fef3c7' },
  CONVERTED: { bg: 'rgba(205, 27, 120, 0.1)', text: '#CD1B78', border: '#fce4ec' },
  UNQUALIFIED: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', border: '#fee2e2' },
};

const platformIcons: Record<string, React.ReactNode> = {
  TWITTER: <Twitter size={16} />,
  FACEBOOK: <Facebook size={16} />,
  INSTAGRAM: <Instagram size={16} />,
  LINKEDIN: <Linkedin size={16} />,
  X: <Twitter size={16} />,
};

export function RecentLeadsTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { data: leadsData, isLoading } = useRecentLeads(50, 0, statusFilter === 'all' ? undefined : statusFilter);

  const leads: Lead[] = (leadsData?.leads || []).map(lead => {
    return {
      id: lead.lead_id,
      name: lead.name || 'Unknown',
      email: lead.email,
      platform: lead.platform,
      status: lead.status,
      intentScore: lead.intent_score || 0,
      relevanceScore: lead.relevance_score || 0,
      createdDate: lead.created_date,
      userEmail: lead.user_email,
      userName: lead.user_name?.trim() || 'Unknown User',
    };
  });

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
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
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0d0e0f', marginBottom: '4px' }}>Recent Leads</h3>
          <p style={{ fontSize: '14px', color: '#6C727F' }}>Latest leads from all platforms</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              backgroundColor: '#fff',
              color: '#0d0e0f',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Filter size={16} />
            Filter
          </button>
          <button
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#CD1B78',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search
            size={18}
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}
          />
          <input
            type="text"
            placeholder="Search leads..."
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
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            border: '1px solid #E5E7EB',
            fontSize: '14px',
            color: '#0d0e0f',
            backgroundColor: '#fff',
            cursor: 'pointer',
          }}
        >
          <option value="all">All Status</option>
          <option value="NEW">New</option>
          <option value="CONTACTED">Contacted</option>
          <option value="QUALIFIED">Qualified</option>
          <option value="CONVERTED">Converted</option>
          <option value="UNQUALIFIED">Unqualified</option>
        </select>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredLeads.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6C727F' }}>
          <p>No leads found</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E5E5E5' }}>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F' }}>
                  Lead Name
                </th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F' }}>
                  User
                </th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F' }}>
                  Platform
                </th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F' }}>
                  Intent Score
                </th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F' }}>
                  Status
                </th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F' }}>
                  Created
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead, index) => (
              <motion.tr
                key={lead.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                style={{ cursor: 'pointer', borderBottom: '1px solid #F0F0F0' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <td style={{ padding: '16px' }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0e0f', marginBottom: '2px' }}>{lead.name}</p>
                    <p style={{ fontSize: '12px', color: '#9EA3AE', margin: 0 }}>{lead.email || 'No email'}</p>
                  </div>
                </td>
                <td style={{ padding: '16px' }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: '#0d0e0f', marginBottom: '2px' }}>
                      {lead.userName || 'Unknown User'}
                    </p>
                    <p style={{ fontSize: '12px', color: '#9EA3AE', margin: 0 }}>{lead.userEmail || ''}</p>
                  </div>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6C727F' }}>
                    {platformIcons[lead.platform.toUpperCase()] || platformIcons['TWITTER']}
                    <span style={{ fontSize: '14px' }}>{lead.platform}</span>
                  </div>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        flex: 1,
                        height: '6px',
                        backgroundColor: '#E5E7EB',
                        borderRadius: '3px',
                        overflow: 'hidden',
                        maxWidth: '80px',
                      }}
                    >
                      <div
                        style={{
                          width: `${lead.intentScore * 100}%`,
                          height: '100%',
                          backgroundColor: lead.intentScore > 0.7 ? '#10b981' : lead.intentScore > 0.5 ? '#f59e0b' : '#ef4444',
                          borderRadius: '3px',
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#0d0e0f' }}>
                      {(lead.intentScore * 100).toFixed(0)}%
                    </span>
                  </div>
                </td>
                <td style={{ padding: '16px' }}>
                  <span
                    style={{
                      padding: '4px 12px',
                      fontSize: '12px',
                      fontWeight: 600,
                      backgroundColor: statusColors[lead.status.toUpperCase()]?.bg || statusColors['NEW'].bg,
                      color: statusColors[lead.status.toUpperCase()]?.text || statusColors['NEW'].text,
                      borderRadius: '6px',
                      border: `1px solid ${statusColors[lead.status.toUpperCase()]?.border || statusColors['NEW'].border}`,
                    }}
                  >
                    {lead.status}
                  </span>
                </td>
                <td style={{ padding: '16px' }}>
                  <span style={{ fontSize: '13px', color: '#6C727F' }}>
                    {formatDistanceToNow(new Date(lead.createdDate), { addSuffix: true })}
                  </span>
                </td>
              </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

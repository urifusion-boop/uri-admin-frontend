'use client';

import { useState } from 'react';
import { Search, Filter, Download, Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';

interface Lead {
  id: string;
  name: string;
  platform: string;
  intentScore: number;
  relevanceScore: number;
  status: 'New' | 'Contacted' | 'Qualified' | 'Converted';
  createdDate: string;
  email?: string;
}

const recentLeads: Lead[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    platform: 'Twitter',
    intentScore: 0.87,
    relevanceScore: 0.92,
    status: 'New',
    createdDate: '2 hours ago',
    email: 'sarah.j@example.com',
  },
  {
    id: '2',
    name: 'Michael Chen',
    platform: 'LinkedIn',
    intentScore: 0.91,
    relevanceScore: 0.88,
    status: 'Contacted',
    createdDate: '5 hours ago',
    email: 'm.chen@business.com',
  },
  {
    id: '3',
    name: 'Emma Davis',
    platform: 'Facebook',
    intentScore: 0.79,
    relevanceScore: 0.85,
    status: 'Qualified',
    createdDate: '1 day ago',
    email: 'emma.davis@agency.com',
  },
];

const statusColors = {
  New: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6', border: '#dbeafe' },
  Contacted: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981', border: '#d1fae5' },
  Qualified: { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', border: '#fef3c7' },
  Converted: { bg: 'rgba(205, 27, 120, 0.1)', text: '#CD1B78', border: '#fce4ec' },
};

const platformIcons: Record<string, React.ReactNode> = {
  Twitter: <Twitter size={16} />,
  Facebook: <Facebook size={16} />,
  Instagram: <Instagram size={16} />,
  LinkedIn: <Linkedin size={16} />,
};

export function RecentLeadsTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredLeads = recentLeads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
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
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Converted">Converted</option>
        </select>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E5E5E5' }}>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F' }}>
                Lead Name
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
                    <p style={{ fontSize: '12px', color: '#9EA3AE', margin: 0 }}>{lead.email}</p>
                  </div>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6C727F' }}>
                    {platformIcons[lead.platform]}
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
                      backgroundColor: statusColors[lead.status].bg,
                      color: statusColors[lead.status].text,
                      borderRadius: '6px',
                      border: `1px solid ${statusColors[lead.status].border}`,
                    }}
                  >
                    {lead.status}
                  </span>
                </td>
                <td style={{ padding: '16px' }}>
                  <span style={{ fontSize: '13px', color: '#6C727F' }}>{lead.createdDate}</span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

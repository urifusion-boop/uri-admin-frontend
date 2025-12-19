'use client';

import { useState } from 'react';
import { X, Download, Filter, Search, Twitter, Facebook, Instagram, Linkedin, Loader2, Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRecentLeads } from '@/hooks/useLeads';
import { formatDistanceToNow } from 'date-fns';

interface UserPerformance {
  user_id: string;
  email: string;
  name: string;
  total_leads: number;
  qualified_leads: number;
  converted_leads: number;
  conversion_rate: number;
}

interface UserLeadsModalProps {
  user: UserPerformance;
  onClose: () => void;
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

export function UserLeadsModal({ user, onClose }: UserLeadsModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { data: leadsData, isLoading } = useRecentLeads(
    100,
    0,
    statusFilter === 'all' ? undefined : statusFilter,
    undefined,
    user.user_id
  );

  const leads = (leadsData?.leads || []).map((lead: any) => ({
    id: lead.lead_id,
    name: lead.name || 'Unknown',
    email: lead.email,
    platform: lead.platform,
    status: lead.status,
    leadType: lead.lead_type || 'BUSINESS',
    intentScore: lead.intent_score || 0,
    relevanceScore: lead.relevance_score || 0,
    createdDate: lead.created_date,
    interestLevel: lead.interest_level || 'Low',
  }));

  const filteredLeads = leads.filter((lead: any) => {
    const matchesSearch =
      lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#fff',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '1200px',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #E5E7EB',
            backgroundColor: '#fff',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
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
                  fontWeight: 700,
                }}
              >
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0d0e0f', marginBottom: '2px' }}>
                  {user.name}
                </h2>
                <p style={{ fontSize: '13px', color: '#6C727F', margin: 0 }}>{user.email}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                padding: '6px',
                cursor: 'pointer',
                color: '#6C727F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={18} />
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            <div style={{ padding: '12px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #F0F0F0' }}>
              <p style={{ fontSize: '11px', color: '#6C727F', marginBottom: '4px', fontWeight: 500 }}>Total Leads</p>
              <p style={{ fontSize: '20px', fontWeight: 700, color: '#0d0e0f', margin: 0 }}>{user.total_leads.toLocaleString()}</p>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #F0F0F0' }}>
              <p style={{ fontSize: '11px', color: '#6C727F', marginBottom: '4px', fontWeight: 500 }}>Qualified</p>
              <p style={{ fontSize: '20px', fontWeight: 700, color: '#10b981', margin: 0 }}>{user.qualified_leads.toLocaleString()}</p>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #F0F0F0' }}>
              <p style={{ fontSize: '11px', color: '#6C727F', marginBottom: '4px', fontWeight: 500 }}>Converted</p>
              <p style={{ fontSize: '20px', fontWeight: 700, color: '#CD1B78', margin: 0 }}>{user.converted_leads.toLocaleString()}</p>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #F0F0F0' }}>
              <p style={{ fontSize: '11px', color: '#6C727F', marginBottom: '4px', fontWeight: 500 }}>Conversion</p>
              <p style={{ fontSize: '20px', fontWeight: 700, color: '#f59e0b', margin: 0 }}>{user.conversion_rate.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5E7EB' }}>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
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
              <option value="Unqualified">Unqualified</option>
            </select>
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
                whiteSpace: 'nowrap',
              }}
            >
              <Download size={16} />
              Export
            </button>
          </div>
          <p style={{ fontSize: '13px', color: '#6C727F' }}>
            Showing <strong>{filteredLeads.length}</strong> of <strong>{leads.length}</strong> leads
          </p>
        </div>

        {/* Leads List */}
        <div style={{ flex: 1, overflow: 'auto', padding: '0 24px 24px' }}>
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
              <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#CD1B78' }} />
            </div>
          ) : filteredLeads.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#6C727F' }}>
              <p>No leads found</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, marginTop: '16px' }}>
              <thead style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1 }}>
                <tr style={{ borderBottom: '1px solid #E5E5E5' }}>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F' }}>
                    Lead Name
                  </th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F' }}>
                    Type
                  </th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F' }}>
                    Platform
                  </th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F' }}>
                    Interest
                  </th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F' }}>
                    Quality
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
                {filteredLeads.map((lead: any, index: number) => (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                    style={{ borderBottom: '1px solid #F0F0F0', cursor: 'pointer' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '16px' }}>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0e0f', marginBottom: '2px' }}>
                          {lead.name}
                        </p>
                        <p style={{ fontSize: '12px', color: '#9EA3AE', margin: 0 }}>{lead.email || 'No email'}</p>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span
                        style={{
                          padding: '4px 10px',
                          fontSize: '11px',
                          fontWeight: 600,
                          backgroundColor:
                            lead.leadType === 'CONVERSATIONAL'
                              ? 'rgba(139, 92, 246, 0.1)'
                              : lead.leadType === 'PERSON'
                              ? 'rgba(59, 130, 246, 0.1)'
                              : 'rgba(16, 185, 129, 0.1)',
                          color:
                            lead.leadType === 'CONVERSATIONAL'
                              ? '#8b5cf6'
                              : lead.leadType === 'PERSON'
                              ? '#3b82f6'
                              : '#10b981',
                          borderRadius: '4px',
                          textTransform: 'capitalize',
                        }}
                      >
                        {lead.leadType === 'CONVERSATIONAL' ? 'Signal' : lead.leadType === 'PERSON' ? 'Individual' : lead.leadType === 'ORGANIZATION' ? 'Org' : 'Business'}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6C727F' }}>
                        {platformIcons[lead.platform?.toUpperCase()] || platformIcons['TWITTER']}
                        <span style={{ fontSize: '14px' }}>{lead.platform}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span
                        style={{
                          padding: '4px 8px',
                          fontSize: '12px',
                          fontWeight: 600,
                          backgroundColor:
                            lead.interestLevel === 'High'
                              ? 'rgba(16, 185, 129, 0.1)'
                              : lead.interestLevel === 'Medium'
                              ? 'rgba(245, 158, 11, 0.1)'
                              : 'rgba(107, 114, 128, 0.1)',
                          color:
                            lead.interestLevel === 'High'
                              ? '#10b981'
                              : lead.interestLevel === 'Medium'
                              ? '#f59e0b'
                              : '#6b7280',
                          borderRadius: '6px',
                        }}
                      >
                        {lead.interestLevel}
                      </span>
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
                            maxWidth: '60px',
                          }}
                        >
                          <div
                            style={{
                              width: `${lead.intentScore * 100}%`,
                              height: '100%',
                              backgroundColor:
                                lead.intentScore > 0.7 ? '#10b981' : lead.intentScore > 0.5 ? '#f59e0b' : '#ef4444',
                              borderRadius: '3px',
                            }}
                          />
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#0d0e0f', minWidth: '35px' }}>
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
                          backgroundColor: statusColors[lead.status?.toUpperCase()]?.bg || statusColors['NEW'].bg,
                          color: statusColors[lead.status?.toUpperCase()]?.text || statusColors['NEW'].text,
                          borderRadius: '6px',
                          border: `1px solid ${statusColors[lead.status?.toUpperCase()]?.border || statusColors['NEW'].border}`,
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
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

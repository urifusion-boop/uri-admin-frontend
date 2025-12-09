'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Eye, MoreVertical, Image, Video, FileText, Download, Edit, Flag, Trash2, CheckCircle } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { Dropdown } from '@/components/common/Dropdown';
import { toast } from 'sonner';

interface ContentItem {
  id: string;
  title: string;
  type: 'image' | 'video' | 'document' | 'portfolio';
  user: string;
  userEmail: string;
  size: string;
  status: 'published' | 'draft' | 'pending' | 'flagged';
  uploadedAt: string;
  views: number;
}

const contentItems: ContentItem[] = [
  {
    id: 'CNT-001',
    title: 'Fashion Campaign 2024',
    type: 'portfolio',
    user: 'Sarah Johnson',
    userEmail: 'sarah@example.com',
    size: '24.5 MB',
    status: 'published',
    uploadedAt: '2024-12-01',
    views: 1243,
  },
  {
    id: 'CNT-002',
    title: 'Product Photography Set',
    type: 'image',
    user: 'Michael Chen',
    userEmail: 'michael@business.com',
    size: '12.8 MB',
    status: 'published',
    uploadedAt: '2024-12-03',
    views: 856,
  },
  {
    id: 'CNT-003',
    title: 'Brand Story Video',
    type: 'video',
    user: 'Emma Davis',
    userEmail: 'emma@agency.com',
    size: '145.2 MB',
    status: 'pending',
    uploadedAt: '2024-12-05',
    views: 0,
  },
  {
    id: 'CNT-004',
    title: 'Marketing Proposal',
    type: 'document',
    user: 'James Wilson',
    userEmail: 'james@creative.com',
    size: '2.4 MB',
    status: 'draft',
    uploadedAt: '2024-12-06',
    views: 45,
  },
  {
    id: 'CNT-005',
    title: 'Inappropriate Content Report',
    type: 'image',
    user: 'Anonymous User',
    userEmail: 'user@example.com',
    size: '5.6 MB',
    status: 'flagged',
    uploadedAt: '2024-12-07',
    views: 234,
  },
];

const typeConfig = {
  image: { icon: Image, bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6', border: '#dbeafe' },
  video: { icon: Video, bg: 'rgba(205, 27, 120, 0.1)', text: '#CD1B78', border: '#fce7f3' },
  document: { icon: FileText, bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981', border: '#d1fae5' },
  portfolio: { icon: FileText, bg: 'rgba(139, 92, 246, 0.1)', text: '#8b5cf6', border: '#ede9fe' },
};

const statusConfig = {
  published: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981', border: '#d1fae5' },
  draft: { bg: 'rgba(156, 163, 175, 0.1)', text: '#6b7280', border: '#e5e7eb' },
  pending: { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', border: '#fef3c7' },
  flagged: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', border: '#fecaca' },
};

export function ContentTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const filteredContent = contentItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const activeFiltersCount = (typeFilter !== 'all' ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0);

  const clearFilters = () => {
    setTypeFilter('all');
    setStatusFilter('all');
  };

  const handleViewContent = (item: ContentItem) => {
    setSelectedContent(item);
    setShowViewModal(true);
  };

  const handleEditContent = (item: ContentItem) => {
    toast.success(`Editing ${item.title}...`);
  };

  const handleDownloadContent = (item: ContentItem) => {
    toast.success(`Downloading ${item.title}...`);
  };

  const handleApproveContent = (item: ContentItem) => {
    toast.success(`${item.title} approved and published`);
  };

  const handleFlagContent = (item: ContentItem) => {
    toast.warning(`${item.title} flagged for review`);
  };

  const handleDeleteContent = (item: ContentItem) => {
    toast.error(`${item.title} deleted`);
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
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0d0e0f' }}>Content Library</h3>
              <p style={{ fontSize: '14px', color: '#6C727F', marginTop: '4px' }}>
                Browse and manage all user-uploaded content
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ position: 'relative', width: '280px' }}>
                <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#9EA3AE' }} />
                <input
                  type="text"
                  placeholder="Search content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '10px 36px 10px 40px', border: '1px solid #E5E5E5', borderRadius: '12px', fontSize: '14px', outline: 'none' }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F2F2F2')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <X style={{ width: '14px', height: '14px', color: '#6C727F' }} />
                  </button>
                )}
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: showFilters ? '#F9FAFB' : '#fff', border: '1px solid #E5E5E5', borderRadius: '12px', fontSize: '14px', fontWeight: 500, color: '#0d0e0f', cursor: 'pointer' }}
                onMouseEnter={(e) => { if (!showFilters) e.currentTarget.style.backgroundColor = '#F9FAFB'; }}
                onMouseLeave={(e) => { if (!showFilters) e.currentTarget.style.backgroundColor = '#fff'; }}
              >
                <Filter style={{ width: '16px', height: '16px' }} />
                Filters
                {activeFiltersCount > 0 && (
                  <span style={{ background: '#CD1B78', color: '#fff', fontSize: '11px', fontWeight: 600, padding: '2px 6px', borderRadius: '10px', minWidth: '18px', textAlign: 'center' }}>
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} style={{ overflow: 'hidden' }}>
                <div style={{ padding: '16px', background: '#F9FAFB', borderRadius: '12px', marginTop: '16px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ flex: '1', minWidth: '200px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>Type</label>
                    <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: '8px', fontSize: '14px', background: '#fff', cursor: 'pointer', outline: 'none' }}>
                      <option value="all">All Types</option>
                      <option value="portfolio">Portfolio</option>
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                      <option value="document">Document</option>
                    </select>
                  </div>
                  <div style={{ flex: '1', minWidth: '200px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>Status</label>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: '8px', fontSize: '14px', background: '#fff', cursor: 'pointer', outline: 'none' }}>
                      <option value="all">All Statuses</option>
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="pending">Pending</option>
                      <option value="flagged">Flagged</option>
                    </select>
                  </div>
                  {activeFiltersCount > 0 && (
                    <button onClick={clearFilters} style={{ padding: '8px 16px', background: '#fff', border: '1px solid #E5E5E5', borderRadius: '8px', fontSize: '13px', fontWeight: 500, color: '#6C727F', cursor: 'pointer', marginTop: '20px' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F2F2F2')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}>
                      Clear Filters
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F', borderBottom: '1px solid #E5E5E5' }}>Content ID</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F', borderBottom: '1px solid #E5E5E5' }}>Title & User</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F', borderBottom: '1px solid #E5E5E5' }}>Type</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F', borderBottom: '1px solid #E5E5E5' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F', borderBottom: '1px solid #E5E5E5' }}>Size</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F', borderBottom: '1px solid #E5E5E5' }}>Views</th>
                <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#6C727F', borderBottom: '1px solid #E5E5E5' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContent.map((item, index) => {
                const TypeIcon = typeConfig[item.type].icon;
                return (
                  <motion.tr key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                    style={{ background: '#fff', border: '1px solid #F0F0F0', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => { const row = e.currentTarget; row.style.backgroundColor = '#F9FAFB'; row.style.transform = 'scale(1.01)'; row.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)'; }}
                    onMouseLeave={(e) => { const row = e.currentTarget; row.style.backgroundColor = '#fff'; row.style.transform = 'scale(1)'; row.style.boxShadow = 'none'; }}>
                    <td style={{ padding: '16px', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#0d0e0f', fontFamily: 'monospace' }}>{item.id}</span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0e0f', marginBottom: '4px' }}>{item.title}</p>
                        <p style={{ fontSize: '13px', color: '#6C727F', margin: 0 }}>{item.user}</p>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ padding: '4px 12px', fontSize: '12px', fontWeight: 600, backgroundColor: typeConfig[item.type].bg, color: typeConfig[item.type].text, borderRadius: '8px', border: `1px solid ${typeConfig[item.type].border}`, display: 'inline-flex', alignItems: 'center', gap: '6px', textTransform: 'capitalize' }}>
                        <TypeIcon style={{ width: '12px', height: '12px' }} />
                        {item.type}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ padding: '4px 12px', fontSize: '12px', fontWeight: 600, backgroundColor: statusConfig[item.status].bg, color: statusConfig[item.status].text, borderRadius: '8px', border: `1px solid ${statusConfig[item.status].border}`, display: 'inline-block', textTransform: 'capitalize' }}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ fontSize: '13px', color: '#6C727F' }}>{item.size}</span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ fontSize: '13px', color: '#0d0e0f', fontWeight: 500 }}>{item.views.toLocaleString()}</span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right', borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button onClick={() => handleViewContent(item)} style={{ padding: '8px 12px', background: '#fff', border: '1px solid #E5E5E5', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 500, color: '#6C727F' }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F2F2F2'; e.currentTarget.style.borderColor = '#D1D5DB'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.borderColor = '#E5E5E5'; }}>
                          <Eye style={{ width: '14px', height: '14px' }} />
                          View
                        </button>
                        <Dropdown
                          trigger={
                            <button style={{ padding: '8px', background: '#fff', border: '1px solid #E5E5E5', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F2F2F2'; e.currentTarget.style.borderColor = '#D1D5DB'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.borderColor = '#E5E5E5'; }}>
                              <MoreVertical style={{ width: '16px', height: '16px', color: '#6C727F' }} />
                            </button>
                          }
                          items={[
                            { label: 'Download', icon: <Download style={{ width: '16px', height: '16px' }} />, onClick: () => handleDownloadContent(item) },
                            { label: 'Edit Details', icon: <Edit style={{ width: '16px', height: '16px' }} />, onClick: () => handleEditContent(item) },
                            ...(item.status === 'pending' ? [{ label: 'Approve & Publish', icon: <CheckCircle style={{ width: '16px', height: '16px' }} />, onClick: () => handleApproveContent(item) }] : []),
                            { label: 'Flag Content', icon: <Flag style={{ width: '16px', height: '16px' }} />, onClick: () => handleFlagContent(item) },
                            { label: 'Delete', icon: <Trash2 style={{ width: '16px', height: '16px' }} />, onClick: () => handleDeleteContent(item), variant: 'danger' as const },
                          ]}
                        />
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #E5E5E5', flexWrap: 'wrap', gap: '16px' }}>
          <p style={{ fontSize: '14px', color: '#6C727F' }}>Showing {filteredContent.length} of {contentItems.length} items</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button disabled style={{ padding: '8px 16px', fontSize: '14px', fontWeight: 500, color: '#9EA3AE', background: 'transparent', border: '1px solid #E5E5E5', borderRadius: '8px', cursor: 'not-allowed' }}>Previous</button>
            <button style={{ padding: '8px 16px', fontSize: '14px', fontWeight: 500, color: '#0d0e0f', background: 'transparent', border: '1px solid #E5E5E5', borderRadius: '8px', cursor: 'pointer' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F2F2F2')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>Next</button>
          </div>
        </div>
      </div>

      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Content Details" size="md">
        {selectedContent && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>Content ID</label><p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0e0f', margin: 0, fontFamily: 'monospace' }}>{selectedContent.id}</p></div>
              <div><label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>Status</label>
                <span style={{ padding: '4px 12px', fontSize: '12px', fontWeight: 600, backgroundColor: statusConfig[selectedContent.status].bg, color: statusConfig[selectedContent.status].text, borderRadius: '8px', border: `1px solid ${statusConfig[selectedContent.status].border}`, display: 'inline-block', textTransform: 'capitalize' }}>{selectedContent.status}</span>
              </div>
              <div><label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>Title</label><p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0e0f', margin: 0 }}>{selectedContent.title}</p></div>
              <div><label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>Type</label>
                <span style={{ padding: '4px 12px', fontSize: '12px', fontWeight: 600, backgroundColor: typeConfig[selectedContent.type].bg, color: typeConfig[selectedContent.type].text, borderRadius: '8px', border: `1px solid ${typeConfig[selectedContent.type].border}`, display: 'inline-block', textTransform: 'capitalize' }}>{selectedContent.type}</span>
              </div>
              <div><label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>Uploaded By</label><p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0e0f', margin: 0 }}>{selectedContent.user}</p><p style={{ fontSize: '13px', color: '#6C727F', margin: 0 }}>{selectedContent.userEmail}</p></div>
              <div><label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>File Size</label><p style={{ fontSize: '14px', color: '#0d0e0f', margin: 0 }}>{selectedContent.size}</p></div>
              <div><label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>Views</label><p style={{ fontSize: '14px', color: '#0d0e0f', margin: 0 }}>{selectedContent.views.toLocaleString()}</p></div>
              <div><label style={{ fontSize: '12px', fontWeight: 600, color: '#6C727F', display: 'block', marginBottom: '6px' }}>Upload Date</label><p style={{ fontSize: '14px', color: '#0d0e0f', margin: 0 }}>{new Date(selectedContent.uploadedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p></div>
            </div>
            <div style={{ display: 'flex', gap: '12px', paddingTop: '16px', borderTop: '1px solid #E5E5E5' }}>
              <button onClick={() => handleDownloadContent(selectedContent)} style={{ flex: 1, padding: '12px 20px', background: '#fff', border: '1px solid #E5E5E5', borderRadius: '12px', fontSize: '14px', fontWeight: 600, color: '#0d0e0f', cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F2F2F2')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}>Download</button>
              <button onClick={() => handleEditContent(selectedContent)} style={{ flex: 1, padding: '12px 20px', background: '#CD1B78', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 600, color: '#fff', cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#A81563')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#CD1B78')}>Edit Details</button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

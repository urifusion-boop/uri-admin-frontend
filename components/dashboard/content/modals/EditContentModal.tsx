'use client';

import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { FileText, Tag, Calendar, User } from 'lucide-react';
import { toast } from 'sonner';

interface EditContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: {
    id: string;
    title: string;
    type: 'Image' | 'Video' | 'Document' | 'Audio';
    author: string;
    status: 'Published' | 'Draft' | 'Pending';
    tags: string;
    uploadDate: string;
  };
}

export function EditContentModal({ isOpen, onClose, content }: EditContentModalProps) {
  const [formData, setFormData] = useState({
    title: content.title,
    type: content.type,
    status: content.status,
    tags: content.tags,
  });

  const handleSave = () => {
    // TODO: Implement API call to update content
    toast.success(`Content "${formData.title}" updated successfully!`);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Content" size="md">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Author Info (Read-only) */}
        <div
          style={{
            padding: '16px',
            borderRadius: '12px',
            backgroundColor: '#F9FAFB',
            border: '1px solid #E5E5E5',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <User size={16} style={{ color: '#6C727F' }} />
            <span style={{ fontSize: '14px', fontWeight: 500, color: '#0d0e0f' }}>{content.author}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Calendar size={14} style={{ color: '#6C727F' }} />
            <span style={{ fontSize: '13px', color: '#6C727F' }}>{content.uploadDate}</span>
          </div>
        </div>

        {/* Title Field */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 500,
              color: '#0d0e0f',
              marginBottom: '8px',
            }}
          >
            Title
          </label>
          <div style={{ position: 'relative' }}>
            <FileText
              size={18}
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6C727F',
              }}
            />
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              style={{
                width: '100%',
                padding: '12px 12px 12px 44px',
                borderRadius: '12px',
                border: '1px solid #E5E5E5',
                fontSize: '14px',
                color: '#0d0e0f',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#CD1B78';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#E5E5E5';
              }}
            />
          </div>
        </div>

        {/* Type and Status Fields */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Type */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 500,
                color: '#0d0e0f',
                marginBottom: '8px',
              }}
            >
              Type
            </label>
            <div style={{ position: 'relative' }}>
              <Tag
                size={18}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6C727F',
                  zIndex: 1,
                }}
              />
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'Image' | 'Video' | 'Document' | 'Audio' })}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 44px',
                  borderRadius: '12px',
                  border: '1px solid #E5E5E5',
                  fontSize: '14px',
                  color: '#0d0e0f',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: '#fff',
                  cursor: 'pointer',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#CD1B78';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#E5E5E5';
                }}
              >
                <option value="Image">Image</option>
                <option value="Video">Video</option>
                <option value="Document">Document</option>
                <option value="Audio">Audio</option>
              </select>
            </div>
          </div>

          {/* Status */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 500,
                color: '#0d0e0f',
                marginBottom: '8px',
              }}
            >
              Status
            </label>
            <div style={{ position: 'relative' }}>
              <Calendar
                size={18}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6C727F',
                  zIndex: 1,
                }}
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Published' | 'Draft' | 'Pending' })}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 44px',
                  borderRadius: '12px',
                  border: '1px solid #E5E5E5',
                  fontSize: '14px',
                  color: '#0d0e0f',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: '#fff',
                  cursor: 'pointer',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#CD1B78';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#E5E5E5';
                }}
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tags Field */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 500,
              color: '#0d0e0f',
              marginBottom: '8px',
            }}
          >
            Tags
          </label>
          <div style={{ position: 'relative' }}>
            <Tag
              size={18}
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6C727F',
              }}
            />
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="e.g., marketing, social, campaign"
              style={{
                width: '100%',
                padding: '12px 12px 12px 44px',
                borderRadius: '12px',
                border: '1px solid #E5E5E5',
                fontSize: '14px',
                color: '#0d0e0f',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#CD1B78';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#E5E5E5';
              }}
            />
          </div>
          <p style={{ fontSize: '12px', color: '#6C727F', marginTop: '6px' }}>
            Separate tags with commas
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: '12px',
              border: '1px solid #E5E5E5',
              backgroundColor: '#fff',
              color: '#0d0e0f',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F2F2F2';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fff';
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: '#CD1B78',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#a01560';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#CD1B78';
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
}

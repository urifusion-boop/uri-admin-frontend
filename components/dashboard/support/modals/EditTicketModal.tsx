'use client';

import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { User, Mail, AlertCircle, Tag, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface EditTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: {
    id: string;
    subject: string;
    user: string;
    email: string;
    priority: 'Low' | 'Medium' | 'High' | 'Urgent';
    status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
    category: string;
    description: string;
  };
}

export function EditTicketModal({ isOpen, onClose, ticket }: EditTicketModalProps) {
  const [formData, setFormData] = useState({
    subject: ticket.subject,
    priority: ticket.priority,
    status: ticket.status,
    category: ticket.category,
    description: ticket.description,
  });

  const handleSave = () => {
    // TODO: Implement API call to update ticket
    toast.success(`Ticket #${ticket.id} updated successfully!`);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Ticket #${ticket.id}`} size="lg">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* User Info (Read-only) */}
        <div
          style={{
            padding: '16px',
            borderRadius: '12px',
            backgroundColor: '#F9FAFB',
            border: '1px solid #E5E5E5',
          }}
        >
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
            <User size={16} style={{ color: '#6C727F' }} />
            <span style={{ fontSize: '14px', fontWeight: 500, color: '#0d0e0f' }}>{ticket.user}</span>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Mail size={16} style={{ color: '#6C727F' }} />
            <span style={{ fontSize: '14px', color: '#6C727F' }}>{ticket.email}</span>
          </div>
        </div>

        {/* Subject Field */}
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
            Subject
          </label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            style={{
              width: '100%',
              padding: '12px 14px',
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

        {/* Category Field */}
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
            Category
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
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
              <option value="Technical Issue">Technical Issue</option>
              <option value="Billing">Billing</option>
              <option value="Account">Account</option>
              <option value="Feature Request">Feature Request</option>
              <option value="Bug Report">Bug Report</option>
              <option value="General Inquiry">General Inquiry</option>
            </select>
          </div>
        </div>

        {/* Priority and Status Fields */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Priority */}
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
              Priority
            </label>
            <div style={{ position: 'relative' }}>
              <AlertCircle
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
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'Low' | 'Medium' | 'High' | 'Urgent' })}
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
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
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
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Open' | 'In Progress' | 'Resolved' | 'Closed' })}
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
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Description Field */}
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
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={6}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '12px',
              border: '1px solid #E5E5E5',
              fontSize: '14px',
              color: '#0d0e0f',
              outline: 'none',
              transition: 'border-color 0.2s',
              resize: 'vertical',
              fontFamily: 'inherit',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#CD1B78';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#E5E5E5';
            }}
          />
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

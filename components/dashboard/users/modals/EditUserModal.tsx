'use client';

import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { User, Mail, Phone, Shield, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    status: 'Active' | 'Suspended' | 'Pending';
    joinDate: string;
  };
}

export function EditUserModal({ isOpen, onClose, user }: EditUserModalProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
  });

  const handleSave = () => {
    // TODO: Implement API call to update user
    toast.success(`User "${formData.name}" updated successfully!`);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit User" size="md">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* User Avatar */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #CD1B78 0%, #9333ea 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '22px',
              fontWeight: 600,
            }}
          >
            {user.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
          </div>
        </div>

        {/* Name Field */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 500,
              color: '#0d0e0f',
              marginBottom: '6px',
            }}
          >
            Full Name
          </label>
          <div style={{ position: 'relative' }}>
            <User
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
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 10px 10px 40px',
                borderRadius: '10px',
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

        {/* Email Field */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 500,
              color: '#0d0e0f',
              marginBottom: '6px',
            }}
          >
            Email Address
          </label>
          <div style={{ position: 'relative' }}>
            <Mail
              size={18}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6C727F',
              }}
            />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 10px 10px 40px',
                borderRadius: '10px',
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

        {/* Phone Field */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 500,
              color: '#0d0e0f',
              marginBottom: '6px',
            }}
          >
            Phone Number
          </label>
          <div style={{ position: 'relative' }}>
            <Phone
              size={18}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6C727F',
              }}
            />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 10px 10px 40px',
                borderRadius: '10px',
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

        {/* Role and Status Fields - Side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 500,
                color: '#0d0e0f',
                marginBottom: '6px',
              }}
            >
              Role
            </label>
            <div style={{ position: 'relative' }}>
              <Shield
                size={16}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6C727F',
                  zIndex: 1,
                }}
              />
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 10px 10px 36px',
                  borderRadius: '10px',
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
                <option value="Influencer">Influencer</option>
                <option value="Business">Business</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 500,
                color: '#0d0e0f',
                marginBottom: '6px',
              }}
            >
              Status
            </label>
            <div style={{ position: 'relative' }}>
              <Calendar
                size={16}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6C727F',
                  zIndex: 1,
                }}
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Suspended' | 'Pending' })}
                style={{
                  width: '100%',
                  padding: '10px 10px 10px 36px',
                  borderRadius: '10px',
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
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '11px',
              borderRadius: '10px',
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
              padding: '11px',
              borderRadius: '10px',
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

'use client';

import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { User, Mail, Phone, Shield, Calendar, Loader2, Key } from 'lucide-react';
import { toast } from 'sonner';
import { useUpdateUser } from '@/hooks/useUsers';
import ManagePermissionsModal from '../ManagePermissionsModal';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    status: 'ACTIVE' | 'INACTIVE' | 'DEACTIVATED' | 'RESTRICTED' | 'LOCKED' | 'DELETED';
    joinDate: string;
    subscription?: string;
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
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);

  const updateUserMutation = useUpdateUser();

  const handleSave = async () => {
    try {
      // Parse first and last name from full name
      const names = formData.name.trim().split(' ');
      const firstName = names[0] || '';
      const lastName = names.slice(1).join(' ') || '';

      await updateUserMutation.mutateAsync({
        userId: user.id,
        data: {
          firstName,
          lastName,
          email: formData.email,
          phoneNumber: formData.phone,
          userType: formData.role as any,
          userStatus: formData.status,
        },
      });

      toast.success(`User "${formData.name}" updated successfully!`);
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update user');
    }
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
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
                <option value="SUPER_ADMIN">Super Admin</option>
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
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'ACTIVE' | 'INACTIVE' | 'DEACTIVATED' | 'RESTRICTED' | 'LOCKED' | 'DELETED' })}
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
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="DEACTIVATED">Deactivated</option>
                <option value="RESTRICTED">Restricted</option>
                <option value="LOCKED">Locked</option>
                <option value="DELETED">Deleted</option>
              </select>
            </div>
          </div>
        </div>

        {/* Manage Permissions Button */}
        {(formData.role === 'ADMIN' || formData.role === 'SUPER_ADMIN') && (
          <div
            style={{
              padding: '12px',
              borderRadius: '10px',
              border: '1px solid #E5E5E5',
              backgroundColor: '#f9fafb',
              marginTop: '4px',
            }}
          >
            <button
              onClick={() => setShowPermissionsModal(true)}
              style={{
                width: '100%',
                padding: '11px',
                borderRadius: '10px',
                border: '1px solid #9333ea',
                backgroundColor: '#faf5ff',
                color: '#9333ea',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3e8ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#faf5ff';
              }}
            >
              <Key size={16} />
              Manage Permissions
            </button>
          </div>
        )}

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
            disabled={updateUserMutation.isPending}
            style={{
              flex: 1,
              padding: '11px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: updateUserMutation.isPending ? '#999' : '#CD1B78',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 500,
              cursor: updateUserMutation.isPending ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              if (!updateUserMutation.isPending) {
                e.currentTarget.style.backgroundColor = '#a01560';
              }
            }}
            onMouseLeave={(e) => {
              if (!updateUserMutation.isPending) {
                e.currentTarget.style.backgroundColor = '#CD1B78';
              }
            }}
          >
            {updateUserMutation.isPending && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
            {updateUserMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Permissions Modal */}
      <ManagePermissionsModal
        isOpen={showPermissionsModal}
        onClose={() => setShowPermissionsModal(false)}
        userId={user.id}
        userName={user.name}
      />
    </Modal>
  );
}

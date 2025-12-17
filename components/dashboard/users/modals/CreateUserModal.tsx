'use client';

import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { User, Mail, Phone, Key, Shield, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateUser } from '@/hooks/useUsers';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateUserModal({ isOpen, onClose }: CreateUserModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    userType: 'CREATIVE',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const createUserMutation = useCreateUser();

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName || formData.firstName.trim().length < 2) {
      newErrors.firstName = 'Please enter first name';
    }
    if (!formData.lastName || formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Please enter last name';
    }
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phoneNumber || formData.phoneNumber.trim().length < 4) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    if (!formData.password || !passwordRegex.test(formData.password)) {
      newErrors.password = 'Password must be 8+ chars, include a number and a symbol';
    }
    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.userType) {
      newErrors.userType = 'Please select user type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validate()) return;
    try {
      await createUserMutation.mutateAsync({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        userType: formData.userType,
      });
      toast.success(`User "${formData.firstName} ${formData.lastName}" created successfully!`);
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create user');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New User" size="md">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* First Name */}
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
            First Name
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
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              placeholder="John"
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
          {errors.firstName && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.firstName}</p>}
        </div>

        {/* Last Name */}
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
            Last Name
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
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              placeholder="Doe"
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
          {errors.lastName && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.lastName}</p>}
        </div>

        {/* Email */}
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
            Email
          </label>
          <div style={{ position: 'relative' }}>
            <Mail
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
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="hi@example.com"
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
          {errors.email && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.email}</p>}
        </div>

        {/* Phone */}
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
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6C727F',
              }}
            />
            <input
              type="text"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              placeholder="+1 234 567 890"
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
          {errors.phoneNumber && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.phoneNumber}</p>}
        </div>

        {/* Password */}
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
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <Key
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
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter password"
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
          {errors.password && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.password}</p>}
        </div>

        {/* Confirm Password */}
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
            Confirm Password
          </label>
          <div style={{ position: 'relative' }}>
            <Key
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
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="Confirm password"
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
          {errors.confirmPassword && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.confirmPassword}</p>}
        </div>

        {/* User Type */}
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
            User Type
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
              value={formData.userType}
              onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
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
              <option value="CREATIVE">Creative</option>
              <option value="BUSINESS">Business</option>
              <option value="AGENCY">Agency</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          {errors.userType && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.userType}</p>}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: '10px',
              border: '1px solid #E5E5E5',
              backgroundColor: '#fff',
              color: '#0d0e0f',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F2F2F2')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={createUserMutation.isPending}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: createUserMutation.isPending ? '#e5a5c7' : '#CD1B78',
              color: '#fff',
              fontWeight: 700,
              cursor: createUserMutation.isPending ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              if (!createUserMutation.isPending) {
                e.currentTarget.style.backgroundColor = '#A81563';
              }
            }}
            onMouseLeave={(e) => {
              if (!createUserMutation.isPending) {
                e.currentTarget.style.backgroundColor = '#CD1B78';
              }
            }}
          >
            {createUserMutation.isPending && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
            {createUserMutation.isPending ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

'use client';

import { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Mail, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useSendEmail } from '@/hooks/useUsers';

interface SendEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export function SendEmailModal({ isOpen, onClose, user }: SendEmailModalProps) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const sendEmailMutation = useSendEmail();

  const handleSend = async () => {
    if (!subject.trim()) {
      toast.error('Please enter a subject');
      return;
    }
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    try {
      await sendEmailMutation.mutateAsync({
        userId: user.id,
        subject: subject.trim(),
        message: message.trim(),
      });
      toast.success(`Email sent to ${user.email} successfully`);
      setSubject('');
      setMessage('');
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send email');
    }
  };

  const handleClose = () => {
    setSubject('');
    setMessage('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Send Email" size="md">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* User Info */}
        <div
          style={{
            background: '#F9FAFB',
            padding: '12px 16px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <Mail size={20} style={{ color: '#CD1B78' }} />
          <div>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0e0f' }}>{user.name}</p>
            <p style={{ fontSize: '13px', color: '#6C727F' }}>{user.email}</p>
          </div>
        </div>

        {/* Subject Field */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 500,
              color: '#0d0e0f',
              marginBottom: '8px',
            }}
          >
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter email subject..."
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
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

        {/* Message Field */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 500,
              color: '#0d0e0f',
              marginBottom: '8px',
            }}
          >
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message..."
            rows={8}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
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
        <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
          <button
            onClick={handleClose}
            disabled={sendEmailMutation.isPending}
            style={{
              flex: 1,
              padding: '11px',
              borderRadius: '10px',
              border: '1px solid #E5E5E5',
              backgroundColor: '#fff',
              color: '#0d0e0f',
              fontSize: '14px',
              fontWeight: 500,
              cursor: sendEmailMutation.isPending ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!sendEmailMutation.isPending) {
                e.currentTarget.style.backgroundColor = '#F2F2F2';
              }
            }}
            onMouseLeave={(e) => {
              if (!sendEmailMutation.isPending) {
                e.currentTarget.style.backgroundColor = '#fff';
              }
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={sendEmailMutation.isPending}
            style={{
              flex: 1,
              padding: '11px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: sendEmailMutation.isPending ? '#999' : '#CD1B78',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 500,
              cursor: sendEmailMutation.isPending ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              if (!sendEmailMutation.isPending) {
                e.currentTarget.style.backgroundColor = '#a01560';
              }
            }}
            onMouseLeave={(e) => {
              if (!sendEmailMutation.isPending) {
                e.currentTarget.style.backgroundColor = '#CD1B78';
              }
            }}
          >
            {sendEmailMutation.isPending && (
              <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
            )}
            {sendEmailMutation.isPending ? 'Sending...' : 'Send Email'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

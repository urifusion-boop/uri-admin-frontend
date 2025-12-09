'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Loader2, HelpCircle, BookOpen, FileText, MessageSquare, Search, ChevronRight } from 'lucide-react';

export default function HelpPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const articles = [
    { title: 'Getting Started Guide', category: 'Basics', icon: <BookOpen size={20} /> },
    { title: 'User Management', category: 'Users', icon: <FileText size={20} /> },
    { title: 'Financial Reports', category: 'Finance', icon: <FileText size={20} /> },
    { title: 'Lead Analytics', category: 'Leads', icon: <FileText size={20} /> },
    { title: 'System Monitoring', category: 'System', icon: <FileText size={20} /> },
    { title: 'Support Tickets', category: 'Support', icon: <FileText size={20} /> },
  ];

  const faqs = [
    { q: 'How do I reset a user password?', a: 'Navigate to Users page, find the user, click actions menu, and select "Reset Password".' },
    { q: 'What does Trial Conversion Rate mean?', a: 'It shows the percentage of users who converted from trial to paid subscription.' },
    { q: 'How often is data updated?', a: 'Most dashboard data updates in real-time. Some metrics refresh every 5 minutes.' },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Help & Documentation</h1>
        <p className="text-muted-foreground mt-2">
          Find guides, tutorials, and answers to common questions
        </p>
      </div>

      {/* Search */}
      <div
        style={{
          background: '#fff',
          borderRadius: '20px',
          boxShadow: '1px 1px 6px 3px rgba(0, 0, 0, 0.07)',
          border: '1px solid #F0F0F0',
          padding: '24px',
          marginBottom: '24px',
        }}
      >
        <div style={{ position: 'relative' }}>
          <Search
            size={20}
            style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}
          />
          <input
            type="text"
            placeholder="Search documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 16px 14px 48px',
              borderRadius: '12px',
              border: '1px solid #E5E7EB',
              fontSize: '15px',
              color: '#0d0e0f',
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Documentation Articles */}
        <div className="xl:col-span-2">
          <div
            style={{
              background: '#fff',
              borderRadius: '20px',
              boxShadow: '1px 1px 6px 3px rgba(0, 0, 0, 0.07)',
              border: '1px solid #F0F0F0',
              padding: '24px',
              marginBottom: '24px',
            }}
          >
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0d0e0f', marginBottom: '20px' }}>
              Documentation
            </h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              {articles.map((article, index) => (
                <div
                  key={index}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    backgroundColor: '#F9FAFB',
                    border: '1px solid #E5E7EB',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F2F2F2';
                    e.currentTarget.style.borderColor = '#CD1B78';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#F9FAFB';
                    e.currentTarget.style.borderColor = '#E5E7EB';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(205, 27, 120, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#CD1B78',
                      }}
                    >
                      {article.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0d0e0f', marginBottom: '2px' }}>
                        {article.title}
                      </h3>
                      <p style={{ fontSize: '13px', color: '#6C727F', margin: 0 }}>{article.category}</p>
                    </div>
                    <ChevronRight size={20} style={{ color: '#6C727F' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div
            style={{
              background: '#fff',
              borderRadius: '20px',
              boxShadow: '1px 1px 6px 3px rgba(0, 0, 0, 0.07)',
              border: '1px solid #F0F0F0',
              padding: '24px',
            }}
          >
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0d0e0f', marginBottom: '20px' }}>
              Frequently Asked Questions
            </h2>
            <div style={{ display: 'grid', gap: '16px' }}>
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid #E5E7EB',
                  }}
                >
                  <p style={{ fontSize: '15px', fontWeight: 600, color: '#0d0e0f', marginBottom: '8px' }}>
                    {faq.q}
                  </p>
                  <p style={{ fontSize: '14px', color: '#6C727F', margin: 0 }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Links Sidebar */}
        <div>
          <div
            style={{
              background: '#fff',
              borderRadius: '20px',
              boxShadow: '1px 1px 6px 3px rgba(0, 0, 0, 0.07)',
              border: '1px solid #F0F0F0',
              padding: '24px',
              marginBottom: '24px',
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0d0e0f', marginBottom: '16px' }}>
              Quick Links
            </h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              {[
                { label: 'API Documentation', icon: <BookOpen size={18} /> },
                { label: 'Release Notes', icon: <FileText size={18} /> },
                { label: 'Contact Support', icon: <MessageSquare size={18} /> },
              ].map((link) => (
                <button
                  key={link.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    backgroundColor: '#fff',
                    color: '#0d0e0f',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ color: '#CD1B78' }}>{link.icon}</div>
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Support Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, #CD1B78 0%, #9C1461 100%)',
              borderRadius: '20px',
              padding: '24px',
              color: '#fff',
            }}
          >
            <MessageSquare size={24} style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Need Help?</h3>
            <p style={{ fontSize: '14px', opacity: 0.95, marginBottom: '16px' }}>
              Our support team is here 24/7
            </p>
            <button
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#fff',
                color: '#CD1B78',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

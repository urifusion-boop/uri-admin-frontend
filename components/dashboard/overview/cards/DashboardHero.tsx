'use client';

import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Shield, Sparkles } from 'lucide-react';

export function DashboardHero() {
  const { user } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        background: 'linear-gradient(135deg, #CD1B78 0%, #8B1354 100%)',
        borderRadius: '20px',
        padding: '28px 32px',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '32px',
      }}
    >
      {/* Background Pattern */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Shield style={{ width: '20px', height: '20px', color: 'white' }} />
            <h1 style={{
              fontSize: '24px',
              fontWeight: 700,
              color: 'white',
            }}>
              Hello, {user?.firstName || 'Admin'} 👋
            </h1>
          </div>

          <p style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.92)',
            maxWidth: '600px',
            lineHeight: '1.5',
            marginBottom: '0',
          }}>
            Welcome to the URI Admin Portal. Monitor platform performance, manage users,
            track revenue, and oversee all system operations from your centralized dashboard.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            borderRadius: '10px',
            padding: '8px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <Sparkles style={{ width: '14px', height: '14px', color: 'white' }} />
            <span style={{ color: 'white', fontSize: '13px', fontWeight: 600 }}>
              Super Admin
            </span>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            borderRadius: '10px',
            padding: '8px 14px',
          }}>
            <span style={{ color: 'white', fontSize: '13px', fontWeight: 600 }}>
              {new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Decorative circles */}
      <div
        style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-30px',
          right: '100px',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.03)',
          pointerEvents: 'none',
        }}
      />
    </motion.div>
  );
}

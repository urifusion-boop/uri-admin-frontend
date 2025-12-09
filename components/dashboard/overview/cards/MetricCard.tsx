'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  index?: number;
}

export function MetricCard({
  title,
  value,
  change,
  changeLabel = 'vs last month',
  icon: Icon,
  iconColor = '#CD1B78',
  iconBgColor = 'rgba(205, 27, 120, 0.1)',
  index = 0,
}: MetricCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        boxShadow: '1px 1px 6px 3px rgba(0, 0, 0, 0.07)',
        border: '1px solid #F0F0F0',
        padding: '24px',
        cursor: 'pointer',
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        {/* Left: Title and Value */}
        <div style={{ flex: 1 }}>
          <p style={{
            fontSize: '14px',
            fontWeight: 500,
            color: '#6C727F',
            marginBottom: '8px'
          }}>
            {title}
          </p>
          <h3 style={{
            fontSize: '32px',
            fontWeight: 700,
            color: '#0d0e0f',
            marginBottom: '12px'
          }}>
            {value}
          </h3>

          {/* Trend Indicator */}
          {change !== undefined && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: isPositive ? '#10b981' : '#ef4444',
                }}
              >
                <svg
                  style={{
                    width: '14px',
                    height: '14px',
                    transform: isPositive ? '' : 'rotate(180deg)',
                  }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
                <span>{Math.abs(change)}%</span>
              </div>
              <span style={{ fontSize: '12px', color: '#6C727F' }}>
                {changeLabel}
              </span>
            </div>
          )}
        </div>

        {/* Right: Icon */}
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            backgroundColor: iconBgColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon style={{ width: '28px', height: '28px', color: iconColor }} />
        </div>
      </div>
    </motion.div>
  );
}

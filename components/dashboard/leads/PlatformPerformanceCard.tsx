'use client';

import { Twitter, Facebook, Instagram, Linkedin, TrendingUp, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePlatformPerformance } from '@/hooks/useLeads';

const platformIcons: Record<string, { icon: React.ReactNode; color: string }> = {
  TWITTER: { icon: <Twitter size={24} />, color: '#1DA1F2' },
  X: { icon: <Twitter size={24} />, color: '#000000' },
  FACEBOOK: { icon: <Facebook size={24} />, color: '#1877F2' },
  INSTAGRAM: { icon: <Instagram size={24} />, color: '#E4405F' },
  LINKEDIN: { icon: <Linkedin size={24} />, color: '#0A66C2' },
  TIKTOK: { icon: <TrendingUp size={24} />, color: '#000000' },
};

export function PlatformPerformanceCard() {
  const { data: platforms, isLoading } = usePlatformPerformance('LAST_1_MONTH');

  const platformData = (platforms || []).map((p: any) => ({
    name: p.platform,
    totalLeads: p.total_leads,
    avgIntentScore: p.avg_intent_score || 0,
    avgRelevanceScore: p.avg_relevance_score || 0,
    conversionRate: p.conversion_rate || 0,
  }));

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '20px',
        boxShadow: '1px 1px 6px 3px rgba(0, 0, 0, 0.07)',
        border: '1px solid #F0F0F0',
        padding: '24px',
      }}
    >
      <div style={{ marginBottom: '24px', flexShrink: 0 }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0d0e0f', marginBottom: '4px' }}>
          Platform Performance
        </h3>
        <p style={{ fontSize: '14px', color: '#6C727F' }}>Lead quality and conversion by platform</p>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : platformData.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6C727F' }}>
          <p>No platform data available</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {platformData.map((platform, index) => {
            const platformKey = platform.name?.toUpperCase() || 'TWITTER';
            const platformConfig = platformIcons[platformKey] || platformIcons['TWITTER'];

            return (
              <motion.div
                key={platform.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                  background: '#F9FAFB',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        backgroundColor: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: platformConfig.color,
                      }}
                    >
                      {platformConfig.icon}
                    </div>
                    <div>
                      <p style={{ fontSize: '16px', fontWeight: 600, color: '#0d0e0f', marginBottom: '2px' }}>
                        {platform.name}
                      </p>
                      <p style={{ fontSize: '13px', color: '#6C727F' }}>
                        {platform.totalLeads.toLocaleString()} leads
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '12px', color: '#6C727F', marginBottom: '2px' }}>Conversion</p>
                    <p style={{ fontSize: '18px', fontWeight: 700, color: '#CD1B78' }}>
                      {platform.conversionRate.toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '12px', color: '#6C727F' }}>Intent Score</span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#0d0e0f' }}>
                        {(platform.avgIntentScore * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '6px',
                        backgroundColor: '#E5E7EB',
                        borderRadius: '3px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${platform.avgIntentScore * 100}%`,
                          height: '100%',
                          backgroundColor: '#10b981',
                          borderRadius: '3px',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '12px', color: '#6C727F' }}>Relevance</span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#0d0e0f' }}>
                        {(platform.avgRelevanceScore * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '6px',
                        backgroundColor: '#E5E7EB',
                        borderRadius: '3px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${platform.avgRelevanceScore * 100}%`,
                          height: '100%',
                          backgroundColor: '#f59e0b',
                          borderRadius: '3px',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

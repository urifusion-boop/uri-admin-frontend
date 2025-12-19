'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Loader2 } from 'lucide-react';
import { useLeadTypeDistribution } from '@/hooks/useLeads';

const LEAD_TYPE_COLORS: Record<string, string> = {
  CONVERSATIONAL: '#8b5cf6',
  PERSON: '#3b82f6',
  ORGANIZATION: '#10b981',
  BUSINESS: '#10b981',
};

const LEAD_TYPE_LABELS: Record<string, string> = {
  CONVERSATIONAL: 'Signal',
  PERSON: 'Individual',
  ORGANIZATION: 'Org',
  BUSINESS: 'Business',
};

export function LeadTypeChart() {
  const { data: leadTypes, isLoading } = useLeadTypeDistribution('LAST_1_MONTH');

  const chartData = (leadTypes || []).map((type) => ({
    name: LEAD_TYPE_LABELS[type.lead_type] || type.lead_type,
    value: type.total_leads,
    fullType: type.lead_type,
    conversionRate: type.conversion_rate,
    qualificationRate: type.qualification_rate,
    avgIntent: type.avg_intent_score,
    avgRelevance: type.avg_relevance_score,
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
      <div style={{ marginBottom: '20px', flexShrink: 0 }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0d0e0f', marginBottom: '4px' }}>
          Lead Type Distribution
        </h3>
        <p style={{ fontSize: '14px', color: '#6C727F' }}>Performance metrics by lead type</p>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : chartData.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6C727F' }}>
          <p>No lead type data available</p>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6C727F' }} />
              <YAxis tick={{ fontSize: 12, fill: '#6C727F' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                  padding: '12px',
                }}
                formatter={(value: number) => value.toLocaleString()}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={LEAD_TYPE_COLORS[entry.fullType] || '#3b82f6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
            {(leadTypes || []).map((type) => {
              const color = LEAD_TYPE_COLORS[type.lead_type] || '#3b82f6';
              const label = LEAD_TYPE_LABELS[type.lead_type] || type.lead_type;

              return (
                <div
                  key={type.lead_type}
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    border: '1px solid #E5E7EB',
                    background: '#F9FAFB',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: color }} />
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#0d0e0f' }}>{label}</span>
                    </div>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: '#0d0e0f' }}>
                      {type.total_leads.toLocaleString()}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '12px' }}>
                    <div>
                      <span style={{ color: '#6C727F' }}>Conversion: </span>
                      <span style={{ fontWeight: 600, color: '#CD1B78' }}>{type.conversion_rate.toFixed(1)}%</span>
                    </div>
                    <div>
                      <span style={{ color: '#6C727F' }}>Qualified: </span>
                      <span style={{ fontWeight: 600, color: '#10b981' }}>{type.qualification_rate.toFixed(1)}%</span>
                    </div>
                    <div>
                      <span style={{ color: '#6C727F' }}>Intent: </span>
                      <span style={{ fontWeight: 600, color: '#0d0e0f' }}>{(type.avg_intent_score * 100).toFixed(0)}%</span>
                    </div>
                    <div>
                      <span style={{ color: '#6C727F' }}>Relevance: </span>
                      <span style={{ fontWeight: 600, color: '#0d0e0f' }}>{(type.avg_relevance_score * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

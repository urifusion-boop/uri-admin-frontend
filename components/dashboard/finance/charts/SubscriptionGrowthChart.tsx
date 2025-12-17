'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTrialConversionFunnel } from '@/hooks/useFinance';
import { Loader2 } from 'lucide-react';

export function SubscriptionGrowthChart() {
  const { data: funnelData, isLoading } = useTrialConversionFunnel();

  // Transform funnel stages to growth chart format
  const subscriptionData = funnelData?.stages.map(stage => ({
    stage: stage.stage,
    count: stage.count,
    percentage: stage.percentage,
  })) || [];
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
      <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0d0e0f', marginBottom: '4px' }}>
        Trial Conversion Funnel
      </h3>
      <p style={{ fontSize: '14px', color: '#6C727F', marginBottom: '24px' }}>
        Trial to subscription conversion stages
      </p>

      {isLoading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
          <Loader2 className="h-8 w-8 animate-spin text-primary" style={{ color: '#CD1B78' }} />
        </div>
      ) : subscriptionData.length === 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
          <p style={{ fontSize: '14px', color: '#6C727F' }}>No trial conversion data available</p>
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <div style={{ padding: '12px', background: '#F9FAFB', borderRadius: '12px' }}>
              <p style={{ fontSize: '12px', color: '#6C727F', margin: 0 }}>Total Trials</p>
              <p style={{ fontSize: '20px', fontWeight: 700, color: '#0d0e0f', margin: 0, marginTop: '4px' }}>
                {funnelData?.totalTrialsStarted || 0}
              </p>
            </div>
            <div style={{ padding: '12px', background: '#F9FAFB', borderRadius: '12px' }}>
              <p style={{ fontSize: '12px', color: '#6C727F', margin: 0 }}>Active Trials</p>
              <p style={{ fontSize: '20px', fontWeight: 700, color: '#3b82f6', margin: 0, marginTop: '4px' }}>
                {funnelData?.activeTrials || 0}
              </p>
            </div>
            <div style={{ padding: '12px', background: '#F9FAFB', borderRadius: '12px' }}>
              <p style={{ fontSize: '12px', color: '#6C727F', margin: 0 }}>Converted</p>
              <p style={{ fontSize: '20px', fontWeight: 700, color: '#10b981', margin: 0, marginTop: '4px' }}>
                {funnelData?.convertedToSubscription || 0}
              </p>
            </div>
            <div style={{ padding: '12px', background: '#F9FAFB', borderRadius: '12px' }}>
              <p style={{ fontSize: '12px', color: '#6C727F', margin: 0 }}>Conversion Rate</p>
              <p style={{ fontSize: '20px', fontWeight: 700, color: '#CD1B78', margin: 0, marginTop: '4px' }}>
                {funnelData?.conversionRate.toFixed(1) || 0}%
              </p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={subscriptionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} vertical={false} />
              <XAxis dataKey="stage" stroke="#9CA3AF" fontSize={13} tickLine={false} axisLine={{ stroke: '#E5E7EB' }} />
              <YAxis stroke="#9CA3AF" fontSize={13} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                  padding: '12px',
                }}
                formatter={(value: number, name: string) => [
                  name === 'percentage' ? `${value.toFixed(1)}%` : value,
                  name === 'count' ? 'Users' : 'Conversion %'
                ]}
              />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
                formatter={(value) => <span style={{ color: '#6C727F', fontSize: '13px', fontWeight: 500 }}>{value === 'count' ? 'Users' : 'Conversion %'}</span>}
              />
              <Line
                type="monotone"
                dataKey="count"
                name="count"
                stroke="#CD1B78"
                strokeWidth={3}
                dot={{ fill: '#CD1B78', r: 5 }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="percentage"
                name="percentage"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}

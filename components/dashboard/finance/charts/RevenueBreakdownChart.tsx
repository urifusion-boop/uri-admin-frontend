'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { PieLabelRenderProps } from 'recharts';
import { useTopRevenuePlans } from '@/hooks/useFinance';
import { Loader2 } from 'lucide-react';

const RADIAN = Math.PI / 180;
const COLORS = ['#CD1B78', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
const renderCustomizedLabel = (props: PieLabelRenderProps) => {
  const {
    cx = 0,
    cy = 0,
    midAngle = 0,
    innerRadius = 0,
    outerRadius = 0,
    percent = 0,
  } = props;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      style={{ fontSize: '14px', fontWeight: 700 }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export function RevenueBreakdownChart() {
  const { data: topPlans, isLoading } = useTopRevenuePlans(5);

  // Transform API data to chart format
  const data = topPlans?.map((plan, index) => ({
    name: plan.planName,
    value: plan.totalRevenue,
    color: COLORS[index % COLORS.length],
  })) || [];

  const total = data.reduce((sum, item) => sum + item.value, 0);

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
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0d0e0f', marginBottom: '4px' }}>
          Revenue by Plan
        </h3>
        <p style={{ fontSize: '14px', color: '#6C727F' }}>
          Revenue distribution across top subscription plans
        </p>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
          <Loader2 className="h-8 w-8 animate-spin text-primary" style={{ color: '#CD1B78' }} />
        </div>
      ) : data.length === 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
          <p style={{ fontSize: '14px', color: '#6C727F' }}>No revenue data available</p>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={110}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={2}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                  padding: '12px',
                }}
                formatter={(value: number) => `₦${value.toLocaleString()}`}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Summary */}
          <div
            style={{
              marginTop: '24px',
              paddingTop: '24px',
              borderTop: '1px solid #E5E5E5',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px',
            }}
          >
            {data.map((item) => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: item.color,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '12px', color: '#6C727F', margin: 0 }}>{item.name}</p>
                  <p style={{ fontSize: '16px', fontWeight: 700, color: '#0d0e0f', margin: 0, marginTop: '2px' }}>
                    ₦{item.value.toLocaleString()}
                  </p>
                  <p style={{ fontSize: '11px', color: '#9EA3AE', margin: 0, marginTop: '2px' }}>
                    {((item.value / total) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

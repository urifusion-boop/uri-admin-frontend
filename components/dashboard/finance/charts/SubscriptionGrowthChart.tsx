'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const subscriptionData = [
  { month: 'Jan', active: 2800, new: 240, churned: 45 },
  { month: 'Feb', active: 2995, new: 250, churned: 55 },
  { month: 'Mar', active: 3190, new: 280, churned: 85 },
  { month: 'Apr', active: 3385, new: 295, churned: 100 },
  { month: 'May', active: 3580, new: 310, churned: 115 },
  { month: 'Jun', active: 3842, new: 342, churned: 80 },
];

export function SubscriptionGrowthChart() {
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
        Subscription Growth
      </h3>
      <p style={{ fontSize: '14px', color: '#6C727F', marginBottom: '24px' }}>
        Active, new, and churned subscriptions over time
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={subscriptionData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} vertical={false} />
          <XAxis dataKey="month" stroke="#9CA3AF" fontSize={13} tickLine={false} axisLine={{ stroke: '#E5E7EB' }} />
          <YAxis stroke="#9CA3AF" fontSize={13} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
              padding: '12px',
            }}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
            formatter={(value) => <span style={{ color: '#6C727F', fontSize: '13px', fontWeight: 500 }}>{value}</span>}
          />
          <Line
            type="monotone"
            dataKey="active"
            name="Active Subscriptions"
            stroke="#CD1B78"
            strokeWidth={3}
            dot={{ fill: '#CD1B78', r: 5 }}
            activeDot={{ r: 7 }}
          />
          <Line
            type="monotone"
            dataKey="new"
            name="New Subscriptions"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ fill: '#10b981', r: 5 }}
            activeDot={{ r: 7 }}
          />
          <Line
            type="monotone"
            dataKey="churned"
            name="Churned"
            stroke="#ef4444"
            strokeWidth={3}
            dot={{ fill: '#ef4444', r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

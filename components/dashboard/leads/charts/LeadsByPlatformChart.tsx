'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const leadsByPlatform = [
  { platform: 'Twitter', count: 156, color: '#1DA1F2' },
  { platform: 'Facebook', count: 98, color: '#1877F2' },
  { platform: 'Instagram', count: 45, color: '#E4405F' },
  { platform: 'LinkedIn', count: 27, color: '#0A66C2' },
];

export function LeadsByPlatformChart() {
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
      <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0d0e0f', marginBottom: '4px' }}>Leads by Platform</h3>
      <p style={{ fontSize: '14px', color: '#6C727F', marginBottom: '24px' }}>Distribution across social platforms</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={leadsByPlatform} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} />
          <XAxis type="number" stroke="#9CA3AF" fontSize={13} tickLine={false} axisLine={false} />
          <YAxis type="category" dataKey="platform" stroke="#9CA3AF" fontSize={13} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
              padding: '12px',
            }}
          />
          <Bar dataKey="count" radius={[0, 8, 8, 0]}>
            {leadsByPlatform.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const userGrowthData = [
  { month: 'Jan', total: 8420, active: 7856, new: 342 },
  { month: 'Feb', total: 9156, active: 8502, new: 736 },
  { month: 'Mar', total: 9892, active: 9148, new: 736 },
  { month: 'Apr', total: 10628, active: 9794, new: 736 },
  { month: 'May', total: 11364, active: 10440, new: 736 },
  { month: 'Jun', total: 12543, active: 11892, new: 1179 },
];

export function UserGrowthChart() {
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
        User Growth Trend
      </h3>
      <p style={{ fontSize: '14px', color: '#6C727F', marginBottom: '24px' }}>
        Total and active user growth over the last 6 months
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={userGrowthData}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#CD1B78" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#CD1B78" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
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
          <Area
            type="monotone"
            dataKey="total"
            name="Total Users"
            stroke="#CD1B78"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorTotal)"
          />
          <Area
            type="monotone"
            dataKey="active"
            name="Active Users"
            stroke="#3b82f6"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorActive)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

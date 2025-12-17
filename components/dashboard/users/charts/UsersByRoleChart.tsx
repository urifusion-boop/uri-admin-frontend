'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LegendPayload } from 'recharts';

type UsersByType = {
  creative: number;
  business: number;
  agency: number;
  admin: number;
};

export function UsersByRoleChart({ usersByType }: { usersByType?: UsersByType }) {
  const data = [
    { name: 'Creative', value: usersByType?.creative || 0, color: '#8b5cf6' },
    { name: 'Business', value: usersByType?.business || 0, color: '#3b82f6' },
    { name: 'Agency', value: usersByType?.agency || 0, color: '#CD1B78' },
    { name: 'Admin', value: usersByType?.admin || 0, color: '#10b981' },
  ];

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
        Users by Role
      </h3>
      <p style={{ fontSize: '14px', color: '#6C727F', marginBottom: '24px' }}>
        Distribution of user types across the platform
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
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
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value: string, entry: LegendPayload) => {
              const count = typeof entry?.value === 'number'
                ? entry.value
                : typeof (entry?.payload as { value?: number })?.value === 'number'
                ? (entry.payload as { value: number }).value
                : 0;
              return (
                <span style={{ color: '#6C727F', fontSize: '13px', fontWeight: 500 }}>
                  {value} ({count.toLocaleString()})
                </span>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

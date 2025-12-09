'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const leadStatusData = [
  { name: 'New', value: 125, color: '#3b82f6' },
  { name: 'Contacted', value: 89, color: '#10b981' },
  { name: 'Qualified', value: 67, color: '#f59e0b' },
  { name: 'Converted', value: 45, color: '#CD1B78' },
];

export function LeadStatusChart() {
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
        Lead Status Distribution
      </h3>
      <p style={{ fontSize: '14px', color: '#6C727F', marginBottom: '24px' }}>Current status of all leads</p>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={leadStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" paddingAngle={2}>
            {leadStatusData.map((entry, index) => (
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
        </PieChart>
      </ResponsiveContainer>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginTop: '24px' }}>
        {leadStatusData.map((status) => (
          <div key={status.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: status.color }} />
            <div>
              <p style={{ fontSize: '12px', color: '#6C727F', margin: 0 }}>{status.name}</p>
              <p style={{ fontSize: '16px', fontWeight: 700, color: '#0d0e0f', margin: 0 }}>{status.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

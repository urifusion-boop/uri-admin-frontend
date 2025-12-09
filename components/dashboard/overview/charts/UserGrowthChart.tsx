'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const data = [
  { month: 'Jan', creatives: 420, businesses: 180, agencies: 45 },
  { month: 'Feb', creatives: 485, businesses: 210, agencies: 52 },
  { month: 'Mar', creatives: 530, businesses: 245, agencies: 58 },
  { month: 'Apr', creatives: 612, businesses: 280, agencies: 67 },
  { month: 'May', creatives: 680, businesses: 315, agencies: 75 },
  { month: 'Jun', creatives: 745, businesses: 350, agencies: 82 },
  { month: 'Jul', creatives: 820, businesses: 390, agencies: 91 },
  { month: 'Aug', creatives: 895, businesses: 425, agencies: 98 },
  { month: 'Sep', creatives: 970, businesses: 465, agencies: 108 },
  { month: 'Oct', creatives: 1050, businesses: 505, agencies: 118 },
  { month: 'Nov', creatives: 1125, businesses: 540, agencies: 125 },
  { month: 'Dec', creatives: 1215, businesses: 585, agencies: 135 },
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
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0d0e0f', marginBottom: '4px' }}>
          User Growth by Type
        </h3>
        <p style={{ fontSize: '14px', color: '#6C727F' }}>
          Monthly user acquisition trends across all user types
        </p>
      </div>

      <ResponsiveContainer width="100%" height={380}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} vertical={false} />
          <XAxis
            dataKey="month"
            stroke="#9CA3AF"
            fontSize={13}
            tickLine={false}
            axisLine={{ stroke: '#E5E7EB' }}
            dy={10}
          />
          <YAxis
            stroke="#9CA3AF"
            fontSize={13}
            tickLine={false}
            axisLine={false}
            dx={-10}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
              padding: '12px',
            }}
            labelStyle={{
              fontWeight: 600,
              color: '#0d0e0f',
              marginBottom: '8px',
            }}
            itemStyle={{
              fontSize: '14px',
              fontWeight: 500,
            }}
            cursor={{ stroke: '#CD1B78', strokeWidth: 1, strokeDasharray: '5 5' }}
          />
          <Legend
            verticalAlign="top"
            height={50}
            iconType="circle"
            iconSize={10}
            formatter={(value) => (
              <span style={{ color: '#6C727F', fontSize: '14px', fontWeight: 500, textTransform: 'capitalize' }}>
                {value}
              </span>
            )}
          />
          <Line
            type="monotone"
            dataKey="creatives"
            stroke="#CD1B78"
            strokeWidth={3}
            dot={{ fill: '#CD1B78', strokeWidth: 2, r: 5, stroke: '#fff' }}
            activeDot={{ r: 7, fill: '#CD1B78', stroke: '#fff', strokeWidth: 2 }}
            name="Creatives"
          />
          <Line
            type="monotone"
            dataKey="businesses"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5, stroke: '#fff' }}
            activeDot={{ r: 7, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
            name="Businesses"
          />
          <Line
            type="monotone"
            dataKey="agencies"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 5, stroke: '#fff' }}
            activeDot={{ r: 7, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
            name="Agencies"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

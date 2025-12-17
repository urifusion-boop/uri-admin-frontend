'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChartDataDto } from '@/lib/api/dashboard-service';
import { Loader2 } from 'lucide-react';

interface UserGrowthChartProps {
  data?: ChartDataDto;
  isLoading?: boolean;
}

export function UserGrowthChart({ data, isLoading }: UserGrowthChartProps) {
  // Transform API data to chart format
  const chartData = data?.data.map((point) => ({
    date: new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    users: point.value,
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
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0d0e0f', marginBottom: '4px' }}>
          User Growth (Cumulative)
        </h3>
        <p style={{ fontSize: '14px', color: '#6C727F' }}>
          Total user registration growth over the last 30 days
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-[380px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={380}>
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} vertical={false} />
            <XAxis
              dataKey="date"
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
            <Line
              type="monotone"
              dataKey="users"
              stroke="#CD1B78"
              strokeWidth={3}
              dot={{ fill: '#CD1B78', strokeWidth: 2, r: 4, stroke: '#fff' }}
              activeDot={{ r: 6, fill: '#CD1B78', stroke: '#fff', strokeWidth: 2 }}
              name="Total Users"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

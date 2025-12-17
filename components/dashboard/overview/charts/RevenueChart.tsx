'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useRevenueTrend } from '@/hooks/useFinance';
import { Loader2 } from 'lucide-react';

export function RevenueChart() {
  const { data: revenueTrendData, isLoading } = useRevenueTrend(30);

  // Transform API data to chart format
  const data = revenueTrendData?.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    revenue: item.dailyRevenue,
    mrr: item.mrr,
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
          Revenue Overview
        </h3>
        <p style={{ fontSize: '14px', color: '#6C727F' }}>
          Daily revenue and MRR trends over the last 30 days
        </p>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '380px' }}>
          <Loader2 className="h-8 w-8 animate-spin text-primary" style={{ color: '#CD1B78' }} />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={380}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#CD1B78" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#CD1B78" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#9CA3AF"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: '#E5E7EB' }}
            dy={10}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke="#9CA3AF"
            fontSize={13}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `₦${value / 1000}k`}
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
            formatter={(value: number, name: string) => [
              `₦${value.toLocaleString()}`,
              name === 'revenue' ? 'Daily Revenue' : 'MRR',
            ]}
            cursor={{ stroke: '#CD1B78', strokeWidth: 1, strokeDasharray: '5 5' }}
          />
          <Legend
            verticalAlign="top"
            height={50}
            iconType="circle"
            iconSize={10}
            formatter={(value) => (
              <span style={{ color: '#6C727F', fontSize: '14px', fontWeight: 500 }}>
                {value === 'revenue' ? 'Daily Revenue' : 'MRR'}
              </span>
            )}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#CD1B78"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorRevenue)"
            dot={false}
            activeDot={{
              r: 6,
              fill: '#CD1B78',
              stroke: '#fff',
              strokeWidth: 2,
            }}
          />
          <Area
            type="monotone"
            dataKey="mrr"
            stroke="#3b82f6"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorMrr)"
            dot={false}
            activeDot={{
              r: 6,
              fill: '#3b82f6',
              stroke: '#fff',
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
      )}
    </div>
  );
}

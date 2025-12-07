import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { WaterLog, DailyStat } from '../types';

interface StatsChartProps {
  logs: WaterLog[];
}

export const StatsChart: React.FC<StatsChartProps> = ({ logs }) => {
  const data: DailyStat[] = useMemo(() => {
    // Group logs by date
    const grouped = logs.reduce((acc, log) => {
      const date = log.dateStr;
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += log.amount;
      return acc;
    }, {} as Record<string, number>);

    // Convert to array and sort by date (last 7 days)
    const sortedDates = Object.keys(grouped).sort();
    const last7Days = sortedDates.slice(-7);

    return last7Days.map(date => ({
      date: date.split('-').slice(1).join('/'), // Format MM/DD
      totalAmount: grouped[date]
    }));
  }, [logs]);

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 bg-white rounded-xl border border-slate-100">
        Chưa có dữ liệu biểu đồ
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-100 h-full">
      <h3 className="text-xl font-bold text-slate-800 mb-6">Thống kê 7 ngày qua</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="totalAmount" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.totalAmount >= 2000 ? '#10b981' : '#3b82f6'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex gap-4 text-xs text-slate-500 justify-center">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Đạt mục tiêu ({'>'}2L)
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-blue-500"></span> Chưa đạt
        </div>
      </div>
    </div>
  );
};
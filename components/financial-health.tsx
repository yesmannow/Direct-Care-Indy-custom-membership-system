'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/pricing';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface FinancialHealthProps {
  mrrData: Array<{ month: string; mrr: number }>;
  currentMRR: number;
}

export function FinancialHealth({ mrrData, currentMRR }: FinancialHealthProps) {
  // Calculate growth metrics
  const previousMRR = mrrData.length > 1 ? mrrData[mrrData.length - 2].mrr : currentMRR;
  const growth = currentMRR - previousMRR;
  const growthPercent = previousMRR > 0 ? ((growth / previousMRR) * 100).toFixed(1) : '0.0';

  return (
    <Card className="border-2 border-[#8A9A8A] bg-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl text-[#2C3E50]">Financial Health</CardTitle>
            <CardDescription>
              Monthly Recurring Revenue (MRR) trends as Pike Medical transitions from volume to value
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Current MRR</p>
            <p className="text-3xl font-bold text-[#8A9A8A]">{formatCurrency(currentMRR)}</p>
            <p className={`text-sm font-medium ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {growth >= 0 ? '+' : ''}{formatCurrency(growth)} ({growthPercent}%)
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mrrData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="month"
              stroke="#666"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              stroke="#666"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip
              formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : '$0'}
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="mrr"
              stroke="#8A9A8A"
              strokeWidth={3}
              name="Monthly Recurring Revenue"
              dot={{ fill: '#8A9A8A', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="p-4 bg-[#F0F0F0] rounded-lg border border-[#2C3E50]">
            <p className="text-sm text-gray-600 mb-1">12-Month Average</p>
            <p className="text-2xl font-bold text-[#2C3E50]">
              {formatCurrency(mrrData.reduce((sum, d) => sum + d.mrr, 0) / mrrData.length)}
            </p>
          </div>
          <div className="p-4 bg-[#F0F0F0] rounded-lg border border-[#2C3E50]">
            <p className="text-sm text-gray-600 mb-1">Peak MRR</p>
            <p className="text-2xl font-bold text-[#2C3E50]">
              {formatCurrency(Math.max(...mrrData.map(d => d.mrr)))}
            </p>
          </div>
          <div className="p-4 bg-[#F0F0F0] rounded-lg border border-[#2C3E50]">
            <p className="text-sm text-gray-600 mb-1">Annual Run Rate</p>
            <p className="text-2xl font-bold text-[#2C3E50]">
              {formatCurrency(currentMRR * 12)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


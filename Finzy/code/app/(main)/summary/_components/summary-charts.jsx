"use client";

import { ArrowDown, ArrowUp, TrendingUpDownIcon } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
} from "recharts";

export default function SummaryCharts({ data }) {
  // prevent crash
  if (!data) return null;

  // expense category

  const expenseData = Object.keys(data.expenseCategory || {}).map((key) => ({
    name: key,
    value: data.expenseCategory[key],
  }));

  // income category

  const incomeData = Object.keys(data.incomeCategory || {}).map((key) => ({
    name: key,
    value: data.incomeCategory[key],
  }));

  // monthly trend

  const monthlyData = Object.keys(data.monthly || {}).map((key) => ({
    month: key,
    amount: data.monthly[key],
  }));
  const EXPENSE_COLORS = [
    "#6366F1", // indigo
    "#DC2626", // red dark
    "#F59E0B", // amber
    "#EF4444", // red
    "#059669", // emerald dark
    "#8B5CF6", // violet
    "#EC4899", // pink
    "#14B8A6", // teal
    "#F97316", // orange
    "#84CC16", // lime
  ];

  const INCOME_COLORS = [
    "#06B6D4", // cyan
    "#A855F7", // purple
    "#10B981", // emerald
    "#EAB308", // yellow
    "#0EA5E9", // sky
    "#D946EF", // fuchsia
    "#64748B", // slate
    "#22C55E", // green
    "#2563EB", // blue dark
    "#3B82F6", // blue
  ];

  return (
    <div className="space-y-8">
      {/* cards */}

      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl shadow-sm hover:shadow-xl hover:bg-emerald-50 transition-all duration-300 ease-out cursor-pointer">
          <h3 className="text-gray-500 font-semibold">Total Income</h3>
          <p className="text-xl font-bold text-green-500">
            ${(Number(data.income || 0)).toFixed(2)}
          </p>
        </div>

        <div className="p-4 rounded-xl  shadow-sm hover:shadow-xl hover:bg-red-50 transition-all duration-300 ease-out cursor-pointer">
          <h3 className="text-gray-500 font-semibold">Total Expense</h3>
          <p className="text-xl font-bold text-red-500">
            ${(Number(data.expense || 0)).toFixed(2)}
          </p>
        </div>

        <div className="p-4 rounded-xl shadow-sm hover:shadow-xl hover:bg-blue-50 transition-all duration-300 ease-out cursor-pointer">
          <h3 className="text-gray-500 font-semibold">Net Balance</h3>
          <p className="text-xl font-bold text-blue-500">
            ${(Number(data.balance || 0)).toFixed(2)}
          </p>
        </div>
      </div>
      {/*  */}

      {/* charts */}

      <div className="grid md:grid-cols-2 gap-6">
        {/* expense pie */}

        <div className="border p-4 rounded-lg">
          <h3 className="mb-4 text-lg font-semibold text-gray-800 tracking-wide border-l-4 border-red-500 pl-3 flex items-center justify-between">
            <span>Expense Categories</span>
            <ArrowDown className="w-5 h-5 text-red-500" />
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={95}
                paddingAngle={3}
                dataKey="value"
                animationDuration={900}
                animationEasing="ease-out"
                activeOuterRadius={110}
                label={({ name, value }) => `${name}: $${value.toFixed(2)}`}
              >
                {expenseData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={EXPENSE_COLORS[i % EXPENSE_COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* income pie */}

        <div className="border p-4 rounded-lg">
          <h3 className="mb-4 text-lg font-semibold text-gray-800 tracking-wide border-l-4 border-green-500 pl-3 flex items-center justify-between">
            <span>Income Categories</span>
            <ArrowUp className="w-5 h-5 text-green-500" />
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={incomeData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={95}
                paddingAngle={3}
                dataKey="value"
                animationDuration={900}
                animationEasing="ease-out"
                activeOuterRadius={110}
                label={({ name, value }) => `${name}: $${value.toFixed(2)}`}
              >
                {incomeData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={INCOME_COLORS[i % INCOME_COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/*  */}

      {/* monthly chart */}

      <div className="border p-4 rounded-lg">
        <h3 className="mb-4 text-lg tracking-wide border-l-4 border-purple-500 pl-3 flex items-center gap-2">
          <span className="font-semibold text-gray-800">Monthly Trends</span>
          <TrendingUpDownIcon className="w-6 h-6 bg-gradient-to-br from-green-500 via-emerald-500 to-red-400 animate-gradient hover:opacity-90 transition-opacity text-white hover:text-white" />
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={monthlyData}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            {/* add some styles */}
            {/* Gradient for line */}
            <defs>
              <linearGradient id="lineColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                <stop offset="50%" stopColor="#22c55e" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0.6} />
              </linearGradient>

              {/* Area gradient (soft fill under line) */}
              <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 13 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 13 }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderRadius: "10px",
                border: "none",
                color: "#fff",
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              }}
              cursor={{
                stroke: "#6366f1",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="none"
              fill="url(#areaColor)"
            />

            <Line
              type="monotone"
              dataKey="amount"
              stroke="url(#lineColor)"
              strokeWidth={3}
              dot={{
                r: 5,
                fill: "#6366f1",
                stroke: "#fff",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 8,
                stroke: "#6366f1",
                strokeWidth: 2,
                fill: "#fff",
              }}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

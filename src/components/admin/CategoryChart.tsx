"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface CategoryChartProps {
  data: { name: string; value: number }[];
  title: string;
  subtitle: string;
}

export const CategoryChart: React.FC<CategoryChartProps> = ({
  data,
  title,
  subtitle,
}) => {
  return (
    <div className="lg:col-span-2 bento-card min-h-[350px] md:min-h-[440px] border-none shadow-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl p-6 md:p-10">
      <div className="flex items-center justify-between mb-8 md:mb-10">
        <div>
          <h3 className="text-lg md:text-xl font-black dark:text-white uppercase tracking-tight">
            {title}
          </h3>
          <p className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">
            {subtitle}
          </p>
        </div>
      </div>
      <div className="h-[250px] md:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f010"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              stroke="#64748b"
              fontSize={8}
              tickLine={false}
              axisLine={false}
              dy={10}
              fontWeight="bold"
            />
            <YAxis
              stroke="#64748b"
              fontSize={8}
              tickLine={false}
              axisLine={false}
              fontWeight="bold"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderRadius: "20px",
                border: "1px solid #1e293b",
                fontSize: "9px",
                fontWeight: "900",
                textTransform: "uppercase",
              }}
              itemStyle={{ color: "#8b5cf6" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#8b5cf6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorValue)"
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

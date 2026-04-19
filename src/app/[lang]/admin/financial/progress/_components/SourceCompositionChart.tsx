"use client";

import React from "react";
import { Card } from "@/components/ui";
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Tooltip } from "recharts";

interface SourceCompositionChartProps {
  sourceData: any[];
  colors: string[];
  f: any;
  formatCurrency: (val: number) => string;
}

export const SourceCompositionChart = ({
  sourceData,
  colors,
  f,
  formatCurrency,
}: SourceCompositionChartProps) => {
  return (
    <Card className="p-8 border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-2xl">
      <h3 className="text-xl font-black text-navy dark:text-white mb-8">
        {f.composition_title || "Komposisi Sumber Dana"}
      </h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RePieChart>
            <Pie
              data={sourceData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {sourceData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any) => formatCurrency(Number(value))}
              contentStyle={{ borderRadius: "1rem", border: "none" }}
            />
          </RePieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {sourceData.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="size-3 rounded-full"
              style={{
                backgroundColor: colors[index % colors.length],
              }}
            />
            <span className="text-[10px] font-bold text-slate-500 uppercase">
              {entry.name}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

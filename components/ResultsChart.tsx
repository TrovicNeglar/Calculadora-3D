import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CostBreakdown } from '../types';

interface ResultsChartProps {
  costs: CostBreakdown;
}

export const ResultsChart: React.FC<ResultsChartProps> = ({ costs }) => {
  const data = [
    { name: 'Material', value: costs.materialCost, color: '#3B82F6' }, // Blue
    { name: 'Energia', value: costs.energyCost, color: '#F59E0B' },   // Amber
    { name: 'Mão de Obra', value: costs.laborCost, color: '#10B981' }, // Green
    { name: 'Setup', value: costs.setupCost, color: '#6366F1' },     // Indigo
  ].filter(item => item.value > 0);

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Custo']}
          />
          <Legend verticalAlign="bottom" height={36}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

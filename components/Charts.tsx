
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { SentenceAnalysis, HPCategory } from '../types';

interface ChartsProps {
  data: SentenceAnalysis[];
}

const Charts: React.FC<ChartsProps> = ({ data }) => {
  // HP Types Bar Data
  const categoryCounts = data.reduce((acc: any, curr) => {
    if (curr.hpCategory !== HPCategory.NONE) {
      acc[curr.hpCategory] = (acc[curr.hpCategory] || 0) + 1;
    }
    return acc;
  }, {});
  const barData = Object.keys(categoryCounts).map(cat => ({ name: cat, count: categoryCounts[cat] }));

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="mt-8">
      <div id="chart-hp-freq" className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 text-center">Historical Present Type Frequency</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} fontSize={10} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={50}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Charts;

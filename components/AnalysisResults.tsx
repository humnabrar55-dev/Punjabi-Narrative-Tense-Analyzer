
import React, { useState, useMemo } from 'react';
import { SentenceAnalysis, HPCategory } from '../types';

interface AnalysisResultsProps {
  sentences: SentenceAnalysis[];
  summary: {
    totalSentences: number;
    hpCount: number;
    tenseSwitchRatio: number;
  };
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ sentences, summary }) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const categories = useMemo(() => {
    const cats = new Set(sentences.map(s => s.hpCategory));
    return ['All', ...Array.from(cats)].sort();
  }, [sentences]);

  const filtered = useMemo(() => {
    return categoryFilter === 'All' ? sentences : sentences.filter(s => s.hpCategory === categoryFilter);
  }, [sentences, categoryFilter]);

  return (
    <div className="mt-8 space-y-8">
      {/* Comparative Statistics Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-300 overflow-hidden">
        <div className="p-4 bg-slate-900">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">Linguistic Metrics: Segments vs. HP Instances</h3>
        </div>
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-100 border-b border-slate-300">
            <tr>
              <th className="px-6 py-3 text-xs font-black text-black uppercase tracking-wider">Metric Category</th>
              <th className="px-6 py-3 text-xs font-black text-black uppercase tracking-wider text-center">Observed Count</th>
              <th className="px-6 py-3 text-xs font-black text-black uppercase tracking-wider text-right">Narrative Proportion</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            <tr>
              <td className="px-6 py-4 text-sm font-bold text-black">Total Narrative Segments (Logical Sentences)</td>
              <td className="px-6 py-4 text-sm font-black text-black text-center tabular-nums">{summary.totalSentences}</td>
              <td className="px-6 py-4 text-sm text-black font-medium text-right italic">100% of Corpus</td>
            </tr>
            <tr className="bg-indigo-50/50">
              <td className="px-6 py-4 text-sm font-bold text-indigo-950">Historical Present (HP) Instances</td>
              <td className="px-6 py-4 text-sm font-black text-indigo-700 text-center tabular-nums">{summary.hpCount}</td>
              <td className="px-6 py-4 text-sm text-indigo-950 font-black text-right">{(summary.tenseSwitchRatio * 100).toFixed(1)}% Frequency</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Main Annotation Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-300 overflow-hidden">
        <div className="p-6 bg-slate-50 border-b border-slate-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-lg font-bold text-black">Deep Discourse Annotation Table</h2>
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-black uppercase tracking-tight">Filter HP Category:</label>
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)} 
              className="text-xs border-2 border-slate-300 rounded p-1.5 bg-white text-black outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-slate-900 text-white text-[11px] uppercase font-bold tracking-widest">
              <tr>
                <th className="px-6 py-4 text-left w-20">Seg #</th>
                <th className="px-6 py-4 text-right">Shahmukhi Logical Sentence</th>
                <th className="px-6 py-4 text-left">Inferred Tense</th>
                <th className="px-6 py-4 text-left">HP Category</th>
                <th className="px-6 py-4 text-left">Linguistic Reasoning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((s, i) => (
                <tr key={i} className="hover:bg-indigo-50/40 transition-colors">
                  <td className="px-6 py-4 font-bold text-black tabular-nums">{(i + 1).toString().padStart(2, '0')}</td>
                  <td dir="rtl" className="px-6 py-6 font-nastaliq text-2xl min-w-[350px] text-black text-right leading-loose">
                    {s.originalText}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm border ${s.inferredTense === 'Historical Present' ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-slate-200 text-black border-slate-300'}`}>
                      {s.inferredTense}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-black text-black">{s.hpCategory}</td>
                  <td className="px-6 py-4 text-xs text-black italic leading-relaxed font-semibold">{s.reasoning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-16 text-center text-black font-bold italic bg-slate-100">No segments match the selected filter.</div>
        )}
      </div>
    </div>
  );
};

export default AnalysisResults;

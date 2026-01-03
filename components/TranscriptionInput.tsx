
import React from 'react';
import FileUploader from './FileUploader';

interface TranscriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

const TranscriptionInput: React.FC<TranscriptionInputProps> = ({ value, onChange, onAnalyze, isLoading }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-slate-800">Linguistic Corpus Input</h2>
        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Shahmukhi Nastaliq RTL</span>
      </div>
      
      <FileUploader onTextExtracted={onChange} isLoading={isLoading} />
      
      <div className="relative">
        <textarea
          dir="rtl"
          className="w-full h-64 p-6 font-nastaliq text-2xl border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none bg-white text-black resize-none shadow-inner"
          placeholder="ایتھے اپنی پنجابی تحریر لکھو یا فائل اپلوڈ کرو..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {/* Highly Visible Character Counter */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-slate-900 text-white px-4 py-1.5 rounded-full text-xs font-mono font-bold shadow-2xl z-20 border-2 border-slate-700 pointer-events-none">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span>{value.length > 0 ? `${value.length.toLocaleString()} chars detected` : "Awaiting input..."}</span>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <button
          onClick={() => onChange('')}
          className="px-6 py-3 rounded-lg font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all active:scale-95"
          disabled={isLoading || !value.trim()}
        >
          Clear
        </button>
        <button
          onClick={onAnalyze}
          disabled={isLoading || !value.trim()}
          className={`flex items-center gap-2 px-10 py-3 rounded-lg font-semibold text-white transition-all shadow-lg ${
            isLoading || !value.trim() 
              ? 'bg-slate-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-indigo-200/50'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Running Discourse Pipeline...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Run Discourse Analysis
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default TranscriptionInput;

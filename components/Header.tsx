
import React, { useState } from 'react';

interface HeaderProps {
  apiKey: string;
  onSaveKey: (key: string) => void;
}

const Header: React.FC<HeaderProps> = ({ apiKey, onSaveKey }) => {
  const [inputKey, setInputKey] = useState(apiKey);

  return (
    <header className="bg-slate-900 text-white py-4 px-8 border-b border-slate-700 shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Shahmukhi HP Analyzer</h1>
            <p className="text-slate-400 text-[10px] uppercase tracking-widest">Discourse Analysis Engine</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input
              type="password"
              placeholder="Enter Gemini API Key..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-500"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
            />
          </div>
          <button
            onClick={() => onSaveKey(inputKey)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold rounded-lg transition-all shadow-lg active:scale-95"
          >
            Save Key
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

import React from 'react';
import { UtensilsCrossed, Settings } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-700 border-b border-slate-800 sticky top-0 z-10 shadow-md">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white/10 p-2 rounded-lg text-red-500 backdrop-blur-sm border border-white/10">
            <UtensilsCrossed size={20} />
          </div>
          <div>
            <h1 className="font-bold text-white text-lg leading-tight tracking-wide">ReiterStube</h1>
            <p className="text-xs text-slate-300 font-medium">Review Manager AI</p>
          </div>
        </div>
        <button className="p-2 text-slate-300 hover:text-white transition-colors">
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
};
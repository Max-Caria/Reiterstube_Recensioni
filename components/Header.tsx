import React from 'react';
import { UtensilsCrossed, LogOut, Zap } from 'lucide-react';

interface HeaderProps {
  restaurantName: string;
  planName?: string;
  creditsUsed?: number;
  creditsLimit?: number;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  restaurantName, 
  planName = 'Basic', 
  creditsUsed = 0, 
  creditsLimit = 0,
  onLogout 
}) => {
  const percentage = Math.min(100, (creditsUsed / creditsLimit) * 100);
  const isLow = percentage > 80;

  return (
    <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10 shadow-md">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white/10 p-2 rounded-lg text-red-500 backdrop-blur-sm border border-white/10">
            <UtensilsCrossed size={20} />
          </div>
          <div>
            <h1 className="font-bold text-white text-lg leading-tight tracking-wide">{restaurantName}</h1>
            <div className="flex items-center space-x-2">
               <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 rounded uppercase tracking-wider">{planName}</span>
               <p className="text-xs text-slate-400 font-medium hidden sm:block">Review Manager AI</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Usage Meter */}
          <div className="hidden sm:flex flex-col items-end mr-2">
             <div className="flex items-center space-x-1 text-xs text-slate-300 mb-1">
               <Zap size={12} className={isLow ? "text-yellow-500" : "text-blue-400"} />
               <span>Credits: {creditsUsed}/{creditsLimit}</span>
             </div>
             <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
               <div 
                 className={`h-full rounded-full ${isLow ? 'bg-yellow-500' : 'bg-blue-500'}`} 
                 style={{ width: `${percentage}%` }}
               ></div>
             </div>
          </div>

          <button 
            onClick={onLogout}
            className="p-2 text-slate-400 hover:text-white transition-colors hover:bg-slate-700 rounded-full"
            title="Esci"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};
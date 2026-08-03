import React from 'react';
import { Activity, BarChart3, Zap } from 'lucide-react';

interface NavigationProps {
  activeTab: 'leaderboard' | 'visuals' | 'judge';
  setActiveTab: (tab: 'leaderboard' | 'visuals' | 'judge') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20">
              <Zap className="h-5 w-5 text-emerald-500" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-slate-100">
              Vibe<span className="text-emerald-500">Bench</span>
            </span>
          </div>
          
          <div className="flex gap-1 rounded-full border border-slate-800 bg-slate-900/50 p-1">
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                activeTab === 'leaderboard'
                  ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              Rankings
            </button>
            <button
              onClick={() => setActiveTab('visuals')}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                activeTab === 'visuals'
                  ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="h-4 w-4" />
              Visualize
            </button>
            <button
              onClick={() => setActiveTab('judge')}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                activeTab === 'judge'
                  ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="h-4 w-4" />
              Vibe Check
            </button>
          </div>

          <div className="hidden sm:block">
            <span className="text-xs font-medium text-slate-500">v2.5.0 (Live)</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

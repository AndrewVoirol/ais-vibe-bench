import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Leaderboard } from './components/Leaderboard';
import { EloChart, PricePerformanceChart } from './components/Charts';
import { VibeCheck } from './components/VibeCheck';
import { Hero3D } from './components/Hero3D';
import { MOCK_MODELS } from './constants';
import { Terminal } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'visuals' | 'judge'>('leaderboard');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-emerald-500/30 selection:text-emerald-200">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* 3D Hero Section */}
      <div className="relative h-[65vh] w-full overflow-hidden border-b border-slate-800">
        <Hero3D models={MOCK_MODELS} />
        
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center">
           <div className="glass-panel mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-emerald-400 shadow-lg shadow-emerald-500/10">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span>Live GenAI Tracking</span>
           </div>
           
           <h1 className="font-display text-5xl font-bold tracking-tight text-white drop-shadow-2xl sm:text-7xl lg:text-9xl">
            VIBE <span className="bg-gradient-to-r from-emerald-400 via-teal-200 to-cyan-400 bg-clip-text text-transparent">BENCH</span>
           </h1>
           
           <p className="mt-8 max-w-2xl text-lg text-slate-300 drop-shadow-md sm:text-xl font-light">
            The definitive signal in the noise. <br/>
            Quantifying the soul of <span className="text-emerald-400 font-medium">Text & Image</span> models with unfiltered metrics.
           </p>

           <div className="mt-10 flex gap-4">
              <button 
                onClick={() => setActiveTab('leaderboard')}
                className="group relative overflow-hidden rounded-full bg-slate-100 px-8 py-3 text-sm font-bold text-slate-900 transition-all hover:bg-white hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
              >
                <span className="relative z-10">View Leaderboard</span>
              </button>
              <button 
                onClick={() => setActiveTab('judge')}
                className="group flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/50 px-8 py-3 text-sm font-bold text-slate-100 backdrop-blur-md transition-all hover:bg-slate-800 hover:border-emerald-500/50"
              >
                <Terminal className="h-4 w-4 text-emerald-500" />
                <span>Run Vibe Check</span>
              </button>
           </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        
        {/* Content Tabs */}
        <div className="space-y-12">
          {activeTab === 'leaderboard' && (
            <div className="animate-fade-in-up">
               <div className="mb-8 flex items-end justify-between border-b border-slate-800 pb-4">
                 <div>
                    <h2 className="font-display text-3xl font-bold text-slate-100">Live Rankings</h2>
                    <p className="mt-1 text-sm text-slate-400">Aggregated from 10k+ community blind tests & benchmarks.</p>
                 </div>
                 <div className="text-right">
                    <span className="text-xs font-mono text-emerald-500 animate-pulse-slow">● SYSTEMS OPERATIONAL</span>
                 </div>
               </div>
               <Leaderboard models={MOCK_MODELS} />
            </div>
          )}

          {activeTab === 'visuals' && (
            <div className="animate-fade-in-up grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="glass-panel rounded-2xl p-1 shadow-2xl shadow-black/50">
                 <EloChart models={MOCK_MODELS} />
              </div>
              <div className="glass-panel rounded-2xl p-1 shadow-2xl shadow-black/50">
                 <PricePerformanceChart models={MOCK_MODELS} />
              </div>
              <div className="glass-panel col-span-1 lg:col-span-2 rounded-2xl p-10 text-center border-emerald-500/20 bg-gradient-to-b from-slate-900 to-slate-950">
                 <h3 className="mb-4 font-display text-2xl font-bold text-slate-200">The Vibe Methodology</h3>
                 <p className="mx-auto max-w-3xl leading-relaxed text-slate-400">
                    Traditional benchmarks measure ability. <span className="text-emerald-400 font-bold">Vibe Bench</span> measures <strong>soul</strong>. 
                    We weigh <span className="text-slate-200">Aesthetics</span>, <span className="text-slate-200">Prompt Adherence</span> (Basedness), 
                    and <span className="text-slate-200">Creative Flair</span> capabilities to find the models that actually spark joy in production environments.
                 </p>
              </div>
            </div>
          )}

          {activeTab === 'judge' && (
            <div className="animate-fade-in-up">
              <VibeCheck />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-slate-900 bg-slate-950 py-12">
        <div className="mx-auto max-w-7xl px-4 text-center text-slate-500 sm:px-6 lg:px-8">
          <p className="mb-4 flex items-center justify-center gap-2 text-sm">
             Engineered with <span className="font-semibold text-emerald-500">Gemini 1.5 Pro</span> + <span className="font-semibold text-cyan-500">React Three Fiber</span>
          </p>
          <p className="text-xs opacity-60">
            &copy; 2025 Vibe Bench. All vibes reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
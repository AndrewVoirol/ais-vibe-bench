import React, { useState } from 'react';
import { LLMModel } from '../types';
import { VibeRadarChart } from './Charts';
import { ArrowUp, ArrowDown, Info, ChevronDown, ChevronUp } from 'lucide-react';

interface LeaderboardProps {
  models: LLMModel[];
}

type SortField = 'elo' | 'vibeScore' | 'pricePerMInput' | 'votes';

export const Leaderboard: React.FC<LeaderboardProps> = ({ models }) => {
  const [sortField, setSortField] = useState<SortField>('elo');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedModels = [...models].sort((a, b) => {
    const modifier = sortDirection === 'asc' ? 1 : -1;
    return (a[sortField] - b[sortField]) * modifier;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <div className="h-4 w-4" />;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  return (
    <div className="w-full space-y-4">
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur-sm">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-slate-950 text-slate-400">
              <tr>
                <th className="px-6 py-5 font-display font-semibold uppercase tracking-wider text-xs">Rank</th>
                <th className="px-6 py-5 font-display font-semibold uppercase tracking-wider text-xs">Model</th>
                <th 
                  className="cursor-pointer px-6 py-5 font-display font-semibold uppercase tracking-wider text-xs hover:text-emerald-400"
                  onClick={() => handleSort('elo')}
                >
                  <div className="flex items-center gap-1">Score (ELO) <SortIcon field="elo" /></div>
                </th>
                <th 
                  className="cursor-pointer px-6 py-5 font-display font-semibold uppercase tracking-wider text-xs hover:text-sky-400"
                  onClick={() => handleSort('vibeScore')}
                >
                  <div className="flex items-center gap-1">Vibe Score <SortIcon field="vibeScore" /></div>
                </th>
                <th 
                  className="cursor-pointer px-6 py-5 font-display font-semibold uppercase tracking-wider text-xs hover:text-slate-200"
                  onClick={() => handleSort('votes')}
                >
                  <div className="flex items-center gap-1">Votes <SortIcon field="votes" /></div>
                </th>
                <th 
                  className="cursor-pointer px-6 py-5 font-display font-semibold uppercase tracking-wider text-xs hover:text-amber-400"
                  onClick={() => handleSort('pricePerMInput')}
                >
                  <div className="flex items-center gap-1">Cost Index <SortIcon field="pricePerMInput" /></div>
                </th>
                <th className="px-6 py-5 font-display font-semibold">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-slate-200">
              {sortedModels.map((model, index) => (
                <React.Fragment key={model.id}>
                  <tr 
                    className={`group cursor-pointer transition-all hover:bg-slate-800/40 ${expandedRow === model.id ? 'bg-slate-800/20' : ''}`}
                    onClick={() => setExpandedRow(expandedRow === model.id ? null : model.id)}
                  >
                    <td className="px-6 py-4 font-mono text-slate-500">
                        {index === 0 ? <span className="text-xl">👑</span> : `#${index + 1}`}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-2.5 w-2.5 rounded-full shadow-[0_0_10px_currentColor]`} style={{ color: getProviderColor(model.provider), backgroundColor: getProviderColor(model.provider) }}></div>
                        <div>
                            <span className="font-bold text-slate-100">{model.name}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-emerald-400 text-lg">{model.elo}</td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                         <span className="font-mono font-bold text-sky-400 text-lg">{model.vibeScore}</span>
                         <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-800">
                           <div className="h-full bg-gradient-to-r from-sky-600 to-cyan-300" style={{ width: `${model.vibeScore}%` }} />
                         </div>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-mono">{model.votes.toLocaleString()}</td>
                    <td className="px-6 py-4 text-slate-400 font-mono">
                      {/* Visual indicator for cost */}
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                           <div key={i} className={`h-1.5 w-1.5 rounded-full ${i < Math.ceil(model.pricePerMInput / 2) ? 'bg-amber-500' : 'bg-slate-800'}`} />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {expandedRow === model.id ? (
                        <ChevronUp className="ml-auto h-5 w-5 text-emerald-500" />
                      ) : (
                        <ChevronDown className="ml-auto h-5 w-5 text-slate-600 opacity-0 transition-opacity group-hover:opacity-100" />
                      )}
                    </td>
                  </tr>
                  {expandedRow === model.id && (
                    <tr className="bg-slate-900/30 border-b border-slate-800/50">
                      <td colSpan={7}>
                        <div className="animate-fade-in-up flex flex-col gap-8 p-8 md:flex-row">
                          <div className="flex-1 space-y-6">
                            <div>
                                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-500 mb-2">
                                    <Info className="h-3 w-3" />
                                    Model Analysis
                                </h4>
                                <p className="text-lg font-light leading-relaxed text-slate-300">{model.description}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                                    <p className="text-[10px] uppercase tracking-wider text-slate-500">Provider</p>
                                    <p className="font-medium text-slate-200 mt-1">{model.provider}</p>
                                </div>
                                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                                    <p className="text-[10px] uppercase tracking-wider text-slate-500">Release Date</p>
                                    <p className="font-medium text-slate-200 mt-1">{model.releaseDate}</p>
                                </div>
                            </div>
                          </div>
                          <div className="w-full md:w-[350px] rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                            <h4 className="mb-4 text-center text-xs font-bold uppercase tracking-widest text-slate-500">Vibe Signature</h4>
                            <VibeRadarChart model={model} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex items-start gap-2 p-2 text-xs text-slate-500">
         <p>* Rankings based on latest Community Vote data. Vibe scores are synthetic estimates.</p>
      </div>
    </div>
  );
};

function getProviderColor(provider: string): string {
    // Map to constants values but handle string input safe
    switch (provider) {
        case 'Google': return '#34d399';
        case 'OpenAI': return '#14b8a6';
        case 'Anthropic': return '#f97316';
        case 'Meta': return '#0ea5e9';
        case 'Mistral': return '#eab308';
        case 'DeepSeek': return '#ef4444';
        case 'Tencent': return '#3b82f6';
        case 'Bytedance': return '#06b6d4';
        case 'Alibaba': return '#f43f5e';
        default: return '#94a3b8';
    }
}
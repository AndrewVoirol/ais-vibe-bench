import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Cell
} from 'recharts';
import { LLMModel } from '../types';
import { PROVIDER_COLORS } from '../constants';

// --- Custom Tooltip Component ---
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border border-slate-700 bg-slate-900 p-3 shadow-xl ring-1 ring-white/10 backdrop-blur-md">
        <p className="font-display font-bold text-slate-100">{data.name}</p>
        <div className="mt-1 space-y-1 text-xs text-slate-400">
          <p>Score: <span className="text-emerald-400">{data.elo}</span></p>
          <p>Vibe: <span className="text-sky-400">{data.vibeScore}</span></p>
          <p>Votes: <span className="text-slate-300">{data.votes.toLocaleString()}</span></p>
        </div>
      </div>
    );
  }
  return null;
};

// --- ELO Bar Chart ---
export const EloChart: React.FC<{ models: LLMModel[] }> = ({ models }) => {
  const sortedData = [...models].sort((a, b) => b.elo - a.elo);

  return (
    <div className="h-[400px] w-full p-4">
      <h3 className="mb-6 font-display text-lg font-semibold text-slate-100">Top Models by Arena Score</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={sortedData} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
          <XAxis type="number" domain={['dataMin - 100', 'auto']} hide />
          <YAxis
            type="category"
            dataKey="name"
            width={140}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1e293b', opacity: 0.4 }} />
          <Bar dataKey="elo" radius={[0, 4, 4, 0]} barSize={32}>
            {sortedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={PROVIDER_COLORS[entry.provider] || '#94a3b8'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// --- Price vs Performance Scatter ---
export const PricePerformanceChart: React.FC<{ models: LLMModel[] }> = ({ models }) => {
  return (
    <div className="h-[400px] w-full p-4">
      <h3 className="mb-6 font-display text-lg font-semibold text-slate-100">Cost vs. Vibe Score</h3>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            type="number"
            dataKey="pricePerMInput"
            name="Cost Index"
            stroke="#64748b"
            label={{ value: 'Cost Index (Est.)', position: 'bottom', offset: 0, fill: '#64748b', fontSize: 12 }}
          />
          <YAxis
            type="number"
            dataKey="vibeScore"
            name="Vibe Score"
            domain={['dataMin - 5', 100]}
            stroke="#64748b"
            label={{ value: 'Vibe Score', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 12 }}
          />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
          <Scatter name="Models" data={models} fill="#34d399">
            {models.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={PROVIDER_COLORS[entry.provider] || '#94a3b8'} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

// --- Radar Chart for Attributes ---
export const VibeRadarChart: React.FC<{ model: LLMModel }> = ({ model }) => {
  const data = [
    { subject: 'Chill', A: model.attributes.chill, fullMark: 100 },
    { subject: 'Intellect', A: model.attributes.intellect, fullMark: 100 },
    { subject: 'Creativity', A: model.attributes.creativity, fullMark: 100 },
    { subject: 'Speed', A: model.attributes.speed, fullMark: 100 },
    { subject: 'Based', A: model.attributes.basedness, fullMark: 100 },
    { subject: 'Humor', A: model.attributes.humor, fullMark: 100 },
    { subject: 'Safety', A: model.attributes.safety, fullMark: 100 },
  ];

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name={model.name}
            dataKey="A"
            stroke={PROVIDER_COLORS[model.provider] || "#34d399"}
            strokeWidth={2}
            fill={PROVIDER_COLORS[model.provider] || "#34d399"}
            fillOpacity={0.3}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }}
            itemStyle={{ color: '#f1f5f9' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
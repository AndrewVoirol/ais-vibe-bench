import React, { useState, useEffect, useRef } from 'react';
import { Play, Terminal, Cpu, Activity, ShieldAlert } from 'lucide-react';
import { analyzeVibe } from '../services/geminiService';
import { VibeAnalysisResult } from '../types';

const LOADING_LOGS = [
  "Initializing Neural Link...",
  "Handshaking with Gemini 2.5 Flash...",
  "Quantizing Context Window...",
  "Analyzing Semantic Vectors...",
  "Calculating Basedness Coefficients...",
  "Evaluating Safety Protocols...",
  "Measuring Wit & Humor...",
  "Optimizing Vibe Tensors...",
  "Rendering Output..."
];

export const VibeCheck: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<VibeAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const logIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (logIntervalRef.current) window.clearInterval(logIntervalRef.current);
    };
  }, []);

  const handleAnalyze = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError(null);
    setResult(null);
    setLogs(["< SYSTEM START >"]);

    // Start fake terminal logs
    let logIndex = 0;
    logIntervalRef.current = window.setInterval(() => {
      if (logIndex < LOADING_LOGS.length) {
        setLogs(prev => [...prev, `> ${LOADING_LOGS[logIndex]}`]);
        logIndex++;
      }
    }, 400);

    try {
      const data = await analyzeVibe(prompt);
      setResult(data);
    } catch (err) {
      setError("Analysis Failed. Check connection/API Key.");
    } finally {
      if (logIntervalRef.current) window.clearInterval(logIntervalRef.current);
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2 h-full">
      {/* Input Section - Left Side */}
      <div className="flex flex-col space-y-4 h-full">
        <div className="flex-1 rounded-none border border-slate-700 bg-slate-950 p-1 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-emerald-500"/>
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-emerald-500"/>
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-emerald-500"/>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-emerald-500"/>

          <div className="h-full flex flex-col p-6">
            <div className="mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <Terminal className="h-5 w-5 text-emerald-500" />
                <h2 className="font-mono text-sm font-bold tracking-widest text-emerald-500 uppercase">Input_Terminal</h2>
              </div>
              <div className="flex items-center gap-2">
                 <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                 <span className="text-[10px] text-slate-500 font-mono">ONLINE</span>
              </div>
            </div>
            
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="ENTER PROMPT FOR VIBE QUANTIFICATION..."
              className="flex-1 w-full resize-none bg-transparent font-mono text-sm text-slate-300 placeholder-slate-700 focus:outline-none"
              spellCheck={false}
            />

            <div className="mt-6 flex items-center justify-between">
              <div className="font-mono text-xs text-slate-600">
                CHARS: <span className="text-emerald-500">{prompt.length}</span>
              </div>
              <button
                onClick={handleAnalyze}
                disabled={loading || !prompt}
                className={`flex items-center gap-2 px-6 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-all
                  ${loading || !prompt
                    ? 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
                    : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                  }`}
              >
                {loading ? (
                  <>PROCESSING...</>
                ) : (
                  <>
                    <Play className="h-3 w-3" />
                    EXECUTE_ANALYSIS
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Terminal Log Output (Visible during loading or always) */}
        {(loading || logs.length > 0) && (
            <div className="h-32 overflow-hidden rounded-sm border border-slate-800 bg-black p-4 font-mono text-xs text-emerald-500/80">
                {logs.map((log, i) => (
                    <div key={i} className="animate-fade-in-up">{log}</div>
                ))}
                {loading && <span className="animate-pulse">_</span>}
            </div>
        )}
      </div>

      {/* Output Section - Right Side */}
      <div className="flex flex-col h-full">
        {result ? (
          <div className="animate-fade-in flex-1 rounded-none border border-slate-700 bg-slate-950/80 backdrop-blur-md p-1 relative">
            {/* Corners */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-emerald-500"/>
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-emerald-500"/>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-emerald-500"/>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-emerald-500"/>
            
            <div className="h-full flex flex-col p-6">
                 {/* Header */}
                 <div className="mb-6 flex items-start justify-between">
                    <div>
                        <div className="font-mono text-xs text-slate-500 mb-1">ANALYSIS RESULT</div>
                        <h3 className="font-display text-3xl font-bold text-white tracking-tight">
                            SCORE: <span className="text-emerald-400">{result.vibeScore}</span>
                        </h3>
                    </div>
                    <Activity className="h-8 w-8 text-slate-800" />
                 </div>

                 {/* Metrics Grid */}
                 <div className="grid grid-cols-3 gap-2 mb-8">
                    <MetricBox label="CHILL" value={result.attributes.chill} />
                    <MetricBox label="INTEL" value={result.attributes.intellect} />
                    <MetricBox label="CREATIVE" value={result.attributes.creativity} />
                    <MetricBox label="BASED" value={result.attributes.basedness} />
                    <MetricBox label="HUMOR" value={result.attributes.humor} />
                    <MetricBox label="SAFETY" value={result.attributes.safety} />
                 </div>

                 {/* Reasoning */}
                 <div className="mb-8 border-l-2 border-emerald-500/50 pl-4 py-2 bg-emerald-950/10">
                    <div className="font-mono text-[10px] uppercase text-emerald-600 mb-1">Judge's Reasoning</div>
                    <p className="font-mono text-sm text-emerald-100/90 leading-relaxed">"{result.reasoning}"</p>
                 </div>

                 {/* Generated Response */}
                 <div className="flex-1 overflow-auto rounded border border-slate-800 bg-slate-900/50 p-4">
                    <div className="flex items-center gap-2 mb-3 border-b border-slate-800 pb-2">
                        <Cpu className="h-3 w-3 text-slate-500" />
                        <span className="font-mono text-[10px] uppercase text-slate-500">Model_Output_Stream</span>
                    </div>
                    <p className="font-sans text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {result.response}
                    </p>
                 </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center rounded-sm border border-dashed border-slate-800 bg-slate-950/30 p-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 border border-slate-800">
                <ShieldAlert className="h-8 w-8 text-slate-700" />
            </div>
            <h3 className="font-mono text-sm font-bold text-slate-500 uppercase tracking-widest">Awaiting Input Signal</h3>
            <p className="mt-2 text-xs text-slate-600 max-w-xs font-mono">
              System is ready for quantum vibe analysis. Enter data in the terminal to begin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const MetricBox = ({ label, value }: { label: string; value: number }) => (
  <div className="flex flex-col items-center justify-center rounded border border-slate-800 bg-slate-900 p-2 text-center hover:border-emerald-500/30 transition-colors">
    <div className="font-mono text-[10px] text-slate-500 mb-1">{label}</div>
    <div className={`font-mono text-lg font-bold ${value > 85 ? 'text-emerald-400' : value > 60 ? 'text-cyan-400' : 'text-slate-400'}`}>
        {value}
    </div>
    <div className="w-full h-1 bg-slate-800 mt-2 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${value}%` }} />
    </div>
  </div>
);
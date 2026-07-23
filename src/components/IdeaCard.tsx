import React, { useState } from 'react';
import { Idea } from '../types';
import { Heart, Share2, ArrowUpRight, Folder, TrendingUp, AlertTriangle, Trash2 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts';

interface IdeaCardProps {
  key?: string;
  idea: Idea;
  onOpenDetails: (idea: Idea) => void;
  isFavorited: boolean;
  onToggleFavorite: (id: string) => void;
  onDeleteIdea?: (id: string) => void;
}

export default function IdeaCard({ idea, onOpenDetails, isFavorited, onToggleFavorite, onDeleteIdea }: IdeaCardProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  // Map score color
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'stroke-[#FF8B2B]';
    if (score >= 70) return 'stroke-amber-500';
    return 'stroke-emerald-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 85) return 'text-[#FF8B2B]';
    if (score >= 70) return 'text-amber-500';
    return 'text-emerald-500';
  };

  const getPotentialBadge = (pot: string) => {
    switch (pot) {
      case 'High':
        return 'bg-orange-50 text-[#FF8B2B] border-[#FF9D42]/20';
      case 'Medium':
        return 'bg-amber-50 text-amber-600 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  // Build the recharts data array
  const sparklineData = idea.sparkline && idea.sparkline.length > 0
    ? idea.sparkline.map((val, idx) => ({ step: `M${idx + 1}`, value: val }))
    : [
        { step: 'M1', value: 20 },
        { step: 'M2', value: 35 },
        { step: 'M3', value: 50 },
        { step: 'M4', value: 68 },
        { step: 'M5', value: 82 },
      ];

  const gradientId = `sparkline-grad-${idea.id.replace(/[^a-zA-Z0-9]/g, '')}`;
  const strokeColor = idea.score >= 80 ? '#FF8B2B' : idea.score >= 65 ? '#F59E0B' : '#22C55E';

  return (
    <div
      id={`idea-card-${idea.id}`}
      className="liquid-glass-card spring-transition spring-hover rounded-3xl p-6 group relative overflow-hidden flex flex-col justify-between h-[300px]"
    >
      {/* Inline Delete Confirmation Overlay */}
      {isConfirming && (
        <div className="absolute inset-0 bg-white/95 dark:bg-[#1E1C1B]/95 backdrop-blur-xs flex flex-col items-center justify-center p-6 z-30 animate-fadeIn text-center">
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-2.5">
            <Trash2 className="w-5 h-5 animate-pulse" />
          </div>
          <h4 className="text-xs font-bold text-[#1B1B1B] dark:text-[#FAF8F5]">Delete this idea?</h4>
          <p className="text-[10px] text-[#707070] dark:text-[#999999] max-w-[200px] mt-1 leading-snug">
            This will permanently remove "{idea.title}" from your backlog.
          </p>
          <div className="flex gap-2 mt-4 w-full justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsConfirming(false);
              }}
              className="px-3 py-1.5 rounded-xl text-[10px] font-bold text-[#707070] dark:text-[#999999] bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onDeleteIdea) onDeleteIdea(idea.id);
                setIsConfirming(false);
              }}
              className="px-3 py-1.5 rounded-xl text-[10px] font-bold text-white bg-red-500 hover:bg-red-600 shadow-xs transition-colors cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Glow highlight behind card on hover */}
      <div className="absolute -inset-px bg-gradient-to-tr from-[#FF9D42]/0 via-[#FF9D42]/0 to-[#FF9D42]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl" />

      {/* Top row: Category & Score Circle */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-[#999999] dark:text-stone-400 uppercase tracking-wider block">
            {idea.category}
          </span>
          <h4 className="text-[16px] font-bold text-[#1B1B1B] dark:text-white leading-tight line-clamp-1 group-hover:text-[#FF8B2B] transition-colors">
            {idea.title}
          </h4>
        </div>
        
        {/* Circular Score Meter */}
        <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="24"
              cy="24"
              r="20"
              className="stroke-black/5 dark:stroke-white/10"
              strokeWidth="3.5"
              fill="transparent"
            />
            <circle
              cx="24"
              cy="24"
              r="20"
              className={`${getScoreColor(idea.score)} transition-all duration-500`}
              strokeWidth="3.5"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 20}
              strokeDashoffset={2 * Math.PI * 20 * (1 - idea.score / 100)}
              strokeLinecap="round"
            />
          </svg>
          <span className={`absolute text-xs font-black tracking-tighter ${getScoreBg(idea.score)}`}>
            {idea.score}
          </span>
        </div>
      </div>

      {/* Mid section: Description */}
      <p className="text-xs text-[#707070] dark:text-stone-300 font-medium leading-relaxed line-clamp-3 my-3">
        {idea.description}
      </p>

      {/* Grid of Key dimensions */}
      <div className="grid grid-cols-3 gap-2 py-3 border-y border-black/5 dark:border-white/10 text-[10px] font-bold text-[#707070] dark:text-stone-400">
        <div>
          <span className="text-[#999999] dark:text-stone-400 block mb-0.5">Potential</span>
          <span className="text-[#1B1B1B] dark:text-white font-extrabold">{idea.potential}</span>
        </div>
        <div>
          <span className="text-[#999999] dark:text-stone-400 block mb-0.5">Competition</span>
          <span className="text-[#1B1B1B] dark:text-white font-extrabold">{idea.competition}</span>
        </div>
        <div>
          <span className="text-[#999999] dark:text-stone-400 block mb-0.5">Trend</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{idea.trend}</span>
        </div>
      </div>

      {/* Bottom Row: Actions & Sparkline */}
      <div className="flex items-center justify-between pt-3 mt-auto">
        {/* Recharts Sparkline Growth Trajectory Chart */}
        <div className="flex items-center gap-1.5" title={`Growth Trajectory (${idea.trend})`}>
          <TrendingUp className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <div className="w-20 h-7 relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={strokeColor} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={strokeColor} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-black/90 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-sm pointer-events-none z-50">
                          {payload[0].value}%
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={strokeColor}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill={`url(#${gradientId})`}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Icons row */}
        <div className="flex items-center gap-1.5">
          {onDeleteIdea && (
            <button
              id={`delete-btn-${idea.id}`}
              onClick={(e) => { e.stopPropagation(); setIsConfirming(true); }}
              className="w-8 h-8 rounded-xl flex items-center justify-center bg-black/5 hover:bg-red-500/10 text-[#707070] hover:text-red-500 transition-colors cursor-pointer"
              title="Delete Idea"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            id={`fav-btn-${idea.id}`}
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(idea.id); }}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
              isFavorited
                ? 'bg-orange-50 text-[#FF8B2B]'
                : 'bg-black/5 hover:bg-black/10 text-[#707070] hover:text-[#1B1B1B]'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-[#FF8B2B]' : ''}`} />
          </button>
          
          <button
            id={`details-btn-${idea.id}`}
            onClick={() => onOpenDetails(idea)}
            className="h-8 px-3 rounded-xl bg-gradient-to-r from-[#FF9D42] to-[#FF8B2B] hover:shadow-sm text-white text-[11px] font-bold flex items-center gap-1 transition-all duration-300"
          >
            <span>Analyze</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

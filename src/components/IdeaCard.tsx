import React from 'react';
import { Idea } from '../types';
import { Heart, Share2, ArrowUpRight, Folder, TrendingUp, AlertTriangle } from 'lucide-react';

interface IdeaCardProps {
  key?: string;
  idea: Idea;
  onOpenDetails: (idea: Idea) => void;
  isFavorited: boolean;
  onToggleFavorite: (id: string) => void;
}

export default function IdeaCard({ idea, onOpenDetails, isFavorited, onToggleFavorite }: IdeaCardProps) {
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

  // Build the mini SVG sparkline path
  const minVal = Math.min(...idea.sparkline);
  const maxVal = Math.max(...idea.sparkline);
  const delta = maxVal - minVal || 1;
  const sparklinePoints = idea.sparkline
    .map((val, idx) => {
      const x = (idx / (idea.sparkline.length - 1)) * 60;
      const y = 25 - ((val - minVal) / delta) * 20;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div
      id={`idea-card-${idea.id}`}
      className="liquid-glass-card spring-transition spring-hover rounded-3xl p-6 group relative overflow-hidden flex flex-col justify-between h-[300px]"
    >
      {/* Glow highlight behind card on hover */}
      <div className="absolute -inset-px bg-gradient-to-tr from-[#FF9D42]/0 via-[#FF9D42]/0 to-[#FF9D42]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl" />

      {/* Top row: Category & Score Circle */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-[#999999] uppercase tracking-wider block">
            {idea.category}
          </span>
          <h4 className="text-[16px] font-bold text-[#1B1B1B] leading-tight line-clamp-1 group-hover:text-[#FF8B2B] transition-colors">
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
              className="stroke-black/5"
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
      <p className="text-xs text-[#707070] font-medium leading-relaxed line-clamp-3 my-3">
        {idea.description}
      </p>

      {/* Grid of Key dimensions */}
      <div className="grid grid-cols-3 gap-2 py-3 border-y border-black/5 text-[10px] font-bold text-[#707070]">
        <div>
          <span className="text-[#999999] block mb-0.5">Potential</span>
          <span className="text-[#1B1B1B] font-extrabold">{idea.potential}</span>
        </div>
        <div>
          <span className="text-[#999999] block mb-0.5">Competition</span>
          <span className="text-[#1B1B1B] font-extrabold">{idea.competition}</span>
        </div>
        <div>
          <span className="text-[#999999] block mb-0.5">Trend</span>
          <span className="text-emerald-600 font-extrabold">{idea.trend}</span>
        </div>
      </div>

      {/* Bottom Row: Actions & Sparkline */}
      <div className="flex items-center justify-between pt-3 mt-auto">
        {/* Sparkline Visualizer */}
        <div className="flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
          <svg className="w-16 h-8 overflow-visible" viewBox="0 0 60 25">
            <polyline
              fill="none"
              stroke="#22C55E"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={sparklinePoints}
            />
          </svg>
        </div>

        {/* Icons row */}
        <div className="flex items-center gap-1.5">
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

import React from 'react';
import { Idea } from '../types';
import { BarChart3, PieChart, Sparkles, TrendingUp, Compass, Globe } from 'lucide-react';

interface AnalyticsPanelProps {
  ideas: Idea[];
}

export default function AnalyticsPanel({ ideas }: AnalyticsPanelProps) {
  const totalCount = ideas.length;
  const [hoveredCategoryIdx, setHoveredCategoryIdx] = React.useState<number | null>(null);
  const [hoveredBarIdx, setHoveredBarIdx] = React.useState<number | null>(null);
  const [hoveredHeatmapId, setHoveredHeatmapId] = React.useState<string | null>(null);

  // Find the top-performing idea dynamically
  const topIdea = totalCount > 0 ? [...ideas].sort((a, b) => b.score - a.score)[0] : null;

  // Calculate real metrics from the ideas state
  const aiCount = ideas.filter(i => i.category?.toLowerCase().includes('ai')).length;
  const saasCount = ideas.filter(i => i.category?.toLowerCase().includes('saas')).length;
  const consumerCount = ideas.filter(i => i.category?.toLowerCase().includes('consumer')).length;
  const otherCount = totalCount - aiCount - saasCount - consumerCount;

  const categories = [
    { name: 'AI', count: aiCount, percentage: totalCount ? Math.round((aiCount / totalCount) * 100) : 0, color: '#FF9D42' },
    { name: 'SaaS', count: saasCount, percentage: totalCount ? Math.round((saasCount / totalCount) * 100) : 0, color: '#FFB874' },
    { name: 'Consumer', count: consumerCount, percentage: totalCount ? Math.round((consumerCount / totalCount) * 100) : 0, color: '#FFD6A5' },
    { name: 'Other', count: otherCount, percentage: totalCount ? Math.round((otherCount / totalCount) * 100) : 0, color: '#F8E8D5' },
  ];

  // Group ideas by category and calculate average scores
  const categoryScores: Record<string, { total: number; count: number }> = {};
  ideas.forEach((idea) => {
    const cat = idea.category || 'Other';
    if (!categoryScores[cat]) {
      categoryScores[cat] = { total: 0, count: 0 };
    }
    categoryScores[cat].total += idea.score || 0;
    categoryScores[cat].count += 1;
  });

  const categoryAverages = Object.entries(categoryScores).map(([name, stat]) => ({
    label: name,
    val: Math.round(stat.total / stat.count),
  })).slice(0, 6); // Max 6 for layout constraints

  // Fallback if no category averages
  const barData = categoryAverages.length > 0 ? categoryAverages : [
    { label: 'SaaS', val: 0 },
    { label: 'AI', val: 0 },
    { label: 'Consumer', val: 0 },
  ];

  if (totalCount === 0) {
    return (
      <div className="bg-white/65 backdrop-blur-xl border border-white/45 p-12 rounded-3xl text-center space-y-4 max-w-2xl mx-auto">
        <div className="w-12 h-12 bg-orange-100/50 rounded-full flex items-center justify-center mx-auto">
          <BarChart3 className="w-6 h-6 text-[#FF8B2B]" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-[#1B1B1B]">No Analytics Signals Pulled Yet</h4>
          <p className="text-xs text-[#707070] font-medium leading-relaxed">
            Upload and analyze your product or SaaS ideas in the Uploads tab. Our AI evaluation engine will compute opportunity indexes, feasibility matrix scores, and plot real-time trends here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Smart Recommendation Banner */}
      {topIdea && (
        <div className="bg-gradient-to-r from-orange-50 to-[#FFD6A5]/10 border border-orange-100 rounded-3xl p-6 space-y-3 animate-fade-in">
          <h3 className="text-xs font-bold text-[#FF8B2B] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#FF9D42]" />
            Portfolio AI Recommendation
          </h3>
          <p className="text-sm text-[#1B1B1B] font-bold leading-relaxed">
            Prioritize <span className="text-[#FF8B2B] font-black underline decoration-2">{topIdea.title}</span> — It is currently your top-performing opportunity, scoring <span className="font-extrabold">{topIdea.score}/100</span> based on active evaluation criteria weights. It estimates a build time of <span className="font-semibold">{topIdea.timeToBuild}</span> and estimated budget of <span className="font-semibold">{topIdea.estimatedCost}</span>.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 text-xs font-semibold text-[#707070]">
            <div className="space-y-1">
              <span className="text-[10px] text-[#999999] uppercase block font-bold">Business Model</span>
              <span className="text-[#1B1B1B] font-extrabold truncate block">{topIdea.businessModel || 'SaaS Subscription'}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-[#999999] uppercase block font-bold">Category Class</span>
              <span className="text-[#1B1B1B] font-extrabold">{topIdea.category}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-[#999999] uppercase block font-bold">Competition</span>
              <span className="text-emerald-600 font-extrabold">{topIdea.competition}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-[#999999] uppercase block font-bold">Investor Confidence</span>
              <span className="text-[#1B1B1B] font-extrabold">{topIdea.investorScore || 80}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Charts Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Category distribution Circular chart */}
        <div className="liquid-glass-card spring-transition rounded-3xl p-6 space-y-4">
          <div>
            <span className="text-[10px] font-bold text-[#999999] uppercase tracking-wider block">Portfolio Density</span>
            <h4 className="text-sm font-bold text-[#1B1B1B] flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-[#FF9D42]" />
              Category Distribution
            </h4>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Custom SVG Donut chart */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(0,0,0,0.03)" strokeWidth="12" />
                {totalCount > 0 && (() => {
                  let cumOffset = 0;
                  return categories.map((c, i) => {
                    const strokeDash = 2 * Math.PI * 40;
                    const strokeDashoffset = strokeDash * (1 - (c.percentage / 100));
                    const rotate = (cumOffset / 100) * 360;
                    cumOffset += c.percentage;
                    const isHovered = hoveredCategoryIdx === i;
                    const anyHovered = hoveredCategoryIdx !== null;
                    return (
                      <circle
                        key={i}
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke={c.color}
                        strokeWidth={isHovered ? "15" : "12"}
                        strokeDasharray={strokeDash}
                        strokeDashoffset={strokeDashoffset}
                        transform={`rotate(${rotate} 50 50)`}
                        className="origin-center transition-all duration-300 cursor-pointer"
                        style={{
                          opacity: anyHovered ? (isHovered ? 1.0 : 0.4) : 1.0,
                        }}
                        onMouseEnter={() => setHoveredCategoryIdx(i)}
                        onMouseLeave={() => setHoveredCategoryIdx(null)}
                      />
                    );
                  });
                })()}
              </svg>
              <div className="absolute text-center px-2 pointer-events-none">
                {hoveredCategoryIdx !== null ? (
                  <div className="animate-fadeIn">
                    <span className="text-lg font-extrabold text-[#1B1B1B] dark:text-[#FAF8F5] block leading-none">
                      {categories[hoveredCategoryIdx].count}
                    </span>
                    <span className="text-[8px] font-black text-[#FF8B2B] uppercase tracking-wider block mt-1">
                      {categories[hoveredCategoryIdx].name} ({categories[hoveredCategoryIdx].percentage}%)
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="text-xl font-extrabold text-[#1B1B1B] dark:text-[#FAF8F5] block leading-none">{totalCount}</span>
                    <span className="text-[9px] font-bold text-[#999999] dark:text-stone-500 uppercase tracking-wider block mt-1">Ideas</span>
                  </div>
                )}
              </div>
            </div>

            {/* Legends list */}
            <div className="space-y-2 flex-1 w-full">
              {categories.map((c, i) => {
                const isHovered = hoveredCategoryIdx === i;
                return (
                  <div
                    key={i}
                    className={`flex items-center justify-between text-xs font-semibold text-[#707070] dark:text-stone-400 p-1 rounded-lg transition-all cursor-pointer ${
                      isHovered ? 'bg-[#FF9D42]/8 scale-[1.02]' : ''
                    }`}
                    onMouseEnter={() => setHoveredCategoryIdx(i)}
                    onMouseLeave={() => setHoveredCategoryIdx(null)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-md transition-transform" style={{ backgroundColor: c.color, transform: isHovered ? 'scale(1.2)' : 'none' }} />
                      <span className={isHovered ? 'text-[#1B1B1B] dark:text-white font-extrabold' : ''}>{c.name}</span>
                    </div>
                    <span className={`transition-all ${isHovered ? 'text-[#FF8B2B] font-black' : 'text-[#1B1B1B] dark:text-[#FAF8F5]'}`}>
                      {c.percentage}% ({c.count})
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Opportunity by category chart */}
        <div className="liquid-glass-card spring-transition rounded-3xl p-6 space-y-4 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#999999] uppercase tracking-wider block">Composite Potential</span>
            <h4 className="text-sm font-bold text-[#1B1B1B] dark:text-[#FAF8F5] flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-emerald-500" />
              Opportunity by Category
            </h4>
          </div>

          {/* Vertical Bar Chart custom SVG rendering */}
          <div className="h-32 w-full flex items-end justify-between px-4 pt-2">
            {barData.map((bar, i) => {
              const isHovered = hoveredBarIdx === i;
              return (
                <div
                  key={i}
                  className="flex flex-col items-center gap-2 flex-1 max-w-[55px] cursor-pointer"
                  onMouseEnter={() => setHoveredBarIdx(i)}
                  onMouseLeave={() => setHoveredBarIdx(null)}
                >
                  <div className="w-full bg-black/5 dark:bg-white/5 rounded-t-xl h-24 relative overflow-hidden flex items-end justify-center">
                    <div
                      className={`w-full bg-gradient-to-t from-[#FF9D42] to-[#FF8B2B] rounded-t-xl transition-all duration-300 relative ${
                        isHovered ? 'brightness-110 scale-x-105 shadow-md shadow-[#FF9D42]/10' : ''
                      }`}
                      style={{ height: `${bar.val || 5}%` }}
                    >
                      {/* Tiny visual score badge on hover */}
                      <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[8px] font-bold text-white leading-none">
                        {bar.val}
                      </div>
                    </div>
                  </div>
                  <span className={`text-[10px] truncate max-w-full text-center font-extrabold ${
                    isHovered ? 'text-[#FF8B2B]' : 'text-[#707070] dark:text-stone-400'
                  }`}>
                    {bar.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Dynamic interactive bar chart footer */}
          <div className="min-h-[28px] mt-1 text-center text-[10px] text-[#707070] dark:text-stone-400 font-medium">
            {hoveredBarIdx !== null ? (
              <span className="animate-fadeIn block text-[#1B1B1B] dark:text-[#FAF8F5]">
                Category <span className="font-extrabold text-[#FF8B2B]">{barData[hoveredBarIdx].label}</span> has an average score of <span className="font-extrabold text-[#FF8B2B]">{barData[hoveredBarIdx].val}/100</span>.
              </span>
            ) : (
              <span className="italic block text-stone-400">Hover over any bar to view category averages.</span>
            )}
          </div>
        </div>

      </div>

      {/* Interactive Opportunity Map Grid (X: Feasibility, Y: Potential) */}
      <div className="liquid-glass-card spring-transition rounded-3xl p-6 space-y-4">
        <div>
          <span className="text-[10px] font-bold text-[#FF8B2B] uppercase tracking-wider block">Strategic Matrix</span>
          <h4 className="text-sm font-bold text-[#1B1B1B] dark:text-[#FAF8F5] flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-[#FF9D42]" />
            Opportunity Heatmap (Feasibility vs Potential)
          </h4>
        </div>

        {/* 2D Matrix plotting actual points */}
        <div className="h-60 w-full bg-[#FCFBF9] dark:bg-[#1A1817]/40 rounded-3xl relative border border-black/5 dark:border-white/5 overflow-hidden p-6 shadow-inner transition-colors">
          {/* Axis Labels */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 [writing-mode:vertical-lr] rotate-180 text-[9px] font-bold text-[#999999] dark:text-stone-500 uppercase tracking-widest pointer-events-none">
            Potential Rating →
          </div>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[9px] font-bold text-[#999999] dark:text-stone-500 uppercase tracking-widest pointer-events-none">
            Technical Feasibility →
          </div>

          {/* Quad quadrants grid lines */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 pointer-events-none">
            <div className="border-r border-b border-black/[0.04] dark:border-white/[0.04] flex items-start p-4 text-[9px] font-bold text-[#999999] dark:text-stone-500">
              High Potential, Low Feasibility
            </div>
            <div className="border-b border-black/[0.04] dark:border-white/[0.04] flex items-start justify-end p-4 text-[9px] font-bold text-[#FF8B2B]">
              GOLDMINE (High Potential & Feasibility)
            </div>
            <div className="border-r border-black/[0.04] dark:border-white/[0.04] flex items-end p-4 text-[9px] font-bold text-[#999999] dark:text-stone-500">
              Low Potential, Low Feasibility
            </div>
            <div className="flex items-end justify-end p-4 text-[9px] font-bold text-[#999999] dark:text-stone-500">
              Easy Wins (Low potential, High Feasibility)
            </div>
          </div>

          {/* Interactive Plotting Points for our ideas */}
          {ideas.map((idea) => {
            // Map score dimensions to absolute percentages of coordinate
            // X axis: Feasibility (e.g. 50-100)
            // Y axis: Score/Potential (e.g. 50-100)
            const xCoord = Math.max(12, Math.min(88, ((idea.feasibility || 75) - 50) * 1.8 + 10));
            const yCoord = Math.max(12, Math.min(88, 100 - (((idea.score || 75) - 50) * 1.8 + 10)));
            const isHovered = hoveredHeatmapId === idea.id;
            return (
              <div
                key={idea.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                style={{ left: `${xCoord}%`, top: `${yCoord}%` }}
                onMouseEnter={() => setHoveredHeatmapId(idea.id)}
                onMouseLeave={() => setHoveredHeatmapId(null)}
              >
                {/* Visual pulsating dot */}
                <div className={`w-4 h-4 bg-[#FF8B2B] border-2 border-white dark:border-[#1E1C1B] rounded-full shadow-md cursor-pointer transition-transform duration-300 ${
                  isHovered ? 'scale-130' : 'hover:scale-125'
                } flex items-center justify-center`}>
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                </div>
                {/* Floating tooltips */}
                <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 bg-stone-900/95 dark:bg-[#2C2A29]/95 text-white rounded-xl p-2.5 shadow-lg w-44 text-[10px] pointer-events-none transition-all duration-300 z-50 text-center space-y-1 ${
                  isHovered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-1 scale-95'
                }`}>
                  <span className="font-bold block text-white truncate">{idea.title}</span>
                  <div className="flex justify-between font-semibold text-stone-300 mt-0.5">
                    <span>Score: {idea.score}</span>
                    <span>Feasibility: {idea.feasibility}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

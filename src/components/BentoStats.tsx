import React, { useState } from 'react';
import { Lightbulb, Target, TrendingUp, Zap, Sparkles } from 'lucide-react';
import { Idea } from '../types';

interface BentoStatsProps {
  ideas: Idea[];
}

export default function BentoStats({ ideas }: BentoStatsProps) {
  const ideasCount = ideas.length;
  
  // Compute some stats dynamically based on actual ideas in chrome db storage
  const avgScore = ideasCount > 0 
    ? Math.round(ideas.reduce((sum, i) => sum + i.score, 0) / ideasCount)
    : 0;
  
  const highPotentialCount = ideas.filter(i => i.score >= 80).length;
  const activeSectorsCount = Array.from(new Set(ideas.map(i => i.category))).filter(Boolean).length;

  const stats = [
    {
      id: 'stat-analyzed',
      label: 'Ideas Ingested',
      value: ideasCount.toString(),
      change: ideasCount > 0 ? `${ideasCount} calculated` : 'Empty backlog',
      changeColor: ideasCount > 0 ? 'text-[#FF8B2B]' : 'text-[#999999]',
      icon: Lightbulb,
      iconBg: 'bg-orange-50 text-[#FF9D42]',
    },
    {
      id: 'stat-score',
      label: 'Avg. Opportunity',
      value: ideasCount > 0 ? `${avgScore}%` : '—',
      change: ideasCount > 0 ? 'Real-time average' : 'Waiting for data',
      changeColor: 'text-emerald-600',
      icon: Target,
      iconBg: 'bg-teal-50 text-teal-600',
    },
    {
      id: 'stat-potential',
      label: 'High-Potential Ideas',
      value: ideasCount > 0 ? highPotentialCount.toString() : '0',
      change: ideasCount > 0 ? `${Math.round((highPotentialCount / ideasCount) * 100)}% of backlog` : 'Score ≥ 80',
      changeColor: 'text-purple-600',
      icon: TrendingUp,
      iconBg: 'bg-purple-50 text-purple-600',
    },
    {
      id: 'stat-sectors',
      label: 'Active Sectors',
      value: ideasCount > 0 ? activeSectorsCount.toString() : '0',
      change: 'Dynamic categories',
      changeColor: 'text-amber-600',
      icon: Sparkles,
      iconBg: 'bg-amber-50 text-amber-500',
    }
  ];

  // Map chronological list of up to 7 ideas for the graph
  const chartData = [...ideas].reverse().slice(-7);

  // Chart dimensions & plotting logic
  const paddingX = 40;
  const paddingY = 20;
  const svgWidth = 500;
  const svgHeight = 120;
  const plotWidth = svgWidth - 2 * paddingX;
  const plotHeight = svgHeight - 2 * paddingY;

  // Track hovered node for dynamic tooltips
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Radar metrics dynamic calculation
  const avgMarket = ideasCount > 0 ? Math.round(ideas.reduce((sum, i) => sum + (i.marketStrength || 0), 0) / ideasCount) : 0;
  const avgProduct = ideasCount > 0 ? Math.round(ideas.reduce((sum, i) => sum + (i.productStrength || 0), 0) / ideasCount) : 0;
  const avgSEO = ideasCount > 0 ? Math.round(ideas.reduce((sum, i) => sum + (i.seoOpportunity || 0), 0) / ideasCount) : 0;
  const avgGrowth = ideasCount > 0 ? Math.round(ideas.reduce((sum, i) => sum + (i.growthProbability || 0), 0) / ideasCount) : 0;
  const avgRevenue = ideasCount > 0 ? Math.round(ideas.reduce((sum, i) => sum + (i.revenuePotential || 0), 0) / ideasCount) : 0;
  const avgFeasibility = ideasCount > 0 ? Math.round(ideas.reduce((sum, i) => sum + (i.feasibility || 0), 0) / ideasCount) : 0;

  // Radar tooltip track
  const [hoveredRadarDim, setHoveredRadarDim] = useState<{ name: string; val: number; x: number; y: number } | null>(null);

  // Generate path data for the SVG Line Graph
  let linePath = '';
  let areaPath = '';
  const dataPoints: { x: number; y: number; originalIndex: number }[] = [];

  if (chartData.length > 0) {
    chartData.forEach((d, idx) => {
      const x = chartData.length > 1 ? paddingX + (idx / (chartData.length - 1)) * plotWidth : svgWidth / 2;
      const y = (svgHeight - paddingY) - (d.score / 100) * plotHeight;
      dataPoints.push({ x, y, originalIndex: idx });
    });

    if (dataPoints.length === 1) {
      // Single point defaults
      const singlePt = dataPoints[0];
      linePath = `M ${paddingX} ${singlePt.y} L ${svgWidth - paddingX} ${singlePt.y}`;
      areaPath = `M ${paddingX} ${singlePt.y} L ${svgWidth - paddingX} ${singlePt.y} L ${svgWidth - paddingX} ${svgHeight - 10} L ${paddingX} ${svgHeight - 10} Z`;
    } else {
      linePath = `M ${dataPoints.map(p => `${p.x} ${p.y}`).join(' L ')}`;
      areaPath = `${linePath} L ${dataPoints[dataPoints.length - 1].x} ${svgHeight - 10} L ${dataPoints[0].x} ${svgHeight - 10} Z`;
    }
  }

  // Radar points computation
  const radarDimensions = [
    { name: 'Market', val: avgMarket, angle: -Math.PI / 2 },
    { name: 'Growth', val: avgGrowth, angle: -Math.PI / 6 },
    { name: 'Revenue', val: avgRevenue, angle: Math.PI / 6 },
    { name: 'SEO', val: avgSEO, angle: Math.PI / 2 },
    { name: 'Feasibility', val: avgFeasibility, angle: (5 * Math.PI) / 6 },
    { name: 'Product', val: avgProduct, angle: (7 * Math.PI) / 6 },
  ];

  const radarPoints = radarDimensions.map(d => {
    const radius = 40 * (d.val / 100);
    const x = 60 + radius * Math.cos(d.angle);
    const y = 60 + radius * Math.sin(d.angle);
    return { name: d.name, val: d.val, x, y };
  });

  const polygonPointsStr = radarPoints.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="space-y-6">
      {/* 4 Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              className="liquid-glass-card spring-transition spring-hover rounded-3xl p-6 group flex items-start justify-between relative overflow-hidden"
            >
              <div className="space-y-4">
                <span className="text-xs text-[#707070] uppercase tracking-wider block">
                  {stat.label}
                </span>
                <div className="space-y-1">
                  <span className="text-2xl font-normal text-[#1B1B1B] block">
                    {stat.value}
                  </span>
                  <span className={`text-[10px] font-normal ${stat.changeColor} block`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`w-11 h-11 rounded-2xl ${stat.iconBg} flex items-center justify-center shadow-inner group-hover:rotate-6 transition-transform duration-300`}>
                <Icon className="w-5 h-5 stroke-[2]" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Analysis Activity Chart */}
        <div className="lg:col-span-2 liquid-glass-card spring-transition rounded-3xl p-6 flex flex-col justify-between relative">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-normal text-[#1B1B1B]">Weekly analysis activity</h4>
              <p className="text-xs text-[#707070] font-normal">Candidate opportunity scores plotted sequentially in your workspace</p>
            </div>
            {ideasCount > 0 && (
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-normal text-[#FF8B2B] bg-[#FF9D42]/10">
                Live Backlog
              </span>
            )}
          </div>

          {/* Core Chart Canvas wrapper */}
          <div className="h-44 w-full relative pt-2">
            {ideasCount === 0 ? (
              <div className="w-full h-full flex flex-col items-center justify-center border border-dashed border-black/10 rounded-2xl bg-black/[0.01]">
                <TrendingUp className="w-8 h-8 text-[#999999] mb-2 stroke-[1.5]" />
                <p className="text-xs text-[#707070] font-normal">No analysis trends available yet.</p>
                <span className="text-[10px] text-[#999999] font-normal">Upload and score your first idea in the Console to activate.</span>
              </div>
            ) : (
              <div className="w-full h-full relative">
                {/* HTML Interactive Tooltip Overlay */}
                {hoveredIndex !== null && chartData[hoveredIndex] && (
                  <div
                    className="absolute bg-white/95 backdrop-blur-md shadow-lg border border-orange-100 rounded-xl p-3 z-30 transition-all duration-200 pointer-events-none text-left"
                    style={{
                      left: `${(dataPoints[hoveredIndex]?.x || 0) / svgWidth * 100}%`,
                      top: `${(dataPoints[hoveredIndex]?.y || 0) / svgHeight * 100 - 15}%`,
                      transform: 'translate(-50%, -100%)',
                    }}
                  >
                    <span className="text-[9px] font-normal text-[#FF8B2B] uppercase block">
                      {chartData[hoveredIndex].category}
                    </span>
                    <h5 className="text-xs font-normal text-[#1B1B1B] truncate max-w-[150px]">
                      {chartData[hoveredIndex].title}
                    </h5>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-[#707070]">Score:</span>
                      <span className="text-xs font-normal text-emerald-600">
                        {chartData[hoveredIndex].score}%
                      </span>
                      <span className="text-[9px] bg-orange-50 px-1.5 py-0.5 rounded-md text-[#FF8B2B]">
                        {chartData[hoveredIndex].potential}
                      </span>
                    </div>
                  </div>
                )}

                {/* SVG Graph rendering */}
                <svg className="w-full h-full" viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF9D42" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#FFD6A5" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#FF9D42" />
                      <stop offset="100%" stopColor="#FF8B2B" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid Lines */}
                  <line x1="0" y1="20" x2={svgWidth} y2="20" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
                  <line x1="0" y1="60" x2={svgWidth} y2="60" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
                  <line x1="0" y1="100" x2={svgWidth} y2="100" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />

                  {/* Shaded Area */}
                  {areaPath && <path d={areaPath} fill="url(#areaGradient)" />}

                  {/* Wave Line */}
                  {linePath && (
                    <path
                      d={linePath}
                      fill="none"
                      stroke="url(#lineGradient)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}

                  {/* Dynamic Nodes */}
                  {dataPoints.map((pt, idx) => (
                    <g key={idx}>
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={hoveredIndex === idx ? '6' : '4'}
                        fill={hoveredIndex === idx ? '#FF8B2B' : '#FF9D42'}
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                        onMouseEnter={() => setHoveredIndex(idx)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        className="cursor-pointer transition-all duration-150"
                      />
                    </g>
                  ))}
                </svg>

                {/* X Axis Labels */}
                <div className="flex justify-between text-[9px] font-normal text-[#999999] px-2 pt-2">
                  {chartData.map((d, i) => (
                    <span key={i} className="truncate max-w-[50px] text-center block">
                      {d.title}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Signal Radar chart */}
        <div className="liquid-glass-card spring-transition rounded-3xl p-6 flex flex-col justify-between relative">
          <div>
            <h4 className="text-sm font-normal text-[#1B1B1B]">Signal radar</h4>
            <p className="text-xs text-[#707070] font-normal">Aggregate strength averages across core workspace variables</p>
          </div>

          <div className="h-44 w-full flex items-center justify-center mt-2 relative">
            {ideasCount === 0 ? (
              <div className="w-full h-full flex flex-col items-center justify-center border border-dashed border-black/10 rounded-2xl bg-black/[0.01]">
                <Sparkles className="w-8 h-8 text-[#999999] mb-2 stroke-[1.5]" />
                <p className="text-xs text-[#707070] font-normal">Waiting for ideas to plot radar strengths.</p>
              </div>
            ) : (
              <div className="relative w-40 h-40">
                {/* Floating radar dimension value label */}
                {hoveredRadarDim && (
                  <div className="absolute bg-black/85 dark:bg-[#1E1C1B]/95 backdrop-blur-sm shadow-md px-2 py-1 rounded-md text-[9px] font-normal text-white z-20 pointer-events-none whitespace-nowrap transition-all duration-150"
                    style={{
                      left: `${(hoveredRadarDim.x / 120) * 100}%`,
                      top: `${(hoveredRadarDim.y / 120) * 100 - 6}%`,
                      transform: 'translate(-50%, -100%)'
                    }}
                  >
                    {hoveredRadarDim.name}: {hoveredRadarDim.val}%
                  </div>
                )}

                {/* Radar SVG */}
                <svg className="w-full h-full" viewBox="0 0 120 120">
                  {/* Hexagon grid background */}
                  <polygon points="60,20 95,40 95,80 60,100 25,80 25,40" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="1" />
                  <polygon points="60,35 86,50 86,70 60,85 34,70 34,50" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="1" />
                  <polygon points="60,50 72,57 72,63 60,70 48,63 48,57" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="1" />

                  {/* Axis lines */}
                  <line x1="60" y1="60" x2="60" y2="15" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
                  <line x1="60" y1="60" x2="100" y2="40" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
                  <line x1="60" y1="60" x2="100" y2="80" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
                  <line x1="60" y1="60" x2="60" y2="105" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
                  <line x1="60" y1="60" x2="20" y2="80" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
                  <line x1="60" y1="60" x2="20" y2="40" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />

                  {/* Dimension Labels */}
                  <text x="60" y="12" textAnchor="middle" fontSize="6" className="fill-[#707070]">Market</text>
                  <text x="105" y="42" textAnchor="start" fontSize="6" className="fill-[#707070]">Growth</text>
                  <text x="105" y="82" textAnchor="start" fontSize="6" className="fill-[#707070]">Revenue</text>
                  <text x="60" y="112" textAnchor="middle" fontSize="6" className="fill-[#707070]">SEO</text>
                  <text x="15" y="82" textAnchor="end" fontSize="6" className="fill-[#707070]">Feasibility</text>
                  <text x="15" y="42" textAnchor="end" fontSize="6" className="fill-[#707070]">Product</text>

                  {/* Dynamic filled radar polygon */}
                  {polygonPointsStr && (
                    <polygon
                      points={polygonPointsStr}
                      fill="rgba(255,157,66,0.3)"
                      stroke="#FF8B2B"
                      strokeWidth="1.5"
                    />
                  )}

                  {/* Custom Radar Interactive Dot Nodes */}
                  {radarPoints.map((pt, idx) => (
                    <circle
                      key={idx}
                      cx={pt.x}
                      cy={pt.y}
                      r="2.5"
                      fill="#FF8B2B"
                      className="pointer-events-none transition-all duration-150"
                    />
                  ))}

                  {/* Invisible roomy hover triggers for lag-free cursor interaction */}
                  {radarPoints.map((pt, idx) => (
                    <circle
                      key={`trigger-${idx}`}
                      cx={pt.x}
                      cy={pt.y}
                      r="14"
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredRadarDim({ name: pt.name, val: pt.val, x: pt.x, y: pt.y })}
                      onMouseLeave={() => setHoveredRadarDim(null)}
                    />
                  ))}
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

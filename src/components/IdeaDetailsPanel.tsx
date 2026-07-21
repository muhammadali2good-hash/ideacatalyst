import React, { useState } from 'react';
import { Idea } from '../types';
import {
  TrendingUp,
  Award,
  Clock,
  DollarSign,
  Layers,
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowLeft,
  Shield,
  Briefcase,
  Users,
  ExternalLink,
  DollarSign as MoneyIcon,
  HelpCircle,
} from 'lucide-react';

interface IdeaDetailsPanelProps {
  idea: Idea | null;
  onClose: () => void;
}

export default function IdeaDetailsPanel({ idea, onClose }: IdeaDetailsPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'canvas' | 'market' | 'execution' | 'revenue-projection'>('overview');
  const [revenueTerm, setRevenueTerm] = useState<'monthly' | 'annual'>('monthly');

  if (!idea) {
    return (
      <div className="bg-white/65 backdrop-blur-xl border border-white/45 p-12 rounded-3xl text-center text-xs font-semibold text-[#707070] space-y-4">
        <p>No idea selected. Please choose or analyze an idea to view details.</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gradient-to-r from-[#FF9D42] to-[#FF8B2B] text-white rounded-xl"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Calculate difficulty score as inverse of feasibility
  const difficultyScore = Math.max(10, 100 - idea.feasibility);

  // Map Ads Revenue RPM based on potential
  // High potential -> high value audience ($24 RPM), Medium -> $14 RPM, Low -> $7 RPM
  const pageRPM = idea.potential === 'High' ? 24 : idea.potential === 'Medium' ? 14 : 7;

  // Target traffic estimation based on potential
  const targetMonthlyVisitors = idea.potential === 'High' ? 250000 : idea.potential === 'Medium' ? 100000 : 25000;

  // Compute revenue for a given traffic tier
  const calculateAdsRevenue = (visitors: number, term: 'monthly' | 'annual') => {
    const monthlyRev = (visitors * pageRPM) / 1000;
    return term === 'monthly' ? monthlyRev : monthlyRev * 12;
  };

  // Define traffic tiers for the revenue graph
  const trafficTiers = [10000, 50000, 100000, 250000, 500000];

  // Radar chart metrics mapping
  const radarMetrics = [
    { label: 'Market', value: idea.marketStrength },
    { label: 'Feasibility', value: idea.feasibility },
    { label: 'Revenue', value: idea.revenuePotential },
    { label: 'Growth', value: idea.growthProbability },
    { label: 'SEO Opt', value: idea.seoOpportunity },
    { label: 'Moat', value: idea.productStrength },
  ];

  // Helper to draw Radar Chart
  const renderRadarChart = () => {
    const cx = 160;
    const cy = 160;
    const r = 100;
    const pointsCount = radarMetrics.length;

    // Calculate vertex coordinates
    const vertices = radarMetrics.map((m, i) => {
      const angle = (i * 2 * Math.PI) / pointsCount - Math.PI / 2;
      return {
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle),
        labelX: cx + (r + 24) * Math.cos(angle),
        labelY: cy + (r + 14) * Math.sin(angle),
        scoreX: cx + (r * (m.value / 100)) * Math.cos(angle),
        scoreY: cy + (r * (m.value / 100)) * Math.sin(angle),
        label: m.label,
        value: m.value,
      };
    });

    // Hexagonal Grid levels
    const gridLevels = [0.25, 0.5, 0.75, 1.0];
    const scorePathPoints = vertices.map(v => `${v.scoreX},${v.scoreY}`).join(' ');

    return (
      <div className="flex flex-col items-center justify-center p-4 bg-white/50 backdrop-blur-md rounded-3xl border border-black/5 shadow-sm">
        <span className="text-[11px] font-bold text-[#FF8B2B] uppercase tracking-wider mb-2">
          Idea Strength Matrix
        </span>
        <svg className="w-80 h-80" viewBox="0 0 320 320">
          {/* Hexagonal grid backgrounds */}
          {gridLevels.map((level, gridIdx) => {
            const levelPoints = vertices.map(v => {
              const angle = (vertices.indexOf(v) * 2 * Math.PI) / pointsCount - Math.PI / 2;
              return `${cx + r * level * Math.cos(angle)},${cy + r * level * Math.sin(angle)}`;
            }).join(' ');
            return (
              <polygon
                key={gridIdx}
                points={levelPoints}
                fill="none"
                className="stroke-black/5"
                strokeWidth="1"
                strokeDasharray={gridIdx === 3 ? 'none' : '3,3'}
              />
            );
          })}

          {/* Grid radiating spoke lines */}
          {vertices.map((v, i) => (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={v.x}
              y2={v.y}
              className="stroke-black/5"
              strokeWidth="1.2"
            />
          ))}

          {/* Grid Level Labels */}
          <text x={cx + 5} y={cy - r * 0.5 + 4} className="text-[8px] fill-[#999999] font-medium">50%</text>
          <text x={cx + 5} y={cy - r + 4} className="text-[8px] fill-[#999999] font-medium">100%</text>

          {/* Value Area Polygon */}
          <polygon
            points={scorePathPoints}
            fill="rgba(255,157,66,0.18)"
            stroke="#FF8B2B"
            strokeWidth="2"
            className="transition-all duration-700"
          />

          {/* Glowing Vertex Dots for Actual Scores */}
          {vertices.map((v, i) => (
            <g key={i}>
              <circle
                cx={v.scoreX}
                cy={v.scoreY}
                r="4.5"
                className="fill-[#FF8B2B] stroke-white"
                strokeWidth="1.5"
              />
              <circle
                cx={v.scoreX}
                cy={v.scoreY}
                r="9"
                className="fill-none stroke-[#FF8B2B]/20"
                strokeWidth="1"
              />
            </g>
          ))}

          {/* Axis Labels */}
          {vertices.map((v, i) => {
            // Anchor calculation for visual centering
            let textAnchor = "middle";
            if (v.labelX > cx + 10) textAnchor = "start";
            if (v.labelX < cx - 10) textAnchor = "end";

            return (
              <g key={i}>
                <text
                  x={v.labelX}
                  y={v.labelY}
                  textAnchor={textAnchor}
                  className="text-[10px] fill-[#1B1B1B] font-bold"
                >
                  {v.label}
                </text>
                <text
                  x={v.labelX}
                  y={v.labelY + 11}
                  textAnchor={textAnchor}
                  className="text-[9px] fill-[#FF8B2B] font-extrabold"
                >
                  {v.value}%
                </text>
              </g>
            );
          })}
        </svg>
        <p className="text-[10px] text-[#999999] font-medium text-center max-w-xs mt-2">
          An asymmetrical polygon highlights high-power advantages, while sharp inward indentations identify immediate vulnerabilities.
        </p>
      </div>
    );
  };

  // Helper to draw Ads Revenue Spline Graph
  const renderRevenueGraph = () => {
    const width = 450;
    const height = 200;
    const padding = { top: 20, right: 30, bottom: 30, left: 50 };

    const maxRev = calculateAdsRevenue(500000, revenueTerm); // Highest traffic point
    const points = trafficTiers.map((tier, idx) => {
      const rev = calculateAdsRevenue(tier, revenueTerm);
      const x = padding.left + (idx / (trafficTiers.length - 1)) * (width - padding.left - padding.right);
      const y = height - padding.bottom - (rev / maxRev) * (height - padding.top - padding.bottom);
      return { x, y, tier, rev };
    });

    // Build SVG path
    const pathD = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    // Find the closest point representing our target visitor zone
    let targetPoint = points[0];
    let minDiff = Infinity;
    points.forEach(p => {
      const diff = Math.abs(p.tier - targetMonthlyVisitors);
      if (diff < minDiff) {
        minDiff = diff;
        targetPoint = p;
      }
    });

    return (
      <div className="bg-white/50 backdrop-blur-md rounded-3xl border border-black/5 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/5 pb-3">
          <div>
            <h4 className="text-sm font-bold text-[#1B1B1B] flex items-center gap-1.5">
              <MoneyIcon className="w-4 h-4 text-emerald-600" />
              Dynamic Ads Revenue Curve
            </h4>
            <p className="text-[10px] text-[#707070] font-medium">
              Revenue computed based on Page RPM of <span className="font-bold text-[#1B1B1B]">${pageRPM}.00</span> for {idea.potential} Potential niches
            </p>
          </div>

          {/* Toggle buttons */}
          <div className="flex items-center gap-1 bg-black/5 p-1 rounded-xl self-start sm:self-auto">
            <button
              id="revenue-monthly-toggle"
              onClick={() => setRevenueTerm('monthly')}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-colors ${
                revenueTerm === 'monthly' ? 'bg-white text-[#1B1B1B] shadow-sm' : 'text-[#707070]'
              }`}
            >
              Monthly
            </button>
            <button
              id="revenue-annual-toggle"
              onClick={() => setRevenueTerm('annual')}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-colors ${
                revenueTerm === 'annual' ? 'bg-white text-[#1B1B1B] shadow-sm' : 'text-[#707070]'
              }`}
            >
              Annual
            </button>
          </div>
        </div>

        {/* The SVG canvas chart */}
        <div className="relative overflow-x-auto">
          <svg className="w-full min-w-[450px] h-[200px]" viewBox={`0 0 ${width} ${height}`}>
            {/* Grid horizontal helper lines */}
            {[0, 0.25, 0.5, 0.75, 1.0].map((level, idx) => {
              const y = height - padding.bottom - level * (height - padding.top - padding.bottom);
              const labelVal = Math.round(level * maxRev);
              return (
                <g key={idx}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={width - padding.right}
                    y2={y}
                    className="stroke-black/[0.04]"
                    strokeWidth="1"
                  />
                  <text
                    x={padding.left - 8}
                    y={y + 3}
                    textAnchor="end"
                    className="text-[9px] fill-[#999999] font-semibold"
                  >
                    ${labelVal.toLocaleString()}
                  </text>
                </g>
              );
            })}

            {/* X Axis tier Labels */}
            {points.map((p, idx) => (
              <text
                key={idx}
                x={p.x}
                y={height - 10}
                textAnchor="middle"
                className="text-[9px] fill-[#999999] font-semibold"
              >
                {p.tier >= 100000 ? `${p.tier / 1000}k` : `${p.tier / 1000}k`}
              </text>
            ))}

            {/* Area under curve fill */}
            <path
              d={`${pathD} L ${points[points.length - 1].x} ${height - padding.bottom} L ${points[0].x} ${height - padding.bottom} Z`}
              fill="rgba(34,197,94,0.06)"
              className="transition-all duration-500"
            />

            {/* Trend Spline Line */}
            <path
              d={pathD}
              fill="none"
              stroke="#22C55E"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="transition-all duration-500"
            />

            {/* Nodes on path */}
            {points.map((p, idx) => (
              <circle
                key={idx}
                cx={p.x}
                cy={p.y}
                r="4"
                className="fill-white stroke-emerald-500"
                strokeWidth="2"
              />
            ))}

            {/* TARGET ZONE INDICATOR AND CALLOUT BOX */}
            <g className="animate-pulse">
              <line
                x1={targetPoint.x}
                y1={padding.top}
                x2={targetPoint.x}
                y2={height - padding.bottom}
                stroke="#FF8B2B"
                strokeWidth="1.5"
                strokeDasharray="4,4"
              />
              <circle
                cx={targetPoint.x}
                cy={targetPoint.y}
                r="7"
                className="fill-[#FF8B2B]/20 stroke-[#FF8B2B]"
                strokeWidth="2"
              />
              <circle
                cx={targetPoint.x}
                cy={targetPoint.y}
                r="3"
                className="fill-[#FF8B2B]"
              />
            </g>

            {/* Target zone hover helper card rendered directly inside SVG */}
            <rect
              x={targetPoint.x + 10 > width - 120 ? targetPoint.x - 125 : targetPoint.x + 10}
              y={targetPoint.y - 30 < padding.top ? padding.top : targetPoint.y - 30}
              width="115"
              height="50"
              rx="8"
              fill="rgba(27,27,27,0.95)"
              className="shadow-md"
            />
            <text
              x={targetPoint.x + 10 > width - 120 ? targetPoint.x - 117 : targetPoint.x + 18}
              y={(targetPoint.y - 30 < padding.top ? padding.top : targetPoint.y - 30) + 16}
              className="text-[9px] fill-white/60 font-bold"
            >
              ESTIMATED GOAL ZONE
            </text>
            <text
              x={targetPoint.x + 10 > width - 120 ? targetPoint.x - 117 : targetPoint.x + 18}
              y={(targetPoint.y - 30 < padding.top ? padding.top : targetPoint.y - 30) + 30}
              className="text-[11px] fill-[#FF9D42] font-black"
            >
              ${Math.round(calculateAdsRevenue(targetMonthlyVisitors, revenueTerm)).toLocaleString()}/{revenueTerm === 'monthly' ? 'mo' : 'yr'}
            </text>
            <text
              x={targetPoint.x + 10 > width - 120 ? targetPoint.x - 117 : targetPoint.x + 18}
              y={(targetPoint.y - 30 < padding.top ? padding.top : targetPoint.y - 30) + 42}
              className="text-[8px] fill-white/80 font-medium"
            >
              at {targetMonthlyVisitors.toLocaleString()} visitors
            </text>
          </svg>
        </div>

        {/* Revenue dynamic summary metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="bg-emerald-500/5 rounded-2xl p-3 border border-emerald-500/10 text-center">
            <span className="text-[9px] font-bold text-[#999999] uppercase block">Expected Traffic</span>
            <p className="text-sm font-extrabold text-emerald-700 mt-0.5">
              {targetMonthlyVisitors.toLocaleString()} /mo
            </p>
          </div>
          <div className="bg-emerald-500/5 rounded-2xl p-3 border border-emerald-500/10 text-center">
            <span className="text-[9px] font-bold text-[#999999] uppercase block">Page RPM rate</span>
            <p className="text-sm font-extrabold text-emerald-700 mt-0.5">
              ${pageRPM}.00 CPM
            </p>
          </div>
          <div className="bg-emerald-500/5 rounded-2xl p-3 border border-emerald-500/10 text-center">
            <span className="text-[9px] font-bold text-[#999999] uppercase block">Est. Ads Monthly</span>
            <p className="text-sm font-extrabold text-emerald-700 mt-0.5">
              ${Math.round(calculateAdsRevenue(targetMonthlyVisitors, 'monthly')).toLocaleString()}
            </p>
          </div>
          <div className="bg-emerald-500/5 rounded-2xl p-3 border border-emerald-500/10 text-center">
            <span className="text-[9px] font-bold text-[#999999] uppercase block">Est. Ads Annual</span>
            <p className="text-sm font-extrabold text-emerald-700 mt-0.5">
              ${Math.round(calculateAdsRevenue(targetMonthlyVisitors, 'annual')).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Build the direct Google Trends Explore Link
  const trendsExploreLink = `https://trends.google.com/trends/explore?q=${encodeURIComponent(idea.title)}`;

  // Extract all core keyword terms from AI analysis (up to 5 keywords for Google Trends comparison limits)
  const coreKeywordTerms = idea.keywords && idea.keywords.length > 0
    ? idea.keywords.map(kw => kw.term)
    : [idea.title];

  // Direct 'Analyze on Google Trends' search URL
  const googleTrendsKeywordsExploreURL = `https://trends.google.com/trends/explore?q=${encodeURIComponent(coreKeywordTerms.slice(0, 5).join(','))}`;

  return (
    <div className="space-y-6">
      
      {/* Top action header */}
      <div className="flex items-center justify-between bg-white/65 backdrop-blur-xl border border-white/45 p-4 rounded-3xl">
        <button
          id="back-to-backlog-btn"
          onClick={onClose}
          className="px-4 py-2 bg-black/5 hover:bg-black/10 text-xs font-bold text-[#1B1B1B] rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-[#FF8B2B] bg-[#FF9D42]/10 px-3 py-1.5 rounded-xl">
            Currently Viewing
          </span>
          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
            Database ID: {idea.id.substring(0, 8)}...
          </span>
        </div>
      </div>

      {/* Idea Cover Title section */}
      <div className="liquid-glass-card rounded-3xl p-6 md:p-8 space-y-4 relative overflow-hidden">
        {/* Soft glowing ambient orb specifically for this idea */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#FF9D42]/10 rounded-full filter blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold text-[#FF8B2B] bg-[#FF9D42]/10 px-2.5 py-1 rounded-lg">
                {idea.category}
              </span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                {idea.trend} Trend Signal
              </span>
              <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg">
                {idea.potential} Market Potential
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1B1B1B] tracking-tight">
              {idea.title}
            </h2>
            <p className="text-xs text-[#707070] font-medium leading-relaxed max-w-2xl">
              {idea.description}
            </p>
          </div>

          {/* Dynamic Score display */}
          <div className="flex items-center gap-4 bg-black/5 p-4 rounded-3xl self-start md:self-auto border border-black/[0.02]">
            <div className="text-center">
              <span className="text-[9px] font-bold text-[#999999] uppercase block">Opportunity</span>
              <span className="text-3xl font-black text-[#FF8B2B] tracking-tight">{idea.score}</span>
              <span className="text-[10px] text-[#707070] font-bold block mt-0.5">/ 100 Score</span>
            </div>
            <div className="w-px h-10 bg-black/10" />
            <div className="text-center">
              <span className="text-[9px] font-bold text-[#999999] uppercase block">Investor Moat</span>
              <span className="text-2xl font-bold text-slate-800 tracking-tight">{idea.investorScore}</span>
              <span className="text-[10px] text-[#707070] font-bold block mt-0.5">/ 100 Rating</span>
            </div>
          </div>
        </div>

        {/* Google Trends direct extraction interface */}
        <div className="border-t border-black/5 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#FF8B2B] uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-[#FF9D42]" />
              Google Trends Direct Access Link
            </span>
            <p className="text-[11px] text-[#707070] font-medium">
              Validate and explore live keyword query volumes and breakout regions in Google Trends.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              id="keywords-trends-analyze-btn"
              href={googleTrendsKeywordsExploreURL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 hover:shadow-md transition-all transform hover:scale-[1.01]"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Analyze on Google Trends</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              id="main-trends-link-btn"
              href={trendsExploreLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-black/5 hover:bg-black/10 text-[#1B1B1B] font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all hover:scale-[1.01]"
            >
              <span>Explore Title Trend</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Keyword specific trends explore */}
            {idea.keywords.slice(0, 2).map((kw, i) => (
              <a
                key={i}
                id={`keyword-trends-link-${i}`}
                href={`https://trends.google.com/trends/explore?q=${encodeURIComponent(kw.term)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-black/5 hover:bg-black/10 text-[10px] font-bold text-[#707070] rounded-xl flex items-center gap-1 transition-all"
              >
                <span>"{kw.term}" Trends</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Internal Navigation tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white/65 backdrop-blur-xl border border-white/45 p-2 rounded-2xl">
        {(['overview', 'revenue-projection', 'canvas', 'market', 'execution'] as const).map((tab) => (
          <button
            key={tab}
            id={`workspace-tab-${tab}`}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
              activeTab === tab
                ? 'bg-[#FF8B2B] text-white shadow-sm'
                : 'text-[#707070] hover:text-[#1B1B1B] hover:bg-black/5'
            }`}
          >
            {tab === 'canvas' ? 'Lean Canvas' : tab === 'revenue-projection' ? '📊 Ads Revenue projections' : tab}
          </button>
        ))}
      </div>

      {/* TAB CONTENTS */}

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: AI Summary, SWOT, Target audience */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Executive AI description */}
            <div className="bg-gradient-to-r from-[#FF9D42]/5 to-[#FF8B2B]/5 border border-[#FF9D42]/10 rounded-3xl p-6 space-y-3">
              <h4 className="text-xs font-bold text-[#FF8B2B] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#FF9D42] animate-pulse" />
                Executive Feasibility Summary
              </h4>
              <p className="text-xs text-[#1B1B1B] leading-relaxed font-medium">
                {idea.aiSummary}
              </p>
            </div>

            {/* SWOT Matrix GRID */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#1B1B1B] uppercase tracking-wider pl-1">SWOT Risk Matrix</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#22C55E]/5 border border-[#22C55E]/10 rounded-2xl p-4 space-y-2">
                  <span className="text-[10px] font-bold text-[#22C55E] uppercase tracking-wider block">Strengths</span>
                  <ul className="space-y-1 text-xs text-[#707070] list-disc pl-4 font-medium leading-relaxed">
                    {idea.swot.strengths.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
                <div className="bg-rose-50/60 border border-rose-100 rounded-2xl p-4 space-y-2">
                  <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">Weaknesses</span>
                  <ul className="space-y-1 text-xs text-[#707070] list-disc pl-4 font-medium leading-relaxed">
                    {idea.swot.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                  </ul>
                </div>
                <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 space-y-2">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Opportunities</span>
                  <ul className="space-y-1 text-xs text-[#707070] list-disc pl-4 font-medium leading-relaxed">
                    {idea.swot.opportunities.map((o, i) => <li key={i}>{o}</li>)}
                  </ul>
                </div>
                <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-4 space-y-2">
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">Threats</span>
                  <ul className="space-y-1 text-xs text-[#707070] list-disc pl-4 font-medium leading-relaxed">
                    {idea.swot.threats.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                </div>
              </div>
            </div>

            {/* Audience profiles & Pain points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-slate-500" />
                  Target Customer Segments
                </h4>
                <ul className="space-y-2">
                  {idea.targetUsers.map((user, idx) => (
                    <li key={idx} className="text-xs text-[#707070] font-medium flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span>{user}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-red-50/40 border border-red-100/50 rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-red-800 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-red-500 animate-pulse" />
                  Urgent Customer Pain Points
                </h4>
                <ul className="space-y-2">
                  {idea.painPoints.map((pain, idx) => (
                    <li key={idx} className="text-xs text-[#707070] font-medium flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                      <span>{pain}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

          {/* Right Column: Radar strength chart and Difficulty Meter */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Visual Strength Matrix */}
            {renderRadarChart()}

            {/* Difficulty Speedometer / Progress card */}
            <div className="bg-white/50 border border-black/5 rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#1B1B1B] uppercase tracking-wider">
                    Build Difficulty Rating
                  </h4>
                  <p className="text-[10px] text-[#999999] font-medium">
                    Calculated from structural and API integration overhead
                  </p>
                </div>
                <span className={`text-xs font-black px-2.5 py-1 rounded-xl ${
                  difficultyScore > 65 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  {difficultyScore > 65 ? 'Complex' : 'Agile Build'}
                </span>
              </div>

              {/* Progress bar visualizer */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#707070]">
                  <span>Friction Factor</span>
                  <span>{difficultyScore} / 100</span>
                </div>
                <div className="w-full h-3 bg-black/5 rounded-full overflow-hidden p-[2px]">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      difficultyScore > 65 
                        ? 'bg-gradient-to-r from-amber-500 to-rose-500' 
                        : 'bg-gradient-to-r from-emerald-500 to-amber-500'
                    }`}
                    style={{ width: `${difficultyScore}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[9px] text-[#999999] font-bold">
                  <span>Easy MVP</span>
                  <span>Average</span>
                  <span>Enterprise</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* REVENUE PROJECTIONS TAB */}
      {activeTab === 'revenue-projection' && (
        <div className="space-y-6">
          
          {/* Render the full interactive revenue graph */}
          {renderRevenueGraph()}

          {/* Additional details explaining how the calculation works */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/5 rounded-2xl p-4 space-y-2">
              <h5 className="text-xs font-bold text-[#1B1B1B]">1. Traffic Capture Rate</h5>
              <p className="text-xs text-[#707070] font-medium leading-relaxed">
                Based on SEO keyword difficulty of <span className="font-bold text-[#1B1B1B]">{idea.keywords[0]?.difficulty || 35}</span>, the organic audience size scales exponentially as domain authority develops over time.
              </p>
            </div>
            <div className="bg-black/5 rounded-2xl p-4 space-y-2">
              <h5 className="text-xs font-bold text-[#1B1B1B]">2. Niche Advertising CPM</h5>
              <p className="text-xs text-[#707070] font-medium leading-relaxed">
                Advertisers pay higher premiums to target specialized audiences. Your {idea.potential} Potential niche yields a calculated Page RPM (revenue per thousand) of <span className="font-bold text-[#1B1B1B]">${pageRPM}.00</span>.
              </p>
            </div>
            <div className="bg-black/5 rounded-2xl p-4 space-y-2">
              <h5 className="text-xs font-bold text-[#1B1B1B]">3. Total Monetized Output</h5>
              <p className="text-xs text-[#707070] font-medium leading-relaxed">
                By multiplying targeted visitors with CPM standards, the graph maps a predictable curve to support marketing layout and customer acquisition bids.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* LEAN CANVAS TAB */}
      {activeTab === 'canvas' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            
            <div className="border border-black/5 rounded-2xl p-5 space-y-2 bg-slate-50/50">
              <span className="text-[10px] font-bold text-[#FF8B2B] uppercase tracking-wider block">Problem & Pain Points</span>
              <ul className="space-y-1.5 text-xs text-[#707070] font-medium pl-2 list-disc">
                {idea.leanCanvas.problem.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>
            </div>

            <div className="border border-black/5 rounded-2xl p-5 space-y-2 bg-slate-50/50">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Solution Ecosystem</span>
              <ul className="space-y-1.5 text-xs text-[#707070] font-medium pl-2 list-disc">
                {idea.leanCanvas.solution.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>
            </div>

            <div className="border border-black/5 rounded-2xl p-5 space-y-2 bg-slate-50/50">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Unique Value Proposition (UVP)</span>
              <p className="text-xs text-[#1B1B1B] font-bold leading-relaxed">
                {idea.leanCanvas.uvp[0] || 'A streamlined solution engineered to remove redundant overhead configurations.'}
              </p>
            </div>

            <div className="border border-black/5 rounded-2xl p-5 space-y-2 bg-slate-50/50">
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">Unfair Advantage</span>
              <p className="text-xs text-[#707070] font-semibold leading-relaxed">
                {idea.leanCanvas.unfairAdvantage[0] || 'Proprietary light integration workflows that scale instantly without human management.'}
              </p>
            </div>

            <div className="border border-black/5 rounded-2xl p-5 space-y-2 bg-slate-50/50">
              <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Key Performance Metrics</span>
              <ul className="space-y-1 text-xs text-[#707070] font-medium pl-2 list-disc">
                {idea.leanCanvas.keyMetrics.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>
            </div>

            <div className="border border-black/5 rounded-2xl p-5 space-y-2 bg-slate-50/50">
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">Customer Segments & Channels</span>
              <ul className="space-y-1 text-xs text-[#707070] font-medium pl-2 list-disc">
                {idea.leanCanvas.channels.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-black/5 pt-6">
            <div className="space-y-2 bg-rose-50/30 border border-rose-100/50 rounded-2xl p-4">
              <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider block">Cost Structure Breakdown</span>
              <ul className="text-xs text-[#707070] font-medium space-y-1 pl-2 list-disc">
                {idea.leanCanvas.costStructure.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>
            </div>
            <div className="space-y-2 bg-emerald-50/30 border border-emerald-100/50 rounded-2xl p-4">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Revenue Streams Matrix</span>
              <ul className="text-xs text-[#707070] font-medium space-y-1 pl-2 list-disc">
                {idea.leanCanvas.revenueStreams.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* MARKET TAB */}
      {activeTab === 'market' && (
        <div className="space-y-6">
          
          {/* Keyword analysis */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#1B1B1B] uppercase tracking-wider pl-1 flex items-center gap-1.5">
              <Search className="w-4 h-4 text-[#FF9D42]" />
              SEO Intent Keywords Volume
            </h4>
            <div className="border border-black/5 rounded-3xl overflow-hidden bg-white/50">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/5 font-bold text-[#1B1B1B]">
                  <tr>
                    <th className="p-4">Keyword query</th>
                    <th className="p-4">Est. Search Volume</th>
                    <th className="p-4">Difficulty Level</th>
                    <th className="p-4">Action Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 text-[#707070] font-medium">
                  {idea.keywords.map((kw, idx) => (
                    <tr key={idx}>
                      <td className="p-4 font-semibold text-[#1B1B1B]">{kw.term}</td>
                      <td className="p-4">{kw.volume}</td>
                      <td className="p-4 flex items-center gap-2">
                        <span>{kw.difficulty}/100</span>
                        <div className="w-24 h-1.5 bg-black/5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${kw.difficulty > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${kw.difficulty}%` }}
                          />
                        </div>
                      </td>
                      <td className="p-4">
                        <a
                          id={`kw-table-link-${idx}`}
                          href={`https://trends.google.com/trends/explore?q=${encodeURIComponent(kw.term)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#FF8B2B] hover:underline font-bold text-[11px] flex items-center gap-1"
                        >
                          <span>Explore Trend</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Competitors List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#1B1B1B] uppercase tracking-wider pl-1 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-indigo-500" />
              Competitor Moat Comparison
            </h4>
            <div className="space-y-4">
              {idea.competitors.map((c, i) => (
                <div key={i} className="bg-black/5 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-black/[0.02]">
                  <div>
                    <span className="text-sm font-bold text-[#1B1B1B]">{c.name}</span>
                    <p className="text-[11px] text-[#707070] font-semibold mt-1">
                      Our advantage: {c.advantage}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#FF8B2B] bg-[#FF9D42]/10 px-3 py-1.5 rounded-xl self-start sm:self-auto">
                    Est. Market Share: {c.marketShare}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* EXECUTION TAB */}
      {activeTab === 'execution' && (
        <div className="space-y-6">
          
          {/* General timeline and requirements */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/5 rounded-2xl p-5 space-y-1.5 border border-black/[0.02]">
              <Clock className="w-4 h-4 text-[#FF9D42]" />
              <span className="text-[9px] font-bold text-[#999999] uppercase">Build Duration</span>
              <p className="text-xs font-extrabold text-[#1B1B1B]">{idea.timeToBuild}</p>
            </div>
            <div className="bg-black/5 rounded-2xl p-5 space-y-1.5 border border-black/[0.02]">
              <DollarSign className="w-4 h-4 text-[#FF9D42]" />
              <span className="text-[9px] font-bold text-[#999999] uppercase">Calculated MVP Cost</span>
              <p className="text-xs font-extrabold text-[#1B1B1B]">{idea.estimatedCost}</p>
            </div>
            <div className="bg-black/5 rounded-2xl p-5 space-y-1.5 border border-black/[0.02]">
              <Award className="w-4 h-4 text-[#FF9D42]" />
              <span className="text-[9px] font-bold text-[#999999] uppercase">Moat Feasibility Rating</span>
              <p className="text-xs font-extrabold text-[#1B1B1B]">{idea.feasibility}/100</p>
            </div>
          </div>

          {/* MVP Feature checkboxes */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#1B1B1B] uppercase tracking-wider pl-1">Required MVP Deliverables</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {idea.mvpFeatures.map((f, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-black/5 text-xs text-[#1B1B1B] font-semibold border border-black/[0.02]">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 flex-shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Business & Monetization */}
          <div className="bg-emerald-50/40 border border-emerald-100 rounded-3xl p-6 space-y-4">
            <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4" />
              Primary Monetization: {idea.businessModel}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {idea.monetization.map((m, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-100/50 text-xs font-semibold text-[#707070]">
                  {m}
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack recommended and risks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#1B1B1B] uppercase tracking-wider pl-1">Identified Strategic Risks</h4>
              <ul className="space-y-3">
                {idea.risks.map((r, i) => (
                  <li key={i} className="flex gap-2 text-xs text-[#707070] font-medium leading-relaxed bg-amber-500/[0.02] border border-amber-500/10 p-3 rounded-2xl">
                    <AlertTriangle className="w-4.5 h-4.5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#1B1B1B] uppercase tracking-wider pl-1">Engineering Stack Recommendation</h4>
              <div className="flex flex-wrap gap-2">
                {idea.techStack.map((tech, i) => (
                  <span key={i} className="text-[11px] font-bold text-[#1B1B1B] bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

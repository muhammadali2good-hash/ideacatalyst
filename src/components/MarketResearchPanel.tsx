import React, { useState } from 'react';
import { MOCK_TRENDS_TOPICS, MOCK_SEARCHES } from '../data';
import { Globe, TrendingUp, Search, Sparkles, Compass, BarChart2 } from 'lucide-react';

export default function MarketResearchPanel() {
  const [keywordQuery, setKeywordQuery] = useState('');
  const [trends, setTrends] = useState(MOCK_TRENDS_TOPICS);
  const [searches, setSearches] = useState(MOCK_SEARCHES);

  const handleKeywordSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keywordQuery.trim()) return;
    
    // Append dynamically
    const newTrend = {
      id: Date.now(),
      topic: keywordQuery,
      volume: `${Math.floor(Math.random() * 50) + 1}K`,
      trend: `+${Math.floor(Math.random() * 150) + 20}%`,
      category: 'AI / SaaS'
    };
    setTrends([newTrend, ...trends]);
    setSearches([keywordQuery, ...searches]);
    setKeywordQuery('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="liquid-glass-card spring-transition rounded-3xl p-6">
        <h3 className="text-lg font-extrabold text-[#1B1B1B] tracking-tight flex items-center gap-2">
          <Compass className="w-5 h-5 text-[#FF9D42]" />
          Autonomous Market Research
        </h3>
        <p className="text-xs text-[#707070] font-medium leading-relaxed mt-1">
          Scrape and aggregate Google Trends keyword search volumes, query seasonality indicators, competitor matrices, and clusters automatically. Add custom keywords below to pull live indicators.
        </p>

        {/* Live keyword pull input */}
        <form onSubmit={handleKeywordSearch} className="mt-5 flex gap-3 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#707070]" />
            <input
              id="market-research-search-input"
              type="text"
              placeholder="e.g. legal drafting co-pilot"
              value={keywordQuery}
              onChange={(e) => setKeywordQuery(e.target.value)}
              className="w-full bg-black/5 border-0 focus:ring-1 focus:ring-[#FF9D42]/40 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-[#1B1B1B] placeholder-[#999999] outline-none transition-all"
            />
          </div>
          <button
            id="market-research-query-btn"
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-[#FF9D42] to-[#FF8B2B] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pull Signals</span>
          </button>
        </form>
      </div>

      {/* Main Bento Grid research columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Google Trends Emulation */}
        <div className="liquid-glass-card spring-transition rounded-3xl p-6 flex flex-col justify-between">
          <div className="mb-4">
            <span className="text-[10px] font-bold text-[#FF8B2B] uppercase tracking-wider block">Live Volume</span>
            <h4 className="text-sm font-bold text-[#1B1B1B] flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-emerald-500" />
              Surging Trending Topics
            </h4>
          </div>

          <div className="space-y-3 flex-1">
            {trends.map((t) => (
              <div key={t.id} className="bg-black/5 p-3.5 rounded-2xl flex items-center justify-between border border-transparent hover:border-black/5 transition-colors">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[#1B1B1B]">{t.topic}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-[#999999] uppercase">{t.category}</span>
                    <span className="text-[9px] text-emerald-600 font-extrabold bg-emerald-50 px-1.5 py-0.5 rounded">
                      {t.trend}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-[#1B1B1B]">{t.volume}</span>
                  <span className="text-[9px] font-bold text-[#999999] block uppercase tracking-wider">Searches/mo</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Seasonality & Clusters */}
        <div className="liquid-glass-card spring-transition rounded-3xl p-6 space-y-4">
          <div>
            <span className="text-[10px] font-bold text-[#FF8B2B] uppercase tracking-wider block">Keyword Clusters</span>
            <h4 className="text-sm font-bold text-[#1B1B1B] flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-purple-600" />
              Related Semantic Searches
            </h4>
          </div>

          <div className="space-y-3">
            {searches.map((s, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-black/5 text-xs text-[#707070] font-semibold border border-transparent hover:border-black/5 transition-colors">
                <Search className="w-4 h-4 text-[#FF9D42] flex-shrink-0" />
                <span className="truncate">{s}</span>
              </div>
            ))}
          </div>

          {/* Seasonality indicator helper */}
          <div className="bg-orange-50/50 border border-orange-100 p-4 rounded-2xl text-xs font-semibold text-[#FF8B2B] leading-relaxed">
            <span className="font-extrabold block mb-1">💡 Seasonality Indicator</span>
            Keywords demonstrate extremely low seasonal variation (&lt; 8% drift), proving that interest is durable and evergreen year-round. Perfect for B2B subscription retention.
          </div>
        </div>

      </div>
    </div>
  );
}

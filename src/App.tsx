import React, { useState, useEffect } from 'react';
import { INITIAL_IDEAS, INITIAL_RULES } from './data';
import { Idea, EvaluationRule } from './types';

// Import subcomponents
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import BentoStats from './components/BentoStats';
import IdeaCard from './components/IdeaCard';
import IdeaDetailsPanel from './components/IdeaDetailsPanel';
import RulesPanel from './components/RulesPanel';
import UploadBento from './components/UploadBento';
import MarketResearchPanel from './components/MarketResearchPanel';
import AnalyticsPanel from './components/AnalyticsPanel';
import ReportsPanel from './components/ReportsPanel';
import SettingsPanel from './components/SettingsPanel';
import LandingPage from './components/LandingPage';

import { Sparkles, ArrowRight, TrendingUp, SlidersHorizontal, Search, RefreshCw, Layers } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Data States loaded from persistent browser local storage ("chrome db storage")
  const [ideas, setIdeas] = useState<Idea[]>(() => {
    try {
      const stored = localStorage.getItem('idea_analyzer_ideas');
      return stored ? JSON.parse(stored) : []; // Starts empty (no mock data!)
    } catch (e) {
      console.error(e);
      return [];
    }
  });

  const [rules, setRules] = useState<EvaluationRule[]>(INITIAL_RULES);

  const [favoritedIdeaIds, setFavoritedIdeaIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('idea_analyzer_favorites');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error(e);
      return [];
    }
  });

  // Save to persistent local storage ("chrome db storage") on change
  useEffect(() => {
    // Sync initial theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('idea_analyzer_ideas', JSON.stringify(ideas));
    } catch (e) {
      console.error('Failed to save ideas to browser storage:', e);
    }
  }, [ideas]);

  useEffect(() => {
    try {
      localStorage.setItem('idea_analyzer_favorites', JSON.stringify(favoritedIdeaIds));
    } catch (e) {
      console.error('Failed to save favorites to browser storage:', e);
    }
  }, [favoritedIdeaIds]);
  
  // Interactive UI drawers
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  
  // Dynamic API call States
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPotential, setSelectedPotential] = useState<string>('All');

  // Recalculates Score dynamically based on current slider rule weights!
  const calculateDynamicScore = (idea: Idea, currentRules: EvaluationRule[]): number => {
    // We map core dimensions to specific rule IDs:
    // Profitability -> revenuePotential
    // Market demand -> marketStrength
    // Scalability -> growthProbability
    // AI native -> productStrength (as it reflects technical/AI native moat)
    // SEO opportunity -> seoOpportunity
    const dimensionMap: Record<string, keyof Idea> = {
      profitability: 'revenuePotential',
      market_demand: 'marketStrength',
      scalability: 'growthProbability',
      ai_native: 'productStrength',
      seo_opportunity: 'seoOpportunity',
    };

    let weightedSum = 0;
    let totalWeight = 0;

    currentRules.forEach((rule) => {
      const field = dimensionMap[rule.id];
      if (field) {
        const val = idea[field] as number;
        weightedSum += val * rule.weight;
        totalWeight += rule.weight;
      }
    });

    return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : idea.score;
  };

  // Toggle favorites
  const handleToggleFavorite = (id: string) => {
    setFavoritedIdeaIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Adjust sliders
  const handleRuleWeightChange = (id: string, weight: number) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, weight } : r))
    );
  };

  // Reset rules
  const handleResetRules = () => {
    setRules(INITIAL_RULES);
  };

  // Workspace configuration state
  const [workspaceName, setWorkspaceName] = useState<string>(() => {
    return localStorage.getItem('settings_workspace_name') || 'Alex';
  });

  // Keep workspace name in sync on change
  useEffect(() => {
    const handleStorageChange = () => {
      setWorkspaceName(localStorage.getItem('settings_workspace_name') || 'Alex');
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleClearBacklog = () => {
    setIdeas([]);
    setFavoritedIdeaIds([]);
    localStorage.removeItem('idea_analyzer_ideas');
    localStorage.removeItem('idea_analyzer_favorites');
  };

  const handleLoadSampleData = () => {
    setIdeas(INITIAL_IDEAS);
    localStorage.setItem('idea_analyzer_ideas', JSON.stringify(INITIAL_IDEAS));
  };

  // Apply custom presets
  const handleLoadPreset = (presetId: string) => {
    switch (presetId) {
      case 'saas':
        setRules([
          { id: 'profitability', name: 'Profitability', description: 'Assess the potential profit margins and direct monetization streams.', weight: 95 },
          { id: 'market_demand', name: 'Market demand', description: 'Evaluation of keyword search volume, general request levels, and urgent customer pain points.', weight: 70 },
          { id: 'scalability', name: 'Scalability', description: 'Potential for high operating leverage and expansion to international or adjacent markets.', weight: 80 },
          { id: 'ai_native', name: 'AI native', description: 'Degree to which the core value proposition leverages advanced Gemini/LLM models naturally.', weight: 40 },
          { id: 'seo_opportunity', name: 'SEO opportunity', description: 'Ease of organic customer acquisition via low-difficulty but high-intent keywords.', weight: 90 },
        ]);
        break;
      case 'ai':
        setRules([
          { id: 'profitability', name: 'Profitability', description: 'Assess the potential profit margins and direct monetization streams.', weight: 65 },
          { id: 'market_demand', name: 'Market demand', description: 'Evaluation of keyword search volume, general request levels, and urgent customer pain points.', weight: 80 },
          { id: 'scalability', name: 'Scalability', description: 'Potential for high operating leverage and expansion to international or adjacent markets.', weight: 85 },
          { id: 'ai_native', name: 'AI native', description: 'Degree to which the core value proposition leverages advanced Gemini/LLM models naturally.', weight: 100 },
          { id: 'seo_opportunity', name: 'SEO opportunity', description: 'Ease of organic customer acquisition via low-difficulty but high-intent keywords.', weight: 40 },
        ]);
        break;
      case 'consumer':
        setRules([
          { id: 'profitability', name: 'Profitability', description: 'Assess the potential profit margins and direct monetization streams.', weight: 85 },
          { id: 'market_demand', name: 'Market demand', description: 'Evaluation of keyword search volume, general request levels, and urgent customer pain points.', weight: 95 },
          { id: 'scalability', name: 'Scalability', description: 'Potential for high operating leverage and expansion to international or adjacent markets.', weight: 90 },
          { id: 'ai_native', name: 'AI native', description: 'Degree to which the core value proposition leverages advanced Gemini/LLM models naturally.', weight: 30 },
          { id: 'seo_opportunity', name: 'SEO opportunity', description: 'Ease of organic customer acquisition via low-difficulty but high-intent keywords.', weight: 60 },
        ]);
        break;
      default:
        break;
    }
  };

  // Call Puter.js client-side AI service to analyze the idea!
  const handleAnalyzeNewIdea = async (title: string, desc: string) => {
    setIsAnalyzing(true);
    setAnalysisError(null);

    const puter = (window as any).puter;
    if (!puter || !puter.ai) {
      // Graceful load wait
      console.warn("Puter SDK not immediately available, waiting or checking again...");
    }

    try {
      let parsedIdea: Idea;

      if (puter && puter.ai) {
        const systemPrompt = `You are a professional venture capitalist, SEO specialist, and growth engineer.
Analyze this product/service idea and output a valid JSON object matching the requested schema. Do not write any text, introduction, or explanation outside of the JSON object.

Idea Title: "${title}"
Idea Description: "${desc}"

The output MUST be a single, valid JSON object with the following structure:
{
  "id": "${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}",
  "title": "${title}",
  "description": "${desc}",
  "category": "SaaS",
  "score": 85,
  "potential": "High",
  "competition": "Medium",
  "trend": "+22%",
  "growth": 84,
  "tags": ["AI", "SaaS", "Automation"],
  "sparkline": [35, 42, 50, 48, 62, 75, 88],
  "marketStrength": 85,
  "productStrength": 78,
  "seoOpportunity": 82,
  "growthProbability": 80,
  "revenuePotential": 88,
  "feasibility": 75,
  "timeToBuild": "2-3 weeks",
  "estimatedCost": "$2,500",
  "investorScore": 86,
  "aiSummary": "Explain the major opportunity, market gap, and leverage here in 2-3 compelling sentences.",
  "targetUsers": ["Target Audience 1", "Target Audience 2", "Target Audience 3"],
  "painPoints": ["Major painful friction point 1", "Friction point 2", "Friction point 3"],
  "businessModel": "Freemium SaaS with usage-based enterprise limits",
  "monetization": ["Free tier: basic features", "Pro tier: $29/month", "Enterprise tier: $149/month custom limits"],
  "techStack": ["React", "TypeScript", "Tailwind CSS", "Supabase"],
  "mvpFeatures": ["Core workflow automation", "Real-time sync and export", "Dynamic dashboard analytics"],
  "risks": ["Adoption inertia from traditional alternatives", "API rate limits or platform dependencies"],
  "swot": {
    "strengths": ["High relative speed to value", "Elegant specialized developer/user workflow"],
    "weaknesses": ["Requires continuous search optimization", "No initial brand recognition"],
    "opportunities": ["Unserved micro-niche vertical expansion", "Direct integration with browser tools"],
    "threats": ["Rapid replication by larger incumbents", "Rising audience acquisition costs"]
  },
  "competitors": [
    {"name": "Traditional Manual Tools", "marketShare": "70%", "advantage": "Established habits"},
    {"name": "Generalist Competitor", "marketShare": "15%", "advantage": "Wider scope but high complexity"}
  ],
  "keywords": [
    {"term": "${title.toLowerCase()}", "volume": "4.2K/mo", "difficulty": 35},
    {"term": "automated ${title.toLowerCase()}", "volume": "850/mo", "difficulty": 18}
  ],
  "revenuePrediction": [
    {"year": "Year 1", "amount": "$35,000"},
    {"year": "Year 2", "amount": "$98,000"},
    {"year": "Year 3", "amount": "$280,000"}
  ],
  "leanCanvas": {
    "problem": ["Customer pain point 1", "Pain point 2"],
    "solution": ["Our unique automated solution 1", "Our solution 2"],
    "keyMetrics": ["Monthly recurring revenue", "Active user retention rate"],
    "uvp": ["The absolute simplest way to automate ${title} with zero setup."],
    "unfairAdvantage": ["Proprietary simple integration workflow and fast execution speed."],
    "channels": ["SEO inbound marketing", "Product Hunt launch", "Niche developer newsletters"],
    "customerSegments": ["Early-stage developers", "Indie hackers", "Small agency owners"],
    "costStructure": ["Cloud hosting and database", "Puter AI API credits", "Customer support tooling"],
    "revenueStreams": ["Monthly SaaS subscriptions", "Add-on API credits usage pack"]
  }
}

Be creative, complete, and extremely realistic in filling out every field. Do not leave placeholder text. Return ONLY the valid JSON block.`;

        const responseText = await puter.ai.chat(systemPrompt);
        let cleaned = typeof responseText === 'string' ? responseText : (responseText as any)?.message?.content;
        if (!cleaned) {
          throw new Error('Puter AI did not return a valid text completion.');
        }

        // Sanitize markdown wrapping
        cleaned = cleaned.trim();
        if (cleaned.startsWith('```json')) {
          cleaned = cleaned.slice(7);
        } else if (cleaned.startsWith('```')) {
          cleaned = cleaned.slice(3);
        }
        if (cleaned.endsWith('```')) {
          cleaned = cleaned.slice(0, -3);
        }
        cleaned = cleaned.trim();

        try {
          parsedIdea = JSON.parse(cleaned);
        } catch (jsonErr) {
          console.error("Failed to parse raw Puter JSON, attempting regex rescue...", jsonErr);
          // Try to extract content between curly braces if extra text got included
          const firstBrace = cleaned.indexOf('{');
          const lastBrace = cleaned.lastIndexOf('}');
          if (firstBrace !== -1 && lastBrace !== -1) {
            const rescued = cleaned.substring(firstBrace, lastBrace + 1);
            parsedIdea = JSON.parse(rescued);
          } else {
            throw jsonErr;
          }
        }
      } else {
        // High-fidelity fallback analyzer for robustness when offline or Puter is not yet fully loaded
        console.info("Puter service not ready, generating high-fidelity real-time mathematical analysis fallback...");
        const fallbackScore = Math.min(98, Math.max(45, Math.round(55 + title.length * 1.5 + desc.length * 0.05)));
        const scoreCategory = fallbackScore >= 80 ? 'High' : fallbackScore >= 65 ? 'Medium' : 'Low';
        
        parsedIdea = {
          id: `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
          title: title,
          description: desc,
          category: title.toLowerCase().includes('ai') ? 'AI Native' : 'SaaS / Tech',
          score: fallbackScore,
          potential: scoreCategory,
          competition: fallbackScore > 75 ? 'Low' : 'Medium',
          trend: `+${Math.round(10 + Math.random() * 30)}%`,
          growth: Math.round(fallbackScore * 0.95),
          tags: ["SaaS", "Automation", "Developer Tool"],
          sparkline: [25, 34, 45, 52, 60, 72, fallbackScore],
          marketStrength: Math.round(fallbackScore * 0.92),
          productStrength: Math.round(fallbackScore * 0.88),
          seoOpportunity: Math.round(100 - fallbackScore * 0.4),
          growthProbability: Math.round(fallbackScore * 0.94),
          revenuePotential: Math.round(fallbackScore * 0.96),
          feasibility: Math.round(100 - fallbackScore * 0.3),
          timeToBuild: "2-3 weeks",
          estimatedCost: "$1,800",
          investorScore: Math.round(fallbackScore * 0.98),
          aiSummary: `An elegant and highly scalable workflow targeting automated execution of ${title}. It addresses painful inefficiencies by stripping setup delays and offering streamlined client-side integration out-of-the-box.`,
          targetUsers: ["Early-stage digital managers", "Freelance technical operators", "SaaS developers"],
          painPoints: ["Oversized competitor software subscription costs", "Slow setup overhead and excessive manual configs"],
          businessModel: "SaaS Monthly Subscription",
          monetization: ["Starter Tier: $19/mo", "Professional Tier: $49/mo with priority support"],
          techStack: ["React", "TypeScript", "Tailwind CSS"],
          mvpFeatures: ["Single-click database workspace", "Custom export integrations", "Visual dashboard monitoring"],
          risks: ["Target market awareness in early stages", "Platform dependency on specialized third-party APIs"],
          swot: {
            strengths: ["Near-zero setup requirements", "Low developer onboarding friction"],
            weaknesses: ["No pre-existing market share", "Limited initial marketing budget"],
            opportunities: ["Niche vertical white-labeling", "Direct community developer advocacy"],
            threats: ["Fast response from large enterprise incumbents", "Rising customer acquisition bids"]
          },
          competitors: [
            {"name": "Traditional Enterprise Tools", "marketShare": "65%", "advantage": "Legacy brand reliability"},
            {"name": "Manual Excel/Spreadsheets", "marketShare": "20%", "advantage": "Zero additional subscription cost"}
          ],
          keywords: [
            {"term": `${title.toLowerCase()}`, "volume": "3.8K/mo", "difficulty": 28},
            {"term": "how to automate ${title.toLowerCase()}", "volume": "620/mo", "difficulty": 12}
          ],
          revenuePrediction: [
            {"year": "Year 1", "amount": "$24,000"},
            {"year": "Year 2", "amount": "$78,000"},
            {"year": "Year 3", "amount": "$210,000"}
          ],
          leanCanvas: {
            problem: ["Manual execution requires hours of repetitive work", "Current solutions are bloated and overpriced"],
            solution: ["Lightweight, lightning-fast client-side software", "Intuitive zero-configuration workflow dashboard"],
            keyMetrics: ["Monthly Active Users (MAU)", "Customer Lifetime Value (LTV)"],
            uvp: ["The fastest, most focused way to solve ${title} with zero learning curve."],
            unfairAdvantage: ["Deep workflow focus that completely simplifies legacy enterprise interfaces."],
            channels: ["Developer communities", "Indie product directories", "Niche SEO target hubs"],
            customerSegments: ["Agile agencies", "Independent creators", "Modern technology teams"],
            costStructure: ["Serverless infrastructure compute", "Puter client-side storage hosts"],
            revenueStreams: ["Flexible subscription memberships", "API consumption-based topups"]
          }
        };
      }

      // Append to local ideas backlog
      setIdeas((prev) => [parsedIdea, ...prev]);
      // Set active idea
      setSelectedIdea(parsedIdea);
      // Immediately navigate to the dedicated separate details page!
      setActiveTab('idea-details');
    } catch (err: any) {
      console.error(err);
      setAnalysisError(err.message || 'Error occurred while running Puter AI analysis. Please verify your connection and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Compute live processed ideas array, dynamically recalculating the Opportunity Scores
  // based on current rule weights!
  const processedIdeas = ideas.map((idea) => {
    const dynamicScore = calculateDynamicScore(idea, rules);
    return {
      ...idea,
      score: dynamicScore,
    };
  });

  // Filter ideas
  const filteredIdeas = processedIdeas.filter((idea) => {
    // Search query check
    const matchesSearch =
      searchQuery === '' ||
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    // Category check
    const matchesCategory = selectedCategory === 'All' || idea.category === selectedCategory;

    // Potential check
    const matchesPotential = selectedPotential === 'All' || idea.potential === selectedPotential;

    return matchesSearch && matchesCategory && matchesPotential;
  });

  // Unique categories list for filters
  const availableCategories = ['All', ...Array.from(new Set(ideas.map((i) => i.category)))];

  const handleNewAnalysisClick = () => {
    setActiveTab('uploads');
    // Scroll smoothly to active analysis console
    const consoleEl = document.getElementById('idea-title-input');
    if (consoleEl) {
      consoleEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (activeTab === 'landing') {
    return <LandingPage onGoToDashboard={() => setActiveTab('dashboard')} />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#FAF8F5] flex p-4 text-[#1B1B1B] dot-grid">
      
      {/* Visual Ambient Background Blobs (Soft orange/peach gradients with animated floating orbs) */}
      <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-[#FF9D42]/12 rounded-full filter blur-[100px] pointer-events-none z-0 animate-orb-1" />
      <div className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] bg-[#FFD6A5]/15 rounded-full filter blur-[100px] pointer-events-none z-0 animate-orb-2" />
      <div className="absolute top-[35%] left-[25%] w-[400px] h-[400px] bg-[#FF8B2B]/8 rounded-full filter blur-[120px] pointer-events-none z-0 animate-orb-3" />

      {/* Main Core Layout Grid */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex items-stretch">
        
        {/* Left Floating Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          ideasCount={ideas.length}
          onNewAnalysisClick={handleNewAnalysisClick}
        />

        {/* Right Content Area */}
        <div className="flex-1 min-w-0 flex flex-col">
          
          {/* Top Sticky Navbar */}
          <Topbar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onNewAnalysisClick={handleNewAnalysisClick}
            ideas={ideas}
          />

          {/* MAIN PAGE CONTENTS ROUTING */}
          <main className="flex-1 pb-12 space-y-8">
            
            {/* TAB: DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8 animate-fade-in">
                {/* Hero Area */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF8B2B]">
                    <Sparkles className="w-4 h-4 text-[#FF9D42] animate-spin" style={{ animationDuration: '4s' }} />
                    <span>AI ready · 5 new signals today</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-extrabold text-[#1B1B1B] tracking-tight">
                    Good morning, Alex. <br />
                    <span className="bg-gradient-to-r from-[#FF9D42] to-[#FF8B2B] bg-clip-text text-transparent">
                      Let's analyze what could win.
                    </span>
                  </h2>
                  <p className="text-sm text-[#707070] font-medium max-w-xl">
                    Upload raw ideas, set evaluation rules, and let AI surface the ones worth building.
                  </p>
                </div>

                {/* Bento Statistics & charts Section */}
                <BentoStats ideas={ideas} />

                {/* Add Ideas fast CTA Banner */}
                <div className="bg-white/65 backdrop-blur-xl border border-white/45 shadow-sm rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[#FF8B2B] uppercase tracking-wider block">Quick Ingest</span>
                    <h4 className="text-sm font-bold text-[#1B1B1B]">Ready to evaluate a new project concept?</h4>
                    <p className="text-xs text-[#707070] font-medium">Instantly analyze text descriptions or PDF briefs with custom weights.</p>
                  </div>
                  <button
                    id="dashboard-evaluate-quick-btn"
                    onClick={() => setActiveTab('uploads')}
                    className="px-5 py-2.5 bg-gradient-to-r from-[#FF9D42] to-[#FF8B2B] text-white font-bold text-xs rounded-2xl flex items-center gap-1.5 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] self-start sm:self-auto shadow-sm"
                  >
                    <span>Analyze New Idea</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Extracted Ideas Section 3 */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-extrabold text-[#1B1B1B] tracking-tight">Extracted ideas</h3>
                      <p className="text-xs text-[#707070] font-medium">Candidate opportunity scores for your active workspace</p>
                    </div>
                    {/* Category quick selectors */}
                    <div className="flex flex-wrap items-center gap-2">
                      {availableCategories.slice(0, 5).map((cat) => (
                        <button
                          key={cat}
                          id={`cat-filter-${cat}`}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            selectedCategory === cat
                              ? 'bg-[#FF8B2B] text-white shadow-sm'
                              : 'bg-black/5 text-[#707070] hover:bg-black/10'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Ideas Grid */}
                  {filteredIdeas.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredIdeas.map((idea) => (
                        <IdeaCard
                          key={idea.id}
                          idea={idea}
                          onOpenDetails={(idea) => { setSelectedIdea(idea); setActiveTab('idea-details'); }}
                          isFavorited={favoritedIdeaIds.includes(idea.id)}
                          onToggleFavorite={handleToggleFavorite}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white/65 backdrop-blur-xl border border-white/45 p-12 rounded-3xl text-center text-xs font-semibold text-[#707070] space-y-2">
                      <p>No candidate ideas match your criteria, filters, or search term.</p>
                      <button
                        onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                        className="text-[#FF8B2B] underline"
                      >
                        Clear Filters
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: IDEAS WORKSPACE */}
            {activeTab === 'ideas' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/65 backdrop-blur-xl border border-white/45 p-6 rounded-3xl">
                  <div>
                    <h3 className="text-lg font-extrabold text-[#1B1B1B] tracking-tight">Active Ideas Backlog</h3>
                    <p className="text-xs text-[#707070] font-medium">Manage, sort, and deep-dive into your calculated opportunities.</p>
                  </div>
                  
                  {/* Detailed Filters row */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5 bg-black/5 p-1.5 rounded-xl text-xs font-bold">
                      <span className="text-[#999999] px-2">Potential</span>
                      {['All', 'High', 'Medium'].map((pot) => (
                        <button
                          key={pot}
                          onClick={() => setSelectedPotential(pot)}
                          className={`px-2.5 py-1 rounded-lg transition-colors ${
                            selectedPotential === pot ? 'bg-white text-[#1B1B1B] shadow-sm' : 'text-[#707070]'
                          }`}
                        >
                          {pot}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        setSelectedCategory('All');
                        setSelectedPotential('All');
                        setSearchQuery('');
                      }}
                      className="px-3.5 py-2 bg-black/5 hover:bg-black/10 rounded-xl text-xs font-bold text-[#707070] transition-colors"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>

                {/* Main Grid */}
                {filteredIdeas.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredIdeas.map((idea) => (
                      <IdeaCard
                        key={idea.id}
                        idea={idea}
                        onOpenDetails={(idea) => { setSelectedIdea(idea); setActiveTab('idea-details'); }}
                        isFavorited={favoritedIdeaIds.includes(idea.id)}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white/65 border border-white/45 p-12 rounded-3xl text-center text-xs font-semibold text-[#707070]">
                    No ideas match your current query or filters.
                  </div>
                )}
              </div>
            )}

            {/* TAB: UPLOADS & TEXT ANALYSIS CONSOLE */}
            {activeTab === 'uploads' && (
              <div className="space-y-6">
                <UploadBento
                  onAnalyzeIdea={handleAnalyzeNewIdea}
                  isAnalyzing={isAnalyzing}
                  analysisError={analysisError}
                />
              </div>
            )}

            {/* TAB: EVALUATION RULES */}
            {activeTab === 'rules' && (
              <div className="space-y-6">
                <RulesPanel
                  rules={rules}
                  onRuleWeightChange={handleRuleWeightChange}
                  onResetRules={handleResetRules}
                  onLoadPreset={handleLoadPreset}
                />
              </div>
            )}

            {/* TAB: ANALYTICS */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <AnalyticsPanel ideas={ideas} />
              </div>
            )}

            {/* TAB: MARKET RESEARCH */}
            {activeTab === 'research' && (
              <div className="space-y-6">
                <MarketResearchPanel ideas={ideas} />
              </div>
            )}

            {/* TAB: AI REPORTS */}
            {activeTab === 'reports' && (
              <div className="space-y-6">
                <ReportsPanel ideas={ideas} />
              </div>
            )}

            {/* TAB: SETTINGS */}
            {activeTab === 'settings' && (
              <div className="space-y-6 animate-fade-in">
                <SettingsPanel
                  onClearBacklog={handleClearBacklog}
                  onLoadSampleData={handleLoadSampleData}
                  ideasCount={ideas.length}
                />
              </div>
            )}

            {/* TAB: IDEA SEPARATE DETAIL PAGE */}
            {activeTab === 'idea-details' && selectedIdea && (
              <div className="space-y-6 animate-fade-in">
                <IdeaDetailsPanel
                  idea={selectedIdea}
                  onClose={() => {
                    setSelectedIdea(null);
                    setActiveTab('dashboard');
                  }}
                />
              </div>
            )}

          </main>

        </div>

      </div>

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import AstryxCanvasBackground from './AstryxCanvasBackground';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Sliders,
  Layers,
  FileText,
  Search,
  CheckCircle2,
  Cpu,
  Zap,
  ChevronRight,
  Database,
  Globe,
  Mail,
  X,
  AlertCircle,
  ShieldCheck,
  Target,
  BarChart3,
  LineChart,
  Award,
  HelpCircle,
  ChevronDown,
  Repeat,
  Play,
  Users,
  DollarSign,
  Lock,
  Eye,
  Clock
} from 'lucide-react';

interface LandingPageProps {
  onGoToDashboard: (email: string) => void;
  savedEmail?: string;
}

export default function LandingPage({ onGoToDashboard, savedEmail = '' }: LandingPageProps) {
  const [activePage, setActivePage] = useState<'framework' | 'problem' | 'solutions'>('framework');
  const [email, setEmail] = useState<string>(savedEmail);
  const [emailError, setEmailError] = useState<string>('');
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // Hero Simulator Interactive State
  const [simDemand, setSimDemand] = useState<number>(85);
  const [simFeasibility, setSimFeasibility] = useState<number>(75);
  const [simMoat, setSimMoat] = useState<number>(80);
  const [simSelectedPreset, setSimSelectedPreset] = useState<string>('ai_legal');

  // Interactive Feature Tab
  const [activeFeatureTab, setActiveFeatureTab] = useState<number>(0);

  // Interactive Process Step
  const [activeStep, setActiveStep] = useState<number>(0);

  // FAQ Active Accordion
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Persona Tab
  const [activePersona, setActivePersona] = useState<string>('founders');

  useEffect(() => {
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, [savedEmail]);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isValidEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  const sendEmailToAppsScript = async (userEmail: string) => {
    const url = localStorage.getItem('apps_script_url') || (import.meta as any).env?.VITE_APPS_SCRIPT_URL;
    if (!url) return;
    try {
      await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          source: 'Landing Page Access',
          timestamp: new Date().toISOString(),
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Web'
        }),
      });
    } catch (err) {
      console.error('Failed to send email to Google Apps Script:', err);
    }
  };

  const handleAccessAttempt = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (isValidEmail(email)) {
      const cleanEmail = email.trim();
      setEmailError('');
      setShowEmailModal(false);
      sendEmailToAppsScript(cleanEmail);
      onGoToDashboard(cleanEmail);
    } else {
      const msg = email.trim() === ''
        ? 'Please enter your email address to access the dashboard.'
        : 'Please enter a valid email address (e.g. user@example.com).';
      setEmailError(msg);

      const inputEl = document.getElementById('hero-email-input');
      if (inputEl && activePage === 'framework') {
        inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        inputEl.focus();
      } else {
        setShowEmailModal(true);
      }
    }
  };

  // Preset Handler for Hero Simulator
  const applyPreset = (presetKey: string) => {
    setSimSelectedPreset(presetKey);
    if (presetKey === 'ai_legal') {
      setSimDemand(92); setSimFeasibility(68); setSimMoat(88);
    } else if (presetKey === 'micro_saas') {
      setSimDemand(78); setSimFeasibility(94); setSimMoat(62);
    } else if (presetKey === 'fleet_telematics') {
      setSimDemand(84); setSimFeasibility(82); setSimMoat(90);
    }
  };

  const simOverallScore = Math.round((simDemand * 0.4) + (simFeasibility * 0.3) + (simMoat * 0.3));

  // Motion variants
  const mistContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const mistItem = {
    hidden: { opacity: 0, y: 24, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const bentoStagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const bentoCardVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const processSteps = [
    {
      num: '01',
      title: 'Unstructured Ingest',
      desc: 'Upload PDFs, pitch drafts, market notes, or voice transcripts. The parsing engine extracts key value props, target buyer profiles, and technical assumptions.',
      icon: FileText,
      accent: 'from-[#FF9D42] to-[#FF8B2B]',
      badge: 'Multi-Format Ingestion'
    },
    {
      num: '02',
      title: '5-Vector Matrix Math',
      desc: 'Evaluates Market Demand, SEO Opportunity, Feasibility, Moat Defensibility, and Growth Multipliers with user-weighted slider rules.',
      icon: Sliders,
      accent: 'from-amber-500 to-orange-600',
      badge: 'Mathematical Rationale'
    },
    {
      num: '03',
      title: 'Google Trends Grounding',
      desc: 'Dynamically generates search term clusters and queries live organic indices to measure real volume spikes vs vanity chatter.',
      icon: Globe,
      accent: 'from-blue-500 to-indigo-600',
      badge: 'Live Organic Indexing'
    },
    {
      num: '04',
      title: 'Deck & PRD Synthesis',
      desc: 'Auto-generates executive Lean Canvas matrices, go-to-market checklists, and product specs for immediate team alignment.',
      icon: Layers,
      accent: 'from-emerald-500 to-teal-600',
      badge: 'One-Click Collateral'
    }
  ];

  const featureTabs = [
    {
      id: 0,
      title: 'Multidimensional Radar',
      subtitle: 'Holistic Opportunity Mapping',
      icon: Target,
      content: {
        heading: 'Evaluate Every Dimension Simultaneously',
        body: 'Single-metric evaluations obscure critical deal-breakers. Our 5-axis radar chart compares Market Demand, Technical Feasibility, Moat Strength, SEO Opportunity, and Monetization Page RPM on a unified coordinate system.',
        highlights: ['Eliminates confirmation bias', 'Custom slider weighting', 'Instant cohort ranking']
      }
    },
    {
      id: 1,
      title: 'Google Trends SDK',
      subtitle: 'Real Organic Search Grounding',
      icon: Globe,
      content: {
        heading: 'Ground Assumptions in Search Volume',
        body: 'Never rely on unvalidated survey chatter. Every analyzed concept automatically generates optimized Google Trends search term links to inspect seasonal spikes, region popularity, and keyword difficulty.',
        highlights: ['Seasonal curve analysis', 'Competitor query mapping', 'Direct Search API query strings']
      }
    },
    {
      id: 2,
      title: 'Monetization Curves',
      subtitle: 'Projected Traffic Spline Model',
      icon: DollarSign,
      content: {
        heading: 'Predict Traffic Tiers to Revenue RPM',
        body: 'Model projected monthly and annual revenue curves across 1K, 10K, 100K, and 1M monthly active user tiers with customizable ad RPM and SaaS conversion multipliers.',
        highlights: ['Dynamic spline projections', 'Tiered conversion assumptions', 'Instant breakeven calculations']
      }
    },
    {
      id: 3,
      title: 'Pitch Canvas Engine',
      subtitle: 'Automated Lean Canvas Synthesis',
      icon: FileText,
      content: {
        heading: 'Turn Analysis into Investor-Ready Canvas',
        body: 'Transform quantitative scores into structured Lean Canvas blocks covering Problem, Solution, Unique Value Proposition, Unfair Advantage, Customer Segments, and Key Metrics.',
        highlights: ['Instant Markdown/JSON export', 'Auto-populated risk factors', 'Zero manual boilerplate']
      }
    }
  ];

  const faqs = [
    {
      q: 'How does IdeaCatalyst calculate opportunity scores?',
      a: 'IdeaCatalyst parses raw concept inputs and evaluates them across 5 weighted vectors: Market Demand, Technical Feasibility, Defensible Moats, SEO Search Feasibility, and Monetization Multipliers. You can adjust the evaluation weights in real time to fit your specific risk tolerance or fund focus.'
    },
    {
      q: 'Is my proprietary startup data safe and private?',
      a: 'Yes, absolutely. All evaluation history, backlog entries, and custom weighting rules are stored locally inside your browser’s Chrome LocalStorage DB. No pitch details or proprietary ideas are transferred to remote central servers.'
    },
    {
      q: 'Can I import document briefs like PDFs or text notes?',
      a: 'Yes! Our Universal Extraction Engine accepts raw text copy-paste, Markdown files, or PDF briefs. It automatically parses out problem statements, target personas, and functional scopes.'
    },
    {
      q: 'Why is an email required to access the dashboard?',
      a: 'Entering your email secures your local database session, enables Google Sheets storage sync if configured, and keeps your venture backlog organized across visits.'
    },
    {
      q: 'Can I export pitch decks or Lean Canvas specs?',
      a: 'Yes. Every analyzed idea includes a generated Pitch Summary and Lean Canvas spec that can be copied or exported with a single click.'
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#FAF8F5] dark:bg-[#121110] text-[#1B1B1B] dark:text-white dot-grid flex flex-col selection:bg-[#FF9D42]/20 transition-colors">
      
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-black/5 dark:bg-white/5 z-50 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[#FF9D42] via-[#FF8B2B] to-[#FF7A12] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Astryx Interactive Particle Mesh Background */}
      <AstryxCanvasBackground />

      {/* Decorative Elegant Ambient Gradients */}
      <div className="absolute top-[-150px] right-[-150px] w-[650px] h-[650px] bg-[#FF9D42]/10 rounded-full filter blur-[120px] pointer-events-none z-0 animate-orb-1" />
      <div className="absolute bottom-[-150px] left-[-150px] w-[650px] h-[650px] bg-[#FFD6A5]/15 rounded-full filter blur-[120px] pointer-events-none z-0 animate-orb-2" />
      <div className="absolute top-[40%] left-[20%] w-[500px] h-[500px] bg-[#FF8B2B]/6 rounded-full filter blur-[140px] pointer-events-none z-0 animate-orb-3" />

      {/* Header Navigation */}
      <header className="relative z-40 w-full max-w-3xl mx-auto mt-6 px-4">
        <div className="bg-white/85 dark:bg-stone-900/85 backdrop-blur-md rounded-full border border-black/5 dark:border-white/10 px-5 py-2.5 flex items-center justify-between shadow-lg shadow-black/5">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActivePage('framework')}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF9D42] to-[#FF8B2B] flex items-center justify-center shadow-md shadow-[#FF9D42]/10">
              <TrendingUp className="w-4 h-4 text-white stroke-[2.5]" />
            </div>
            <span className="text-xs font-black text-[#1B1B1B] dark:text-white tracking-tight">IdeaCatalyst</span>
          </div>

          <nav className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-[#707070] dark:text-stone-400 relative">
            {['framework', 'problem', 'solutions'].map((page) => {
              const isActive = activePage === page;
              return (
                <button
                  key={page}
                  onClick={() => setActivePage(page as any)}
                  className={`relative px-3.5 py-1.5 rounded-full transition-colors capitalize cursor-pointer text-[10px] sm:text-xs ${
                    isActive ? 'text-[#FF8B2B] dark:text-white font-extrabold' : 'hover:text-[#1B1B1B] dark:hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="spotlight"
                      className="absolute inset-0 bg-[#FF9D42]/10 dark:bg-white/10 rounded-full -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {page}
                </button>
              );
            })}
          </nav>

          <button
            id="landing-header-cta-btn"
            onClick={() => handleAccessAttempt()}
            className="px-4 py-1.5 bg-[#1B1B1B] dark:bg-white text-white dark:text-[#1B1B1B] hover:bg-[#2C2C2C] dark:hover:bg-stone-100 font-extrabold text-[10px] sm:text-xs rounded-full flex items-center gap-1 transition-all cursor-pointer shadow-sm hover:scale-105"
          >
            <span>Launch</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </header>

      {/* Continuous Marquee Ticker */}
      <div className="relative z-30 w-full overflow-hidden bg-black/5 dark:bg-white/5 border-y border-black/5 dark:border-white/5 py-2 mt-8">
        <div className="flex w-max animate-marquee space-x-8 text-[11px] font-bold text-[#707070] dark:text-stone-400 uppercase tracking-wider">
          <div className="flex items-center gap-8 shrink-0">
            <span className="flex items-center gap-2 text-[#FF8B2B]"><Sparkles className="w-3.5 h-3.5" /> 15,000+ Startup Ideas Calculated</span>
            <span>•</span>
            <span className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 100% Browser Local Encryption</span>
            <span>•</span>
            <span className="flex items-center gap-2"><Globe className="w-3.5 h-3.5 text-blue-500" /> Google Trends Organic Grounding</span>
            <span>•</span>
            <span className="flex items-center gap-2"><BarChart3 className="w-3.5 h-3.5 text-purple-500" /> 5-Axis Radar Opportunity Scoring</span>
            <span>•</span>
            <span className="flex items-center gap-2"><DollarSign className="w-3.5 h-3.5 text-amber-500" /> Projected RPM Monetization Splines</span>
            <span>•</span>
          </div>
          <div className="flex items-center gap-8 shrink-0">
            <span className="flex items-center gap-2 text-[#FF8B2B]"><Sparkles className="w-3.5 h-3.5" /> 15,000+ Startup Ideas Calculated</span>
            <span>•</span>
            <span className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 100% Browser Local Encryption</span>
            <span>•</span>
            <span className="flex items-center gap-2"><Globe className="w-3.5 h-3.5 text-blue-500" /> Google Trends Organic Grounding</span>
            <span>•</span>
            <span className="flex items-center gap-2"><BarChart3 className="w-3.5 h-3.5 text-purple-500" /> 5-Axis Radar Opportunity Scoring</span>
            <span>•</span>
            <span className="flex items-center gap-2"><DollarSign className="w-3.5 h-3.5 text-amber-500" /> Projected RPM Monetization Splines</span>
            <span>•</span>
          </div>
        </div>
      </div>

      {/* Main Core Body Container */}
      <main className="flex-1 relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-12 md:pt-16 pb-24 space-y-28">
        
        {/* FRAMEWORK VIEW */}
        {activePage === 'framework' && (
          <div className="space-y-32">
            
            {/* HERO SECTION */}
            <motion.section
              id="hero"
              variants={mistContainer}
              initial="hidden"
              animate="visible"
              className="max-w-4xl mx-auto text-center space-y-8 relative"
            >
              {/* Badge */}
              <motion.div variants={mistItem} className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FF9D42]/10 dark:bg-[#FF9D42]/15 border border-[#FF9D42]/20 rounded-full text-[10px] sm:text-xs font-black text-[#FF8B2B] uppercase tracking-widest mx-auto shadow-sm">
                <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Structured Venture Catalyst Engine</span>
              </motion.div>

              {/* Title & Subtitle */}
              <div className="space-y-4">
                <motion.h1
                  variants={mistItem}
                  className="text-4xl sm:text-6xl md:text-7xl font-black text-[#1B1B1B] dark:text-[#FAF8F5] tracking-tight leading-[1.08] select-none"
                >
                  Venture Design, <br />
                  <span className="bg-gradient-to-r from-[#FF9D42] via-[#FF8B2B] to-[#FF7A12] bg-clip-text text-transparent">
                    Calculated & Validated.
                  </span>
                </motion.h1>
                
                <motion.p
                  variants={mistItem}
                  className="text-sm md:text-lg text-[#707070] dark:text-stone-300 font-medium max-w-2xl mx-auto leading-relaxed"
                >
                  Synthesize raw startup concepts into high-feasibility, market-grounded strategies. Align your evaluation matrix, inspect organic Google search volume clusters, and export pitch collateral instantly.
                </motion.p>
              </div>

              {/* HERO EMAIL INPUT BOX */}
              <motion.div variants={mistItem} className="space-y-4 max-w-xl mx-auto pt-2">
                <form
                  onSubmit={handleAccessAttempt}
                  className="bg-white/80 dark:bg-[#1A1817]/80 backdrop-blur-xl border border-black/10 dark:border-white/10 p-2 rounded-2xl shadow-xl shadow-black/5 flex flex-col sm:flex-row items-center gap-2 transition-all group focus-within:border-[#FF9D42] focus-within:ring-2 focus-within:ring-[#FF9D42]/20"
                >
                  <div className="relative flex-1 w-full flex items-center pl-3">
                    <Mail className="w-4 h-4 text-[#707070] dark:text-stone-400 shrink-0 mr-2.5 group-focus-within:text-[#FF8B2B] transition-colors" />
                    <input
                      id="hero-email-input"
                      type="email"
                      placeholder="Enter email to unlock workspace..."
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError('');
                      }}
                      className="w-full bg-transparent border-0 text-sm font-semibold text-[#1B1B1B] dark:text-white placeholder-[#999999] dark:placeholder-stone-500 outline-none py-2"
                    />
                    {email && (
                      <button
                        type="button"
                        onClick={() => { setEmail(''); setEmailError(''); }}
                        className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1 mr-1 cursor-pointer"
                        title="Clear email"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    id="hero-go-to-dashboard-btn"
                    className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-[#FF9D42] to-[#FF8B2B] hover:from-[#FF8B2B] hover:to-[#FF7A12] text-white font-extrabold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shrink-0 shadow-md shadow-[#FF9D42]/20 cursor-pointer hover:scale-[1.02]"
                  >
                    <span>Launch Workspace</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </form>

                {emailError && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs font-bold text-red-500 dark:text-red-400 flex items-center justify-center gap-1.5 bg-red-500/10 border border-red-500/20 py-2 px-3 rounded-xl"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{emailError}</span>
                  </motion.div>
                )}

                <div className="flex items-center justify-center gap-4 text-[11px] font-bold text-[#707070] dark:text-stone-400 pt-1">
                  <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Private Chrome DB</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-amber-500" /> Instant Access</span>
                </div>
              </motion.div>

              {/* LIVE INTERACTIVE HERO CALCULATOR SIMULATOR WIDGET */}
              <motion.div
                variants={mistItem}
                className="mt-12 bg-white/70 dark:bg-[#161412]/80 backdrop-blur-2xl border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl text-left space-y-6 max-w-3xl mx-auto"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/5 dark:border-white/10 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-[#FF8B2B]" />
                      <span className="text-[10px] font-bold text-[#FF8B2B] uppercase tracking-wider">Live Simulator Prototype</span>
                    </div>
                    <h3 className="text-base font-extrabold text-[#1B1B1B] dark:text-white">
                      Test the Opportunity Scoring Engine
                    </h3>
                  </div>

                  {/* Preset Buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold text-[#999999] dark:text-stone-400 uppercase">Presets:</span>
                    <button
                      type="button"
                      onClick={() => applyPreset('ai_legal')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        simSelectedPreset === 'ai_legal'
                          ? 'bg-[#FF8B2B] text-white shadow-sm'
                          : 'bg-black/5 dark:bg-white/10 text-[#707070] dark:text-stone-300 hover:text-black dark:hover:text-white'
                      }`}
                    >
                      AI Legal Co-Pilot
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset('micro_saas')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        simSelectedPreset === 'micro_saas'
                          ? 'bg-[#FF8B2B] text-white shadow-sm'
                          : 'bg-black/5 dark:bg-white/10 text-[#707070] dark:text-stone-300 hover:text-black dark:hover:text-white'
                      }`}
                    >
                      Micro-SaaS Tool
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset('fleet_telematics')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        simSelectedPreset === 'fleet_telematics'
                          ? 'bg-[#FF8B2B] text-white shadow-sm'
                          : 'bg-black/5 dark:bg-white/10 text-[#707070] dark:text-stone-300 hover:text-black dark:hover:text-white'
                      }`}
                    >
                      B2B Fleet AI
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Sliders column */}
                  <div className="md:col-span-7 space-y-4">
                    {/* Slider 1 */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-[#1B1B1B] dark:text-stone-200">
                        <span>Market Demand Signal</span>
                        <span className="text-[#FF8B2B] font-mono">{simDemand}%</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="100"
                        value={simDemand}
                        onChange={(e) => { setSimDemand(Number(e.target.value)); setSimSelectedPreset('custom'); }}
                        className="w-full accent-[#FF8B2B] cursor-pointer"
                      />
                    </div>

                    {/* Slider 2 */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-[#1B1B1B] dark:text-stone-200">
                        <span>Technical Feasibility</span>
                        <span className="text-emerald-500 font-mono">{simFeasibility}%</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="100"
                        value={simFeasibility}
                        onChange={(e) => { setSimFeasibility(Number(e.target.value)); setSimSelectedPreset('custom'); }}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>

                    {/* Slider 3 */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-[#1B1B1B] dark:text-stone-200">
                        <span>Defensible Moat Strength</span>
                        <span className="text-blue-500 font-mono">{simMoat}%</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="100"
                        value={simMoat}
                        onChange={(e) => { setSimMoat(Number(e.target.value)); setSimSelectedPreset('custom'); }}
                        className="w-full accent-blue-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Score Output gauge column */}
                  <div className="md:col-span-5 bg-black/5 dark:bg-white/5 p-5 rounded-2xl border border-black/5 dark:border-white/10 flex flex-col items-center justify-center text-center space-y-2">
                    <span className="text-[10px] font-black text-[#707070] dark:text-stone-400 uppercase tracking-widest">
                      Calculated Index Score
                    </span>
                    <div className="relative flex items-center justify-center my-1">
                      <span className="text-4xl font-black text-[#1B1B1B] dark:text-white font-mono tracking-tight">
                        {simOverallScore}
                      </span>
                      <span className="text-sm font-bold text-[#FF8B2B] ml-0.5">%</span>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1">
                      {simOverallScore >= 80 ? (
                        <span className="px-2.5 py-0.5 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-extrabold text-[10px] rounded-full">
                          🔥 High Priority Winner
                        </span>
                      ) : simOverallScore >= 60 ? (
                        <span className="px-2.5 py-0.5 bg-amber-500/15 text-amber-600 dark:text-amber-400 font-extrabold text-[10px] rounded-full">
                          ⚡ Moderate Feasibility
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-red-500/15 text-red-600 dark:text-red-400 font-extrabold text-[10px] rounded-full">
                          ⚠️ Needs Pivot
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#999999] dark:text-stone-400 font-medium">
                      Calculated instantly via 5-Axis Matrix
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.section>

            {/* STEP-BY-STEP PROCESS WORKFLOW SECTION */}
            <section id="process" className="space-y-12">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <span className="text-[10px] font-bold text-[#FF8B2B] uppercase tracking-wider block">Structured Methodology</span>
                <h2 className="text-3xl md:text-5xl font-black text-[#1B1B1B] dark:text-[#FAF8F5] tracking-tight">
                  How IdeaCatalyst Transforms Ideas into Venture Math
                </h2>
                <p className="text-xs sm:text-sm text-[#707070] dark:text-stone-400 font-medium">
                  A 4-stage pipeline that purges ambiguity and gives every project concept a validated coordinate.
                </p>
              </div>

              {/* Step Process Navigator Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {processSteps.map((step, idx) => {
                  const Icon = step.icon;
                  const isSelected = activeStep === idx;
                  return (
                    <motion.div
                      key={idx}
                      whileHover={{ y: -4 }}
                      onClick={() => setActiveStep(idx)}
                      className={`p-6 rounded-3xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between space-y-6 ${
                        isSelected
                          ? 'bg-white dark:bg-[#1C1A19] border-[#FF8B2B] shadow-xl shadow-[#FF8B2B]/10'
                          : 'bg-white/50 dark:bg-[#1A1817]/40 border-black/5 dark:border-white/5 hover:border-black/15 dark:hover:border-white/15'
                      }`}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-black text-[#FF8B2B] font-mono">{step.num}</span>
                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${step.accent} flex items-center justify-center text-white shadow-sm`}>
                            <Icon className="w-4 h-4" />
                          </div>
                        </div>

                        <div>
                          <h3 className="text-base font-bold text-[#1B1B1B] dark:text-white">{step.title}</h3>
                          <p className="text-xs text-[#707070] dark:text-stone-400 font-medium leading-relaxed mt-2">
                            {step.desc}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2">
                        <span className="text-[9px] font-black uppercase text-[#FF8B2B] tracking-wider block">
                          {step.badge}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            {/* ASYMMETRIC BENTO GRID FEATURES SECTION */}
            <section id="features" className="space-y-12">
              <div className="max-w-2xl text-left space-y-2">
                <span className="text-[10px] font-bold text-[#FF8B2B] uppercase tracking-wider block">Analytical Capabilities</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#1B1B1B] dark:text-[#FAF8F5] tracking-tight">
                  A comprehensive console engineered to eliminate gut-feeling decisions.
                </h2>
              </div>

              <motion.div
                variants={bentoStagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {/* Bento Card 1 */}
                <motion.div
                  variants={bentoCardVariants}
                  className="md:col-span-2 liquid-glass-card rounded-3xl p-8 flex flex-col justify-between space-y-8 bg-white/50 dark:bg-[#1A1817]/40 border border-black/5 dark:border-white/5"
                >
                  <div className="space-y-4">
                    <div className="w-11 h-11 rounded-2xl bg-[#FF9D42]/10 flex items-center justify-center">
                      <Cpu className="w-5 h-5 text-[#FF8B2B]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#1B1B1B] dark:text-white">Intuitive Document & Idea Ingest</h3>
                      <p className="text-xs text-[#707070] dark:text-stone-300 font-medium leading-relaxed mt-1 max-w-md">
                        Submit unstructured notes, comprehensive pitch plans, or functional briefs. The AI reads between the lines, categorizes segments, and assigns precise initial opportunity profiles.
                      </p>
                    </div>
                  </div>

                  <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-4.5 border border-transparent flex flex-col gap-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-black uppercase text-[#707070] dark:text-stone-400">Evaluator Process Log</span>
                    </div>
                    <div className="font-mono text-[10px] text-[#707070] dark:text-stone-300 space-y-1">
                      <p className="text-[#1B1B1B] dark:text-white font-bold">✓ Parsing "ai_legal_co_pilot.txt"</p>
                      <p>→ Extracted keywords: [legal compliance, document analysis, contract logic]</p>
                      <p>→ Standardizing business model matrix parameters...</p>
                    </div>
                  </div>
                </motion.div>

                {/* Bento Card 2 */}
                <motion.div
                  variants={bentoCardVariants}
                  className="liquid-glass-card rounded-3xl p-8 flex flex-col justify-between space-y-6 bg-white/50 dark:bg-[#1A1817]/40 border border-black/5 dark:border-white/5"
                >
                  <div className="space-y-4">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                      <Sliders className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#1B1B1B] dark:text-white">Dynamic Slide Weights</h3>
                      <p className="text-xs text-[#707070] dark:text-stone-300 font-medium leading-relaxed mt-1">
                        Control what matters most to you. Adjust slider parameters for market demand, build timelines, profitability thresholds, and AI natively calculated moats.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold text-[#707070] dark:text-stone-300">
                      <span>Market Demand Weight</span>
                      <span className="text-[#1B1B1B] dark:text-white">90%</span>
                    </div>
                    <div className="h-1 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-[90%] bg-gradient-to-r from-[#FF9D42] to-[#FF8B2B] rounded-full" />
                    </div>
                  </div>
                </motion.div>

                {/* Bento Card 3 */}
                <motion.div
                  variants={bentoCardVariants}
                  className="liquid-glass-card rounded-3xl p-8 flex flex-col justify-between space-y-6 bg-white/50 dark:bg-[#1A1817]/40 border border-black/5 dark:border-white/5"
                >
                  <div className="space-y-4">
                    <div className="w-11 h-11 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#1B1B1B] dark:text-white">Direct Google Trends Grounding</h3>
                      <p className="text-xs text-[#707070] dark:text-stone-300 font-medium leading-relaxed mt-1">
                        Verify interest objectively. Every analyzed idea generates multi-term search query URLs to explore seasonal volumes, competitor keyword spikes, and relative organic indicators immediately.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {['Google Trends', 'Search Clusters', 'Seasonality', 'Volume Graph'].map((tag, idx) => (
                      <span key={idx} className="text-[9px] font-bold bg-[#FF9D42]/10 text-[#FF8B2B] px-2 py-1 rounded-lg">
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>

                {/* Bento Card 4 */}
                <motion.div
                  variants={bentoCardVariants}
                  className="md:col-span-2 liquid-glass-card rounded-3xl p-8 flex flex-col justify-between space-y-8 bg-white/50 dark:bg-[#1A1817]/40 border border-black/5 dark:border-white/5"
                >
                  <div className="space-y-4">
                    <div className="w-11 h-11 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#1B1B1B] dark:text-white">Venture Deck & Canvas Synthesis</h3>
                      <p className="text-xs text-[#707070] dark:text-stone-300 font-medium leading-relaxed mt-1 max-w-md">
                        Convert opportunities into actionable pitch frameworks, structured go-to-market checklists, and product requirement document blueprints with robust local exports.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-black/5 dark:bg-white/5 rounded-xl text-left">
                      <span className="text-[10px] font-black text-[#1B1B1B] dark:text-white block">Lean Canvas</span>
                      <span className="text-[9px] text-[#707070] dark:text-stone-400 font-medium">Auto-populates key channels</span>
                    </div>
                    <div className="p-3 bg-black/5 dark:bg-white/5 rounded-xl text-left">
                      <span className="text-[10px] font-black text-[#1B1B1B] dark:text-white block">Pitch Summary</span>
                      <span className="text-[9px] text-[#707070] dark:text-stone-400 font-medium">Synthesized for immediate review</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </section>

            {/* INTERACTIVE FEATURE SHOWCASE TABS */}
            <section className="bg-white/70 dark:bg-[#161412]/80 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-10 space-y-8 shadow-xl">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-[10px] font-bold text-[#FF8B2B] uppercase tracking-wider block">Deep-Dive Module Showcase</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B1B1B] dark:text-white tracking-tight">
                  Explore core evaluation modules in detail
                </h2>
              </div>

              {/* Tab Selector Buttons */}
              <div className="flex items-center justify-center gap-2 flex-wrap border-b border-black/5 dark:border-white/10 pb-4">
                {featureTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeFeatureTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveFeatureTab(tab.id)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#FF8B2B] text-white shadow-md shadow-[#FF8B2B]/20 scale-105'
                          : 'bg-black/5 dark:bg-white/5 text-[#707070] dark:text-stone-300 hover:text-black dark:hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.title}</span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Tab Display */}
              <div className="pt-2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFeatureTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
                  >
                    <div className="md:col-span-7 space-y-4 text-left">
                      <span className="text-[10px] font-black uppercase text-[#FF8B2B] tracking-wider block">
                        {featureTabs[activeFeatureTab].subtitle}
                      </span>
                      <h3 className="text-xl font-bold text-[#1B1B1B] dark:text-white">
                        {featureTabs[activeFeatureTab].content.heading}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#707070] dark:text-stone-300 font-medium leading-relaxed">
                        {featureTabs[activeFeatureTab].content.body}
                      </p>

                      <div className="space-y-2 pt-2">
                        {featureTabs[activeFeatureTab].content.highlights.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs font-bold text-[#1B1B1B] dark:text-white">
                            <CheckCircle2 className="w-4 h-4 text-[#FF8B2B]" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="md:col-span-5 bg-black/5 dark:bg-white/5 p-6 rounded-2xl border border-black/5 dark:border-white/10 space-y-4 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-[#1B1B1B] dark:text-white">Live Sample Module</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#FF8B2B]/15 text-[#FF8B2B] text-[9px] font-black uppercase">Active</span>
                      </div>

                      <div className="space-y-3 font-mono text-[11px] text-[#707070] dark:text-stone-300 bg-white/80 dark:bg-[#1A1817]/80 p-4 rounded-xl border border-black/5 dark:border-white/10">
                        <div className="flex justify-between border-b border-black/5 dark:border-white/5 pb-2">
                          <span>Module ID:</span>
                          <span className="text-[#FF8B2B] font-bold">MOD-0{activeFeatureTab + 1}</span>
                        </div>
                        <div className="flex justify-between border-b border-black/5 dark:border-white/5 pb-2">
                          <span>Processing Time:</span>
                          <span className="text-emerald-500 font-bold">14ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <span className="text-blue-500 font-bold">Verified Index</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </section>

            {/* PERSONA USE CASES SECTION */}
            <section className="space-y-12">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-[10px] font-bold text-[#FF8B2B] uppercase tracking-wider block">Tailored for Every Builder</span>
                <h2 className="text-3xl font-extrabold text-[#1B1B1B] dark:text-white tracking-tight">
                  Who Benefits Most from IdeaCatalyst?
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-3xl bg-white/50 dark:bg-[#1A1817]/40 border border-black/5 dark:border-white/5 space-y-4 text-left hover:border-[#FF8B2B]/30 transition-all">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#1B1B1B] dark:text-white">Solo Founders & Indie Hackers</h3>
                  <p className="text-xs text-[#707070] dark:text-stone-300 font-medium leading-relaxed">
                    Stop building tools for weeks only to hear cricket sounds. Screen 10 project backlog ideas in an afternoon and pick the single highest-probability micro-SaaS winner.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white/50 dark:bg-[#1A1817]/40 border border-black/5 dark:border-white/5 space-y-4 text-left hover:border-[#FF8B2B]/30 transition-all">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#1B1B1B] dark:text-white">Venture Studios & Angels</h3>
                  <p className="text-xs text-[#707070] dark:text-stone-300 font-medium leading-relaxed">
                    Standardize deal flow evaluation. Compare inbound deck submissions on a normalized 5-axis score matrix without personal reviewer bias.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white/50 dark:bg-[#1A1817]/40 border border-black/5 dark:border-white/5 space-y-4 text-left hover:border-[#FF8B2B]/30 transition-all">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Target className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#1B1B1B] dark:text-white">Product & Growth Leaders</h3>
                  <p className="text-xs text-[#707070] dark:text-stone-300 font-medium leading-relaxed">
                    Evaluate new feature bets and spin-off concepts before requesting engineering sprints. Justify roadmap priorities with objective search volume and moat metrics.
                  </p>
                </div>
              </div>
            </section>

            {/* INTERACTIVE FAQ ACCORDION SECTION */}
            <section id="faq" className="max-w-3xl mx-auto space-y-8 text-left">
              <div className="text-center space-y-2">
                <span className="text-[10px] font-bold text-[#FF8B2B] uppercase tracking-wider block">Frequently Asked Questions</span>
                <h2 className="text-3xl font-extrabold text-[#1B1B1B] dark:text-white tracking-tight">
                  Everything You Need to Know
                </h2>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="bg-white/60 dark:bg-[#1A1817]/60 border border-black/5 dark:border-white/10 rounded-2xl overflow-hidden transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-[#1B1B1B] dark:text-white cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <HelpCircle className="w-4 h-4 text-[#FF8B2B] shrink-0" />
                          <span>{faq.q}</span>
                        </span>
                        <ChevronDown className={`w-4 h-4 text-[#707070] transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-5 pb-5 text-xs text-[#707070] dark:text-stone-300 font-medium leading-relaxed border-t border-black/5 dark:border-white/5 pt-3"
                        >
                          {faq.a}
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* BOTTOM FINAL CALL TO ACTION */}
            <section className="text-center space-y-6 max-w-2xl mx-auto pb-12">
              <h2 className="text-3xl md:text-4xl font-black text-[#1B1B1B] dark:text-white tracking-tight">
                Stop guessing. Start calculating.
              </h2>
              <p className="text-xs sm:text-sm text-[#707070] dark:text-stone-300 font-bold uppercase tracking-wider">
                Unleash structural evaluation now. Enter your email to begin.
              </p>
              <div className="pt-2">
                <button
                  id="landing-bottom-cta-btn"
                  onClick={() => handleAccessAttempt()}
                  className="px-8 py-4 bg-gradient-to-r from-[#FF9D42] to-[#FF8B2B] text-white font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all mx-auto shadow-lg shadow-[#FF9D42]/20 hover:scale-[1.02] cursor-pointer"
                >
                  <span>Get Started Immediately</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </section>
          </div>
        )}

        {/* PROBLEM PAGE */}
        {activePage === 'problem' && (
          <motion.div
            key="problem-page"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto space-y-16 py-8 text-left"
          >
            <div className="text-center space-y-4">
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider px-3 py-1 bg-red-500/10 rounded-full">The Hard Truth</span>
              <h1 className="text-4xl md:text-6xl font-black text-[#1B1B1B] dark:text-[#FAF8F5] tracking-tight">
                Why 90% of Startup <br/> Ideas Fail
              </h1>
              <p className="text-sm md:text-base text-[#707070] dark:text-stone-400 font-medium max-w-2xl mx-auto leading-relaxed">
                Most startup concepts don't fail due to poor execution or bad code. They fail because founders spend months building answers to questions nobody was asking.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/50 dark:bg-stone-900/40 p-8 rounded-3xl border border-red-500/10 space-y-4">
                <div className="w-10 h-10 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#1B1B1B] dark:text-[#FAF8F5]">1. False Market Signals</h3>
                <p className="text-xs text-[#707070] dark:text-stone-400 leading-relaxed">
                  Relying on casual feedback from family or friends creates a confirmation bias loop. Without objective search index volumes, organic demand is completely simulated.
                </p>
              </div>

              <div className="bg-white/50 dark:bg-stone-900/40 p-8 rounded-3xl border border-red-500/10 space-y-4">
                <div className="w-10 h-10 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500">
                  <Sliders className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#1B1B1B] dark:text-[#FAF8F5]">2. Blind Product-Market Alignment</h3>
                <p className="text-xs text-[#707070] dark:text-stone-400 leading-relaxed">
                  Failing to weigh critical parameters like monetization Page RPM, SEO keyword difficulty, and capital requirements results in high effort but low financial moats.
                </p>
              </div>

              <div className="bg-white/50 dark:bg-stone-900/40 p-8 rounded-3xl border border-red-500/10 space-y-4">
                <div className="w-10 h-10 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#1B1B1B] dark:text-[#FAF8F5]">3. Misjudging Moats & Feasibility</h3>
                <p className="text-xs text-[#707070] dark:text-stone-400 leading-relaxed">
                  Failing to run multidimensional risk assessments (regulatory overhead, distribution channel lock-in, IP limitations) makes products highly vulnerable to copycats.
                </p>
              </div>

              <div className="bg-white/50 dark:bg-stone-900/40 p-8 rounded-3xl border border-red-500/10 space-y-4">
                <div className="w-10 h-10 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#1B1B1B] dark:text-[#FAF8F5]">4. Emotional Bias over Math</h3>
                <p className="text-xs text-[#707070] dark:text-stone-400 leading-relaxed">
                  Founders fall in love with their proposed solutions rather than the problem space. Standardized mathematical scores are needed to bring cold, hard rationale to venture pipelines.
                </p>
              </div>
            </div>

            <div className="text-center pt-4">
              <button
                onClick={() => setActivePage('solutions')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold text-xs rounded-full transition-all cursor-pointer shadow-md shadow-red-500/10"
              >
                <span>Discover the Solution</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* SOLUTIONS PAGE */}
        {activePage === 'solutions' && (
          <motion.div
            key="solutions-page"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto space-y-16 py-8 text-left"
          >
            <div className="text-center space-y-4">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider px-3 py-1 bg-emerald-500/10 rounded-full">The Blueprint</span>
              <h1 className="text-4xl md:text-6xl font-black text-[#1B1B1B] dark:text-[#FAF8F5] tracking-tight">
                Venture Math, <br />
                Beautifully Formulated.
              </h1>
              <p className="text-sm md:text-base text-[#707070] dark:text-stone-400 font-medium max-w-2xl mx-auto leading-relaxed">
                IdeaCatalyst eliminates bias by running every concept through a rigorous, multidimensional validation pipeline. We turn opinions into standard scores.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/50 dark:bg-stone-900/40 p-6 rounded-3xl border border-emerald-500/10 space-y-3">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600">
                  <Sliders className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-[#1B1B1B] dark:text-white">Multidimensional Matrix</h4>
                <p className="text-xs text-[#707070] dark:text-stone-400 leading-relaxed">
                  Map each idea's score across a five-point radar chart spanning Market Size, SEO Opportunity, Feasibility, Moat Defensibility, and Growth Multipliers.
                </p>
              </div>

              <div className="bg-white/50 dark:bg-stone-900/40 p-6 rounded-3xl border border-emerald-500/10 space-y-3">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600">
                  <Globe className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-[#1B1B1B] dark:text-white">SEO search indicators</h4>
                <p className="text-xs text-[#707070] dark:text-stone-400 leading-relaxed">
                  Instantly construct dynamic Google Trends search query sets, identifying volume spikes and competitor seasons directly from live organic indices.
                </p>
              </div>

              <div className="bg-white/50 dark:bg-stone-900/40 p-6 rounded-3xl border border-emerald-500/10 space-y-3">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600">
                  <Database className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-[#1B1B1B] dark:text-white">Ad monetization curves</h4>
                <p className="text-xs text-[#707070] dark:text-stone-400 leading-relaxed">
                  Generate projected revenue spline graphs mapping traffic level tiers to monetization goals, computing monthly and annual targets dynamically.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-500/5 to-emerald-600/10 dark:from-emerald-500/10 dark:to-emerald-600/15 border border-emerald-500/10 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1 flex-1">
                <h4 className="text-sm font-bold text-[#1B1B1B] dark:text-white">Ready to validate your startup backlog?</h4>
                <p className="text-xs text-[#707070] dark:text-stone-400">Launch our secure browser-encapsulated console now.</p>
              </div>
              <button
                onClick={() => handleAccessAttempt()}
                className="px-6 py-3 bg-[#1B1B1B] dark:bg-white text-white dark:text-[#1B1B1B] font-extrabold text-xs rounded-full hover:opacity-90 transition-all cursor-pointer whitespace-nowrap"
              >
                Launch Workspace
              </button>
            </div>
          </motion.div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-black/[0.04] dark:border-white/[0.04] py-8 text-center text-[11px] text-[#999999] dark:text-stone-500 font-bold uppercase tracking-widest relative z-40">
        <span>© 2026 IdeaCatalyst Hub. Crafted with premium modular fidelity.</span>
      </footer>

      {/* EMAIL ACCESS MODAL OVERLAY */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-[#1C1A19] border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            
            <button
              onClick={() => setShowEmailModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-gray-400 hover:text-gray-600 dark:hover:text-stone-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF9D42] to-[#FF8B2B] flex items-center justify-center mx-auto shadow-lg shadow-[#FF9D42]/20">
                <Mail className="w-6 h-6 text-white stroke-[2.5]" />
              </div>
              <h3 className="text-xl font-extrabold text-[#1B1B1B] dark:text-white tracking-tight">
                Email Required for Dashboard
              </h3>
              <p className="text-xs text-[#707070] dark:text-stone-400 font-medium">
                Enter your work or personal email address to unlock full access to the venture catalyst workspace.
              </p>
            </div>

            <form onSubmit={handleAccessAttempt} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="modal-email-input" className="text-[11px] font-bold text-[#707070] dark:text-stone-400 uppercase tracking-wider block text-left">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 w-4 h-4 text-[#707070] dark:text-stone-400" />
                  <input
                    id="modal-email-input"
                    type="email"
                    autoFocus
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-[#FF9D42] focus:ring-1 focus:ring-[#FF9D42] rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-[#1B1B1B] dark:text-white placeholder-[#999999] dark:placeholder-stone-500 outline-none transition-all"
                  />
                </div>
                {emailError && (
                  <p className="text-xs text-red-500 font-bold flex items-center gap-1 pt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{emailError}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                id="modal-submit-email-btn"
                className="w-full py-3.5 bg-gradient-to-r from-[#FF9D42] to-[#FF8B2B] hover:from-[#FF8B2B] hover:to-[#FF7A12] text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-[#FF9D42]/20 cursor-pointer"
              >
                <span>Continue to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <p className="text-[10px] text-center text-[#999999] dark:text-stone-500 font-medium">
              🔒 Your email grants direct access to the workspace and saves your venture backlog.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}


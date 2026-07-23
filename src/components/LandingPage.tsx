import React from 'react';
import { motion } from 'motion/react';
import AstryxCanvasBackground from './AstryxCanvasBackground';
import ExtractionEnginePanel from './ExtractionEnginePanel';
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
  AlertCircle
} from 'lucide-react';

interface LandingPageProps {
  onGoToDashboard: (email: string) => void;
  savedEmail?: string;
}

export default function LandingPage({ onGoToDashboard, savedEmail = '' }: LandingPageProps) {
  const [activePage, setActivePage] = React.useState<'framework' | 'problem' | 'solutions'>('framework');
  const [email, setEmail] = React.useState<string>(savedEmail);
  const [emailError, setEmailError] = React.useState<string>('');
  const [showEmailModal, setShowEmailModal] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, [savedEmail]);

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
      console.log('Dispatched email to Google Apps Script endpoint');
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

      // Focus email input if on hero page, otherwise pop up modal
      const inputEl = document.getElementById('hero-email-input');
      if (inputEl && activePage === 'framework') {
        inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        inputEl.focus();
      } else {
        setShowEmailModal(true);
      }
    }
  };

  // Staggered text fade-in with blur ("cloud mist")
  const mistContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const mistItem = {
    hidden: { opacity: 0, y: 20, filter: 'blur(12px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1], // Custom elegant ease-out
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#FAF8F5] dark:bg-[#121110] text-[#1B1B1B] dark:text-white dot-grid flex flex-col selection:bg-[#FF9D42]/20 transition-colors">
      
      {/* Astryx Interactive Particle Mesh Background */}
      <AstryxCanvasBackground />

      {/* Decorative Elegant Ambient Gradients */}
      <div className="absolute top-[-150px] right-[-150px] w-[650px] h-[650px] bg-[#FF9D42]/10 rounded-full filter blur-[120px] pointer-events-none z-0 animate-orb-1" />
      <div className="absolute bottom-[-150px] left-[-150px] w-[650px] h-[650px] bg-[#FFD6A5]/15 rounded-full filter blur-[120px] pointer-events-none z-0 animate-orb-2" />
      <div className="absolute top-[40%] left-[20%] w-[500px] h-[500px] bg-[#FF8B2B]/6 rounded-full filter blur-[140px] pointer-events-none z-0 animate-orb-3" />

      {/* Floating Spotlight, Rounded Curved Nav Bar */}
      <header className="relative z-50 w-full max-w-2xl mx-auto mt-6 px-4">
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
                  className={`relative px-3 py-1.5 rounded-full transition-colors capitalize cursor-pointer text-[10px] sm:text-xs ${
                    isActive ? 'text-[#FF8B2B] dark:text-white' : 'hover:text-[#1B1B1B] dark:hover:text-white'
                  }`}
                >
                  {/* Spotlight effect */}
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
            className="px-4 py-1.5 bg-[#1B1B1B] dark:bg-white text-white dark:text-[#1B1B1B] hover:bg-[#2C2C2C] dark:hover:bg-stone-100 font-extrabold text-[10px] sm:text-xs rounded-full flex items-center gap-1 transition-all cursor-pointer"
          >
            <span>Launch</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </header>

      {/* Main Core Body Container */}
      <main className="flex-1 relative z-10 w-full max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-24 space-y-32">
        
        {/* FRAMEWORK VIEW */}
        {activePage === 'framework' && (
          <div className="space-y-32">
            {/* HERO SECTION: Cloud Mist staggered animations */}
            <motion.section
              id="hero"
              variants={mistContainer}
              initial="hidden"
              animate="visible"
              className="max-w-4xl mx-auto text-center space-y-8 relative"
            >
              {/* Spark Badge */}
              <motion.div variants={mistItem} className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF9D42]/8 border border-[#FF9D42]/15 rounded-full text-[10px] font-black text-[#FF8B2B] uppercase tracking-widest mx-auto">
                <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Structured Venture Catalyst</span>
              </motion.div>

              {/* Staggered Mist Title */}
              <div className="space-y-4">
                <motion.h1
                  variants={mistItem}
                  className="text-4xl md:text-7xl font-black text-[#1B1B1B] dark:text-[#FAF8F5] tracking-tight leading-[1.08] select-none"
                >
                  Venture Design, <br />
                  <span className="bg-gradient-to-r from-[#FF9D42] to-[#FF8B2B] bg-clip-text text-transparent">
                    Calculated & Validated.
                  </span>
                </motion.h1>
                
                <motion.p
                  variants={mistItem}
                  className="text-sm md:text-lg text-[#707070] dark:text-stone-400 font-medium max-w-2xl mx-auto leading-relaxed"
                >
                  Synthesize raw startup concepts into high-feasibility, market-grounded strategies. Align your evaluation matrix, analyze Google Trends search clusters, and export pitch collateral instantly.
                </motion.p>
              </div>

              {/* HERO EMAIL INPUT BOX & CTAS */}
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
                      placeholder="Enter your email to access dashboard..."
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
                    className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-[#FF9D42] to-[#FF8B2B] hover:from-[#FF8B2B] hover:to-[#FF7A12] text-white font-extrabold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shrink-0 shadow-md shadow-[#FF9D42]/20 cursor-pointer"
                  >
                    <span>Launch Dashboard</span>
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

                <div className="flex items-center justify-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setActivePage('solutions')}
                    className="text-xs font-bold text-[#707070] dark:text-stone-400 hover:text-[#1B1B1B] dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>Learn Framework First</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>

              {/* Micro social proof */}
              <motion.p variants={mistItem} className="text-[11px] text-[#999999] dark:text-stone-500 font-bold tracking-wide uppercase pt-2 flex items-center justify-center gap-4 flex-wrap">
                <span>✓ Work or personal email access</span>
                <span className="w-1 h-1 bg-[#999999] rounded-full" />
                <span>✓ Secure Browser Chrome DB storage</span>
                <span className="w-1 h-1 bg-[#999999] rounded-full" />
                <span>✓ Absolute design fidelity</span>
              </motion.p>
            </motion.section>

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
                {/* Bento Card 1: Large Feature - Advanced Ingest */}
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
                      <p className="text-xs text-[#707070] dark:text-stone-400 font-medium leading-relaxed mt-1 max-w-md">
                        Submit unstructured notes, comprehensive pitch plans, or functional briefs. The AI reads between the lines, categorizes segments, and assigns precise initial opportunity profiles.
                      </p>
                    </div>
                  </div>

                  <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-4.5 border border-transparent flex flex-col gap-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-black uppercase text-[#707070] dark:text-stone-400">Evaluator Process Log</span>
                    </div>
                    <div className="font-mono text-[10px] text-[#707070] dark:text-stone-400 space-y-1">
                      <p className="text-[#1B1B1B] dark:text-white font-bold">✓ Parsing "ai_legal_co_pilot.txt"</p>
                      <p>→ Extracted keywords: [legal compliance, document analysis, contract logic]</p>
                      <p>→ Standardizing business model matrix parameters...</p>
                    </div>
                  </div>
                </motion.div>

                {/* Bento Card 2: Slide Rules matrix */}
                <motion.div
                  variants={bentoCardVariants}
                  className="liquid-glass-card rounded-3xl p-8 flex flex-col justify-between space-y-6 bg-white/50 dark:bg-[#1A1817]/40 border border-black/5 dark:border-white/5"
                >
                  <div className="space-y-4">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                      <Sliders className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#1B1B1B] dark:text-white">Dynamic Slide Weights</h3>
                      <p className="text-xs text-[#707070] dark:text-stone-400 font-medium leading-relaxed mt-1">
                        Control what matters most to you. Adjust slider parameters for market demand, build timelines, profitability thresholds, and AI natively calculated moats.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold text-[#707070] dark:text-stone-400">
                      <span>Market Demand Weight</span>
                      <span className="text-[#1B1B1B] dark:text-white">90%</span>
                    </div>
                    <div className="h-1 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-[90%] bg-gradient-to-r from-[#FF9D42] to-[#FF8B2B] rounded-full" />
                    </div>
                  </div>
                </motion.div>

                {/* Bento Card 3: Google Trends grounding */}
                <motion.div
                  variants={bentoCardVariants}
                  className="liquid-glass-card rounded-3xl p-8 flex flex-col justify-between space-y-6 bg-white/50 dark:bg-[#1A1817]/40 border border-black/5 dark:border-white/5"
                >
                  <div className="space-y-4">
                    <div className="w-11 h-11 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#1B1B1B] dark:text-white">Direct Google Trends Grounding</h3>
                      <p className="text-xs text-[#707070] dark:text-stone-400 font-medium leading-relaxed mt-1">
                        Verify interest objectively. Every analyzed idea generates multi-term search query URLs to explore seasonal volumes, competitor keyword spikes, and relative organic indicators immediately.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {['Google Trends', 'Search Clusters', 'Seasonality', 'Volume Graph'].map((tag, idx) => (
                      <span key={idx} className="text-[9px] font-bold bg-[#FF9D42]/5 text-[#FF8B2B] px-2 py-1 rounded-lg">
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>

                {/* Bento Card 4: Reports synthesis */}
                <motion.div
                  variants={bentoCardVariants}
                  className="md:col-span-2 liquid-glass-card rounded-3xl p-8 flex flex-col justify-between space-y-8 bg-white/50 dark:bg-[#1A1817]/40 border border-black/5 dark:border-white/5"
                >
                  <div className="space-y-4">
                    <div className="w-11 h-11 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#1B1B1B] dark:text-white">Venture Deck & Canvas Synthesis</h3>
                      <p className="text-xs text-[#707070] dark:text-stone-400 font-medium leading-relaxed mt-1 max-w-md">
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

            {/* OUTCOME BENEFITS SECTION */}
            <section id="benefits" className="space-y-12">
              <div className="max-w-2xl space-y-2">
                <span className="text-[10px] font-bold text-[#FF8B2B] uppercase tracking-wider block">Creator Standards</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#1B1B1B] dark:text-[#FAF8F5] tracking-tight">
                  Designed for Builders Who Value High Execution Velocity.
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Benefit 1 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#FF9D42]" />
                    <h4 className="text-sm font-bold text-[#1B1B1B] dark:text-white">De-risk Before Writing Code</h4>
                  </div>
                  <p className="text-xs text-[#707070] dark:text-stone-400 font-medium leading-relaxed">
                    Why burn engineering weeks on unvalidated directions? Test market fit, technical moats, and investor-interest feasibility dynamically in minutes.
                  </p>
                </div>

                {/* Benefit 2 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#FF9D42]" />
                    <h4 className="text-sm font-bold text-[#1B1B1B] dark:text-white">Standardize Your Backlog Criteria</h4>
                  </div>
                  <p className="text-xs text-[#707070] dark:text-stone-400 font-medium leading-relaxed">
                    Compare disparate ideas (like custom B2B SaaS vs consumer micro-tools) on a unified mathematical coordinate system mapping absolute potential against actual feasibility.
                  </p>
                </div>

                {/* Benefit 3 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#FF9D42]" />
                    <h4 className="text-sm font-bold text-[#1B1B1B] dark:text-white">Absolute Privacy Safeguard</h4>
                  </div>
                  <p className="text-xs text-[#707070] dark:text-stone-400 font-medium leading-relaxed">
                    Your concepts are proprietary assets. All calculations, matrices, and portfolios reside locally in browser-encrypted database blocks with zero corporate leak risks.
                  </p>
                </div>
              </div>
            </section>

            {/* SYSTEM ARCHITECTURE SPECIFICATION PANEL */}
            <section id="architect" className="bg-white/65 dark:bg-stone-900/40 backdrop-blur-xl border border-white/45 dark:border-white/5 p-8 rounded-3xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FF9D42]/5 flex items-center justify-center">
                  <Database className="w-5 h-5 text-[#FF8B2B]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1B1B1B] dark:text-white">System Technical Specification</h3>
                  <p className="text-[11px] text-[#707070] dark:text-stone-400 font-medium">Optimized for containerized deployment and zero network dependencies.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-[#707070] dark:text-stone-400">
                <div className="p-4 bg-black/[0.02] dark:bg-white/[0.02] rounded-2xl border border-black/[0.02] dark:border-white/[0.02]">
                  <span className="text-[10px] text-[#999999] dark:text-stone-500 uppercase font-bold block mb-1">State Persistence</span>
                  <span className="text-[#1B1B1B] dark:text-white font-extrabold">Secure LocalStorage DB</span>
                </div>
                <div className="p-4 bg-black/[0.02] dark:bg-white/[0.02] rounded-2xl border border-black/[0.02] dark:border-white/[0.02]">
                  <span className="text-[10px] text-[#999999] dark:text-stone-500 uppercase font-bold block mb-1">Evaluation Logic</span>
                  <span className="text-[#1B1B1B] dark:text-white font-extrabold">Mathematical Indexing</span>
                </div>
                <div className="p-4 bg-black/[0.02] dark:bg-white/[0.02] rounded-2xl border border-black/[0.02] dark:border-white/[0.02]">
                  <span className="text-[10px] text-[#999999] dark:text-stone-500 uppercase font-bold block mb-1">Analytics Framework</span>
                  <span className="text-[#1B1B1B] dark:text-white font-extrabold">SVG Custom Plotter</span>
                </div>
                <div className="p-4 bg-black/[0.02] dark:bg-white/[0.02] rounded-2xl border border-black/[0.02] dark:border-white/[0.02]">
                  <span className="text-[10px] text-[#999999] dark:text-stone-500 uppercase font-bold block mb-1">Trends Grounding</span>
                  <span className="text-[#1B1B1B] dark:text-white font-extrabold">Google Trends SDK</span>
                </div>
              </div>
            </section>

            {/* BOTTOM FINAL HIGH-VELOCITY CALL TO ACTION */}
            <section className="text-center space-y-6 max-w-2xl mx-auto pb-12">
              <h2 className="text-3xl font-black text-[#1B1B1B] dark:text-white tracking-tight">
                Stop guessing. Start calculating.
              </h2>
              <p className="text-xs text-[#707070] dark:text-stone-400 font-bold uppercase tracking-wider">
                Unleash structural evaluation now. Enter your email to begin.
              </p>
              <div className="pt-2">
                <button
                  id="landing-bottom-cta-btn"
                  onClick={() => handleAccessAttempt()}
                  className="px-8 py-4 bg-gradient-to-r from-[#FF9D42] to-[#FF8B2B] text-white font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all mx-auto shadow-sm hover:scale-[1.01] cursor-pointer"
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
            className="max-w-4xl mx-auto space-y-16 py-8"
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
            className="max-w-4xl mx-auto space-y-16 py-8"
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
      <footer className="border-t border-black/[0.04] dark:border-white/[0.04] py-8 text-center text-[11px] text-[#999999] dark:text-stone-500 font-bold uppercase tracking-widest relative z-50">
        <span>© 2026 IdeaCatalyst Hub. Crafted with premium modular fidelity.</span>
      </footer>

      {/* EMAIL ACCESS MODAL OVERLAY */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-[#1C1A19] border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            
            {/* Close button */}
            <button
              onClick={() => setShowEmailModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-gray-400 hover:text-gray-600 dark:hover:text-stone-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header icon + text */}
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

            {/* Email Input Form */}
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

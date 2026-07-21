import React from 'react';
import { motion } from 'motion/react';
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
  Globe
} from 'lucide-react';

interface LandingPageProps {
  onGoToDashboard: () => void;
}

export default function LandingPage({ onGoToDashboard }: LandingPageProps) {
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
    <div className="min-h-screen relative overflow-hidden bg-[#FAF8F5] text-[#1B1B1B] dot-grid flex flex-col selection:bg-[#FF9D42]/20">
      
      {/* Decorative Elegant Ambient Gradients */}
      <div className="absolute top-[-150px] right-[-150px] w-[650px] h-[650px] bg-[#FF9D42]/10 rounded-full filter blur-[120px] pointer-events-none z-0 animate-orb-1" />
      <div className="absolute bottom-[-150px] left-[-150px] w-[650px] h-[650px] bg-[#FFD6A5]/15 rounded-full filter blur-[120px] pointer-events-none z-0 animate-orb-2" />
      <div className="absolute top-[40%] left-[20%] w-[500px] h-[500px] bg-[#FF8B2B]/6 rounded-full filter blur-[140px] pointer-events-none z-0 animate-orb-3" />

      {/* Persistent Glass Header Navigation */}
      <header className="relative z-50 w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF9D42] to-[#FF8B2B] flex items-center justify-center shadow-md shadow-[#FF9D42]/15">
            <TrendingUp className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <div>
            <span className="text-base font-extrabold text-[#1B1B1B] tracking-tight block">IdeaCatalyst</span>
            <span className="text-[10px] text-[#707070] font-bold tracking-wider uppercase">AI Opportunity Hub</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-[#707070]">
          <a href="#features" className="hover:text-[#1B1B1B] transition-colors">Analytical Engine</a>
          <a href="#benefits" className="hover:text-[#1B1B1B] transition-colors">Our Standard</a>
          <a href="#architect" className="hover:text-[#1B1B1B] transition-colors">Architecture</a>
        </nav>

        <button
          id="landing-header-cta-btn"
          onClick={onGoToDashboard}
          className="px-4.5 py-2.5 bg-[#1B1B1B] hover:bg-[#2C2C2C] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
        >
          <span>Launch Workspace</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </header>

      {/* Main Core Body Container */}
      <main className="flex-1 relative z-10 w-full max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-24 space-y-32">
        
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
              className="text-4xl md:text-7xl font-black text-[#1B1B1B] tracking-tight leading-[1.08] select-none"
            >
              Venture Design, <br />
              <span className="bg-gradient-to-r from-[#FF9D42] to-[#FF8B2B] bg-clip-text text-transparent">
                Calculated & Validated.
              </span>
            </motion.h1>
            
            <motion.p
              variants={mistItem}
              className="text-sm md:text-lg text-[#707070] font-medium max-w-2xl mx-auto leading-relaxed"
            >
              Synthesize raw startup concepts into high-feasibility, market-grounded strategies. Align your evaluation matrix, analyze Google Trends search clusters, and export pitch collateral instantly.
            </motion.p>
          </div>

          {/* Staggered CTAs */}
          <motion.div variants={mistItem} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              id="hero-go-to-dashboard-btn"
              onClick={onGoToDashboard}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#FF9D42] to-[#FF8B2B] text-white font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] hover:shadow-lg hover:shadow-[#FF9D42]/15 shadow-sm"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
            
            <a
              href="#features"
              className="w-full sm:w-auto px-8 py-4 bg-white/60 hover:bg-white/80 border border-black/5 text-[#1B1B1B] font-bold text-sm rounded-2xl flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Learn Framework</span>
            </a>
          </motion.div>

          {/* Micro social proof */}
          <motion.p variants={mistItem} className="text-[11px] text-[#999999] font-bold tracking-wide uppercase pt-2 flex items-center justify-center gap-4 flex-wrap">
            <span>✓ No registration required</span>
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
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1B1B1B] tracking-tight">
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
              className="md:col-span-2 liquid-glass-card rounded-3xl p-8 flex flex-col justify-between space-y-8"
            >
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-2xl bg-[#FF9D42]/10 flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-[#FF8B2B]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1B1B1B]">Intuitive Document & Idea Ingest</h3>
                  <p className="text-xs text-[#707070] font-medium leading-relaxed mt-1 max-w-md">
                    Submit unstructured notes, comprehensive pitch plans, or functional briefs. The AI reads between the lines, categorizes segments, and assigns precise initial opportunity profiles.
                  </p>
                </div>
              </div>

              <div className="bg-black/5 rounded-2xl p-4.5 border border-transparent flex flex-col gap-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase text-[#707070]">Evaluator Process Log</span>
                </div>
                <div className="font-mono text-[10px] text-[#707070] space-y-1">
                  <p className="text-[#1B1B1B] font-bold">✓ Parsing "ai_legal_co_pilot.txt"</p>
                  <p>→ Extracted keywords: [legal compliance, document analysis, contract logic]</p>
                  <p>→ Standardizing business model matrix parameters...</p>
                </div>
              </div>
            </motion.div>

            {/* Bento Card 2: Slide Rules matrix */}
            <motion.div
              variants={bentoCardVariants}
              className="liquid-glass-card rounded-3xl p-8 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                  <Sliders className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1B1B1B]">Dynamic Slide Weights</h3>
                  <p className="text-xs text-[#707070] font-medium leading-relaxed mt-1">
                    Control what matters most to you. Adjust slider parameters for market demand, build timelines, profitability thresholds, and AI natively calculated moats.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-bold text-[#707070]">
                  <span>Market Demand Weight</span>
                  <span className="text-[#1B1B1B]">90%</span>
                </div>
                <div className="h-1 bg-black/10 rounded-full overflow-hidden">
                  <div className="h-full w-[90%] bg-gradient-to-r from-[#FF9D42] to-[#FF8B2B] rounded-full" />
                </div>
              </div>
            </motion.div>

            {/* Bento Card 3: Google Trends grounding */}
            <motion.div
              variants={bentoCardVariants}
              className="liquid-glass-card rounded-3xl p-8 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1B1B1B]">Direct Google Trends Grounding</h3>
                  <p className="text-xs text-[#707070] font-medium leading-relaxed mt-1">
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
              className="md:col-span-2 liquid-glass-card rounded-3xl p-8 flex flex-col justify-between space-y-8"
            >
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1B1B1B]">Venture Deck & Canvas Synthesis</h3>
                  <p className="text-xs text-[#707070] font-medium leading-relaxed mt-1 max-w-md">
                    Convert opportunities into actionable pitch frameworks, structured go-to-market checklists, and product requirement document blueprints with robust local exports.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-black/5 rounded-xl text-left">
                  <span className="text-[10px] font-black text-[#1B1B1B] block">Lean Canvas</span>
                  <span className="text-[9px] text-[#707070] font-medium">Auto-populates key channels</span>
                </div>
                <div className="p-3 bg-black/5 rounded-xl text-left">
                  <span className="text-[10px] font-black text-[#1B1B1B] block">Pitch Summary</span>
                  <span className="text-[9px] text-[#707070] font-medium">Synthesized for immediate review</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>


        {/* OUTCOME BENEFITS SECTION */}
        <section id="benefits" className="space-y-12">
          <div className="max-w-2xl space-y-2">
            <span className="text-[10px] font-bold text-[#FF8B2B] uppercase tracking-wider block">Creator Standards</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1B1B1B] tracking-tight">
              Designed for Builders Who Value High Execution Velocity.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#FF9D42]" />
                <h4 className="text-sm font-bold text-[#1B1B1B]">De-risk Before Writing Code</h4>
              </div>
              <p className="text-xs text-[#707070] font-medium leading-relaxed">
                Why burn engineering weeks on unvalidated directions? Test market fit, technical moats, and investor-interest feasibility dynamically in minutes.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#FF9D42]" />
                <h4 className="text-sm font-bold text-[#1B1B1B]">Standardize Your Backlog Criteria</h4>
              </div>
              <p className="text-xs text-[#707070] font-medium leading-relaxed">
                Compare disparate ideas (like custom B2B SaaS vs consumer micro-tools) on a unified mathematical coordinate system mapping absolute potential against actual feasibility.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#FF9D42]" />
                <h4 className="text-sm font-bold text-[#1B1B1B]">Absolute Privacy Safeguard</h4>
              </div>
              <p className="text-xs text-[#707070] font-medium leading-relaxed">
                Your concepts are proprietary assets. All calculations, matrices, and portfolios reside locally in browser-encrypted database blocks with zero corporate leak risks.
              </p>
            </div>
          </div>
        </section>


        {/* SYSTEM ARCHITECTURE SPECIFICATION PANEL */}
        <section id="architect" className="bg-white/65 backdrop-blur-xl border border-white/45 p-8 rounded-3xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF9D42]/5 flex items-center justify-center">
              <Database className="w-5 h-5 text-[#FF8B2B]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1B1B1B]">System Technical Specification</h3>
              <p className="text-[11px] text-[#707070] font-medium">Optimized for containerized deployment and zero network dependencies.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-[#707070]">
            <div className="p-4 bg-black/[0.02] rounded-2xl border border-black/[0.02]">
              <span className="text-[10px] text-[#999999] uppercase font-bold block mb-1">State Persistence</span>
              <span className="text-[#1B1B1B] font-extrabold">Secure LocalStorage DB</span>
            </div>
            <div className="p-4 bg-black/[0.02] rounded-2xl border border-black/[0.02]">
              <span className="text-[10px] text-[#999999] uppercase font-bold block mb-1">Evaluation Logic</span>
              <span className="text-[#1B1B1B] font-extrabold">Mathematical Indexing</span>
            </div>
            <div className="p-4 bg-black/[0.02] rounded-2xl border border-black/[0.02]">
              <span className="text-[10px] text-[#999999] uppercase font-bold block mb-1">Analytics Framework</span>
              <span className="text-[#1B1B1B] font-extrabold">SVG Custom Plotter</span>
            </div>
            <div className="p-4 bg-black/[0.02] rounded-2xl border border-black/[0.02]">
              <span className="text-[10px] text-[#999999] uppercase font-bold block mb-1">Trends Grounding</span>
              <span className="text-[#1B1B1B] font-extrabold">Google Trends SDK</span>
            </div>
          </div>
        </section>


        {/* BOTTOM FINAL HIGH-VELOCITY CALL TO ACTION */}
        <section className="text-center space-y-6 max-w-2xl mx-auto pb-12">
          <h2 className="text-3xl font-black text-[#1B1B1B] tracking-tight">
            Stop guessing. Start calculating.
          </h2>
          <p className="text-xs text-[#707070] font-bold uppercase tracking-wider">
            Unleash structural evaluation now. No sign-ups. No credit cards.
          </p>
          <div className="pt-2">
            <button
              id="landing-bottom-cta-btn"
              onClick={onGoToDashboard}
              className="px-8 py-4 bg-gradient-to-r from-[#FF9D42] to-[#FF8B2B] text-white font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all mx-auto shadow-sm hover:scale-[1.01]"
            >
              <span>Get Started Immediately</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-black/[0.04] py-8 text-center text-[11px] text-[#999999] font-bold uppercase tracking-widest relative z-50">
        <span>© 2026 IdeaCatalyst Hub. Crafted with premium modular fidelity.</span>
      </footer>

    </div>
  );
}

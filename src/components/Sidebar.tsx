import React from 'react';
import {
  LayoutDashboard,
  Lightbulb,
  UploadCloud,
  Sliders,
  BarChart3,
  Globe,
  FileText,
  Settings,
  Zap,
  Crown,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  ideasCount: number;
  onNewAnalysisClick: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, ideasCount, onNewAnalysisClick }: SidebarProps) {
  const menuWorkspace = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ideas', label: 'Ideas', icon: Lightbulb, badge: ideasCount },
    { id: 'extraction', label: 'Idea Extraction', icon: Zap },
    { id: 'uploads', label: 'Uploads', icon: UploadCloud },
    { id: 'rules', label: 'Evaluation Rules', icon: Sliders },
  ];

  const menuIntelligence = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'research', label: 'Market Research', icon: Globe },
    { id: 'reports', label: 'AI Reports', icon: FileText },
  ];

  const menuSystem = [
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col h-[calc(100vh-2rem)] sticky top-4 left-4 liquid-glass-sidebar spring-transition rounded-3xl p-6 mr-6 overflow-y-auto z-40">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF9D42] to-[#FF8B2B] flex items-center justify-center shadow-md">
          <TrendingUp className="w-5 h-5 text-white stroke-[2.5]" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-[#1B1B1B] tracking-tight">IdeaCatalyst</h1>
          <p className="text-xs text-[#999999] font-medium">AI Workspace</p>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="space-y-6 flex-1">
        {/* Workspace Group */}
        <div>
          <span className="text-[11px] font-bold text-[#999999] uppercase tracking-wider block mb-3 px-3">
            Workspace
          </span>
          <nav className="space-y-1">
            {menuWorkspace.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 group relative spring-transition spring-active ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FF9D42]/10 to-[#FF8B2B]/10 text-[#FF8B2B] font-bold shadow-xs border border-[#FF9D42]/20'
                      : 'text-[#707070] hover:text-[#1B1B1B] hover:bg-black/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-[18px] h-[18px] transition-colors ${isActive ? 'text-[#FF8B2B]' : 'text-[#707070] group-hover:text-[#1B1B1B]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-[#FF8B2B] text-white' : 'bg-black/5 text-[#707070]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Intelligence Group */}
        <div>
          <span className="text-[11px] font-bold text-[#999999] uppercase tracking-wider block mb-3 px-3">
            Intelligence
          </span>
          <nav className="space-y-1">
            {menuIntelligence.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 group relative spring-transition spring-active ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FF9D42]/10 to-[#FF8B2B]/10 text-[#FF8B2B] font-bold shadow-xs border border-[#FF9D42]/20'
                      : 'text-[#707070] hover:text-[#1B1B1B] hover:bg-black/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-[18px] h-[18px] transition-colors ${isActive ? 'text-[#FF8B2B]' : 'text-[#707070] group-hover:text-[#1B1B1B]'}`} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* System Group */}
        <div>
          <span className="text-[11px] font-bold text-[#999999] uppercase tracking-wider block mb-3 px-3">
            System
          </span>
          <nav className="space-y-1">
            {menuSystem.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 group relative spring-transition spring-active ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FF9D42]/10 to-[#FF8B2B]/10 text-[#FF8B2B] font-bold shadow-xs border border-[#FF9D42]/20'
                      : 'text-[#707070] hover:text-[#1B1B1B] hover:bg-black/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-[18px] h-[18px] transition-colors ${isActive ? 'text-[#FF8B2B]' : 'text-[#707070] group-hover:text-[#1B1B1B]'}`} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer System: Credits, Upgrade Button & Profile */}
      <div className="mt-auto pt-6 border-t border-black/5 space-y-5">
        {/* Credits usage bar */}
        <div className="space-y-2 px-1">
          <div className="flex items-center justify-between text-xs text-[#707070] font-semibold">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#FF9D42] fill-[#FF9D42]/20" />
              Credits
            </span>
            <span className="text-[#1B1B1B]">1,240 / 2,000</span>
          </div>
          <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#FF9D42] to-[#FFD6A5] rounded-full" style={{ width: '62%' }} />
          </div>
        </div>

        {/* Premium Upgrade Button */}
        <button
          id="upgrade-button"
          onClick={onNewAnalysisClick}
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#FF9D42] to-[#FF8B2B] hover:shadow-md text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Crown className="w-4 h-4" />
          <span>Upgrade to Pro</span>
        </button>

        {/* User Account profile */}
        <div className="flex items-center gap-3 px-1 pt-1">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-800 to-slate-950 flex items-center justify-center text-white text-xs font-bold shadow-inner">
            AL
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[#1B1B1B] truncate">Alex Lin</p>
            <p className="text-[11px] font-medium text-[#999999] truncate">alex@founder.co</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

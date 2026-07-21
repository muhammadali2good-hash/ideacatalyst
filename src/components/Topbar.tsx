import React, { useState, useEffect } from 'react';
import { Search, Bell, Sparkles, Plus, Keyboard } from 'lucide-react';
import { Idea } from '../types';

interface TopbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onNewAnalysisClick: () => void;
  ideas: Idea[];
}

export default function Topbar({ searchQuery, setSearchQuery, onNewAnalysisClick, ideas }: TopbarProps) {
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState('AI Workspace');
  const [notifications, setNotifications] = useState<{ id: string; text: string; unread: boolean }[]>([]);
  const [hasOpenedNotifications, setHasOpenedNotifications] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Generate real notifications dynamically from actual ideas
    const generated = ideas.flatMap((idea, idx) => [
      {
        id: `${idea.id}-evaluation`,
        text: `Gemini successfully evaluated "${idea.title}" (Score: ${idea.score}/100)`,
        unread: idx === 0 && !hasOpenedNotifications
      },
      {
        id: `${idea.id}-trends`,
        text: `Google Trends search clusters plotted for "${idea.title}"`,
        unread: false
      }
    ]).slice(0, 5);
    setNotifications(generated);
  }, [ideas, hasOpenedNotifications]);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="sticky top-4 z-40 w-full liquid-glass-topbar spring-transition rounded-3xl p-4 flex items-center justify-between mb-6">
      {/* Search Input Container */}
      <div className="flex-1 max-w-lg relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#707070] dark:text-stone-400 group-focus-within:text-[#FF8B2B] transition-colors" />
        <input
          id="global-search-input"
          type="text"
          placeholder="Search ideas, reports, categories, keywords..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-black/5 hover:bg-black-[0.08] dark:bg-white/5 focus:bg-white dark:focus:bg-[#1E1C1B] border-0 focus:ring-1 focus:ring-[#FF9D42]/40 rounded-2xl pl-11 pr-12 py-2.5 text-sm font-medium text-[#1B1B1B] dark:text-white placeholder-[#999999] dark:placeholder-stone-500 outline-none transition-all duration-300"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 text-[11px] font-bold text-[#999999] dark:text-stone-500 bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded-lg border border-black-[0.05] dark:border-white/[0.05]">
          <Keyboard className="w-3 h-3 text-[#999999] dark:text-stone-500" />
          <span>⌘K</span>
        </div>
      </div>

      {/* Action Items */}
      <div className="flex items-center gap-4">
        {/* Workspace Dropdown */}
        <div className="relative">
          <button
            id="workspace-dropdown-trigger"
            onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-xs font-bold text-[#1B1B1B] dark:text-white transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF9D42]" />
            <span>{selectedWorkspace}</span>
            <span className="text-[10px] text-[#707070] dark:text-stone-400">▼</span>
          </button>
          
          {showWorkspaceMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white/95 dark:bg-[#1C1A19]/95 backdrop-blur-lg border border-black/10 dark:border-white/10 rounded-2xl shadow-lg p-2 z-50">
              <div className="text-[10px] font-bold text-[#999999] dark:text-stone-500 uppercase tracking-wider px-3 py-1.5 border-b border-black/5 dark:border-white/5">
                Workspaces
              </div>
              <button
                onClick={() => { setSelectedWorkspace('AI Workspace'); setShowWorkspaceMenu(false); }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-[#1B1B1B] dark:text-stone-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                AI Workspace
              </button>
              <button
                onClick={() => { setSelectedWorkspace('Sandbox Beta'); setShowWorkspaceMenu(false); }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-[#1B1B1B] dark:text-stone-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                Sandbox Beta
              </button>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            id="notifications-button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setHasOpenedNotifications(true);
              setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
            }}
            className="w-10 h-10 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center relative transition-colors"
          >
            <Bell className="w-4 h-4 text-[#1B1B1B] dark:text-white" />
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#FF8B2B] rounded-full animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white/95 dark:bg-[#1C1A19]/95 backdrop-blur-lg border border-black/10 dark:border-white/10 rounded-2xl shadow-lg p-3 z-50">
              <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-2 mb-2">
                <span className="text-xs font-bold text-[#1B1B1B] dark:text-white">Recent Signals</span>
                <span className="text-[10px] text-[#999999] dark:text-stone-500">
                  {ideas.length > 0 ? `${ideas.length * 2} signals total` : '0 signals'}
                </span>
              </div>
              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map(n => (
                    <div key={n.id} className="p-2 rounded-xl text-xs text-[#707070] dark:text-stone-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors leading-relaxed">
                      {n.text}
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-[#999999] dark:text-stone-500 italic font-medium">
                    No active signals. Create your first analysis to see real-time workspace signals!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* New Analysis CTA Button */}
        <button
          id="new-analysis-topbar-button"
          onClick={onNewAnalysisClick}
          className="px-5 py-2.5 bg-gradient-to-r from-[#FF9D42] to-[#FF8B2B] text-white hover:shadow-md font-semibold text-xs rounded-2xl flex items-center gap-1.5 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Analysis</span>
        </button>
      </div>
    </header>
  );
}

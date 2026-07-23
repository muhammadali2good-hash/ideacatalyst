import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Sparkles, Plus, Keyboard, X, Tag, FileText, ArrowRight, User, Sun, Moon } from 'lucide-react';
import { Idea } from '../types';

interface TopbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onNewAnalysisClick: () => void;
  ideas: Idea[];
  onSelectIdea?: (idea: Idea) => void;
  setActiveTab?: (tab: string) => void;
  userEmail?: string;
}

export default function Topbar({
  searchQuery,
  setSearchQuery,
  onNewAnalysisClick,
  ideas,
  onSelectIdea,
  setActiveTab,
  userEmail
}: TopbarProps) {
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState('AI Workspace');
  const [notifications, setNotifications] = useState<{ id: string; text: string; unread: boolean }[]>([]);
  const [hasOpenedNotifications, setHasOpenedNotifications] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(() => {
    return typeof document !== 'undefined' && (document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark');
  });

  useEffect(() => {
    const syncTheme = () => {
      setIsDarkTheme(document.documentElement.classList.contains('dark'));
    };
    window.addEventListener('theme-change', syncTheme);
    return () => window.removeEventListener('theme-change', syncTheme);
  }, []);

  const toggleTheme = () => {
    const nextIsDark = !document.documentElement.classList.contains('dark');
    if (nextIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    setIsDarkTheme(nextIsDark);
    window.dispatchEvent(new Event('theme-change'));
  };

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global Keyboard shortcut listener for Command+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchFocused(true);
      } else if (e.key === 'Escape') {
        setIsSearchFocused(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close live search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  // Compute live search matches across title, description, tags, category, and keywords
  const trimmedQuery = searchQuery.trim().toLowerCase();
  const searchResults = trimmedQuery.length > 0
    ? ideas.filter(idea => {
        const titleMatch = idea.title?.toLowerCase().includes(trimmedQuery);
        const descMatch = idea.description?.toLowerCase().includes(trimmedQuery);
        const tagMatch = idea.tags?.some(t => t.toLowerCase().includes(trimmedQuery));
        const catMatch = idea.category?.toLowerCase().includes(trimmedQuery);
        const kwMatch = idea.keywords?.some(k => k.term.toLowerCase().includes(trimmedQuery));
        return titleMatch || descMatch || tagMatch || catMatch || kwMatch;
      })
    : [];

  const handleResultClick = (idea: Idea) => {
    setIsSearchFocused(false);
    if (onSelectIdea) {
      onSelectIdea(idea);
    } else if (setActiveTab) {
      setActiveTab('ideas');
    }
  };

  const handleViewAllResults = () => {
    setIsSearchFocused(false);
    if (setActiveTab) {
      setActiveTab('ideas');
    }
  };

  return (
    <header className="sticky top-4 z-40 w-full liquid-glass-topbar spring-transition rounded-3xl p-4 flex items-center justify-between mb-6">
      {/* Search Input Container */}
      <div ref={searchContainerRef} className="flex-1 max-w-lg relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#707070] dark:text-stone-400 group-focus-within:text-[#FF8B2B] transition-colors z-10" />
        
        <input
          ref={searchInputRef}
          id="global-search-input"
          type="text"
          placeholder="Filter ideas by title, description, tags..."
          value={searchQuery}
          onFocus={() => setIsSearchFocused(true)}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-black/5 hover:bg-black-[0.08] dark:bg-white/5 focus:bg-white dark:focus:bg-[#1E1C1B] border border-transparent focus:border-[#FF9D42]/40 rounded-2xl pl-11 pr-20 py-2.5 text-sm font-medium text-[#1B1B1B] dark:text-white placeholder-[#999999] dark:placeholder-stone-500 outline-none transition-all duration-300"
        />

        {/* Clear Button & Keyboard Shortcut Badge */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 z-10">
          {searchQuery && (
            <button
              type="button"
              id="clear-global-search-btn"
              onClick={() => { setSearchQuery(''); searchInputRef.current?.focus(); }}
              className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-gray-400 hover:text-gray-600 dark:hover:text-stone-200 transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <div className="hidden md:flex items-center gap-1 text-[10px] font-bold text-[#999999] dark:text-stone-500 bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded-lg border border-black/[0.05] dark:border-white/[0.05]">
            <Keyboard className="w-3 h-3 text-[#999999] dark:text-stone-500" />
            <span>⌘K</span>
          </div>
        </div>

        {/* Live Search Results Dropdown Overlay */}
        {isSearchFocused && trimmedQuery.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white/95 dark:bg-[#1C1A19]/95 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl p-3 z-50 animate-fade-in max-h-96 overflow-y-auto space-y-2">
            <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-2 px-1">
              <span className="text-[11px] font-bold text-[#707070] dark:text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                <Search className="w-3 h-3 text-[#FF8B2B]" />
                <span>Matching Ideas ({searchResults.length})</span>
              </span>
              <span className="text-[10px] font-semibold text-[#FF8B2B]">
                Filtering title, desc & tags
              </span>
            </div>

            {searchResults.length > 0 ? (
              <div className="space-y-1">
                {searchResults.slice(0, 6).map((idea) => {
                  const titleMatched = idea.title?.toLowerCase().includes(trimmedQuery);
                  const descMatched = idea.description?.toLowerCase().includes(trimmedQuery);
                  const matchedTag = idea.tags?.find(t => t.toLowerCase().includes(trimmedQuery));

                  return (
                    <button
                      key={idea.id}
                      onClick={() => handleResultClick(idea)}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all flex items-start justify-between gap-3 group cursor-pointer border border-transparent hover:border-black/5 dark:hover:border-white/5"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h5 className="text-xs font-bold text-[#1B1B1B] dark:text-white group-hover:text-[#FF8B2B] transition-colors truncate">
                            {idea.title}
                          </h5>
                          {titleMatched && (
                            <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
                              Title match
                            </span>
                          )}
                          {matchedTag && (
                            <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center gap-0.5">
                              <Tag className="w-2.5 h-2.5" />
                              #{matchedTag}
                            </span>
                          )}
                          {descMatched && !titleMatched && !matchedTag && (
                            <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center gap-0.5">
                              <FileText className="w-2.5 h-2.5" />
                              Desc match
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#707070] dark:text-stone-400 line-clamp-1 font-medium">
                          {idea.description}
                        </p>
                        {/* Tags list */}
                        {idea.tags && idea.tags.length > 0 && (
                          <div className="flex items-center gap-1 pt-0.5">
                            {idea.tags.map((t, idx) => (
                              <span
                                key={idx}
                                className={`text-[9px] font-semibold px-1.5 py-0.2 rounded-md ${
                                  t.toLowerCase().includes(trimmedQuery)
                                    ? 'bg-[#FF8B2B] text-white'
                                    : 'bg-black/5 dark:bg-white/5 text-[#707070] dark:text-stone-400'
                                }`}
                              >
                                #{t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end shrink-0 gap-1">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-lg bg-[#FF9D42]/10 text-[#FF8B2B]">
                          Score: {idea.score}
                        </span>
                        <span className="text-[9px] font-semibold text-[#999999] dark:text-stone-500">
                          {idea.category}
                        </span>
                      </div>
                    </button>
                  );
                })}

                {searchResults.length > 6 && (
                  <button
                    onClick={handleViewAllResults}
                    className="w-full text-center py-2 text-xs font-bold text-[#FF8B2B] hover:underline flex items-center justify-center gap-1 cursor-pointer pt-2 border-t border-black/5 dark:border-white/5"
                  >
                    <span>View all {searchResults.length} matching ideas</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ) : (
              <div className="p-4 text-center space-y-1">
                <p className="text-xs font-semibold text-[#1B1B1B] dark:text-stone-300">
                  No ideas match "{searchQuery}"
                </p>
                <p className="text-[11px] text-[#707070] dark:text-stone-500">
                  Try searching across title keywords, description text, or tag names (e.g. "SaaS", "AI", "FinTech").
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Items */}
      <div className="flex items-center gap-3">
        {/* User Email Pill */}
        {userEmail && (
          <div
            id="topbar-user-email-badge"
            className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-xs font-semibold text-[#1B1B1B] dark:text-stone-300"
            title={`Active session email: ${userEmail}`}
          >
            <User className="w-3.5 h-3.5 text-[#FF8B2B]" />
            <span className="max-w-[130px] truncate">{userEmail}</span>
          </div>
        )}

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

        {/* Quick Theme Toggle Button (Black & Orange Dark Mode) */}
        <button
          id="topbar-theme-toggle-btn"
          type="button"
          onClick={toggleTheme}
          className="w-10 h-10 rounded-2xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 border border-transparent dark:border-[#FF9D42]/30 flex items-center justify-center transition-all cursor-pointer group shadow-xs"
          title={isDarkTheme ? "Switch to Light Theme" : "Switch to Black & Orange Dark Theme"}
        >
          {isDarkTheme ? (
            <Sun className="w-4 h-4 text-[#FF9D42] group-hover:scale-110 transition-transform" />
          ) : (
            <Moon className="w-4 h-4 text-[#1B1B1B] dark:text-stone-300 group-hover:scale-110 transition-transform" />
          )}
        </button>

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

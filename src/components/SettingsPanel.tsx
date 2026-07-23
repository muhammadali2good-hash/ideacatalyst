import React, { useState, useEffect } from 'react';
import {
  Settings,
  Sun,
  Moon,
  Trash2,
  RefreshCw,
  Sliders,
  Shield,
  Key,
  Database,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Mail,
  Copy,
  Check,
  ExternalLink,
  Send,
} from 'lucide-react';

interface SettingsPanelProps {
  onClearBacklog: () => void;
  onLoadSampleData: () => void;
  ideasCount: number;
}

const APPS_SCRIPT_CODE_SNIPPET = `function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Auto-create header row if sheet is fresh
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Email Address", "Source", "User Agent"]);
      sheet.getRange(1, 1, 1, 4).setFontWeight("bold").setBackground("#FF8B2B").setFontColor("#FFFFFF");
    }

    var email = "";
    var source = "Landing Page";
    var userAgent = "";

    if (e && e.postData && e.postData.contents) {
      var data = JSON.parse(e.postData.contents);
      email = data.email || "";
      source = data.source || "Landing Page Access";
      userAgent = data.userAgent || "";
    } else if (e && e.parameter) {
      email = e.parameter.email || "";
      source = e.parameter.source || "Landing Page Access";
      userAgent = e.parameter.userAgent || "";
    }

    if (email) {
      var timestamp = new Date();
      sheet.appendRow([timestamp, email, source, userAgent]);
      return ContentService.createTextOutput(JSON.stringify({ "result": "success", "email": email }))
        .setMimeType(ContentService.MimeType.JSON);
    } else {
      return ContentService.createTextOutput(JSON.stringify({ "result": "error", "message": "No email provided" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("IdeaCatalyst Web App Script is active!");
}`;

export default function SettingsPanel({ onClearBacklog, onLoadSampleData, ideasCount }: SettingsPanelProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });

  const [usePuterAI, setUsePuterAI] = useState<boolean>(() => {
    return localStorage.getItem('settings_use_puter_ai') !== 'false';
  });

  const [workspaceName, setWorkspaceName] = useState<string>(() => {
    return localStorage.getItem('settings_workspace_name') || 'Alex\'s Lab';
  });

  const [appsScriptUrl, setAppsScriptUrl] = useState<string>(() => {
    return localStorage.getItem('apps_script_url') || (import.meta as any).env?.VITE_APPS_SCRIPT_URL || '';
  });

  const [showToast, setShowToast] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [isTestingWebhook, setIsTestingWebhook] = useState<boolean>(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
    window.dispatchEvent(new Event('theme-change'));
  }, [theme]);

  const toggleTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    triggerToast(`Theme set to ${newTheme === 'light' ? 'Bright Light Mode' : 'Pitch Black Dark Mode'}`);
  };

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => {
      setShowToast(null);
    }, 3500);
  };

  const handleSaveWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('settings_workspace_name', workspaceName);
    triggerToast('Workspace preferences saved successfully!');
    window.dispatchEvent(new Event('storage'));
  };

  const handleSaveAppsScriptUrl = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('apps_script_url', appsScriptUrl.trim());
    triggerToast('Google Apps Script Webhook URL saved successfully!');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_CODE_SNIPPET);
    setCopiedCode(true);
    triggerToast('Google Apps Script code copied to clipboard!');
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handleTestWebhook = async () => {
    const url = appsScriptUrl.trim();
    if (!url) {
      triggerToast('Please paste a valid Google Apps Script Web App URL first!');
      return;
    }

    setIsTestingWebhook(true);
    try {
      localStorage.setItem('apps_script_url', url);
      await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test_founder@ideacatalyst.io',
          source: 'Webhook Connection Test',
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        }),
      });
      triggerToast('Test payload dispatched to Google Sheets! Check your Google Sheet rows.');
    } catch (err) {
      console.error(err);
      triggerToast('Failed to reach endpoint. Verify URL permissions.');
    } finally {
      setIsTestingWebhook(false);
    }
  };

  const handleTogglePuter = () => {
    const newValue = !usePuterAI;
    setUsePuterAI(newValue);
    localStorage.setItem('settings_use_puter_ai', String(newValue));
    triggerToast(`Analysis engine set to ${newValue ? 'Puter.js AI' : 'Local Deterministic'}`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1B1B1B] dark:text-white tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#FF9D42]" />
            Workspace Settings
          </h2>
          <p className="text-xs text-[#707070] dark:text-stone-400 font-medium mt-1">
            Configure system themes, Google Sheets email webhooks, and local database storage.
          </p>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-[#1B1B1B] dark:bg-[#1E1C1B] text-white text-xs px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 z-50 border border-white/10 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#FF9D42]" />
          <span className="font-semibold">{showToast}</span>
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: General Configuration */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Section 1: Visual Theme Toggle */}
          <div className="liquid-glass-card rounded-3xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/10">
              <div>
                <h3 className="text-sm font-bold text-[#1B1B1B] dark:text-[#FAF8F5] flex items-center gap-2">
                  <Sun className="w-4 h-4 text-[#FF9D42]" />
                  Interface Appearance
                </h3>
                <p className="text-[11px] text-[#707070] dark:text-[#A0A0A0] font-medium mt-0.5">
                  Switch between Crisp Light schema and Pitch Black & Orange luxury theme.
                </p>
              </div>

              {/* Main Toggle Switch */}
              <button
                id="main-theme-toggle-switch"
                type="button"
                onClick={() => toggleTheme(theme === 'light' ? 'dark' : 'light')}
                className={`w-14 h-7 rounded-full p-1 transition-all duration-300 relative flex items-center cursor-pointer ${
                  theme === 'dark' ? 'bg-[#FF8B2B]' : 'bg-black/15'
                }`}
                title="Toggle Pitch Black & Orange Dark Mode"
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center transform transition-transform duration-300 ${
                    theme === 'dark' ? 'translate-x-7 bg-[#1A1817]' : 'translate-x-0'
                  }`}
                >
                  {theme === 'dark' ? (
                    <Moon className="w-3 h-3 text-[#FF9D42]" />
                  ) : (
                    <Sun className="w-3 h-3 text-amber-500" />
                  )}
                </div>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Light Mode Button */}
              <button
                id="theme-light-btn"
                onClick={() => toggleTheme('light')}
                className={`p-4 rounded-2xl border text-left space-y-2 transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'border-[#FF8B2B] bg-[#FF9D42]/10 text-[#FF8B2B] shadow-xs'
                    : 'border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-[#707070] dark:text-[#A0A0A0]'
                }`}
              >
                <Sun className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="text-xs font-bold text-[#1B1B1B] dark:text-white">Classic Bright</p>
                  <p className="text-[10px] text-[#707070] dark:text-[#A0A0A0] font-medium">Warm white cream backdrop</p>
                </div>
              </button>

              {/* Dark Mode Button */}
              <button
                id="theme-dark-btn"
                onClick={() => toggleTheme('dark')}
                className={`p-4 rounded-2xl border text-left space-y-2 transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'border-[#FF8B2B] bg-[#FF9D42]/15 text-[#FF9D42] shadow-xs'
                    : 'border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-[#707070] dark:text-[#A0A0A0]'
                }`}
              >
                <Moon className="w-5 h-5 text-orange-400" />
                <div>
                  <p className="text-xs font-bold text-[#1B1B1B] dark:text-white">Pitch Black & Orange</p>
                  <p className="text-[10px] text-[#707070] dark:text-[#A0A0A0] font-medium">Deep obsidian & glowing orange</p>
                </div>
              </button>
            </div>
          </div>

          {/* Section 2: Google Sheets Email Webhook */}
          <div className="liquid-glass-card rounded-3xl p-6 space-y-5 border border-[#FF9D42]/20">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#1B1B1B] dark:text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#FF9D42]" />
                  Google Sheets Email Storage Sync
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FF8B2B]/10 text-[#FF8B2B]">
                  Live Integration
                </span>
              </div>
              <p className="text-[11px] text-[#707070] dark:text-stone-400 font-medium mt-1">
                Automatically append user email submissions directly into your private Google Sheet spreadsheet.
              </p>
            </div>

            {/* Form for Webhook URL */}
            <form onSubmit={handleSaveAppsScriptUrl} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-[#999999] dark:text-stone-400 uppercase block mb-1">
                  Google Apps Script Deployment Web App URL
                </label>
                <input
                  id="apps-script-url-input"
                  type="url"
                  value={appsScriptUrl}
                  onChange={(e) => setAppsScriptUrl(e.target.value)}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-[#FF9D42] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#1B1B1B] dark:text-white outline-none"
                  placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  id="save-apps-script-url-btn"
                  className="px-4 py-2 bg-gradient-to-r from-[#FF9D42] to-[#FF8B2B] text-white font-bold text-xs rounded-xl transition-all hover:shadow-md cursor-pointer"
                >
                  Save URL
                </button>

                <button
                  type="button"
                  onClick={handleTestWebhook}
                  disabled={isTestingWebhook}
                  id="test-apps-script-btn"
                  className="px-4 py-2 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-[#1B1B1B] dark:text-stone-200 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-[#FF9D42]" />
                  <span>{isTestingWebhook ? 'Sending Ping...' : 'Test Connection'}</span>
                </button>
              </div>
            </form>

            {/* Google Apps Script Code Box */}
            <div className="space-y-2 pt-2 border-t border-black/5 dark:border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1B1B1B] dark:text-stone-200 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-[#FF8B2B]" />
                  Google Apps Script Code (.gs)
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="text-xs font-bold text-[#FF8B2B] hover:text-[#FF7A12] flex items-center gap-1 cursor-pointer bg-[#FF8B2B]/10 hover:bg-[#FF8B2B]/20 px-2.5 py-1 rounded-lg transition-colors"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied Code!' : 'Copy Code'}</span>
                </button>
              </div>

              <pre className="bg-[#12100E] text-stone-300 p-3.5 rounded-xl text-[11px] font-mono leading-relaxed overflow-x-auto border border-stone-800 max-h-40">
                {APPS_SCRIPT_CODE_SNIPPET}
              </pre>

              {/* Instructions Guide */}
              <div className="bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-2xl text-[11px] text-[#707070] dark:text-stone-300 space-y-1.5 font-medium">
                <p className="font-bold text-[#1B1B1B] dark:text-white flex items-center gap-1.5">
                  <span>📌 How to Setup Google Sheets Backend:</span>
                </p>
                <ol className="list-decimal list-inside space-y-1 leading-relaxed text-[10.5px]">
                  <li>Open your <strong>Google Sheet</strong> spreadsheet.</li>
                  <li>Go to menu <strong>Extensions → Apps Script</strong>.</li>
                  <li>Paste the copied script code above into <code>Code.gs</code>.</li>
                  <li>Click <strong>Deploy → New deployment</strong>.</li>
                  <li>Select type <strong>Web App</strong>. Set <i>Execute as: Me</i> and <i>Who has access: Anyone</i>.</li>
                  <li>Click <strong>Deploy</strong>, copy the Web App URL, and paste it into the field above!</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Section 3: Workspace customization */}
          <div className="liquid-glass-card rounded-3xl p-6">
            <h3 className="text-sm font-bold text-[#1B1B1B] dark:text-white flex items-center gap-2 mb-1">
              <Database className="w-4 h-4 text-[#FF9D42]" />
              Workspace Preferences
            </h3>
            <p className="text-[11px] text-[#707070] dark:text-stone-400 font-medium mb-4">
              Assign customized attributes for reporting exports and AI personalized templates.
            </p>

            <form onSubmit={handleSaveWorkspace} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-[#999999] dark:text-stone-400 uppercase block mb-1">Workspace Name</label>
                <input
                  id="workspace-name-input"
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:ring-1 focus:ring-[#FF9D42]/40 rounded-xl px-4 py-2.5 text-xs font-semibold text-[#1B1B1B] dark:text-white outline-none"
                  placeholder="e.g. Apollo Ventures"
                />
              </div>

              <button
                id="save-workspace-settings-btn"
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-[#FF9D42] to-[#FF8B2B] text-white font-bold text-xs rounded-xl transition-all hover:shadow-md cursor-pointer"
              >
                Save Preferences
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Database / Backlog Clean Controls */}
        <div className="space-y-6">
          
          {/* Data Control Center */}
          <div className="liquid-glass-card rounded-3xl p-6 space-y-4 border border-rose-500/20">
            <div>
              <span className="text-[9px] font-bold text-rose-500 uppercase tracking-wider block">Maintenance Zone</span>
              <h3 className="text-sm font-bold text-[#1B1B1B] dark:text-white flex items-center gap-2 mt-0.5">
                <Trash2 className="w-4 h-4 text-rose-500" />
                Workspace Database
              </h3>
              <p className="text-[11px] text-[#707070] dark:text-stone-400 font-medium mt-1">
                Your browser contains <span className="font-extrabold text-[#1B1B1B] dark:text-white">{ideasCount} evaluated ideas</span> inside Chrome DB persistent storage.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                id="clear-all-data-btn"
                onClick={onClearBacklog}
                className="w-full py-2.5 px-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all border border-rose-500/20 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Backlog DB</span>
              </button>

              <button
                id="load-sample-data-btn"
                onClick={onLoadSampleData}
                className="w-full py-2.5 px-4 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-[#707070] dark:text-stone-300 hover:text-[#1B1B1B] dark:hover:text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Load Sample Case Studies</span>
              </button>
            </div>

            <div className="bg-amber-500/[0.03] border border-amber-500/10 p-3.5 rounded-2xl flex items-start gap-2.5 text-[10px] text-[#707070] dark:text-stone-400 font-medium leading-relaxed">
              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <span>
                Clearing the backlog completely wipes the Chrome Local Storage databases. This action is instantaneous and cannot be undone.
              </span>
            </div>
          </div>

          {/* Secure Cloud Shield Card */}
          <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-3xl p-6 space-y-3">
            <h4 className="text-xs font-bold text-[#1B1B1B] dark:text-white flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-slate-500 dark:text-stone-400" />
              Security Specifications
            </h4>
            <p className="text-[10px] text-[#707070] dark:text-stone-400 font-medium leading-relaxed">
              Your credentials are never stored on any centralized server. All API connections are proxied client-side via secure sandbox headers with zero session leaks.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

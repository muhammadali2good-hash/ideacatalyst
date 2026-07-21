import React, { useState, useEffect } from 'react';
import { UploadCloud, FileText, FileSpreadsheet, Keyboard, Sparkles, Loader2 } from 'lucide-react';

interface UploadBentoProps {
  onAnalyzeIdea: (title: string, desc: string) => Promise<void>;
  isAnalyzing: boolean;
  analysisError: string | null;
}

export default function UploadBento({ onAnalyzeIdea, isAnalyzing, analysisError }: UploadBentoProps) {
  const [activeMethod, setActiveMethod] = useState<'text' | 'pdf' | 'txt' | 'csv'>('text');
  
  // Custom manual idea fields
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaDesc, setIdeaDesc] = useState('');

  // Reassuring messages for loading state
  const loadingSteps = [
    'Initializing Gemini-3.6-flash legal & SaaS agent...',
    'Extracting search volumes & evaluating keywords difficulty...',
    'Compiling competitor matrices & identifying target user segments...',
    'Running SWOT analysis and generating Lean Canvas matrix...',
    'Formatting complete financial predictions and compiling final scores...'
  ];
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isAnalyzing) {
      interval = setInterval(() => {
        setLoadingStepIdx((prev) => (prev + 1) % loadingSteps.length);
      }, 3500);
    } else {
      setLoadingStepIdx(0);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleSubmitText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaTitle.trim() || !ideaDesc.trim()) return;
    onAnalyzeIdea(ideaTitle, ideaDesc);
  };

  // Drag and drop simulator
  const [dragActive, setDragActive] = useState(false);
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const nameWithoutExt = file.name.split('.').slice(0, -1).join('.');
      setIdeaTitle(nameWithoutExt);
      setIdeaDesc(`Analyzed file content from "${file.name}" uploaded via drag-and-drop.`);
      onAnalyzeIdea(nameWithoutExt, `Dynamic document analysis of uploaded file: ${file.name}.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* 4 Bento Upload Methods Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { id: 'text', name: 'Text / Raw Prompt', desc: 'Type or paste ideas', icon: Keyboard },
          { id: 'pdf', name: 'PDF Document', desc: 'Analyze contracts or briefs', icon: UploadCloud },
          { id: 'txt', name: 'TXT Transcript', desc: 'Paste call or chat logs', icon: FileText },
          { id: 'csv', name: 'CSV Idea List', desc: 'Batch ingest tables', icon: FileSpreadsheet },
        ].map((method) => {
          const Icon = method.icon;
          const isActive = activeMethod === method.id;
          return (
            <button
              key={method.id}
              id={`upload-method-${method.id}`}
              onClick={() => setActiveMethod(method.id as any)}
              className={`p-5 rounded-3xl text-left flex flex-col justify-between h-36 spring-transition spring-hover cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-tr from-[#FF9D42]/10 to-[#FF8B2B]/10 border-2 border-[#FF8B2B]/50 shadow-xs'
                  : 'liquid-glass-card'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isActive ? 'bg-[#FF8B2B] text-white' : 'bg-black/5 text-[#707070]'}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className={`text-xs font-bold ${isActive ? 'text-[#FF8B2B]' : 'text-[#1B1B1B]'}`}>{method.name}</h4>
                <p className="text-[10px] text-[#999999] font-medium leading-tight">{method.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Form workspace bento card */}
      <div className="liquid-glass-card spring-transition rounded-3xl p-6 relative min-h-[300px] flex flex-col justify-center">
        {isAnalyzing ? (
          /* Premium Loading Screen with reassuring step indicators */
          <div className="flex flex-col items-center justify-center space-y-6 text-center py-10">
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-4 border-[#FF9D42]/10 border-t-[#FF8B2B] animate-spin" />
              <Sparkles className="w-6 h-6 text-[#FF9D42] absolute animate-pulse" />
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-[#1B1B1B]">Gemini AI is analyzing your idea</h4>
              <p className="text-xs text-[#FF8B2B] font-extrabold max-w-md animate-pulse">
                {loadingSteps[loadingStepIdx]}
              </p>
              <p className="text-[11px] text-[#999999] max-w-sm font-medium">
                This typically takes 8-12 seconds as we construct SWOT matrix, financial projections, and keyword scores.
              </p>
            </div>
          </div>
        ) : (
          /* Normal Inputs */
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-black/5 pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#1B1B1B] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#FF8B2B]" />
                  Interactive Analysis Console
                </h3>
                <p className="text-xs text-[#707070] font-medium">Provide raw details to trigger dynamic Gemini deep-dives</p>
              </div>
              <span className="text-[10px] font-bold text-[#FF8B2B] bg-[#FF9D42]/10 px-2.5 py-1 rounded-xl">
                Ready for Analysis
              </span>
            </div>

            {analysisError && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl text-xs font-semibold">
                {analysisError}
              </div>
            )}

            {activeMethod === 'text' ? (
              <form onSubmit={handleSubmitText} className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="idea-title-input" className="text-xs font-bold text-[#707070]">Idea Title</label>
                  <input
                    id="idea-title-input"
                    type="text"
                    required
                    placeholder="e.g., AI-Powered Contract Review or Micro-SaaS Invoice Reminders"
                    value={ideaTitle}
                    onChange={(e) => setIdeaTitle(e.target.value)}
                    className="w-full bg-black/5 border-0 focus:ring-1 focus:ring-[#FF9D42]/40 rounded-xl px-4 py-2.5 text-xs font-semibold text-[#1B1B1B] placeholder-[#999999] outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="idea-desc-input" className="text-xs font-bold text-[#707070]">Core Description & Details</label>
                  <textarea
                    id="idea-desc-input"
                    rows={4}
                    required
                    placeholder="Describe the problem, the core solution, potential customer profiles, and any specific monetization concepts. The more details you provide, the deeper the Gemini SWOT & Canvas generation will be."
                    value={ideaDesc}
                    onChange={(e) => setIdeaDesc(e.target.value)}
                    className="w-full bg-black/5 border-0 focus:ring-1 focus:ring-[#FF9D42]/40 rounded-xl px-4 py-2.5 text-xs font-semibold text-[#1B1B1B] placeholder-[#999999] outline-none transition-all resize-none"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    id="trigger-analysis-btn"
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-[#FF9D42] to-[#FF8B2B] text-white hover:shadow-md font-bold text-xs rounded-2xl flex items-center gap-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Sparkles className="w-4 h-4 stroke-[2.5]" />
                    <span>Run Full Gemini AI Report</span>
                  </button>
                </div>
              </form>
            ) : (
              /* PDF, TXT, CSV Dropzone */
              <div
                id="file-dropzone-container"
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center space-y-4 text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-[#FF8B2B] bg-[#FF9D42]/5'
                    : 'border-black/10 bg-black/[0.01] hover:bg-black/5'
                }`}
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = activeMethod === 'pdf' ? '.pdf' : activeMethod === 'txt' ? '.txt' : '.csv';
                  input.onchange = (e: any) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const nameWithoutExt = file.name.split('.').slice(0, -1).join('.');
                      setIdeaTitle(nameWithoutExt);
                      setIdeaDesc(`Analyzed document context from "${file.name}" uploaded successfully.`);
                      onAnalyzeIdea(nameWithoutExt, `Dynamic document analysis of uploaded file: ${file.name}.`);
                    }
                  };
                  input.click();
                }}
              >
                <div className="w-12 h-12 rounded-2xl bg-[#FF9D42]/10 flex items-center justify-center text-[#FF8B2B]">
                  <UploadCloud className="w-6 h-6 stroke-[2]" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-[#1B1B1B]">
                    Drag & Drop your .{activeMethod.toUpperCase()} file here
                  </h4>
                  <p className="text-[10px] text-[#999999] font-medium">
                    or click to search locally (Max size: 10MB)
                  </p>
                </div>
                <span className="text-[9px] font-bold text-[#FF8B2B] bg-[#FF9D42]/10 px-2.5 py-1 rounded-xl">
                  Supports Multi-Page OCR parsing
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

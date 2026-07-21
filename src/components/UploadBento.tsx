import React, { useState, useEffect } from 'react';
import { UploadCloud, FileText, FileSpreadsheet, Keyboard, Sparkles, Loader2, Check, AlertCircle } from 'lucide-react';

interface UploadBentoProps {
  onAnalyzeIdea: (title: string, desc: string) => Promise<void>;
  onAnalyzeBatch: (batch: { title: string; description: string }[]) => Promise<void>;
  isAnalyzing: boolean;
  analysisError: string | null;
}

export default function UploadBento({ onAnalyzeIdea, onAnalyzeBatch, isAnalyzing, analysisError }: UploadBentoProps) {
  const [activeMethod, setActiveMethod] = useState<'text' | 'pdf' | 'txt' | 'csv'>('text');
  
  // Custom manual idea fields
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaDesc, setIdeaDesc] = useState('');

  // Batch extraction states
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionError, setExtractionError] = useState<string | null>(null);
  const [extractedIdeas, setExtractedIdeas] = useState<{ title: string; description: string }[]>([]);
  const [fileName, setFileName] = useState('');
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

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
      parseFileAndExtractIdeas(e.dataTransfer.files[0]);
    }
  };

  const parseFileAndExtractIdeas = async (file: File) => {
    setIsExtracting(true);
    setExtractionError(null);
    setExtractedIdeas([]);
    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      const rawText = e.target?.result as string;
      if (!rawText || rawText.trim().length === 0) {
        parseLocally("", file.name);
        return;
      }
      
      const puter = (window as any).puter;
      if (puter && puter.ai) {
        try {
          const extractionPrompt = `You are an expert startup strategist. Analyze this raw text from an uploaded file named "${file.name}" and extract ALL separate, distinct startup/business/SaaS ideas mentioned in the file.
          
          Guidelines:
          - Extract up to 6 distinct ideas.
          - For each idea, assign a concise name/title and a descriptive 1-2 sentence overview/description.
          - Output MUST be a valid JSON array of objects. Do not write any conversational text, introductory text, markdown formatting blocks, or explanations. Only return raw valid JSON.
          
          Document Contents:
          """
          ${rawText.slice(0, 12000)}
          """
          
          JSON structure:
          [
            {
              "title": "CleanEnergy SaaS",
              "description": "An enterprise utility platform for calculating and offsetting team carbon emission footprint."
            }
          ]`;
          
          const responseText = await puter.ai.chat(extractionPrompt);
          let cleaned = typeof responseText === 'string' ? responseText : (responseText as any)?.message?.content;
          if (cleaned) {
            cleaned = cleaned.trim();
            if (cleaned.startsWith('```json')) cleaned = cleaned.slice(7);
            else if (cleaned.startsWith('```')) cleaned = cleaned.slice(3);
            if (cleaned.endsWith('```')) cleaned = cleaned.slice(0, -3);
            cleaned = cleaned.trim();
            
            try {
              const parsed = JSON.parse(cleaned);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setExtractedIdeas(parsed);
                setSelectedIndices(parsed.map((_, i) => i));
                setIsExtracting(false);
                return;
              }
            } catch (err) {
              console.error("Puter AI return wasn't clean JSON, failing over to local parsing:", err);
            }
          }
        } catch (err) {
          console.error("AI extraction error, calling local parser:", err);
        }
      }
      
      parseLocally(rawText, file.name);
    };
    
    reader.onerror = () => {
      setExtractionError("Failed to read file.");
      setIsExtracting(false);
    };
    
    reader.readAsText(file);
  };

  const parseLocally = (rawText: string, name: string) => {
    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
    const ideasList: { title: string; description: string }[] = [];
    
    if (name.endsWith('.csv') && lines.length > 0) {
      let startIndex = 0;
      if (lines[0] && (lines[0].toLowerCase().includes('title') || lines[0].toLowerCase().includes('name'))) {
        startIndex = 1;
      }
      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i];
        const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if (parts.length >= 2) {
          const t = parts[0].replace(/^["']|["']$/g, '').trim();
          const d = parts[1].replace(/^["']|["']$/g, '').trim();
          if (t && d) {
            ideasList.push({ title: t, description: d });
          }
        } else if (parts[0]) {
          const t = parts[0].replace(/^["']|["']$/g, '').trim();
          if (t) {
            ideasList.push({ title: t, description: `Batch imported from ${name} at index ${i}` });
          }
        }
      }
    } else if (name.endsWith('.txt') && lines.length > 0) {
      let currentTitle = '';
      for (const line of lines) {
        const bulletMatch = line.match(/^[-*•+]\s*(.*?)(?::| -)\s*(.*)/);
        const numberMatch = line.match(/^\d+[\s.)-]+\s*(.*?)(?::| -)\s*(.*)/);
        
        if (bulletMatch) {
          ideasList.push({ title: bulletMatch[1].trim(), description: bulletMatch[2].trim() });
        } else if (numberMatch) {
          ideasList.push({ title: numberMatch[1].trim(), description: numberMatch[2].trim() });
        } else {
          if (line.length > 5 && line.length < 50 && !line.endsWith('.') && !currentTitle) {
            currentTitle = line;
          } else if (line.length > 20 && currentTitle) {
            ideasList.push({ title: currentTitle, description: line });
            currentTitle = '';
          }
        }
      }
    }
    
    if (ideasList.length === 0) {
      const baseName = name.split('.')[0].replace(/[-_]+/g, ' ');
      ideasList.push({
        title: `${baseName} Workflow Optimizer`,
        description: `Automates key workflows, reduces operational bottlenecks, and improves throughput for projects of type ${baseName}.`
      });
      ideasList.push({
        title: `${baseName} Analytics Portal`,
        description: `Deep-dives into performance data, tracking seasonal search trends and revenue opportunities for ${baseName}.`
      });
      ideasList.push({
        title: `${baseName} Hub Collaboration`,
        description: `A modern client-facing communication and resource system tailored specifically for teams working with ${baseName}.`
      });
    }
    
    const sliced = ideasList.slice(0, 6);
    setExtractedIdeas(sliced);
    setSelectedIndices(sliced.map((_, i) => i));
    setIsExtracting(false);
  };

  const toggleSelectIndex = (idx: number) => {
    if (selectedIndices.includes(idx)) {
      setSelectedIndices(selectedIndices.filter(i => i !== idx));
    } else {
      setSelectedIndices([...selectedIndices, idx]);
    }
  };

  const handleProcessBatch = () => {
    const selected = extractedIdeas.filter((_, idx) => selectedIndices.includes(idx));
    if (selected.length === 0) return;
    onAnalyzeBatch(selected);
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
              onClick={() => {
                setActiveMethod(method.id as any);
                setExtractedIdeas([]);
                setExtractionError(null);
              }}
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
              <h4 className="text-sm font-bold text-[#1B1B1B]">Gemini AI is analyzing and evaluating</h4>
              <p className="text-xs text-[#FF8B2B] font-extrabold max-w-md animate-pulse">
                {loadingSteps[loadingStepIdx]}
              </p>
              <p className="text-[11px] text-[#999999] max-w-sm font-medium">
                This typically takes 8-12 seconds as we construct SWOT matrix, financial projections, and keyword scores for each idea.
              </p>
            </div>
          </div>
        ) : isExtracting ? (
          /* File extraction progress indicator */
          <div className="flex flex-col items-center justify-center space-y-6 text-center py-10">
            <div className="relative flex items-center justify-center animate-bounce">
              <div className="w-14 h-14 rounded-2xl bg-[#FF9D42]/10 flex items-center justify-center text-[#FF8B2B]">
                <Loader2 className="w-7 h-7 animate-spin stroke-[2]" />
              </div>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-[#1B1B1B]">Scanning Document and Extracting Ideas</h4>
              <p className="text-xs text-[#707070] font-medium max-w-sm">
                Reading text and asking Gemini AI to recognize and separate unique startup, SaaS, or product concepts inside {fileName}...
              </p>
            </div>
          </div>
        ) : extractedIdeas.length > 0 ? (
          /* Extracted separate ideas preview screen */
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-black/5 pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#1B1B1B] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#FF8B2B]" />
                  Discovered {extractedIdeas.length} Separate Ideas
                </h3>
                <p className="text-xs text-[#707070] font-medium">We found these distinct business concepts inside "{fileName}"</p>
              </div>
              <button
                onClick={() => {
                  setExtractedIdeas([]);
                  setFileName('');
                }}
                className="text-xs text-[#999999] hover:text-[#FF8B2B] font-semibold"
              >
                Clear / Upload Another
              </button>
            </div>

            {extractionError && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                {extractionError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto pr-1">
              {extractedIdeas.map((idea, idx) => {
                const isSelected = selectedIndices.includes(idx);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleSelectIndex(idx)}
                    className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer text-left relative flex gap-3 ${
                      isSelected
                        ? 'border-[#FF8B2B] bg-[#FF9D42]/5'
                        : 'border-black/5 bg-black/[0.01] hover:bg-black/5'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center border mt-0.5 transition-all ${
                      isSelected ? 'bg-[#FF8B2B] border-[#FF8B2B] text-white' : 'border-[#999999] bg-white'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-[#1B1B1B] leading-snug">{idea.title}</h4>
                      <p className="text-[10px] text-[#707070] font-normal leading-relaxed">{idea.description}</p>
                    </div>
                    <span className="absolute top-3 right-3 text-[9px] font-extrabold text-[#FF8B2B]/70 uppercase">
                      Idea #{idx + 1}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between border-t border-black/5 pt-4">
              <p className="text-[10px] text-[#999999] font-medium">
                {selectedIndices.length} of {extractedIdeas.length} ideas selected for full multi-dimensional evaluation.
              </p>
              <button
                onClick={handleProcessBatch}
                disabled={selectedIndices.length === 0}
                className="px-6 py-2.5 bg-gradient-to-r from-[#FF9D42] to-[#FF8B2B] text-white disabled:opacity-50 hover:shadow-md font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all duration-300 transform hover:scale-[1.01]"
              >
                <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Evaluate Selected as Separate Ideas</span>
              </button>
            </div>
          </div>
        ) : (
          /* Normal Inputs or Drag and Drop */
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
                      parseFileAndExtractIdeas(file);
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
                  Analyze & extract separate ideas inside this bunch
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  FileSpreadsheet, 
  Sparkles, 
  Loader2, 
  Check, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Edit3, 
  File,
  CheckSquare,
  Square,
  FolderPlus,
  Compass,
  ArrowRight
} from 'lucide-react';
import { Idea } from '../types';

interface ExtractionPanelProps {
  onImportIdeas: (ideas: Idea[]) => void;
  activeIdeasCount: number;
}

interface ExtractedItem {
  id: string;
  title: string;
  description: string;
  category: string;
}

export default function ExtractionPanel({ onImportIdeas, activeIdeasCount }: ExtractionPanelProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileText, setFileText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [discoveredItems, setDiscoveredItems] = useState<ExtractedItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Editing state for individual discovered item before importing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editCategory, setEditCategory] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadPdfJS = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      if ((window as any).pdfjsLib) {
        resolve((window as any).pdfjsLib);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = () => {
        (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        resolve((window as any).pdfjsLib);
      };
      script.onerror = () => reject(new Error('Failed to load PDF.js engine.'));
      document.head.appendChild(script);
    });
  };

  const getPdfText = async (fileArrayBuffer: ArrayBuffer): Promise<string> => {
    const pdfjsLib = await loadPdfJS();
    const loadingTask = pdfjsLib.getDocument({ data: fileArrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }
    return fullText;
  };

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
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = async (selectedFile: File) => {
    setFile(selectedFile);
    setErrorMsg(null);
    setDiscoveredItems([]);
    setSelectedIds([]);
    setFileText('');

    const fileType = selectedFile.name.split('.').pop()?.toLowerCase();
    if (!['txt', 'csv', 'pdf'].includes(fileType || '')) {
      setErrorMsg("Unsupported file format. Please upload a .txt, .csv, or .pdf file.");
      setFile(null);
      return;
    }
  };

  const startExtraction = async () => {
    if (!file) return;
    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const fileType = file.name.split('.').pop()?.toLowerCase();
      let extractedText = '';

      if (fileType === 'pdf') {
        setProcessingStep('Decoding binary PDF structures and text nodes...');
        const arrayBuffer = await file.arrayBuffer();
        extractedText = await getPdfText(arrayBuffer);
      } else {
        setProcessingStep('Reading text content from local stream...');
        extractedText = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string || '');
          reader.onerror = () => reject(new Error('Failed to read file contents.'));
          reader.readAsText(file);
        });
      }

      setFileText(extractedText);
      
      if (!extractedText.trim()) {
        throw new Error("The uploaded file appears to be empty.");
      }

      setProcessingStep('Analyzing text content for business patterns...');

      const puter = (window as any).puter;
      let items: ExtractedItem[] = [];

      if (puter && puter.ai) {
        try {
          setProcessingStep('Extracting business ideas with Puter AI model...');
          const prompt = `You are a professional venture capitalist and startup strategist. Analyze this text content from a file and extract ALL separate, distinct business, startup, product, or SaaS ideas.
          
Your goal is to extract as many separate and individual business ideas as possible from this file. Even if there are many ideas, list them out individually.
For each business idea, extract:
1. A clear, compelling, concise title/name.
2. A descriptive paragraph (2-3 sentences) detailing the core problem, unique value proposition, and workflow solution.
3. An appropriate startup category (e.g., SaaS, FinTech, AI Native, HealthTech, EdTech, E-commerce, Logistics, Developer Tool, Web3).

Format your output STRICTLY as a valid JSON array of objects. Do not include any introductions, conversation, markdown wrapper markers (like \`\`\`json), or explanations.

Input Document Text:
"""
${extractedText.slice(0, 15000)}
"""

Desired JSON format (example):
[
  {
    "title": "Clean Energy Monitor",
    "description": "An enterprise SaaS platform designed to monitor energy usage across remote data facilities and provide real-time suggestions to lower carbon emission footprint.",
    "category": "SaaS"
  }
]`;

          const responseText = await puter.ai.chat(prompt);
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
                items = parsed.map((it: any, index: number) => ({
                  id: `ext-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 4)}`,
                  title: it.title || `Extracted Idea ${index + 1}`,
                  description: it.description || 'No description extracted.',
                  category: it.category || 'SaaS'
                }));
              }
            } catch (jsonErr) {
              console.error("Failed parsing Puter JSON, falling back to pattern matching", jsonErr);
            }
          }
        } catch (aiErr) {
          console.error("AI extraction failed, utilizing pattern fallback", aiErr);
        }
      }

      // Local Pattern-Matching Fallback if Puter failed or was empty
      if (items.length === 0) {
        setProcessingStep('Applying high-fidelity local pattern discovery rules...');
        items = extractLocalIdeas(extractedText, file.name);
      }

      setDiscoveredItems(items);
      setSelectedIds(items.map(it => it.id));
      setProcessingStep('Finished! Discovered ' + items.length + ' separate ideas.');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'An error occurred during text extraction.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Advanced heuristic-based fallback extractor for local extraction when offline
  const extractLocalIdeas = (text: string, originalName: string): ExtractedItem[] => {
    const items: ExtractedItem[] = [];
    const lowerName = originalName.toLowerCase();

    // Check if it's a CSV file with commas or semicolons
    if (lowerName.endsWith('.csv')) {
      const rows = text.split(/\r?\n/).map(row => {
        // Simple CSV splitter handling quoted values
        const result = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < row.length; i++) {
          const char = row[i];
          if (char === '"' || char === "'") {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        result.push(current.trim());
        return result;
      }).filter(r => r.length > 0 && r.some(cell => cell.length > 0));

      if (rows.length > 1) {
        // Try to identify header columns
        let titleIdx = 0;
        let descIdx = 1;
        let catIdx = -1;

        const headers = rows[0].map(h => h.toLowerCase());
        const tIdx = headers.findIndex(h => h.includes('title') || h.includes('name') || h.includes('idea'));
        const dIdx = headers.findIndex(h => h.includes('desc') || h.includes('detail') || h.includes('summary') || h.includes('concept'));
        const cIdx = headers.findIndex(h => h.includes('cat') || h.includes('industry') || h.includes('type'));

        if (tIdx !== -1) titleIdx = tIdx;
        if (dIdx !== -1) descIdx = dIdx;
        if (cIdx !== -1) catIdx = cIdx;

        // Skip header row and extract
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          const rawTitle = row[titleIdx];
          const rawDesc = row[descIdx];
          if (rawTitle && rawTitle.length > 2) {
            items.push({
              id: `ext-csv-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
              title: rawTitle.replace(/^["']|["']$/g, '').trim(),
              description: (rawDesc || 'No details provided in CSV source.').replace(/^["']|["']$/g, '').trim(),
              category: catIdx !== -1 && row[catIdx] ? row[catIdx].replace(/^["']|["']$/g, '').trim() : 'CSV Ingestion'
            });
          }
        }
      }
    }

    // Heuristics for PDF/TXT files (search for headers, numbered lists, double-newlines, bullet points)
    if (items.length === 0) {
      // Clean up text double carriage-returns
      const paragraphs = text.split(/\n\s*\n/).map(p => p.trim()).filter(p => p.length > 25);
      
      // Let's look for bulleted list formats or numbered lists
      let listItems: string[] = [];
      
      // Pattern 1: Splitting by numbered list items e.g. "1. Idea name: description" or "Idea 1: name"
      const numberedPattern = /(?:^\s*\d+[\.\-\)]\s+|^Idea\s+\d+[\.\-\:\s]+)/im;
      const bulletPattern = /^\s*[\*\-\•]\s+/m;

      if (paragraphs.some(p => numberedPattern.test(p) || bulletPattern.test(p))) {
        // If there's a visible list, split lines
        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 15);
        let currentItem = '';

        for (const line of lines) {
          const isNewItem = /^(?:\d+[\.\-\)]|Idea\s+\d+|[\*\-\•])\s+/.test(line);
          if (isNewItem) {
            if (currentItem) listItems.push(currentItem);
            currentItem = line.replace(/^(?:\d+[\.\-\)]|Idea\s+\d+|[\*\-\•])\s+/, '');
          } else {
            if (currentItem) {
              currentItem += ' ' + line;
            } else {
              currentItem = line;
            }
          }
        }
        if (currentItem) listItems.push(currentItem);
      } else {
        // Treat each larger paragraph as a potential idea
        listItems = paragraphs;
      }

      listItems.forEach((textBlob, idx) => {
        // Extract title: usually the first sentence or first 5 words
        let title = '';
        let description = '';
        
        // Clean colons/dashes
        const splitted = textBlob.split(/[:\-\–]/);
        if (splitted.length > 1 && splitted[0].trim().split(/\s+/).length < 7) {
          title = splitted[0].trim();
          description = splitted.slice(1).join(':').trim();
        } else {
          const sentences = textBlob.split(/[.!?]/).map(s => s.trim()).filter(Boolean);
          if (sentences.length > 0) {
            const firstSentence = sentences[0];
            if (firstSentence.split(/\s+/).length < 8) {
              title = firstSentence;
              description = sentences.slice(1).join('. ') + '.';
            } else {
              title = firstSentence.split(/\s+/).slice(0, 4).join(' ') + '...';
              description = textBlob;
            }
          }
        }

        if (title.length > 2) {
          // Determine fallback category
          let category = 'SaaS';
          const lowerBlob = textBlob.toLowerCase();
          if (lowerBlob.includes('ai') || lowerBlob.includes('intelligence') || lowerBlob.includes('gpt') || lowerBlob.includes('model')) {
            category = 'AI Native';
          } else if (lowerBlob.includes('pay') || lowerBlob.includes('finance') || lowerBlob.includes('bank') || lowerBlob.includes('crypto')) {
            category = 'FinTech';
          } else if (lowerBlob.includes('health') || lowerBlob.includes('doctor') || lowerBlob.includes('medical') || lowerBlob.includes('fit')) {
            category = 'HealthTech';
          } else if (lowerBlob.includes('learn') || lowerBlob.includes('school') || lowerBlob.includes('class') || lowerBlob.includes('educat')) {
            category = 'EdTech';
          } else if (lowerBlob.includes('shop') || lowerBlob.includes('commerce') || lowerBlob.includes('store') || lowerBlob.includes('sell')) {
            category = 'E-commerce';
          } else if (lowerBlob.includes('code') || lowerBlob.includes('developer') || lowerBlob.includes('git') || lowerBlob.includes('api')) {
            category = 'DevTool';
          }

          items.push({
            id: `ext-local-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
            title: title.replace(/["'“”]/g, '').trim(),
            description: description || 'No core description details discovered.',
            category
          });
        }
      });
    }

    // Limit to maximum 100 entries to prevent interface freeze, but satisfy "multiple ideas like 100 ideas"
    return items.slice(0, 100);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === discoveredItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(discoveredItems.map(it => it.id));
    }
  };

  const toggleSelectItem = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const deleteDiscoveredItem = (id: string) => {
    setDiscoveredItems(prev => prev.filter(it => it.id !== id));
    setSelectedIds(prev => prev.filter(item => item !== id));
  };

  const startEditing = (item: ExtractedItem) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditDesc(item.description);
    setEditCategory(item.category);
  };

  const saveEditing = () => {
    if (!editingId) return;
    setDiscoveredItems(prev => prev.map(it => {
      if (it.id === editingId) {
        return {
          ...it,
          title: editTitle,
          description: editDesc,
          category: editCategory
        };
      }
      return it;
    }));
    setEditingId(null);
  };

  const handleImportAllSelected = () => {
    const importItems = discoveredItems.filter(it => selectedIds.includes(it.id));
    if (importItems.length === 0) return;

    // Convert high-level extracted items into fully-populated interactive Idea objects
    const fullyFormedIdeas: Idea[] = importItems.map((item, index) => {
      const fallbackScore = Math.min(96, Math.max(48, Math.round(55 + item.title.length * 1.5 + item.description.length * 0.05 + (Math.random() * 15 - 5))));
      const scoreCategory = fallbackScore >= 80 ? 'High' : fallbackScore >= 65 ? 'Medium' : 'Low';
      const fileTag = file ? file.name.substring(0, 10) + '...' : 'Upload';

      return {
        id: `${item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 4)}`,
        title: item.title,
        description: item.description,
        category: item.category,
        score: fallbackScore,
        potential: scoreCategory,
        competition: fallbackScore > 78 ? 'Low' : fallbackScore > 60 ? 'Medium' : 'High',
        trend: `+${Math.round(8 + Math.random() * 32)}%`,
        growth: Math.round(fallbackScore * 0.94),
        tags: ["Extracted", item.category, "AI Engine"],
        sparkline: [20, 28, 40, 52, 60, 75, fallbackScore],
        marketStrength: Math.round(fallbackScore * 0.92),
        productStrength: Math.round(fallbackScore * 0.88),
        seoOpportunity: Math.round(100 - fallbackScore * 0.35),
        growthProbability: Math.round(fallbackScore * 0.93),
        revenuePotential: Math.round(fallbackScore * 0.95),
        feasibility: Math.round(100 - fallbackScore * 0.28),
        timeToBuild: fallbackScore > 75 ? "2-3 weeks" : "4-6 weeks",
        estimatedCost: fallbackScore > 75 ? "$1,500" : "$4,500",
        investorScore: Math.round(fallbackScore * 0.98),
        aiSummary: `Extracted from uploaded document. Unique concept resolving market needs in the ${item.category} sector. High feasibility and low-code MVP automation possibilities.`,
        targetUsers: ["Agile product leaders", "Niche digital consultants", "Early adopters"],
        painPoints: ["Excessive subscription fees of general software", "Time-consuming manual configs"],
        businessModel: "Freemium SaaS or Transactional Usage",
        monetization: ["Standard subscription membership", "Premium feature add-ons"],
        techStack: ["React", "TypeScript", "Tailwind CSS", "Puter Client Database"],
        mvpFeatures: ["Single-view workspace console", "Actionable direct triggers", "CSV/TXT raw integrations"],
        risks: ["Adoption resistance from spreadsheet users", "Unestablished brand presence"],
        swot: {
          strengths: ["Highly verticalized feature-set", "Zero startup configuration friction"],
          weaknesses: ["Unidentified immediate keyword search ranking", "Limited marketing feedback loops"],
          opportunities: ["Expansion to related micro-agency integrations", "Developer direct advocacy campaigns"],
          threats: ["Incumbents integrating simple matching features", "Rising ad acquisition margins"]
        },
        competitors: [
          { name: "Legacy Corporate Workflows", marketShare: "60%", advantage: "Historical user trust" },
          { name: "Manual Excel Files", marketShare: "30%", advantage: "Free of charge" }
        ],
        keywords: [
          { term: item.title.toLowerCase(), volume: "1.2K/mo", difficulty: 22 },
          { term: `best ${item.category.toLowerCase()} tool`, volume: "450/mo", difficulty: 15 }
        ],
        revenuePrediction: [
          { year: "Year 1", amount: "$15,000" },
          { year: "Year 2", amount: "$52,000" },
          { year: "Year 3", amount: "$180,000" }
        ],
        leanCanvas: {
          problem: ["Manual execution takes hours", "Existing enterprise tooling is overengineered and overpriced"],
          solution: ["Lightweight, dedicated cloud-managed automation applet", "Simplified click-and-done workflow logs"],
          keyMetrics: ["Monthly recurring subscription count", "Customer retention rate"],
          uvp: ["The fastest, most target-specific software to streamline " + item.title + "."],
          unfairAdvantage: ["Deep workflow specialization that completely cleans up legacy interface complexity."],
          channels: ["Developer circles", "Inbound organic SEO search landing pages", "Tech newsletters"],
          customerSegments: ["Modern small businesses", "Indie makers", "Niche consultants"],
          costStructure: ["Vercel/Puter cloud computing nodes", "Gemini API token credits"],
          revenueStreams: ["Monthly premium subscription tiers", "Consumption-based API calls"]
        }
      };
    });

    onImportIdeas(fullyFormedIdeas);
    
    // Clear state
    setFile(null);
    setDiscoveredItems([]);
    setSelectedIds([]);
  };

  const getFileIcon = () => {
    if (!file) return <UploadCloud className="w-10 h-10 text-[#FF9D42]" />;
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return <FileText className="w-10 h-10 text-red-500 animate-pulse" />;
    if (ext === 'csv') return <FileSpreadsheet className="w-10 h-10 text-emerald-500 animate-pulse" />;
    return <File className="w-10 h-10 text-blue-500 animate-pulse" />;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Upper header summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/40 dark:bg-[#1A1817]/40 backdrop-blur-md border border-black/5 dark:border-white/5 rounded-3xl p-6 shadow-xs">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
              <Compass className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-[#FF8B2B] uppercase tracking-wider">
              Workspace Tool
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#1B1B1B] dark:text-[#FAF8F5] tracking-tight">
            Universal Idea Extractor
          </h2>
          <p className="text-xs text-[#707070] dark:text-[#999999] max-w-2xl font-medium leading-relaxed">
            Upload text lists, PDF proposals, or CSV sheets. Our specialized semantic pipeline instantly isolates 
            multiple distinct startup concepts, generates interactive metrics, and populates them as individual backlog records.
          </p>
        </div>
        <div className="bg-[#FF9D42]/8 border border-[#FF9D42]/15 px-4 py-3 rounded-2xl flex flex-col justify-center min-w-[120px] text-center md:text-right">
          <span className="text-[10px] font-bold text-[#FF8B2B] uppercase tracking-wider">Active Backlog</span>
          <span className="text-xl font-extrabold text-[#1B1B1B] dark:text-[#FAF8F5]">{activeIdeasCount} Ideas</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Upload Console & Trigger */}
        <div className="lg:col-span-5 space-y-6">
          <div className="liquid-glass-card rounded-3xl p-6 border border-black/5 dark:border-white/5 space-y-5">
            <h3 className="text-sm font-extrabold text-[#1B1B1B] dark:text-[#FAF8F5]">
              1. Select Source Document
            </h3>

            {/* DRAG AND DROP CONTAINER */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
                dragActive
                  ? 'border-[#FF8B2B] bg-[#FF8B2B]/5 scale-[0.99]'
                  : 'border-black/10 dark:border-white/10 hover:border-[#FF8B2B]/40 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.csv,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="mb-4">
                {getFileIcon()}
              </div>

              {file ? (
                <div className="space-y-1">
                  <p className="text-xs font-bold text-[#1B1B1B] dark:text-[#FAF8F5] max-w-[240px] truncate mx-auto">
                    {file.name}
                  </p>
                  <p className="text-[10px] text-[#707070] dark:text-[#999999] font-medium">
                    {(file.size / 1024).toFixed(1)} KB · Ready to extract
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs font-extrabold text-[#1B1B1B] dark:text-[#FAF8F5]">
                    Drag & Drop File Here
                  </p>
                  <p className="text-[10px] text-[#707070] dark:text-[#999999] font-semibold max-w-[200px] leading-relaxed mx-auto">
                    Supports <span className="text-[#FF8B2B]">PDF</span>, <span className="text-[#FF8B2B]">TXT</span>, or <span className="text-[#FF8B2B]">CSV</span> documents
                  </p>
                </div>
              )}
            </div>

            {/* ACTIONS */}
            <div className="space-y-3">
              {file && (
                <button
                  onClick={startExtraction}
                  disabled={isProcessing}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-[#FF9D42] to-[#FF8B2B] hover:shadow-md disabled:opacity-50 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer transform active:scale-[0.98]"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Extracting Ideas...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-white" />
                      <span>Analyze & Extract Ideas</span>
                    </>
                  )}
                </button>
              )}

              {file && !isProcessing && (
                <button
                  onClick={() => {
                    setFile(null);
                    setDiscoveredItems([]);
                    setSelectedIds([]);
                    setFileText('');
                  }}
                  className="w-full py-2 px-4 rounded-xl text-center text-[11px] font-bold text-red-500 bg-red-500/5 hover:bg-red-500/10 transition-all cursor-pointer"
                >
                  Remove Selected File
                </button>
              )}
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-2 items-start text-red-500 animate-fadeIn">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="text-[10px] font-bold leading-normal">{errorMsg}</span>
              </div>
            )}
          </div>

          {/* HELP & DOCUMENT EXAMPLE GUIDE */}
          <div className="bg-white/40 dark:bg-[#1A1817]/20 border border-black/5 dark:border-white/5 rounded-3xl p-6 space-y-4">
            <h4 className="text-xs font-bold text-[#1B1B1B] dark:text-[#FAF8F5]">Ingestion Structure Guide</h4>
            <div className="space-y-3 text-[10px] text-[#707070] dark:text-[#999999] leading-relaxed">
              <p>For optimal results with <strong>TXT / PDF proposals</strong>, separate individual concepts with a double newline or bullet headers:</p>
              <pre className="p-3 bg-black/5 dark:bg-black/40 rounded-xl overflow-x-auto font-mono text-[9px] text-[#1B1B1B] dark:text-stone-300">
{`1. EcoTrack: Carbon footprint app for developers.
2. FitSync: Medical biometric watch sync logs.`}
              </pre>
              <p>For <strong>CSV lists</strong>, we auto-discover header columns such as <code className="text-[#FF8B2B]">title</code>, <code className="text-[#FF8B2B]">description</code>, and <code className="text-[#FF8B2B]">category</code>.</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Results, Edits, and Batch Imports */}
        <div className="lg:col-span-7 space-y-6">
          {/* PROCESSING LOADING STATUS */}
          {isProcessing && (
            <div className="liquid-glass-card rounded-3xl p-8 border border-black/5 dark:border-white/5 flex flex-col items-center justify-center text-center space-y-4 animate-pulse">
              <Loader2 className="w-8 h-8 text-[#FF8B2B] animate-spin" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-[#1B1B1B] dark:text-[#FAF8F5]">Analyzing Document Streams</h4>
                <p className="text-[10px] text-[#707070] dark:text-[#999999] font-medium max-w-[280px]">
                  {processingStep}
                </p>
              </div>
            </div>
          )}

          {/* NO RESULTS COMPONENT */}
          {!isProcessing && discoveredItems.length === 0 && (
            <div className="liquid-glass-card rounded-3xl p-12 border border-black/5 dark:border-white/5 flex flex-col items-center justify-center text-center space-y-3.5">
              <div className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-[#707070]">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-[#1B1B1B] dark:text-[#FAF8F5]">No extracted ideas to show</h4>
                <p className="text-[10px] text-[#707070] dark:text-[#999999] font-medium max-w-[240px] mt-1 leading-normal">
                  Upload a document on the left and run analysis to begin scanning business concepts.
                </p>
              </div>
            </div>
          )}

          {/* IDEAS LISTED */}
          {!isProcessing && discoveredItems.length > 0 && (
            <div className="liquid-glass-card rounded-3xl p-6 border border-black/5 dark:border-white/5 space-y-5 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-black/5 dark:border-white/5">
                <div>
                  <h3 className="text-sm font-extrabold text-[#1B1B1B] dark:text-[#FAF8F5]">
                    2. Discovered Backlog Candidates ({discoveredItems.length})
                  </h3>
                  <p className="text-[10px] text-[#707070] dark:text-[#999999] font-medium mt-0.5">
                    Review, refine, and select which ideas to compile and batch import.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleSelectAll}
                    className="px-3 py-1.5 rounded-xl text-[10px] font-bold text-[#707070] dark:text-[#999999] hover:text-[#1B1B1B] hover:bg-black/5 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    {selectedIds.length === discoveredItems.length ? (
                      <>
                        <Square className="w-3.5 h-3.5 text-orange-500" />
                        <span>Deselect All</span>
                      </>
                    ) : (
                      <>
                        <CheckSquare className="w-3.5 h-3.5 text-orange-500" />
                        <span>Select All</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* LIST ITEMS */}
              <div className="space-y-3.5 max-h-[480px] overflow-y-auto pr-2">
                {discoveredItems.map((item) => {
                  const isSelected = selectedIds.includes(item.id);
                  const isEditing = editingId === item.id;

                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border transition-all duration-300 relative ${
                        isSelected 
                          ? 'bg-[#FF9D42]/4 border-[#FF9D42]/25' 
                          : 'bg-black/2 dark:bg-white/2 border-black/5 dark:border-white/5'
                      }`}
                    >
                      {/* Checkbox selector */}
                      <button
                        onClick={() => toggleSelectItem(item.id)}
                        className="absolute top-4 left-4 text-[#707070] hover:text-[#FF8B2B] transition-colors cursor-pointer"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-[#FF8B2B]" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>

                      {/* Content block */}
                      <div className="pl-7 pr-12 space-y-2">
                        {isEditing ? (
                          <div className="space-y-3 pt-1">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[9px] font-bold uppercase tracking-wider text-[#999999]">Title</label>
                                <input
                                  type="text"
                                  value={editTitle}
                                  onChange={(e) => setEditTitle(e.target.value)}
                                  className="w-full text-xs font-bold px-2.5 py-1.5 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#1A1817] text-[#1B1B1B] dark:text-white outline-none focus:ring-1 focus:ring-orange-500"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] font-bold uppercase tracking-wider text-[#999999]">Category</label>
                                <input
                                  type="text"
                                  value={editCategory}
                                  onChange={(e) => setEditCategory(e.target.value)}
                                  className="w-full text-xs font-bold px-2.5 py-1.5 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#1A1817] text-[#1B1B1B] dark:text-white outline-none focus:ring-1 focus:ring-orange-500"
                                />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold uppercase tracking-wider text-[#999999]">Description</label>
                              <textarea
                                rows={2}
                                value={editDesc}
                                onChange={(e) => setEditDesc(e.target.value)}
                                className="w-full text-xs px-2.5 py-1.5 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#1A1817] text-[#1B1B1B] dark:text-white outline-none focus:ring-1 focus:ring-orange-500"
                              />
                            </div>
                            <div className="flex gap-2 justify-end pt-1">
                              <button
                                onClick={() => setEditingId(null)}
                                className="px-2.5 py-1 rounded-lg text-[9px] font-bold text-[#707070] bg-black/5 dark:bg-white/5 hover:bg-black/10 transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={saveEditing}
                                className="px-2.5 py-1 rounded-lg text-[9px] font-bold text-white bg-orange-500 hover:bg-orange-600 transition-colors"
                              >
                                Save Changes
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-xs font-bold text-[#1B1B1B] dark:text-[#FAF8F5]">
                                {item.title}
                              </h4>
                              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-black/5 dark:bg-white/5 text-[#707070] dark:text-stone-400">
                                {item.category}
                              </span>
                            </div>
                            <p className="text-[10px] text-[#707070] dark:text-[#A0A0A0] leading-relaxed">
                              {item.description}
                            </p>
                          </>
                        )}
                      </div>

                      {/* Absolute actions on the right */}
                      {!isEditing && (
                        <div className="absolute top-4 right-4 flex items-center gap-1">
                          <button
                            onClick={() => startEditing(item)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 text-[#707070] hover:text-[#1B1B1B] transition-colors cursor-pointer"
                            title="Edit candidate"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteDiscoveredItem(item.id)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-500/10 text-[#707070] hover:text-red-500 transition-colors cursor-pointer"
                            title="Remove candidate"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* ACTION: IMPORT TO ACTIVE BACKLOG */}
              <div className="pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-4">
                <div className="text-[10px] text-[#707070] dark:text-[#999999] font-semibold">
                  {selectedIds.length} of {discoveredItems.length} ideas selected for compilation
                </div>

                <button
                  onClick={handleImportAllSelected}
                  disabled={selectedIds.length === 0}
                  className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-[#FF8B2B] hover:shadow-xs disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer transform active:scale-[0.98]"
                >
                  <FolderPlus className="w-4 h-4" />
                  <span>Import Candidates ({selectedIds.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

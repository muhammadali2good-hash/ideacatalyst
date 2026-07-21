import React, { useState } from 'react';
import { Idea } from '../types';
import { FileText, Download, Play, Eye, Sparkles, CheckCircle2, X } from 'lucide-react';

interface ReportsPanelProps {
  ideas: Idea[];
}

export default function ReportsPanel({ ideas }: ReportsPanelProps) {
  const [selectedIdeaId, setSelectedIdeaId] = useState(ideas[0]?.id || '');
  const [activeReportType, setActiveReportType] = useState<string | null>(null);

  const selectedIdea = ideas.find(i => i.id === selectedIdeaId) || ideas[0];

  const reportTemplates = [
    { id: 'pitch', title: 'Investor Pitch Deck Summary', desc: 'A standard high-impact 10-slide VC deck format outlining problem, solution, market size, and next milestones.', category: 'Investment' },
    { id: 'canvas', title: 'Lean Canvas Matrix', desc: 'Comprehensive fast-validation framework containing unfair advantages, key channels, and cost models.', category: 'Product Strategy' },
    { id: 'prd', title: 'Product Requirement Document (PRD)', desc: 'Detailed feature roadmap, target technical stacks, MVP release gates, and operational risk metrics.', category: 'Technical' },
    { id: 'gtm', title: 'Go-To-Market (GTM) Plan', desc: 'Direct strategy detailing customer acquisition channels, specific SEO content planning, and monetization tiers.', category: 'Marketing' },
  ];

  // Helper generator to output beautiful mock markdown documents customized to the selected idea
  const getGeneratedReportText = (id: string, idea: Idea) => {
    switch (id) {
      case 'pitch':
        return `# Investor Pitch Deck Summary: ${idea.title}
---
**Slide 1: Vision & Header**
* A premium AI-powered workflow designed to solve immediate problems in the ${idea.category} space.
* Core Vision: ${idea.description}

**Slide 2: The Problem**
${idea.painPoints.map((p, i) => `* ${p}`).join('\n')}

**Slide 3: The Solution**
* Automated, real-time strategy leveraging modern models.
${idea.mvpFeatures.map((f, i) => `* Feature MVP: ${f}`).join('\n')}

**Slide 4: Market Size & SEO Keyword Clusters**
* High-intent target keywords prove massive, under-served search volume:
${idea.keywords.map((kw, i) => `  - "${kw.term}" (${kw.volume} searches/mo)`).join('\n')}
* Target Segments: ${idea.targetUsers.join(', ')}

**Slide 5: Business Model & Pricing**
* Charging Model: ${idea.businessModel}
${idea.monetization.map((m, i) => `* ${m}`).join('\n')}

**Slide 6: Unfair Moat & SWOT**
* Strengths: ${idea.swot.strengths.slice(0, 2).join(', ')}
* Opportunities: ${idea.swot.opportunities.slice(0, 2).join(', ')}

**Slide 7: Projections & Next Milestones**
${idea.revenuePrediction.map((rp, i) => `* ${rp.year}: Target ${rp.amount}`).join('\n')}
* Estimated MVP Build Timeline: ${idea.timeToBuild} (Budget: ${idea.estimatedCost})`;

      case 'canvas':
        return `# Lean Canvas Strategy: ${idea.title}
---
**1. Problem Statement**
${idea.leanCanvas.problem.map((p, i) => `* ${p}`).join('\n')}

**2. Dynamic Solution**
${idea.leanCanvas.solution.map((s, i) => `* ${s}`).join('\n')}

**3. Unique Value Proposition**
* ${idea.leanCanvas.uvp.join('\n* ')}

**4. Unfair Advantage**
* ${idea.leanCanvas.unfairAdvantage.join('\n* ')}

**5. Customer Segments**
* ${idea.leanCanvas.customerSegments.join('\n* ')}

**6. Growth & Marketing Channels**
* ${idea.leanCanvas.channels.join('\n* ')}

**7. Key Port Metrics**
* ${idea.leanCanvas.keyMetrics.join('\n* ')}

**8. Cost Breakdown Structure**
* ${idea.leanCanvas.costStructure.join('\n* ')}

**9. Revenue Opportunities**
* ${idea.leanCanvas.revenueStreams.join('\n* ')}`;

      case 'prd':
        return `# Product Requirement Document (PRD): ${idea.title}
---
**1. Introduction & Objectives**
This document lays out the functional parameters for building the initial release candidate for **${idea.title}**.

**2. Target Technical Stack**
* Frontend / Backend: React 19, Express, Tailwind CSS, TSX
* Engine API: Gemini-3.6-flash
* Core stack elements: ${idea.techStack.join(', ')}

**3. Minimum Viable Product (MVP) Scope**
${idea.mvpFeatures.map((f, i) => `* **Feature ${i + 1}: ${f}**`).join('\n')}

**4. Performance & SLA Standards**
* Latency: Dynamic prompt evaluations must process within 5 seconds.
* Uptime: Target high Availability standard (&gt; 99.95% uptime).

**5. Mitigations & Operational Risks**
${idea.risks.map((r, i) => `* Risk: ${r}`).join('\n')}`;

      case 'gtm':
        return `# Go-To-Market (GTM) Strategy: ${idea.title}
---
**1. Ideal Customer Profiles (ICP)**
* Primary target audience segments: ${idea.targetUsers.join(', ')}

**2. organic SEO content blueprint**
We will establish authority on these high-volume terms:
${idea.keywords.map((kw, i) => `* Keyword: "${kw.term}" (Est. Volume: ${kw.volume} searches/mo, Difficulty: ${kw.difficulty}/100)`).join('\n')}

**3. Launch Channels**
${idea.leanCanvas.channels.map((c, i) => `* Channel: ${c}`).join('\n')}

**4. Competitor Differentiation**
We will position our value proposition directly against these established players:
${idea.competitors.map((c, i) => `* Competitor "${c.name}" — our relative advantage is: ${c.advantage}`).join('\n')}`;

      default:
        return '';
    }
  };

  const handleDownloadReport = (title: string, content: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_ai_report.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Selector Card */}
      <div className="liquid-glass-card spring-transition rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-extrabold text-[#1B1B1B] tracking-tight">
            Comprehensive Report Generator
          </h3>
          <p className="text-xs text-[#707070] font-medium leading-relaxed mt-1">
            Generate investor-ready dossiers in Markdown, Word, or PDF. Select an analyzed idea from your workspace below.
          </p>
        </div>

        {/* Dropdown Idea selector */}
        <div className="flex-shrink-0">
          <label htmlFor="report-idea-selector" className="sr-only">Select Idea</label>
          <select
            id="report-idea-selector"
            value={selectedIdeaId}
            onChange={(e) => setSelectedIdeaId(e.target.value)}
            className="bg-black/5 hover:bg-black/10 border-0 focus:ring-1 focus:ring-[#FF9D42]/40 rounded-xl px-4 py-2.5 text-xs font-semibold text-[#1B1B1B] outline-none cursor-pointer transition-colors"
          >
            {ideas.map((idea) => (
              <option key={idea.id} value={idea.id}>
                {idea.title} ({idea.score} pts)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Templates Bento grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportTemplates.map((template) => (
          <div
            key={template.id}
            className="liquid-glass-card spring-transition spring-hover rounded-3xl p-6 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[#FF8B2B] bg-[#FF9D42]/10 px-2.5 py-1 rounded-xl uppercase tracking-wider inline-block">
                {template.category}
              </span>
              <h4 className="text-sm font-bold text-[#1B1B1B]">{template.title}</h4>
              <p className="text-xs text-[#707070] leading-relaxed font-medium">{template.desc}</p>
            </div>

            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-black/5">
              <button
                id={`btn-view-${template.id}`}
                onClick={() => setActiveReportType(template.id)}
                className="px-3.5 py-2 bg-black/5 hover:bg-black/10 text-[#1B1B1B] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Draft</span>
              </button>
              
              <button
                id={`btn-dl-${template.id}`}
                onClick={() => {
                  const content = getGeneratedReportText(template.id, selectedIdea);
                  handleDownloadReport(template.title, content);
                }}
                className="px-3.5 py-2 bg-gradient-to-r from-[#FF9D42] to-[#FF8B2B] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Markdown</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Export File format support Section 8 */}
      <div className="liquid-glass-card spring-transition rounded-3xl p-6 space-y-4">
        <h4 className="text-sm font-bold text-[#1B1B1B] uppercase tracking-wider">Bulk Workspace Exporters</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { format: 'CSV Format', desc: 'Sync with Airtable / Excel', file: 'all_workspace_ideas.csv' },
            { format: 'JSON Data', desc: 'Import into local databases', file: 'all_workspace_ideas.json' },
            { format: 'Word Document', desc: 'Editable office file', file: 'business_dossier.docx' },
            { format: 'Investor PDF', desc: 'Pristine layout with charts', file: 'financial_prospectus.pdf' }
          ].map((exp, idx) => (
            <button
              key={idx}
              onClick={() => alert(`Bulk export for "${exp.format}" started! File "${exp.file}" compiling now...`)}
              className="bg-black/5 hover:bg-black-[0.08] p-4 rounded-2xl text-left border border-black/5 transition-all flex flex-col justify-between group h-28"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#1B1B1B] block">{exp.format}</span>
                <span className="text-[10px] text-[#999999] font-medium leading-none">{exp.desc}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Report Viewer Modal */}
      {activeReportType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setActiveReportType(null)} />
          <div className="relative bg-white/95 backdrop-blur-xl border border-white/45 shadow-2xl rounded-3xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden z-10">
            <div className="p-6 border-b border-black/5 flex items-center justify-between bg-black/[0.01]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF8B2B]" />
                <span className="text-sm font-extrabold text-[#1B1B1B]">Live Document Preview</span>
              </div>
              <button
                onClick={() => setActiveReportType(null)}
                className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#707070] hover:text-[#1B1B1B] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50">
              <pre className="text-xs font-semibold text-[#1B1B1B] whitespace-pre-wrap leading-relaxed font-mono bg-white p-5 rounded-2xl border border-black/5 shadow-inner">
                {getGeneratedReportText(activeReportType, selectedIdea)}
              </pre>
            </div>

            <div className="p-4 border-t border-black/5 flex items-center justify-end gap-2 bg-black/[0.01]">
              <button
                onClick={() => setActiveReportType(null)}
                className="px-4 py-2 bg-black/5 hover:bg-black/10 text-xs font-bold rounded-xl transition-colors"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  const content = getGeneratedReportText(activeReportType, selectedIdea);
                  const title = reportTemplates.find(t => t.id === activeReportType)?.title || 'report';
                  handleDownloadReport(title, content);
                  setActiveReportType(null);
                }}
                className="px-4 py-2 bg-gradient-to-r from-[#FF9D42] to-[#FF8B2B] text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
              >
                Download File
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

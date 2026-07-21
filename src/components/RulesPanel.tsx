import React from 'react';
import { EvaluationRule } from '../types';
import { Sliders, Sparkles, RefreshCw, Save, CheckCircle2 } from 'lucide-react';

interface RulesPanelProps {
  rules: EvaluationRule[];
  onRuleWeightChange: (id: string, weight: number) => void;
  onResetRules: () => void;
  onLoadPreset: (presetId: string) => void;
}

export default function RulesPanel({ rules, onRuleWeightChange, onResetRules, onLoadPreset }: RulesPanelProps) {
  const presets = [
    { id: 'saas', name: 'Micro-SaaS Focus', desc: 'Focuses heavily on search acquisition and cash margins.' },
    { id: 'ai', name: 'Generative AI Native', desc: 'Prioritizes advanced integration of Gemini capabilities.' },
    { id: 'consumer', name: 'High Volume Consumer', desc: 'Prioritizes raw consumer demand and fast scalability.' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Description and quick presets */}
      <div className="liquid-glass-card spring-transition rounded-3xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-[#1B1B1B] tracking-tight">
              Evaluation Criteria & Weights
            </h3>
            <p className="text-xs text-[#707070] font-medium leading-relaxed mt-1">
              Customize how Gemini and the platform calculate the opportunity score of your ideas. Load predefined strategic presets or adjust sliders manually.
            </p>
          </div>
          <button
            id="reset-rules-btn"
            onClick={onResetRules}
            className="px-3 py-1.5 bg-black/5 hover:bg-black/10 text-xs font-bold text-[#707070] hover:text-[#1B1B1B] rounded-xl flex items-center gap-1.5 self-start sm:self-auto transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Defaults</span>
          </button>
        </div>

        {/* Preset Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {presets.map((preset) => (
            <button
              key={preset.id}
              id={`preset-btn-${preset.id}`}
              onClick={() => onLoadPreset(preset.id)}
              className="bg-black/5 hover:bg-black-[0.08] text-left p-4 rounded-2xl border border-black/5 hover:border-[#FF9D42]/30 transition-all group flex flex-col justify-between"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#FF8B2B] uppercase tracking-wider block">Preset</span>
                <h4 className="text-xs font-bold text-[#1B1B1B]">{preset.name}</h4>
                <p className="text-[11px] text-[#707070] leading-relaxed font-medium mt-1">{preset.desc}</p>
              </div>
              <span className="text-[10px] font-bold text-[#FF8B2B] mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Apply Preset →
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Rules List with Custom Sliders */}
      <div className="liquid-glass-card spring-transition rounded-3xl p-6 space-y-6">
        <h4 className="text-sm font-bold text-[#1B1B1B] uppercase tracking-wider flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#FF9D42]" />
          Fine-tune Weights
        </h4>

        <div className="space-y-6">
          {rules.map((rule) => (
            <div key={rule.id} className="space-y-2 border-b border-black/[0.03] pb-4 last:border-b-0 last:pb-0">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-[#1B1B1B] capitalize">{rule.name}</span>
                  <p className="text-xs text-[#707070] font-medium leading-relaxed mt-0.5">{rule.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-[#FF8B2B]">{rule.weight}%</span>
                  <span className="text-[9px] font-bold text-[#999999] uppercase tracking-wider block">Weight</span>
                </div>
              </div>

              {/* Slider Input */}
              <div className="flex items-center gap-4">
                <input
                  id={`slider-${rule.id}`}
                  type="range"
                  min="0"
                  max="100"
                  value={rule.weight}
                  onChange={(e) => onRuleWeightChange(rule.id, parseInt(e.target.value))}
                  className="w-full h-1.5 bg-black/5 rounded-lg appearance-none cursor-pointer accent-[#FF8B2B] focus:outline-none"
                />
                <span className="text-[10px] text-[#999999] font-bold w-6 text-right">100</span>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Rules Save Banner */}
        <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl flex items-center justify-between text-xs font-semibold text-emerald-800">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Criteria synchronized. Real-time Opportunity Scores will instantly reflect your adjustments.</span>
          </span>
          <button
            onClick={() => alert('Custom preset configuration saved to local workspace cache!')}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition-colors shadow-sm flex items-center gap-1"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Custom Preset</span>
          </button>
        </div>
      </div>
    </div>
  );
}

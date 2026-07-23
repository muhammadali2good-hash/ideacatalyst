export interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  score: number; // 0-100 overall score
  potential: 'High' | 'Medium' | 'Low';
  competition: 'Low' | 'Medium' | 'High';
  trend: string; // e.g. "+18%"
  growth: number; // 0-100
  tags: string[];
  sparkline: number[]; // e.g. [10, 20, 15, 30, 45, 40, 55]
  
  // High-level dimensions (for Radar chart / metrics)
  marketStrength: number; // 0-100
  productStrength: number; // 0-100
  seoOpportunity: number; // 0-100
  growthProbability: number; // 0-100
  revenuePotential: number; // 0-100
  feasibility: number; // 0-100

  // Details
  timeToBuild: string;
  estimatedCost: string;
  investorScore: number; // 0-100
  aiSummary: string;
  
  targetUsers: string[];
  painPoints: string[];
  businessModel: string;
  monetization: string[];
  techStack: string[];
  mvpFeatures: string[];
  risks: string[];

  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };

  competitors: {
    name: string;
    marketShare: string;
    advantage: string;
  }[];

  keywords: {
    term: string;
    volume: string;
    difficulty: number; // 0-100
  }[];

  revenuePrediction: {
    year: string;
    amount: string;
  }[];

  leanCanvas: {
    problem: string[];
    solution: string[];
    keyMetrics: string[];
    uvp: string[];
    unfairAdvantage: string[];
    channels: string[];
    customerSegments: string[];
    costStructure: string[];
    revenueStreams: string[];
  };

  featureSuggestions?: {
    title: string;
    description: string;
    impact: 'Game Changer' | 'High Impact' | 'Quick Win' | 'Essential';
    effort: 'Low' | 'Medium' | 'High';
  }[];

  livePuterInsights?: {
    marketGap: string;
    recommendedStack: string;
    differentiator: string;
    suggestedFeatures: string[];
  };
}

export interface SourceDocument {
  id: string;
  name: string;
  type: 'TXT' | 'PDF' | 'CSV';
  content: string;
  size?: number;
  uploadedAt: string;
}

export interface EvidenceSignal {
  source_id: string;
  source_type: 'TXT' | 'PDF' | 'CSV';
  date?: string;
  title_or_row_label?: string;
  verbatim_complaint_snippet: string;
  problem_summary: string;
  desired_outcome: string;
  workaround_used: string;
  willingness_to_pay_signal: string;
  target_user: string;
  confidence_level: 'High' | 'Medium' | 'Low';
}

export interface ScoreBreakdown {
  pain_intensity: number; // 0-5
  repetition_across_sources: number; // 0-5
  willingness_to_pay: number; // 0-5
  search_demand: number; // 0-5
  competition_gap: number; // 0-5
  seo_feasibility: number; // 0-5
}

export interface CompactVisualizer {
  idea_title: string;
  pain_score: number;
  demand_score: number;
  competition_score: number;
  seo_score: number;
  monetization_score: number;
  verdict_color: string;
  source_count: number;
  keywords: string[];
  trend_link: string;
}

export interface ValidatedIdea {
  id: string;
  opportunity_name: string;
  problem: string;
  target_user: string;
  why_it_matters: string;
  evidence_signals: EvidenceSignal[];
  demand_validation: string;
  competition_analysis: string;
  SEO_analysis: string;
  monetization_angle: string;
  score_breakdown: ScoreBreakdown;
  total_score: number; // out of 30
  verdict: 'Pass' | 'Fail';
  confidence: string;
  uncertainty_notes: string;
  sources_used: string[];
  visualizer: CompactVisualizer;
}

export interface RejectedTheme {
  id: string;
  theme_name: string;
  rejection_reason: string;
  failed_criteria: string[];
  evidence_count: number;
  sources_involved: string[];
}

export interface ExtractionResult {
  validated_ideas: ValidatedIdea[];
  rejected_themes: RejectedTheme[];
  extraction_summary: {
    total_sources_analyzed: number;
    total_evidence_units_extracted: number;
    themes_clustered: number;
    themes_passed: number;
    themes_rejected: number;
  };
}

export interface EvaluationRule {
  id: string;
  name: string;
  description: string;
  weight: number; // 0-100
}

export interface PresetCriteria {
  id: string;
  name: string;
  rules: EvaluationRule[];
}

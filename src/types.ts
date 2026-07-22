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

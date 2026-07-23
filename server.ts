import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize Google GenAI if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// REST API Endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasGeminiKey: !!apiKey });
});

// AI analysis endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { ideaTitle, ideaDescription, criteriaWeights } = req.body;

    if (!ideaTitle || !ideaDescription) {
      return res.status(400).json({ error: 'Title and description are required.' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured in secrets. Please set it in Settings > Secrets.',
      });
    }

    // Prepare evaluation criteria context
    const criteriaContext = criteriaWeights
      ? Object.entries(criteriaWeights)
          .map(([key, val]) => `- ${key}: weight/importance is ${val}/100`)
          .join('\n')
      : 'Default business criteria';

    const prompt = `You are a world-class startup evaluator, venture capitalist, and market researcher.
Analyze the following startup idea and return a deeply detailed, structured JSON report.

IDEA TITLE: "${ideaTitle}"
IDEA DESCRIPTION: "${ideaDescription}"

CRITERIA & WEIGHTS CONTEXT TO EMPHASIZE:
${criteriaContext}

You MUST return a JSON object that adheres EXACTLY to this TypeScript interface:
interface Idea {
  id: string; // generate a random unique slug or string
  title: string;
  description: string;
  category: string; // Single word or short phrase e.g., AI, SaaS, Consumer, Wellness, FinTech, DevTools, EdTech
  score: number; // 0 to 100 overall score based on the criteria weights
  potential: 'High' | 'Medium' | 'Low';
  competition: 'Low' | 'Medium' | 'High';
  trend: string; // e.g. "+15%" or "-2%" based on general market direction
  growth: number; // 0-100 score of estimated growth rate
  tags: string[]; // 3-4 keywords/industry tags e.g. ["SaaS", "AI", "Finance"]
  sparkline: number[]; // exactly 7 numbers representing historical interest over 7 months (e.g., [20, 30, 25, 40, 50, 48, 60])
  
  // Scores 0-100 for these core dimensions
  marketStrength: number;
  productStrength: number;
  seoOpportunity: number;
  growthProbability: number;
  revenuePotential: number;
  feasibility: number;

  timeToBuild: string; // e.g. "2-3 weeks", "2 months"
  estimatedCost: string; // e.g. "$5,000", "$1,500"
  investorScore: number; // 0-100 score on how investable it is
  aiSummary: string; // 2-3 sentence strategic executive summary

  targetUsers: string[]; // exactly 3-4 primary target customer groups
  painPoints: string[]; // exactly 3 key painful issues solved
  businessModel: string; // short description of model (e.g. B2B SaaS, Marketplace)
  monetization: string[]; // exactly 2-3 specific billing tiers or monetizations
  techStack: string[]; // 4-5 modern tools/frameworks recommended
  mvpFeatures: string[]; // exactly 3-4 core MVP features to build
  risks: string[]; // exactly 3 biggest execution or market risks

  swot: {
    strengths: string[]; // 3-4 items
    weaknesses: string[]; // 3-4 items
    opportunities: string[]; // 3-4 items
    threats: string[]; // 3-4 items
  };

  competitors: {
    name: string;
    marketShare: string; // e.g. "20%" or "N/A"
    advantage: string; // unique differentiator or weak point
  }[]; // exactly 3 competitors (even if generic categories)

  keywords: {
    term: string;
    volume: string; // e.g. "12,500/mo" or "400/mo"
    difficulty: number; // 0-100 search difficulty
  }[]; // exactly 3 high-intent search keywords

  revenuePrediction: {
    year: string; // "Year 1", "Year 2", "Year 3"
    amount: string; // e.g. "$120,000 ARR"
  }[]; // exactly 3 entries

  leanCanvas: {
    problem: string[]; // 2-3 core pain points
    solution: string[]; // 2-3 ways the product solves them
    keyMetrics: string[]; // 2-3 key metrics to track
    uvp: string[]; // 1-2 unique value propositions
    unfairAdvantage: string[]; // 1-2 points of moat
    channels: string[]; // 2-3 distribution channels
    customerSegments: string[]; // 2-3 target demographics
    costStructure: string[]; // 2-3 major items
    revenueStreams: string[]; // 2-3 major monetization paths
  };
}

Be realistic but creative, thorough, and analytical. Do not output any markdown formatting, backticks, or wrapper text around the JSON. Return ONLY the raw JSON string starting with { and ending with }.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error('Empty response received from Gemini.');
    }

    // Parse output JSON
    const parsedIdea = JSON.parse(textOutput.trim());
    res.json({ success: true, data: parsedIdea });

  } catch (error: any) {
    console.error('Gemini Analysis Error:', error);
    res.status(500).json({
      error: 'Failed to evaluate idea. The model returned an invalid payload or suffered an API issue.',
      details: error.message,
    });
  }
});

// SaaS Idea Extraction Engine endpoint
app.post('/api/extract-ideas', async (req, res) => {
  try {
    const { sources, targetIdeaCount, extractionHint } = req.body; // Array of { id, name, type: 'TXT' | 'PDF' | 'CSV', content }

    if (!sources || !Array.isArray(sources) || sources.length === 0) {
      return res.status(400).json({ error: 'At least one source document (TXT, PDF, or CSV) is required.' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured in secrets. Please set GEMINI_API_KEY in Settings.',
      });
    }

    const sourcesContext = sources.map((s: any, idx: number) => `
--- SOURCE FILE #${idx + 1} ---
ID: ${s.id || `SRC_${idx + 1}`}
NAME: ${s.name || `Source_${idx + 1}`}
TYPE: ${s.type || 'TXT'}
CONTENT:
${s.content}
`).join('\n\n');

    const hintInstructions = extractionHint && String(extractionHint).trim()
      ? `- USER EXTRACTION HINT / FOCUS AREA: "${String(extractionHint).trim()}". Prioritize extracting opportunities matching this direction.`
      : '';
    const countInstructions = targetIdeaCount && Number(targetIdeaCount) > 0
      ? `- TARGET IDEA COUNT: Aim to identify and validate up to ${Number(targetIdeaCount)} distinct opportunities if supported by source data.`
      : '';

    const extractionPrompt = `
You are the Idea Extraction Engine for a SaaS Idea Validator and SaaS Idea Visualizer.

Your job:
1) Ingest source files in TXT, PDF, and CSV formats.
2) Extract only real business problems, complaints, pain points, workflow breakdowns, workaround behavior, and explicit willingness-to-pay signals.
3) Cluster repeated complaints into themes.
4) Validate each theme against evidence rules.
5) Score only themes that pass the validation gate.
6) Return structured output for the SaaS Idea Visualizer.
${hintInstructions}
${countInstructions}

IMPORTANT RULES:
- Do not invent ideas from imagination.
- Every idea must trace back to real extracted evidence from the uploaded source files.
- If evidence is weak, incomplete, or single-source, reject the theme.
- Never claim market demand unless there are at least 2 independent evidence points from the sources.
- Never approximate numbers if the source does not provide them. Use "no data".
- Prefer specific, repeated, recurring pain points over vague or one-off complaints.
- Focus on ideas that are simple to build, have clear organic-search intent, and can monetize through ads, subscriptions, or lead capture.

VALIDATION GATE:
A theme passes ONLY if it meets at least 3 of these 5 criteria:
1) Repeated complaints across independent sources
2) Clear search demand
3) Evidence of willingness to pay
4) Low or manageable competition
5) Clear specific use case
If it fails (< 3 met), reject it.

SCORING RUBRIC (0 to 5 for each category, Total = /30):
- Pain Intensity (0-5)
- Repetition Across Sources (0-5)
- Willingness to Pay (0-5)
- Search Demand (0-5)
- Competition Gap (0-5)
- SEO Feasibility (0-5)

SOURCE FILES TO ANALYZE:
${sourcesContext}

Return ONLY valid raw JSON matching this schema:
{
  "validated_ideas": [
    {
      "id": "string",
      "opportunity_name": "string",
      "problem": "string",
      "target_user": "string",
      "why_it_matters": "string",
      "evidence_signals": [
        {
          "source_id": "string",
          "source_type": "TXT",
          "verbatim_complaint_snippet": "string",
          "problem_summary": "string",
          "desired_outcome": "string",
          "workaround_used": "string",
          "willingness_to_pay_signal": "string",
          "target_user": "string",
          "confidence_level": "High"
        }
      ],
      "demand_validation": "string",
      "competition_analysis": "string",
      "SEO_analysis": "string",
      "monetization_angle": "string",
      "score_breakdown": {
        "pain_intensity": 5,
        "repetition_across_sources": 4,
        "willingness_to_pay": 4,
        "search_demand": 4,
        "competition_gap": 4,
        "seo_feasibility": 5
      },
      "total_score": 26,
      "verdict": "Pass",
      "confidence": "High",
      "uncertainty_notes": "string",
      "sources_used": ["string"],
      "visualizer": {
        "idea_title": "string",
        "pain_score": 5,
        "demand_score": 4,
        "competition_score": 4,
        "seo_score": 5,
        "monetization_score": 4,
        "verdict_color": "#FF8B2B",
        "source_count": 2,
        "keywords": ["string"],
        "trend_link": "https://trends.google.com"
      }
    }
  ],
  "rejected_themes": [
    {
      "id": "string",
      "theme_name": "string",
      "rejection_reason": "string",
      "failed_criteria": ["string"],
      "evidence_count": 1,
      "sources_involved": ["string"]
    }
  ],
  "extraction_summary": {
    "total_sources_analyzed": 1,
    "total_evidence_units_extracted": 5,
    "themes_clustered": 3,
    "themes_passed": 2,
    "themes_rejected": 1
  }
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: extractionPrompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error('Empty response received from Gemini for Idea Extraction.');
    }

    const parsedResult = JSON.parse(textOutput.trim());
    res.json({ success: true, data: parsedResult });
  } catch (error: any) {
    console.error('Idea Extraction Error:', error);
    res.status(500).json({
      error: 'Failed to run idea extraction engine.',
      details: error.message,
    });
  }
});

// Setup Vite Dev Server / Static Asset Hosting
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`IdeaAnalyzer AI server running on port ${PORT}`);
  });
}

setupServer();

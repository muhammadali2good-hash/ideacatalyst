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

import { Idea, EvaluationRule } from './types';

export const INITIAL_RULES: EvaluationRule[] = [
  {
    id: 'profitability',
    name: 'Profitability',
    description: 'Assess the potential profit margins and direct monetization streams.',
    weight: 80,
  },
  {
    id: 'market_demand',
    name: 'Market demand',
    description: 'Evaluation of keyword search volume, general request levels, and urgent customer pain points.',
    weight: 75,
  },
  {
    id: 'scalability',
    name: 'Scalability',
    description: 'Potential for high operating leverage and expansion to international or adjacent markets.',
    weight: 70,
  },
  {
    id: 'ai_native',
    name: 'AI native',
    description: 'Degree to which the core value proposition leverages advanced Gemini/LLM models naturally.',
    weight: 90,
  },
  {
    id: 'seo_opportunity',
    name: 'SEO opportunity',
    description: 'Ease of organic customer acquisition via low-difficulty but high-intent keywords.',
    weight: 55,
  },
];

export const INITIAL_IDEAS: Idea[] = [
  {
    id: 'contract-review',
    title: 'AI-Powered Contract Review',
    description: 'An AI-powered legal copilot that checks commercial lease agreements, employment letters, and vendor agreements for unfavorable clauses in seconds.',
    category: 'AI',
    score: 90,
    potential: 'High',
    competition: 'Low',
    trend: '+18%',
    growth: 92,
    tags: ['AI', 'SaaS', 'LegalTech'],
    sparkline: [20, 35, 30, 48, 62, 75, 90],
    marketStrength: 95,
    productStrength: 88,
    seoOpportunity: 68,
    growthProbability: 92,
    revenuePotential: 94,
    feasibility: 85,
    timeToBuild: '3-4 weeks',
    estimatedCost: '$4,500',
    investorScore: 94,
    aiSummary: 'A high-impact SaaS solution in the lucrative legal space. Highly scalable, leverages Gemini capabilities for deep clause analysis and drafting, with clear high-ticket monetization opportunities.',
    targetUsers: ['Freelancers', 'SMEs without legal departments', 'Real Estate agencies', 'Consultants'],
    painPoints: ['High lawyer consultation fees ($300+/hr)', 'Slow turnaround times for contract signoffs', 'Fear of signing hidden unfavorable clauses'],
    businessModel: 'B2B subscription (Tiered: $49/mo and $149/mo) with per-review pay-as-you-go top-ups.',
    monetization: ['Starter plan ($49/mo for 10 reviews)', 'Growth plan ($149/mo for unlimited reviews)', 'API licensing for CRM integration'],
    techStack: ['React 19', 'Express', 'Gemini-3.6-flash', 'Pinecone Vector DB', 'PostgreSQL'],
    mvpFeatures: [
      'PDF/DOCX Drag-and-Drop upload',
      'Instant Risk Heatmap (High, Medium, Low risk clauses)',
      'Human-readable translations of legalese',
      'Interactive copilot chat to negotiate or rewrite specific clauses'
    ],
    risks: [
      'Regulatory compliance and "unauthorized practice of law" liability',
      'Accuracy of halluncinated legal statements',
      'Enterprise data confidentiality requirements'
    ],
    swot: {
      strengths: ['Instant turnarounds', '90%+ cheaper than standard legal drafts', 'Deep multi-modal contract understanding with Gemini'],
      weaknesses: ['Requires extensive fine-tuning or rigid prompt engineering', 'Legal disclaimer constraints limit full automation'],
      opportunities: ['Integrate into CRM/procurement systems', 'Partner with small business accounting software'],
      threats: ['Lawyer associations filing lawsuits', 'Incumbents like DocuSign embedding similar AI tools']
    },
    competitors: [
      { name: 'Klarity AI', marketShare: '12%', advantage: 'Enterprise focused but very high-priced ($10k+ yearly min)' },
      { name: 'LawGeex', marketShare: '8%', advantage: 'Extremely deep enterprise integration, but slow setup' },
      { name: 'AI Drafts Pro', marketShare: '3%', advantage: 'Cheap but lacks comprehensive compliance checking' }
    ],
    keywords: [
      { term: 'ai contract analyzer', volume: '12,500/mo', difficulty: 42 },
      { term: 'commercial lease review online', volume: '4,200/mo', difficulty: 28 },
      { term: 'check legal contract free', volume: '22,000/mo', difficulty: 51 }
    ],
    revenuePrediction: [
      { year: 'Year 1', amount: '$120,000 ARR' },
      { year: 'Year 2', amount: '$450,000 ARR' },
      { year: 'Year 3', amount: '$1,200,000 ARR' }
    ],
    leanCanvas: {
      problem: [
        'Hiring business lawyers is prohibitively expensive for small startups.',
        'Reviewing multiple draft agreements delays partnerships and transactions.'
      ],
      solution: [
        'Automated real-time clause inspection and visual compliance score.',
        'AI suggestions to re-phrase hostile contract terms.'
      ],
      keyMetrics: [
        'Monthly Active Users (MAU)',
        'Average Processing Time (Goal: < 10 seconds)',
        'Review Retention Rate'
      ],
      uvp: [
        'The instant premium legal check that costs less than a single coffee cup per review.'
      ],
      unfairAdvantage: [
        'Proprietary fine-tuned prompts containing 50,000+ audited enterprise contracts.'
      ],
      channels: [
        'Founders groups on Reddit & Indie Hackers',
        'Direct LinkedIn outbound to boutique business consultancies',
        'Inbound content marketing on SEO keywords'
      ],
      customerSegments: [
        'Bootstrapped startup founders',
        'Freelance contractors',
        'Independent real estate managers'
      ],
      costStructure: [
        'Gemini API processing tokens',
        'Server hosting and vector database costs',
        'Marketing/Ad spend'
      ],
      revenueStreams: [
        'Tiered monthly subscription plans',
        'One-off single document audit for $19 each'
      ]
    }
  },
  {
    id: 'vitamin-sub',
    title: 'Personalized Vitamin Subscription',
    description: 'A direct-to-consumer personalized wellness platform where users take a 5-minute lifestyle audit and receive a customized daily supplement pack.',
    category: 'Consumer',
    score: 78,
    potential: 'Medium',
    competition: 'Medium',
    trend: '+4%',
    growth: 72,
    tags: ['Consumer', 'Wellness', 'eCommerce'],
    sparkline: [40, 42, 45, 52, 60, 68, 78],
    marketStrength: 82,
    productStrength: 75,
    seoOpportunity: 48,
    growthProbability: 70,
    revenuePotential: 88,
    feasibility: 65,
    timeToBuild: '6-8 weeks',
    estimatedCost: '$12,000',
    investorScore: 75,
    aiSummary: 'A solid business model with great recurring revenue characteristics, though customer acquisition cost (CAC) and fulfillment logisitics are substantial. Needs unique brand storytelling.',
    targetUsers: ['Working professionals over 30', 'Fitness enthusiasts', 'Biohackers', 'Busy parents'],
    painPoints: ['Overwhelmed by generic multivitamin bottles', 'Forgetting to take daily pills', 'Lack of custom nutrition counseling access'],
    businessModel: 'Direct-to-consumer recurring monthly box starting at $35/mo.',
    monetization: ['Monthly supplement box ($35-$65/mo)', 'Premium health-coach consultation add-on ($29/mo)'],
    techStack: ['React 19', 'Tailwind', 'Node.js', 'Stripe Subscriptions', 'Shopify Admin API'],
    mvpFeatures: [
      'Interactive lifestyle questionnaire',
      'AI Recommendation breakdown engine',
      'Biodegradable customized paper sachet packet dispenser',
      'Easy cancellation and postponement portal'
    ],
    risks: [
      'Health claims liability and FDA warnings',
      'Complex physical inventory management (co-packing partners)',
      'High initial churn rates after 2-3 months'
    ],
    swot: {
      strengths: ['High lifetime value (LTV)', 'Aesthetic, Instagrammable packaging increases referral rate', 'Unique personalized brand experience'],
      weaknesses: ['High Customer Acquisition Cost (CAC)', 'No proprietary defense on raw vitamin ingredients', 'Complex physical supply chain'],
      opportunities: ['Integrate wearable data (Apple Health, Oura Ring)', 'Partner with local fitness boutiques'],
      threats: ['Amazon launching immediate white-label subscription boxes', 'General inflation pinching consumer wellness budgets']
    },
    competitors: [
      { name: 'Care/of', marketShare: '35%', advantage: 'Strong brand identity, heavily backed' },
      { name: 'Persona Nutrition', marketShare: '20%', advantage: 'Deep scientific board, backed by Nestle' },
      { name: 'Ritual', marketShare: '25%', advantage: 'Focuses on transparency of ingredients, beautiful look' }
    ],
    keywords: [
      { term: 'personalized vitamins subscription', volume: '18,200/mo', difficulty: 58 },
      { term: 'custom daily vitamin packs', volume: '6,400/mo', difficulty: 49 },
      { term: 'best vitamin subscription boxes', volume: '9,800/mo', difficulty: 62 }
    ],
    revenuePrediction: [
      { year: 'Year 1', amount: '$240,000 ARR' },
      { year: 'Year 2', amount: '$780,000 ARR' },
      { year: 'Year 3', amount: '$2,100,000 ARR' }
    ],
    leanCanvas: {
      problem: [
        'Consumers suffer pill-fatigue from buying 8 different huge bottles of vitamins.',
        'People do not know which specific vitamins their diet is actually deficient in.'
      ],
      solution: [
        'A single daily compostable pouch containing exactly the 4 supplement pills custom tailored to your body.'
      ],
      keyMetrics: [
        'Customer Acquisition Cost (CAC)',
        'Monthly Churn Rate (Target < 6%)',
        'Net Promoter Score (NPS)'
      ],
      uvp: [
        'Zero guesswork. Just the vitamins you actually need, delivered in premium daily packs.'
      ],
      unfairAdvantage: [
        'Proprietary clinical recommendation algorithm developed in partnership with leading metabolic researchers.'
      ],
      channels: [
        'Instagram & TikTok influencer marketing',
        'Affiliate partnerships with boutique gyms and fitness creators',
        'SEO wellness advice articles'
      ],
      customerSegments: [
        'Busy urban professionals looking to optimize energy',
        'Health-conscious mothers purchasing for households'
      ],
      costStructure: [
        'Raw nutrient ingredients and manufacturing',
        'High-density packaging and custom boxes',
        'Paid customer acquisition spend'
      ],
      revenueStreams: [
        'Monthly recurring supplement box subscriptions',
        'Upfront custom blood-panel assessment kit ($99)'
      ]
    }
  },
  {
    id: 'voice-trans',
    title: 'Realtime Voice Translation Radicals',
    description: 'An ultra-low latency, multi-speaker live translation web application that allows international business teams to host video calls with instant audio translation in their own voice.',
    category: 'AI',
    score: 88,
    potential: 'High',
    competition: 'High',
    trend: '+15%',
    growth: 85,
    tags: ['AI', 'Video', 'Enterprise'],
    sparkline: [30, 42, 55, 60, 72, 80, 88],
    marketStrength: 91,
    productStrength: 92,
    seoOpportunity: 55,
    growthProbability: 88,
    revenuePotential: 90,
    feasibility: 70,
    timeToBuild: '4-6 weeks',
    estimatedCost: '$8,000',
    investorScore: 89,
    aiSummary: 'A state-of-the-art implementation that directly targets international trade and global tech companies. The inclusion of localized voice-cloning technology gives a highly compelling competitive advantage.',
    targetUsers: ['Global remote tech startups', 'International sourcing & logistics firms', 'Bilingual customer support centers'],
    painPoints: ['High cost of professional human translation services', 'Awkward pauses during standard speech-to-text translators', 'Losing personal emotional connection on phone calls'],
    businessModel: 'B2B enterprise per-seat model starting at $29/seat/mo.',
    monetization: ['Teams plan ($29/user/mo)', 'Enterprise custom SLA (unlimited minutes, dedicated hosting)'],
    techStack: ['React 19', 'WebRTC', 'Gemini-3.5-live-translate-preview', 'ElevenLabs voice cloning API', 'WebSockets'],
    mvpFeatures: [
      'Peer-to-peer WebRTC video room',
      'Instant voice cloning from 30 seconds of speech',
      'Dual audio channels (hear translation in near real-time, original muted or low-volume in background)',
      'Full searchable live meeting transcripts with custom AI summary translation exports'
    ],
    risks: [
      'Deepfake security vulnerabilities and voice identity theft risks',
      'WebRTC latency spikes on weak cellular connections',
      'High per-minute voice-generation API pricing'
    ],
    swot: {
      strengths: ['Preserves natural speaking voice and tone', 'Ultra low latency (<400ms translation loop)', 'Supports 40+ global languages natively'],
      weaknesses: ['Expensive ongoing API costs for premium voice synthesis', 'Struggles with heavy technical jargon or accents'],
      opportunities: ['Embed as a widget inside Zoom, MS Teams, or Google Meet', 'Target global telemedicine clinics'],
      threats: ['Zoom and Teams releasing free native high-quality translation widgets', 'General open-source models matching performance for free']
    },
    competitors: [
      { name: 'Rask AI', marketShare: '18%', advantage: 'Great for video localization, but not optimized for live interactive calls' },
      { name: 'Kudo', marketShare: '14%', advantage: 'Uses professional human interpreters alongside basic AI tools' },
      { name: 'ElevenLabs Reader', marketShare: '25%', advantage: 'Superb voice generation, but lacks dedicated meeting interfaces' }
    ],
    keywords: [
      { term: 'live voice translator for video calls', volume: '15,400/mo', difficulty: 48 },
      { term: 'ai voice cloner live translator', volume: '6,200/mo', difficulty: 38 },
      { term: 'realtime multilingual business translator', volume: '3,800/mo', difficulty: 25 }
    ],
    revenuePrediction: [
      { year: 'Year 1', amount: '$180,000 ARR' },
      { year: 'Year 2', amount: '$620,000 ARR' },
      { year: 'Year 3', amount: '$1,850,000 ARR' }
    ],
    leanCanvas: {
      problem: [
        'Global commerce slows down because buyers and sellers cannot communicate fluently.',
        'Existing translators sound like robotic, cold, synthetic voices.'
      ],
      solution: [
        'Real-time voice-cloning translation that overlays perfectly onto live video call streams.'
      ],
      keyMetrics: [
        'Audio Stream Latency (Goal: < 450ms)',
        'Minutes Streamed Per User Weekly',
        'Cloning Accuracy Score'
      ],
      uvp: [
        'Speak in your voice, instantly heard in 40+ other languages. No robots allowed.'
      ],
      unfairAdvantage: [
        'Custom audio pipeline that runs voice translation and synchronization natively on edge servers.'
      ],
      channels: [
        'Product Hunt & Hacker News viral demos',
        'Direct partnerships with global wholesale marketplaces (Alibaba/Global Sources buyers)',
        'Tech translation case study blogs'
      ],
      customerSegments: [
        'International trade agencies',
        'Global software consultancies with offshore developers',
        'Foreign language support staff'
      ],
      costStructure: [
        'Voice synthesis and cloning compute API costs',
        'WebRTC signaling and streaming server bandwidth',
        'Security audits and encryption overhead'
      ],
      revenueStreams: [
        'SaaS monthly subscription based on user counts',
        'Premium high-definition audio packages'
      ]
    }
  },
  {
    id: 'invoice-reminders',
    title: 'Micro-SaaS Invoice Reminders',
    description: 'A dedicated accounting micro-SaaS that connects directly with Stripe and Quickbooks to send gentle, personalized SMS and email follow-ups to clients with unpaid invoices.',
    category: 'SaaS',
    score: 68,
    potential: 'Medium',
    competition: 'Low',
    trend: '+7%',
    growth: 64,
    tags: ['SaaS', 'Finance', 'Productivity'],
    sparkline: [50, 48, 52, 55, 58, 62, 68],
    marketStrength: 70,
    productStrength: 65,
    seoOpportunity: 72,
    growthProbability: 66,
    revenuePotential: 68,
    feasibility: 90,
    timeToBuild: '2-3 weeks',
    estimatedCost: '$2,500',
    investorScore: 68,
    aiSummary: 'A fantastic, low-risk, highly practical utility tool. Perfect for solo developers or micro-teams to build. Simple integration, highly automated, and targets a painful administrative headache.',
    targetUsers: ['Freelance designers & developers', 'Boutique marketing agencies', 'Contracting firms', 'SaaS billing teams'],
    painPoints: ['Clients ignoring invoice emails', 'Uncomfortable manual reminder conversations', 'Late payments disrupting business cashflow'],
    businessModel: 'Flat pricing of $19/mo with optional transaction commission billing.',
    monetization: ['Standard flat rate ($19/mo)', 'Pro plan ($49/mo for automated escalation & collections referrals)'],
    techStack: ['React 19', 'Next.js API Routes', 'PostgreSQL', 'Stripe API', 'Twilio SMS Gateway'],
    mvpFeatures: [
      'One-click Stripe & QuickBooks connector',
      'AI Smart-Tone custom email & SMS reminder generator',
      'Interactive Escalation Timeline (Draft -> Friendly -> Persistent -> Legal warning)',
      'Dispute resolution portal link included on invoice'
    ],
    risks: [
      'Accidentally spamming or bothering an already-paid major enterprise client due to webhook delays',
      'Strict GDPR/CCPA consumer debt collections communication rules',
      'High reliance on Stripe and QuickBooks API stability'
    ],
    swot: {
      strengths: ['Super easy to build and maintain', 'High immediate value (directly gets businesses paid faster)', 'Low competition in direct micro-escalation niches'],
      weaknesses: ['Low technical moat', 'Stripe or QuickBooks could release this feature directly for free', 'Low average contract value (ACV) limits heavy paid ads'],
      opportunities: ['Launch on Shopify app store and WordPress ecosystem', 'Partner with freelance accounting advisors'],
      threats: ['Large financial players copying features', 'Customers churning once their late invoices are fully paid']
    },
    competitors: [
      { name: 'Chaser', marketShare: '15%', advantage: 'Enterprise-grade but requires months of configuration' },
      { name: 'Invoiced', marketShare: '20%', advantage: 'Full billing platform, too complex for small agencies' },
      { name: 'LatePay Bot', marketShare: '5%', advantage: 'Simple but lacks smart AI conversational tone matching' }
    ],
    keywords: [
      { term: 'automatic invoice reminder tool', volume: '5,200/mo', difficulty: 24 },
      { term: 'how to gently remind client about payment', volume: '14,000/mo', difficulty: 15 },
      { term: 'stripe auto late fee reminders', volume: '2,800/mo', difficulty: 19 }
    ],
    revenuePrediction: [
      { year: 'Year 1', amount: '$45,000 ARR' },
      { year: 'Year 2', amount: '$150,000 ARR' },
      { year: 'Year 3', amount: '$420,000 ARR' }
    ],
    leanCanvas: {
      problem: [
        'Freelancers waste hours drafting polite emails begging to get paid.',
        'Delayed invoice payouts create severe, stressful cashflow gaps.'
      ],
      solution: [
        'Connect your Stripe key, and a gentle automated helper will gently ping client phones with custom friendly links.'
      ],
      keyMetrics: [
        'Average Days Unpaid (DSO) Reduction',
        'Customer Subscription Churn',
        'Stripe Integration Success Rate'
      ],
      uvp: [
        'Get paid 12 days faster without having the awkward "late fee" chat yourself.'
      ],
      unfairAdvantage: [
        'Smart-Tone email templates designed by hostage negotiators to secure non-confrontational cooperation.'
      ],
      channels: [
        'Indie Hackers & Twitter freelance community outreach',
        'Free automated Google Sheets templates with CTA links to the SaaS',
        'Product Hunt launch and directory listings'
      ],
      customerSegments: [
        'Independent consulting designers',
        'Local landscape, plumbing, or catering micro-businesses'
      ],
      costStructure: [
        'Twilio SMS API charges',
        'Basic cloud database hosting',
        'Customer support time'
      ],
      revenueStreams: [
        'Flat $19/mo subscription',
        '1% success fee on recovered invoices over 90 days past due'
      ]
    }
  },
  {
    id: 'design-studio',
    title: 'Aesthetic Design Studio',
    description: 'An premium AI-assisted visual editor that generates gorgeous landing page mockups and layouts following ultra-premium typography, spatial grids, and current SaaS design trends.',
    category: 'Design',
    score: 81,
    potential: 'High',
    competition: 'Medium',
    trend: '+11%',
    growth: 82,
    tags: ['Design', 'NoCode', 'SaaS'],
    sparkline: [45, 50, 48, 65, 70, 75, 81],
    marketStrength: 85,
    productStrength: 84,
    seoOpportunity: 60,
    growthProbability: 80,
    revenuePotential: 83,
    feasibility: 75,
    timeToBuild: '4-5 weeks',
    estimatedCost: '$6,500',
    investorScore: 82,
    aiSummary: 'A high-growth design workspace that taps into the booming modern visual design movement. It targets the massive wave of indie creators and product builders who crave pristine landing pages but lack Figma expertise.',
    targetUsers: ['Product marketers', 'SaaS founders', 'Figma power users', 'Agency owners'],
    painPoints: ['Generic, boring tailwind templates', 'Spending thousands on premium boutique designers', 'Struggling with typography hierarchies and micro-spacing'],
    businessModel: 'Freemium with pro tier at $24/mo and expert tier at $59/mo.',
    monetization: ['Pro plan ($24/mo for 50 exports)', 'Team plan ($59/mo for collaborative workspaces)', 'Custom asset-pack add-ons'],
    techStack: ['React 19', 'Tailwind CSS', 'Gemini-3.1-flash-lite-image', 'HTML2Canvas', 'Supabase API'],
    mvpFeatures: [
      'Premium presets curated from award-winning sites',
      'AI font-pairing and high-contrast color scheme auto-generator',
      'One-click Clean Code exporter (Tailwind + React)',
      'Liquid glass background filter generator'
    ],
    risks: [
      'High complexity in building a visual drag-and-drop React canvas',
      'Rapidly shifting visual trends requiring constant product updates',
      'Figma launching advanced automated "make premium landing page" buttons'
    ],
    swot: {
      strengths: ['Beautiful output right out of the box with zero design skills', 'Super fast code exporting', 'No complex Figma configurations needed'],
      weaknesses: ['Limits the freedom of custom shapes compared to raw vector tools', 'Requires substantial engineering to achieve fluid UI interactions'],
      opportunities: ['Launch custom CSS widgets', 'Partner with hosting sites like Vercel and Netlify for one-click publishing'],
      threats: ['Traditional web builders (Framer, Webflow) heavily embedding AI assistants', 'AI slop saturating the template market']
    },
    competitors: [
      { name: 'Framer AI', marketShare: '40%', advantage: 'Incredibly powerful, but has a steep learning curve' },
      { name: 'Relume', marketShare: '25%', advantage: 'Excellent component library, but focuses mostly on wireframes' },
      { name: 'Siter.io', marketShare: '10%', advantage: 'Easy visual editing, lacks generative AI-native components' }
    ],
    keywords: [
      { term: 'generate premium website design', volume: '11,200/mo', difficulty: 45 },
      { term: 'linear design style template', volume: '4,500/mo', difficulty: 30 },
      { term: 'minimalist landing page builder', volume: '14,800/mo', difficulty: 55 }
    ],
    revenuePrediction: [
      { year: 'Year 1', amount: '$140,000 ARR' },
      { year: 'Year 2', amount: '$520,000 ARR' },
      { year: 'Year 3', amount: '$1,400,000 ARR' }
    ],
    leanCanvas: {
      problem: [
        'Founders build amazing backends, but their frontends look like dated bootstrap templates.',
        'Hiring high-end design agencies costs thousands of dollars and weeks of waiting.'
      ],
      solution: [
        'A curated design playground that only lets you build beautiful things by enforcing premium constraints.'
      ],
      keyMetrics: [
        'Design Export Count',
        'Customer Retention Rate',
        'Average Editing Session Duration'
      ],
      uvp: [
        'Your ideas, styled with Linear-grade aesthetics in under three minutes.'
      ],
      unfairAdvantage: [
        'Design constraint engine that mathematically balances font sizes, line heights, and margins dynamically.'
      ],
      channels: [
        'Twitter/X visual design build-in-public threads',
        'Direct templates shared on Figma community page',
        'Launch on Product Hunt and designer newsletters'
      ],
      customerSegments: [
        'Indie hacker builders launching multiple MVPs',
        'Boutique marketing agencies scaling client proposals'
      ],
      costStructure: [
        'Image generation and vector asset API tokens',
        'Frontend hosting and CDN assets',
        'Ongoing design curation and research'
      ],
      revenueStreams: [
        'Monthly subscriptions for exporting and templates',
        'Premium standalone component pack licensing'
      ]
    }
  },
  {
    id: 'pet-marketplace',
    title: 'Sustainable Pet Food Marketplace',
    description: 'An organic, insect-protein, and ethically sourced pet nutrition marketplace where owners get a carbon-neutral customized meal plan for their dogs and cats.',
    category: 'Consumer',
    score: 63,
    potential: 'Medium',
    competition: 'High',
    trend: '+2%',
    growth: 58,
    tags: ['Consumer', 'Eco-friendly', 'PetCare'],
    sparkline: [30, 32, 28, 42, 50, 55, 63],
    marketStrength: 65,
    productStrength: 60,
    seoOpportunity: 50,
    growthProbability: 55,
    revenuePotential: 70,
    feasibility: 68,
    timeToBuild: '5-7 weeks',
    estimatedCost: '$9,000',
    investorScore: 61,
    aiSummary: 'A highly specialized niche with an passionate, ethical consumer demographic. While the carbon-neutral focus is extremely strong, shipping heavy bags of pet food carries high logistical friction.',
    targetUsers: ['Eco-conscious pet owners', 'Vegans/Vegetarians with pets', 'Allergy-prone pets owners'],
    painPoints: ['Guilt over heavy environmental impact of meat-heavy pet diets', 'Difficult to find trustworthy clean insect-protein brands', 'Pet digestional issues from filler wheat ingredients'],
    businessModel: 'Recurring food subscription box or direct curated marketplace purchase.',
    monetization: ['Curated pet food subscription packs ($40-$80/mo)', 'Ethical toys and treat upsells ($15/order)'],
    techStack: ['React 19', 'Tailwind', 'Express', 'Shopify Storefront API', 'Stripe Payments'],
    mvpFeatures: [
      'Pet Allergy & Carbon-Footprint calculator',
      'Curated directory of top insect-protein and yeast-protein pet food brands',
      'Autoship recurring delivery intervals',
      'Custom eco-packaging'
    ],
    risks: [
      'Pets refusing to eat insect-protein foods leading to high immediate returns',
      'High logistics and weight shipping costs eroding gross margins',
      'Varying vet opinions on insect/yeast-based pet nutrition guidelines'
    ],
    swot: {
      strengths: ['Extremely loyal and highly vocal community advocate network', 'High ESG rating attracts ethical impact VC capital', 'Lower protein production costs compared to beef/chicken'],
      weaknesses: ['High education gap (convincing pet owners insects are healthy and safe)', 'High weight-to-value shipping logistics'],
      opportunities: ['Partner with climate-tech blogs and carbon-offset portals', 'Launch branded organic treats as high-margin gateway items'],
      threats: ['Traditional major pet brands (Purina, Blue Buffalo) launching cheap eco-lines', 'Regulatory blocks on novel insect proteins in some regions']
    },
    competitors: [
      { name: 'Yora Pet Foods', marketShare: '30%', advantage: 'UK based, highly established but expensive to import' },
      { name: 'Wild Earth', marketShare: '40%', advantage: 'US based, backed by Mark Cuban, focuses mostly on yeast-protein dog food' },
      { name: 'Jiminy\'s', marketShare: '20%', advantage: 'Strong insect treats selection, growing quickly' }
    ],
    keywords: [
      { term: 'insect protein dog food eco friendly', volume: '6,200/mo', difficulty: 40 },
      { term: 'carbon neutral pet brand', volume: '1,800/mo', difficulty: 22 },
      { term: 'vegan pet food marketplace', volume: '4,500/mo', difficulty: 48 }
    ],
    revenuePrediction: [
      { year: 'Year 1', amount: '$110,000 ARR' },
      { year: 'Year 2', amount: '$380,000 ARR' },
      { year: 'Year 3', amount: '$980,000 ARR' }
    ],
    leanCanvas: {
      problem: [
        'Traditional meat pet food creates massive carbon footprints and intensive livestock abuse.',
        'Many dogs suffer severe skin and digestive allergies from poultry and beef filler diets.'
      ],
      solution: [
        'A carbon-neutral marketplace providing vet-approved insect and yeast protein diets with clear allergen filters.'
      ],
      keyMetrics: [
        'Average Order Value (AOV)',
        'Customer Repeat Purchase Rate',
        'Carbon Emissions Saved per order'
      ],
      uvp: [
        'Love your pet. Love your planet. Nourish them ethically.'
      ],
      unfairAdvantage: [
        'Direct supply agreements with leading certified vertical cricket-farms, reducing baseline raw material markup.'
      ],
      channels: [
        'Ethical climate-action newsletters and green living forums',
        'SEO guides on dog hypoallergenic food alternatives',
        'Pet expo partnerships'
      ],
      customerSegments: [
        'Milennials who treat pets as family and prioritize sustainability',
        'Frustrated owners of pets with chronic skin and stomach conditions'
      ],
      costStructure: [
        'Inventory storage and heavy shipping logistics',
        'Marketing CAC',
        'Vet advisory board credentials'
      ],
      revenueStreams: [
        'Curated marketplace sales margin (35% markup)',
        'Eco-Pet Club loyalty subscription membership fee'
      ]
    }
  }
];

export const MOCK_TRENDS_TOPICS = [
  { id: 1, topic: 'Micro-SaaS Billing', volume: '12.4K', trend: '+45%', category: 'SaaS' },
  { id: 2, topic: 'AI Legal Assistants', volume: '45.2K', trend: '+124%', category: 'AI' },
  { id: 3, topic: 'Insect Protein Supplements', volume: '18.1K', trend: '+12%', category: 'Consumer' },
  { id: 4, topic: 'Minimalist Figma Canvas', volume: '22.8K', trend: '+88%', category: 'Design' },
  { id: 5, topic: 'WebRTC Low Latency Translation', volume: '8.9K', trend: '+210%', category: 'AI' },
];

export const MOCK_SEARCHES = [
  'how to analyze legal documents with ai',
  'saas landing page best practices 2026',
  'is insect dog food safe vets opinion',
  'stripe automated dunning micro-saas',
  'care of vitamins review real experience'
];

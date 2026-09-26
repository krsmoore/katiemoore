const THEMES = {
  verizon: { hero: '#CC0000', chip: '#CC0000', text: '#ffffff', chipText: '#ffffff', accent: '#CC0000' },
  sprint: { hero: '#FFDD05', chip: '#FFDD05', text: '#1f2b46', chipText: '#1f2b46', accent: '#1f2b46' },
  tmobile: { hero: '#E20074', chip: '#E20074', text: '#ffffff', chipText: '#ffffff', accent: '#E20074' },
  samsung: { hero: '#000000', chip: '#000000', text: '#ffffff', chipText: '#ffffff', accent: '#000000' },
  walmart: { hero: '#0053e2', chip: '#0053e2', text: '#ffffff', chipText: '#ffffff', accent: '#0053e2' },
  ahs: { hero: '#ffffff', chip: '#0033A0', text: '#1f2b46', chipText: '#ffffff', accent: '#CC0000' },
  default: { hero: '#1f78ff', chip: '#246ee0', text: '#ffffff', chipText: '#ffffff', accent: '#1f78ff' },
};

const LOVED_BY_ROLE = {
  'walmart-sm': [
    'Seeing connections others missed',
    'Turning ambiguity into something actionable',
    'Being willing to build the first version instead of waiting for perfect conditions',
  ],
  'samsung-director': [
    'Calm in high-stakes launches',
    'Raising expectations without losing the team',
    'Knowing when to push back and when to find a way',
  ],
  'samsung-sr-mgr': [
    'Challenging “we’ve always done it this way”',
    'Strong creative judgment',
    'Asking the uncomfortable question about whether something would actually work in the field',
  ],
  tmobile: [
    'Growing other leaders',
    'Creating stability when everything around the team was changing',
    'Giving leaders ownership instead of answers',
  ],
  sprint: [
    'Being commercially minded in an L&D role',
    'Credibility with field leaders',
    'Asking harder questions about whether the work was worth the investment',
  ],
  'verizon-hrbp': [
    'Sound judgment in gray areas',
    'Being someone leaders called before things went sideways',
    'Having difficult conversations without making them unnecessarily difficult',
  ],
  'verizon-district-trainer': [
    'Reading the room',
    'Adapting in the moment instead of rigidly following the plan',
    'Earning credibility with frontline teams',
  ],
  'verizon-gsm': [
    'High expectations with a human approach',
    'Spotting potential in people',
    'Creating an environment where people wanted to perform well',
  ],
  'ahs-call-center-manager': [
    'Hearing what other people missed in a conversation',
    'Diagnosing before coaching',
    'Knowing that the same number could have very different causes',
  ],
};

const LOCATION_BY_ROLE = {
  'verizon-gsm': 'Auburn, Alabama',
  'verizon-district-trainer': 'Georgia/Alabama',
  'verizon-hrbp': 'Georgia/Alabama',
  'ahs-call-center-manager': 'Georgia',
  sprint: 'Irving, Texas',
  tmobile: 'Irving, Texas',
  'samsung-sr-mgr': 'Plano, Texas',
  'samsung-director': 'Plano, Texas',
  'walmart-sm': 'Bentonville, Arkansas',
};

const CAPABILITY_LABELS = {
  'lead-people': 'Leading People',
  'lead-leaders': 'Leading Leaders',
  'lead-creative': 'Leading Creative & Specialist Talent',
  'lead-big': 'Leading Big Things',
  'build-scratch': 'Building From Scratch',
  'hands-on-builder': 'Hands-On Building',
  'strategy-execution': 'Strategy → Execution',
  'data-decisions': 'Data → Decisions',
  'enterprise-scale': 'Enterprise Scale',
  'influence-without-authority': 'Influence Without Authority',
  transformation: 'Transformation',
  'business-impact': 'Business Impact',
  'develop-people': 'Developing People',
  'ai-emerging-tech': 'AI & Emerging Technology',
  ambiguity: 'Navigating Ambiguity',
  'learning-capability': 'Learning & Capability Expertise',
  'career-progression': 'Career Progression',
  'executive-scope': 'Executive-Level Scope',
  'learns-from-mistakes': 'How Katie Learns From Mistakes',
};

const PERSONA_FLOWS = {
  recruiter: {
    prompt: 'What would you like validated first?',
    supportsSixtySecond: true,
    options: [
      { key: 'lead-people', label: 'People Leadership' },
      { key: 'lead-leaders', label: 'Leader-of-Leaders Experience' },
      { key: 'enterprise-scale', label: 'Enterprise Scale' },
      { key: 'learning-capability', label: 'Learning & Capability Expertise' },
      { key: 'transformation', label: 'Transformation Experience' },
      { key: 'ai-emerging-tech', label: 'AI & Technology Experience' },
      { key: 'data-decisions', label: 'Data & Measurement' },
      { key: 'business-impact', label: 'Business Results' },
      { key: 'career-progression', label: 'Career Progression' },
      { key: 'executive-scope', label: 'Executive-Level Scope' },
    ],
  },
  'hiring-manager': {
    prompt: 'What matters most to you in your next leader?',
    options: [
      { key: 'lead-people', label: 'They can lead teams effectively.' },
      { key: 'lead-leaders', label: 'They can lead managers who lead teams.' },
      { key: 'lead-creative', label: 'They can set guardrails and let experts do great work.' },
      { key: 'lead-big', label: 'They can own large, complex initiatives.' },
      { key: 'build-scratch', label: 'They can start with a blank page and create something real.' },
      { key: 'hands-on-builder', label: 'They can personally build and prototype when needed.' },
      { key: 'strategy-execution', label: 'They can determine direction and make it happen.' },
      { key: 'data-decisions', label: 'They can use data to decide what to do.' },
      { key: 'enterprise-scale', label: 'They can operate across large populations and geographies.' },
      { key: 'influence-without-authority', label: 'They can get things done without direct authority.' },
      { key: 'transformation', label: 'They can fundamentally change how organizations operate.' },
      { key: 'business-impact', label: 'They can connect capability work to measurable outcomes.' },
      { key: 'develop-people', label: 'They can make people around them more capable.' },
      { key: 'ai-emerging-tech', label: 'They can drive AI and emerging technology adoption.' },
      { key: 'ambiguity', label: 'They can create direction when answers are unclear.' },
    ],
  },
  'interview-panel': {
    prompt: 'What are you trying to understand about Katie in action?',
    options: [
      { key: 'lead-people', label: 'How Katie Leads' },
      { key: 'lead-leaders', label: 'How Katie Leads Leaders' },
      { key: 'lead-creative', label: 'How Katie Leads Creative Teams' },
      { key: 'ambiguity', label: 'How Katie Handles Ambiguity' },
      { key: 'data-decisions', label: 'How Katie Uses Data' },
      { key: 'influence-without-authority', label: 'How Katie Influences' },
      { key: 'hands-on-builder', label: 'How Katie Builds' },
      { key: 'strategy-execution', label: 'How Katie Makes Decisions' },
      { key: 'transformation', label: 'How Katie Leads Change' },
      { key: 'develop-people', label: 'How Katie Develops People' },
      { key: 'ai-emerging-tech', label: 'How Katie Approaches AI' },
      { key: 'business-impact', label: 'How Katie Gets Results' },
      { key: 'learns-from-mistakes', label: 'How Katie Learns From Mistakes' },
    ],
  },
  browsing: { prompt: 'Explore all stories', options: [] },
};

const SUGGESTED_COMBOS = [
  { name: 'The Builder', picks: ['build-scratch', 'hands-on-builder', 'strategy-execution'] },
  { name: 'The Enterprise Leader', picks: ['lead-leaders', 'enterprise-scale', 'influence-without-authority'] },
  { name: 'The Transformer', picks: ['lead-big', 'ambiguity', 'transformation'] },
  { name: 'The People Leader', picks: ['lead-people', 'develop-people', 'lead-creative'] },
  { name: 'The Strategist', picks: ['strategy-execution', 'data-decisions', 'business-impact'] },
  { name: 'Future-of-Work Leader', picks: ['ai-emerging-tech', 'learning-capability', 'enterprise-scale'] },
];

const CAREER_EXPLORER_STORIES = [
  {
    id: 'walmart-lifecycle',
    company: 'Walmart',
    timeframe: '2025 – Present',
    hook: 'How do you turn 20 separate logistics programs into one seller strategy?',
    summary: 'Reframed logistics from program-first messaging to seller-need lifecycle decisions.',
    heroMetrics: ['~20 programs mapped', '8-phase lifecycle', '3-month cross-functional launch'],
    challenge: 'Portfolio positioning had stalled and non-WFS options felt like fallback choices.',
    myRole: {
      owned: 'Set portfolio strategy and north-star for how sellers should be guided.',
      built: 'Created lifecycle framework plus core seller and associate copy.',
      led: 'Coordinated enablement, marketing, leadership, and SMEs working part-time on effort.',
      influenced: 'Aligned multiple leadership teams around holistic messaging before launch.',
    },
    scale: ['Marketplace logistics portfolio', 'Multiple orgs and leaders', 'No dedicated full-time pod'],
    callsMade: [
      'Chose lifecycle-first narrative over product-first sequencing.',
      'Validated framework with SMEs before socialization.',
      'Used a single north-star test for every proposed change.',
    ],
    changed: {
      business: 'Unified seller-facing narrative launched; behavioral adoption still in progress.',
      capability: 'Associates received new learning and conversation-support materials.',
      systemic: 'Created shared positioning foundation across teams.',
    },
    whatIKnowNow: 'Alignment speed improves when everyone sees where they fit in the same story.',
    doOver: "I wouldn’t change the decision; I might still reduce late-stage launch risk buffers.",
    askMeAbout: ['How I stress-tested the lifecycle with SMEs', 'What I cut to protect launch quality'],
    capabilityScores: { 'lead-big': 3, 'strategy-execution': 3, 'influence-without-authority': 3, transformation: 2, 'enterprise-scale': 2, 'business-impact': 2 },
    tags: ['Strategy and Execution', 'Building from Scratch', 'Influence Without Authority'],
    storyType: 'transformation',
    visualConcept: 'Connected track map of seller journey phases',
    sourceConfidence: 'high',
  },
  {
    id: 'walmart-opp',
    company: 'Walmart',
    timeframe: '2025 – Present',
    hook: "How do you manage capacity when you can't even see the work?",
    summary: 'Built OPP operating system to make intake, throughput, and performance measurable.',
    heroMetrics: ['20→6 workflow simplification', 'Ticketed intake system', 'Capacity bottleneck visibility'],
    challenge: 'No PM system, no standard intake, no denominator, and one-person rebuild period.',
    myRole: {
      owned: 'Defined operating model design principles and metric architecture.',
      built: 'Built dashboards, data structure, and PM integrations via vibe coding.',
      led: 'Re-established operating cadence while rebuilding the team.',
      influenced: 'Used data to secure stakeholder advocacy and contractor support.',
    },
    scale: ['Enablement operating system', 'Cross-functional requesters', 'Portfolio-level tracking'],
    callsMade: ['Paused intake when data showed overcapacity risk.', 'Converted SOW from simple timeline to multi-asset contract.', 'Separated Productivity, Operations, and Performance signals.'],
    changed: {
      business: 'Capacity conversations shifted from emotional debate to evidence-based prioritization.',
      capability: 'Team gained clearer intake clarity and workload transparency.',
      systemic: 'OPP became a repeatable decision framework.',
    },
    whatIKnowNow: 'If you can’t see demand and load, you can’t responsibly scale quality.',
    doOver: 'Automate data pipelines earlier to reduce manual maintenance.',
    askMeAbout: ['How I designed OPP metrics', 'Why SOW structure changed after a conflict'],
    capabilityScores: { 'build-scratch': 3, 'hands-on-builder': 3, 'data-decisions': 3, 'strategy-execution': 2, 'business-impact': 2, ambiguity: 2 },
    tags: ['Data and Decisions', 'Hands-on Building', 'Operating Model'],
    storyType: 'builder',
    visualConcept: 'Control room dashboard and queued work stream',
    sourceConfidence: 'high',
  },
  {
    id: 'walmart-certification',
    company: 'Walmart',
    timeframe: '2025 – Present',
    hook: "What if people don't need more information? They need different capability.",
    summary: 'Redesigned WFS certification into role-based architecture and gained VP-backed mandate.',
    heroMetrics: ['5 role-based certifications', 'Mandatory completion adoption', 'Organization hit 116% target'],
    challenge: 'Associates asked Tier 1 questions despite long one-size certification and poor info findability.',
    myRole: {
      owned: 'Diagnosis, certification architecture, and executive recommendation.',
      built: 'Learning architecture, copy, visuals, videos, and SCORM package.',
      led: 'Partnered with employee redesigning SharePoint access layer.',
      influenced: 'Presented directly to VP and secured completion mandate.',
    },
    scale: ['Seller-facing teams across functions', 'Leadership-monitored completion initiative'],
    callsMade: ['Switched from one-size curriculum to role-specific tracks.', 'Split access and capability problems into separate workstreams.', 'Asked for explicit VP sponsorship with due dates and gap reporting.'],
    changed: {
      business: 'Organization reached 116% of target (multi-factor outcome).',
      capability: 'Clearer role-specific understanding of WFS usage.',
      systemic: 'Certification governance became a leadership-managed motion.',
    },
    whatIKnowNow: 'Adoption improves when content answers real role decisions, not trivia recall.',
    doOver: 'Invest earlier in manager coaching reinforcement after certification.',
    askMeAbout: ['How I separated correlation from causation in outcome reporting', 'How VP alignment changed adoption speed'],
    capabilityScores: { 'learning-capability': 3, 'strategy-execution': 3, 'executive-scope': 2, 'business-impact': 2, 'develop-people': 2 },
    tags: ['Workforce Capability', 'Learning Strategy', 'Executive Influence'],
    storyType: 'capability',
    visualConcept: 'Certification pathway branches by role',
    sourceConfidence: 'high',
  },
  {
    id: 'samsung-turnaround',
    company: 'Samsung',
    timeframe: '2021 – 2025',
    hook: 'How do you rebuild credibility when partners no longer want your work?',
    summary: 'Turned around quality, governance, and trust for a 40-person learning org.',
    heroMetrics: ['40-person org', '90K→192K learning scope', 'Brand-governed QA process'],
    challenge: 'Partners doubted material quality due to product errors and inconsistent design quality.',
    myRole: {
      owned: 'Director-level strategy for partner trust recovery and operating discipline.',
      built: 'Transparency routines, lock-doc process, and approval governance.',
      led: 'Organization redesign, talent reset, and quality bar elevation.',
      influenced: 'Rebuilt partner confidence across carriers and internal teams.',
    },
    scale: ['40-person org', 'carrier partner ecosystem', 'up to 192K learner footprint'],
    callsMade: ['Asked partners for explicit yes-criteria before redesign.', 'Moved legal/product/carrier approval before visual design.', 'Raised hiring bar with mandatory work samples.'],
    changed: {
      business: 'Channel partners resumed and expanded adoption of learning materials.',
      capability: 'Team quality consistency improved materially.',
      systemic: 'Governance sequence reduced rework and protected quality.',
    },
    whatIKnowNow: 'Trust is rebuilt through reliability rituals, not one heroic deliverable.',
    doOver: 'Set mutual partner accountability commitments earlier.',
    askMeAbout: ['What I looked for in work samples', 'How I handled turnover while protecting respect'],
    capabilityScores: { 'lead-leaders': 3, 'lead-creative': 3, transformation: 3, 'enterprise-scale': 3, 'influence-without-authority': 2 },
    tags: ['Leading Leaders', 'Transformation', 'Leading Creative Talent'],
    storyType: 'turnaround',
    visualConcept: 'Before/after quality gate with escalating standards',
    sourceConfidence: 'high',
  },
  {
    id: 'samsung-future-director',
    company: 'Samsung',
    timeframe: '2021 – 2025',
    hook: 'What do you do when someone has the potential for the next level, but not the leadership behavior?',
    summary: 'Coached a Senior Manager through accountability leadership and difficult performance management.',
    heroMetrics: ['No HR/legal challenge to documentation', 'Internal behavior shift to accountability'],
    challenge: 'High-potential leader avoided performance conversations and tried to solve with headcount.',
    myRole: {
      owned: 'Diagnosis and leadership behavior expectations.',
      built: 'Coaching structure for difficult conversations and documentation practice.',
      led: 'Development journey toward director-level behavior.',
      influenced: 'Reset distinction between capacity constraints and performance management.',
    },
    scale: ['Leader-of-leaders coaching', 'Direct impact on team standards'],
    callsMade: ['Refused additional headcount request.', 'Documented accountability gap at manager level.', 'Practiced conversations until behavior changed.'],
    changed: {
      business: 'Performance issue resolved through manager leadership action.',
      capability: 'Manager gained confidence with accountability conversations.',
      systemic: 'Reinforced culture that leadership includes hard conversations.',
    },
    whatIKnowNow: 'Development starts with desire: do they want the responsibility, not just the title?',
    doOver: 'No major change to decision path; direct coaching was the right call.',
    askMeAbout: ['How I coach without rescuing', 'How I document leadership accountability fairly'],
    capabilityScores: { 'develop-people': 3, 'lead-leaders': 3, 'lead-people': 2, 'business-impact': 1 },
    tags: ['Leading Leaders', 'Developing People', 'Performance Leadership'],
    storyType: 'talent-development',
    visualConcept: 'Two-lane path: talent vs leadership behavior',
    sourceConfidence: 'high',
  },
  {
    id: 'samsung-ai-readiness',
    company: 'Samsung',
    timeframe: '2021 – 2025',
    hook: 'What happens when an AI demo proves capability, but not adoption value?',
    summary: 'Flagged reliability risk in launch demo and proposed more relatable use case.',
    heroMetrics: ['192K workforce readiness context', 'Cross-market launch constraints'],
    challenge: 'Technically impressive restaurant demo was likely to fail in many geographies.',
    myRole: {
      owned: 'Workforce readiness strategy and use-case quality critique.',
      built: 'Alternative recommendation anchored in context-reliable behavior.',
      led: 'Readiness planning across multiple companies and geographies.',
      influenced: 'Documented post-mortem recommendations when proposal was not adopted.',
    },
    scale: ['192K employees', 'multi-geography launch'],
    callsMade: ['Prioritized repeatability over novelty.', 'Stress-tested demo against geography variance.', 'Documented lessons despite transition timing.'],
    changed: {
      business: 'Field demos became inconsistent where original use case failed.',
      capability: 'Captured practical AI adoption criteria for future launches.',
      systemic: 'Post-mortem clarified constraints for future strategy design.',
    },
    whatIKnowNow: 'AI demos must be relevant, reliable, repeatable, and easy to picture in daily life.',
    doOver: 'Ask upfront what HOW decisions are truly open before building strategy.',
    askMeAbout: ['How I evaluate AI adoption risk', 'How I handle being right when recommendation is declined'],
    capabilityScores: { 'ai-emerging-tech': 3, 'data-decisions': 2, ambiguity: 2, 'strategy-execution': 2 },
    tags: ['AI and Emerging Technology', 'Enterprise Scale', 'Strategic Influence'],
    storyType: 'ai-strategy',
    visualConcept: 'Split-screen: wow demo vs dependable everyday task',
    sourceConfidence: 'high',
  },
  {
    id: 'tmobile-transformation',
    company: 'T-Mobile for Business',
    timeframe: '2020 – 2021',
    hook: 'How do you turn a frightened remote support organization into a sales team?',
    summary: 'Built relevance-based sales motion while developing leader coaching depth.',
    heroMetrics: ['56 employees', '8 frontline leaders', '~400/quarter → 1,200+ in one month'],
    challenge: 'Post-acquisition, newly remote, and high fear across role expectations and context.',
    myRole: {
      owned: 'Transformation sequence and leadership accountability model.',
      built: 'Finding-the-Alert conversation method and capability checks.',
      led: 'Leader routines, skill build, and coaching expectations.',
      influenced: 'Reframed sales as problem-solving instead of pressure selling.',
    },
    scale: ['56-person org', 'remote operations', 'COVID-era transition'],
    callsMade: ['Learned frontline job personally before optimization.', 'Ran live account-based manager capability checks weekly.', 'Moved from group practice to accountability conversations after learning window.'],
    changed: {
      business: 'Acquired accounts increased materially in a compressed window.',
      capability: 'Managers improved real-time coaching quality.',
      systemic: 'Sales became tied to meaningful account signals, not generic scripts.',
    },
    whatIKnowNow: 'You cannot coach work you don’t deeply understand.',
    doOver: 'Handle selected external partner friction with more curiosity before reaction.',
    askMeAbout: ['How I built trust before raising standards', 'How I coached reluctant managers into confident sales coaches'],
    capabilityScores: { 'lead-people': 3, 'lead-leaders': 3, transformation: 3, 'business-impact': 3, ambiguity: 2 },
    tags: ['Learning and Capability Expertise', 'Transformation Experience', 'Business Results'],
    storyType: 'transformation',
    visualConcept: 'Remote team constellation converging on shared sales motion',
    sourceConfidence: 'high',
  },
  {
    id: 'sprint-sales-accountability',
    company: 'Sprint',
    timeframe: '2018 – 2020',
    hook: 'Can training prove that it makes money?',
    summary: 'Built trainer bootcamp and tied interventions directly to business outcomes.',
    heroMetrics: ['$900K added sales in 90 days', '5,500+ employees supported', '200%+ IoT sales vs benchmark'],
    challenge: 'Training success was measured by completion, not performance change.',
    myRole: {
      owned: 'Shift from activity metrics to business impact accountability.',
      built: 'Bootcamp curriculum and applied coaching model for trainers.',
      led: 'Capability uplift in trainer skillset and field engagement approach.',
      influenced: 'Connected L&D work to store-manager systems and business language.',
    },
    scale: ['5,500+ workforce support', 'multi-state operation'],
    callsMade: ['Selected accessory sales for measurable baseline.', 'Required live customer-coaching reps, not classroom-only practice.', 'Trained team on manager systems to increase business fluency.'],
    changed: {
      business: 'Material short-term sales lift observed after intervention.',
      capability: 'Trainers became stronger performance partners.',
      systemic: 'L&D credibility improved through business storytelling and ROI framing.',
    },
    whatIKnowNow: 'If behavior in the field doesn’t change, training isn’t done yet.',
    doOver: 'Align local sales leaders to intervention measurement earlier.',
    askMeAbout: ['How we protected baseline integrity', 'What shifted in trainer mindset'],
    capabilityScores: { 'business-impact': 3, 'learning-capability': 3, 'data-decisions': 2, 'lead-people': 2, 'strategy-execution': 2 },
    tags: ['Data and Decisions', 'Learning Strategy', 'Business Impact'],
    storyType: 'performance',
    visualConcept: 'Field coaching loop tied to sales dashboard',
    sourceConfidence: 'high',
  },
  {
    id: 'sprint-quiz-warehouse',
    company: 'Sprint',
    timeframe: '2018 – 2020',
    hook: 'What happens when you stop defending your function and start scaling someone else’s good idea?',
    summary: 'Turned a District Manager’s grassroots product quiz into a full field campaign that outsold the rest of the country combined.',
    heroMetrics: ['5,500 regional employees', '3 days of targeted effort', 'Outsold every other region combined'],
    challenge: 'A working field idea existed only as an informal paper quiz that couldn’t scale as-is, and it hadn’t come from Learning.',
    myRole: {
      owned: 'Decision to recognize and scale an idea that didn’t originate from my function.',
      built: 'Digitized version of the quiz plus curated content and a field coaching rollout.',
      led: 'A weekend of side-by-side coaching across the region.',
      influenced: 'Opened an ongoing collaboration with Curriculum after initial friction.',
    },
    scale: ['5,500 regional employees', '7 other regions', 'newly launched product line'],
    callsMade: ['Curated and digitized an existing field idea instead of building from scratch.', 'Partnered with leaders and trainers to deploy it fast.', 'Stayed factual when Curriculum pushed back instead of getting defensive.'],
    changed: {
      business: 'Region sold more of the product than the other 7 regions combined; the warehouse ran out of product.',
      capability: 'Built a mechanism connecting existing resources with a clear narrative for the field.',
      systemic: 'Created a closer, more collaborative working relationship with Curriculum.',
    },
    whatIKnowNow: 'Great leadership makes good ideas bigger — I don’t need to be the source of an idea to help it scale.',
    doOver: 'Look for the potential in an idea before focusing on its flaws.',
    askMeAbout: ['Why the District Manager’s idea made me uncomfortable at first', 'What my VP said when we got national attention'],
    capabilityScores: { 'influence-without-authority': 3, 'business-impact': 3, transformation: 2, ambiguity: 2 },
    tags: ['Enterprise Scale', 'Business Impact', 'Influence Without Authority'],
    storyType: 'grassroots-scale',
    visualConcept: 'Grassroots idea rippling outward across a regional map',
    sourceConfidence: 'high',
  },
  {
    id: 'verizon-building-the-bench',
    company: 'Verizon',
    timeframe: '2008 – 2017',
    hook: 'What happens if your next leaders are already on the team, but no one is looking at them?',
    summary: 'Shifted succession conversations from spotlighting top and bottom performers to seeing everyone — growing the internal leadership bench.',
    heroMetrics: ['27 stores supported', '450 employees', '15% increase in internal promotions'],
    challenge: 'External leadership hires weren’t staying, while internal talent in the middle went unseen and undiscussed.',
    myRole: {
      owned: 'Reframing talent conversations with store leaders as a new HR Business Partner.',
      built: 'A one-by-one staff review habit that surfaced overlooked employees.',
      led: 'Coaching moments that pushed leaders to know their full teams, not just the extremes.',
      influenced: 'Skip-level conversations that made people feel seen and more optimistic about their future.',
    },
    scale: ['27 stores', '450 employees', 'multi-year talent pipeline'],
    callsMade: ['Asked leaders to go one-by-one through their staff instead of naming top-of-mind people.', 'Made the coaching moment explicit when a leader couldn’t describe someone on their team.', 'Kept pushing past comfortable narratives about who was “leadership material.”'],
    changed: {
      business: 'Internal promotions increased 15%.',
      capability: 'Leaders built a habit of knowing their full team, not just the extremes.',
      systemic: 'The bench got deeper and new leaders stayed longer.',
    },
    whatIKnowNow: 'Your best performer isn’t automatically your best leader — potential shows up in how someone influences others and whether they actually want to lead.',
    doOver: 'Recognize sooner that being able to solve the problem myself didn’t mean I should — sometimes developing the leader who owned it was the better answer.',
    askMeAbout: ['The employee I found because nobody was talking about them', 'When I learned to stop solving problems for employees'],
    capabilityScores: { 'develop-people': 3, 'career-progression': 3, 'learning-capability': 2, 'lead-people': 2 },
    tags: ['Career Mobility', 'Developing People', 'Leading Through Leaders'],
    storyType: 'talent-development',
    visualConcept: 'Spotlight moving from the extremes of a lineup toward the quiet middle',
    sourceConfidence: 'high',
  },
  {
    id: 'samsung-budget-portfolio',
    company: 'Samsung',
    timeframe: '2021 – 2025',
    hook: 'What does it mean to manage $3.2M like an investment instead of a budget?',
    summary: 'Challenged whether every recurring expense in a $3.2M portfolio was actually creating value, and reinvested the savings into higher-impact work.',
    heroMetrics: ['$3.2M annual budget', '90% reduction on a recurring vendor charge', '10+ vendors across learning, creative, technology, and comms'],
    challenge: 'Vendor costs had gone unquestioned for years, treated as fixed rather than negotiable.',
    myRole: {
      owned: 'Full accountability for the $3.2M portfolio and vendor relationships.',
      built: 'A questioning framework applied to every recurring cost, not just the obvious ones.',
      led: 'Negotiations that reduced a $500-per-post vendor charge to $50.',
      influenced: 'Redirected recovered dollars into R&D, incentives, and higher-impact creative execution.',
    },
    scale: ['$3.2M annual budget', '40 employees', '10+ vendors'],
    callsMade: ['Asked vendors to show the actual labor math behind their rates.', 'Treated every expense as an investment decision, not a fixed cost.', 'Reinvested savings instead of simply pocketing them.'],
    changed: {
      business: 'Cut one recurring vendor charge 90% (from $500 to $50 per post).',
      capability: 'Built a repeatable habit of questioning spend against value delivered.',
      systemic: 'Freed budget to fund experimentation, incentives, and higher-impact creative work.',
    },
    whatIKnowNow: 'Budget management is strategy — every dollar committed to low-value work is a dollar you can’t use to experiment, improve quality, or build capability.',
    doOver: 'Let the team see more of the money — vendor negotiations and funding tradeoffs were leadership-development opportunities I should have shared.',
    askMeAbout: ['The other vendor quotes I challenged', 'The hardest funding decisions I’ve had to make'],
    capabilityScores: { 'data-decisions': 3, 'business-impact': 3, 'executive-scope': 2 },
    tags: ['Portfolio Leadership', 'Commercial Acumen', 'Strategic Decisions'],
    storyType: 'stewardship',
    visualConcept: 'Budget line splitting from a flat cost into reinvested growth channels',
    sourceConfidence: 'high',
  },
  {
    id: 'samsung-influencing-700',
    company: 'Samsung',
    timeframe: '2021 – 2025',
    hook: 'How do you get 700 people who don’t report to you to execute your strategy?',
    summary: 'Built a repeatable model for driving consistent launch execution across 700 field employees with zero direct authority.',
    heroMetrics: ['700 field roles (400 FTE + 300 3PL)', '4 regions, 7 channel partners', '6+ launches per year'],
    challenge: 'Every major launch depended on hundreds of field employees I had no authority over.',
    myRole: {
      owned: 'Strategy for driving consistent field behavior without direct authority.',
      built: 'A repeatable execution model: define behavior, align leaders, make it relevant, enable execution, make great work visible.',
      led: 'Recognition programs (leaderboards, shout-outs) that created field-driven momentum.',
      influenced: 'Got local leaders to reinforce expectations so the work didn’t stay optional.',
    },
    scale: ['700 field roles', '4 regions', '7 channel partners'],
    callsMade: ['Defined the specific behavior needed instead of a vague goal.', 'Secured leader alignment before asking the field to act.', 'Connected the ask to outcomes the field already cared about.'],
    changed: {
      business: 'Consistent execution across 6+ launches per year at enterprise scale.',
      capability: 'Field employees began reinforcing behavior with each other, not just following instructions.',
      systemic: 'Momentum outgrew the original program and became self-sustaining.',
    },
    whatIKnowNow: 'People don’t need to care about my goals — my job is to connect the work to something they already have a reason to care about.',
    doOver: 'Spend more time learning the field role itself so I could connect what I needed to what mattered to them.',
    askMeAbout: ['The hardest leader I had to get on board', 'The recognition tactic that created the most momentum'],
    capabilityScores: { 'influence-without-authority': 3, 'lead-leaders': 2, transformation: 2, 'enterprise-scale': 2 },
    tags: ['Transformation Experience', 'People Leadership', 'Business Results'],
    storyType: 'influence-scale',
    visualConcept: 'Ripple effect spreading outward from a single strategy across a field map',
    sourceConfidence: 'high',
  },
  {
    id: 'verizon-early-failure',
    company: 'Verizon',
    timeframe: '2008 – 2017',
    hook: 'Are you really a leader if no one wants to follow you?',
    summary: 'Recovered from early leadership misread by apologizing, listening, and adapting coaching.',
    heroMetrics: ['Directional gains: engagement, NPS, sales, retention'],
    challenge: 'Started too rigidly based on inherited diagnosis; trust and followership dropped.',
    myRole: {
      owned: 'Accepted personal accountability for approach failure.',
      built: 'One-by-one relationship rebuild and individualized coaching style.',
      led: 'Culture reset toward high expectations with stronger trust.',
      influenced: 'Changed narrative from “harsh manager” to effective leader through actions.',
    },
    scale: ['Store-level team leadership'],
    callsMade: ['Acknowledged mistake directly.', 'Listened before prescribing fixes.', 'Adjusted coaching to each employee rather than one style.'],
    changed: {
      business: 'Directional sales and NPS improvements observed.',
      capability: 'Team motivation and response to coaching improved.',
      systemic: 'Established lasting principle: diagnose firsthand before leading change.',
    },
    whatIKnowNow: 'Don’t inherit someone else’s diagnosis; listen, understand, then challenge.',
    doOver: 'Shut my mouth and listen more, earlier.',
    askMeAbout: ['How I rebuilt credibility after a rough start', 'How this failure changed my leadership style'],
    capabilityScores: { 'lead-people': 3, 'learns-from-mistakes': 3, 'develop-people': 2, ambiguity: 1 },
    tags: ['People Leadership', 'Business Results', 'Transformation Experience'],
    storyType: 'self-awareness',
    visualConcept: 'Broken line repairing into upward trajectory',
    sourceConfidence: 'high',
  },
];

const KPI_DISPLAY_ORDER = [
  'WFS GMV',
  'WFS Seller Acquisition',
  'Knowledge Check Score',
  'NPS',
  'Learning Completion Rate',
  'Program Adoption Rate',
  'Training Frequency',
  'Mention Rate',
  'Mystery Shop Accuracy',
  'Revenue',
  'Budget Adherance',
  'Knowledge Retention',
  'Content Quality',
  'Acceptance Rate',
  'SLA Adherance',
  'Renewals',
  'New Customer Acquisition',
  'Labor Budget',
  'Completion Rate',
  'Visit Percentage',
  'Time on Platform',
  'Budget',
  'Acquisition',
  'Handle Time',
  'Drop Calls',
  'Quality Control',
  'Labor',
  'Visit Rate',
  'Investigations',
  'Response Time',
  'Employee Relations Issues',
  'Payroll Issues',
  'Customer Retention',
  'Accessory Revenue',
  'Employee Feedback Score',
  'Audit',
];

const ROLE_KPIS = {
  'walmart-sm': ['WFS GMV', 'WFS Seller Acquisition', 'Knowledge Check Score', 'NPS', 'Learning Completion Rate', 'Program Adoption Rate'],
  'samsung-director': ['Training Frequency', 'Mention Rate', 'Mystery Shop Accuracy', 'Revenue', 'Budget Adherance'],
  'samsung-sr-mgr': ['Training Frequency', 'Mention Rate', 'Mystery Shop Accuracy', 'Knowledge Retention', 'Content Quality', 'Acceptance Rate'],
  tmobile: ['SLA Adherance', 'Renewals', 'New Customer Acquisition', 'Labor Budget', 'NPS'],
  sprint: ['Completion Rate', 'Visit Percentage', 'Time on Platform', 'Budget', 'NPS', 'Revenue', 'Acquisition'],
  'ahs-call-center-manager': ['Handle Time', 'Drop Calls', 'Quality Control', 'Labor', 'New Customer Acquisition'],
  'verizon-hrbp': ['Visit Rate', 'Investigations', 'Response Time', 'Employee Relations Issues', 'Payroll Issues'],
  'verizon-district-trainer': ['Visit Rate', 'New Customer Acquisition', 'Customer Retention', 'Accessory Revenue', 'Time on Platform', 'Budget', 'NPS'],
  'verizon-gsm': ['New Customer Acquisition', 'Customer Retention', 'Employee Feedback Score', 'NPS', 'Accessory Revenue', 'Labor', 'Audit'],
};

const ROLE_MAJOR_WINS = {
  'verizon-gsm': ['35% above sales target', '>90% customer NPS', '8% reduction in stock shortages'],
  'verizon-district-trainer': ['42% lift in accessory revenue', '19% drop in operations errors', '12% increase in new-hire speed-to-competency'],
  'verizon-hrbp': ['+15% internal promotions', '+12% team performance ratings', '10% reduction in employee relations issues'],
  'ahs-call-center-manager': ['7% drop in handle time', '30% increase in new contracts'],
  sprint: ['+200% IOT sales', '$900K retail revenue in 90 days'],
  tmobile: ['400 accounts monthly -> 1,200 accounts monthly', '+23% employee feedback scores'],
  'samsung-sr-mgr': ['+35% engagement rates', '40% improvement in speed-to-competency', '+11% product training time', '22% increase in employee certification rates'],
  'samsung-director': ['+43% training reach', '+37% mention rate'],
  'walmart-sm': ['105% to acquisition target', '88% certification completion', '20 -> 6 workflow reduction'],
};

const ROLE_PROUD_OF = {
  'walmart-sm': [
    'I brought two historically separate fulfillment stories together and created a lifecycle that made it easier for associates—and sellers—to understand how Walmart’s logistics solutions fit together.',
    'I’m proud that what started as an enablement framework grew beyond my team: Marketing now uses it in seller communications and events, and the certification model is expanding internationally.',
    'I’ve pushed the boundaries of what our team can build ourselves, using AI and vibe coding to rapidly turn ideas into working tools, experiences, and solutions without always needing specialized technical or creative resources.',
  ],
  'samsung-director': [
    'I made the transition from leading content strategy to thinking much more broadly about how we prepared an entire workforce for what Samsung was bringing to market.',
    'I helped prepare frontline teams for Gemini and Galaxy AI at a moment when generative AI was fundamentally changing the mobile industry, while also providing feedback upstream as the experience was being tested.',
    'I rebuilt confidence in a learning organization whose work was at risk of being outsourced and proved that we could raise the quality of the work while keeping the capability inside the organization.',
  ],
  'samsung-sr-mgr': [
    'My team architected the methods frontline employees used to learn how to sell Samsung products, connecting product knowledge to what actually needed to happen in the customer conversation.',
    'I’m proud that we kept experimenting with better ways for people to learn, including AR/VR, rather than assuming the traditional approach was always the right one.',
    'I built and developed a 15-person team that could move faster and operate more consistently without sacrificing the quality of what we put into the field.',
  ],
  tmobile: [
    'I helped a team that had historically thought of itself primarily as support realize that taking care of the customer and growing the relationship didn\'t have to be competing objectives.',
    'I’m proud of how I developed my eight frontline leaders to own the performance of their teams rather than having every answer come through me.',
    'I led the organization through a merger and the disruption of the pandemic while keeping people connected, customers supported, and the business operating.',
  ],
  sprint: [
    'I helped change the question from “Did people complete the training?” to “Did anything actually get better because of it?”',
    'I’m proud that we could connect development directly to business performance—including an upskilling effort that generated more than $900K in additional sales in 90 days.',
    'I invested in the people doing the teaching, not just the people taking the training, and developed our trainers into stronger performance partners for the field.',
  ],
  'ahs-call-center-manager': [
    'Learning to look past the scorecard. The numbers could tell me who was struggling, but listening to the conversations helped me understand what was actually getting in their way.',
    'Helping people become more intentional and human in their sales conversations—hearing curiosity, hesitation, and buying signals instead of simply working through a script.',
    'Becoming a much stronger coach by learning that two people can miss the same metric for completely different reasons, and the intervention has to match the person rather than the number.',
  ],
  'verizon-hrbp': [
    'Being someone leaders trusted with the messy, complicated people situations where there wasn\'t always an obvious answer—and helping them find a path that was fair to the employee, responsible for the business, and consistent with policy.',
    'Helping turn succession planning into actual opportunity for employees, contributing to a 15% increase in internal promotions rather than creating plans that simply sat on paper.',
    'Learning how to hold care and accountability at the same time—supporting employees through leaves, benefits, performance challenges, and difficult circumstances while still helping leaders maintain the standards their teams needed.',
  ],
  'verizon-district-trainer': [
    'I spent enough time in the stores to see what happened after the training was over, which changed how I thought about learning for the rest of my career.',
    'I’m proud that I built development around the problems employees and managers were actually experiencing, rather than assuming another course was automatically the answer.',
    'I got to coach people not only toward better performance in their current roles, but toward greater confidence, growth, and their next opportunity.',
  ],
  'verizon-gsm': [
    'I took a Tier 3 store to Tier 1, but I’m most proud that we did it while maintaining 90%+ NPS—we didn\'t have to choose between performance and taking care of customers.',
    'I developed three managers to become stronger leaders and deliver results without sacrificing the morale of their teams.',
    'This was where I learned one of the ideas that has followed me through my career: how you get the result matters just as much as the result itself.',
  ],
};

const state = {
  data: null,
  caseStudySpec: null,
  whatWinByStoryId: {},
  filteredRoles: [],
  activeRoleId: null,
  explorer: {
    persona: null,
    selected: [],
    viewedStoryIds: new Set(),
    lastResults: [],
  },
};

const el = {
  name: document.getElementById('name'),
  title: document.getElementById('title'),
  roleNav: document.getElementById('roleNav'),
  roleHero: document.getElementById('roleHero'),
  measurements: document.getElementById('measurements'),
  wins: document.getElementById('wins'),
  accomplishments: document.getElementById('accomplishments'),
  loved: document.getElementById('loved'),
  searchRoles: document.getElementById('searchRoles'),
  fitQuizButton: document.getElementById('fitQuizButton'),
  fitQuizModal: document.getElementById('fitQuizModal'),
  fitQuizClose: document.getElementById('fitQuizClose'),
  careerExplorerRoot: document.getElementById('careerExplorerRoot'),
  ceScreenWho: document.getElementById('ceScreenWho'),
  ceScreenSelect: document.getElementById('ceScreenSelect'),
  ceScreenResults: document.getElementById('ceScreenResults'),
  ceDetail: document.getElementById('ceDetail'),
  ceSelectPrompt: document.getElementById('ceSelectPrompt'),
  ceProgress: document.getElementById('ceProgress'),
  ceOptions: document.getElementById('ceOptions'),
  ceShowResults: document.getElementById('ceShowResults'),
  ceBrowseAll: document.getElementById('ceBrowseAll'),
  ceBackToWho: document.getElementById('ceBackToWho'),
  ceResultsHeading: document.getElementById('ceResultsHeading'),
  ceResultsSubhead: document.getElementById('ceResultsSubhead'),
  ceCards: document.getElementById('ceCards'),
  ceResultsBack: document.getElementById('ceResultsBack'),
  ceReplayCombo: document.getElementById('ceReplayCombo'),
  ceReplayBrowsing: document.getElementById('ceReplayBrowsing'),
  ceTryAnother: document.getElementById('ceTryAnother'),
  ceBackToSelect: document.getElementById('ceBackToSelect'),
  ceFilterBySkill: document.getElementById('ceFilterBySkill'),
  ceSuggestedCombos: document.getElementById('ceSuggestedCombos'),
};

async function init() {
  const response = await fetch('katie-moore-resume.json');
  if (!response.ok) {
    renderError('Could not load resume data.');
    return;
  }

  state.data = await response.json();
  state.data.roles = orderRoles(state.data.roles);
  state.filteredRoles = [...state.data.roles];
  state.activeRoleId = state.filteredRoles[0]?.id ?? null;

  try {
    const specResponse = await fetch('case-study-portfolio-spec.json');
    if (specResponse.ok) {
      state.caseStudySpec = await specResponse.json();
    }
  } catch (error) {
    console.warn('Case study spec not loaded:', error);
  }

  try {
    // Bundled build embeds this data (see bundle_for_puppy_share.py) since a
    // relative fetch() has nothing to hit once this is a single flat file on
    // Puppy Pages -- it was silently failing there before and the what/win
    // overrides were never actually applying on the live site.
    const whatWinData = typeof EMBEDDED_WHAT_WIN !== 'undefined'
      ? EMBEDDED_WHAT_WIN
      : await (async () => {
        const whatWinResponse = await fetch('what-the-win.json');
        return whatWinResponse.ok ? whatWinResponse.json() : null;
      })();
    if (whatWinData) {
      state.whatWinByStoryId = buildWhatWinByStoryId(whatWinData.items);
    }
  } catch (error) {
    console.warn('What/Win data not loaded:', error);
  }

  el.name.textContent = state.data.name;
  el.title.textContent = `${state.data.title} · ${state.data.yearsExperience}+ years`;

  renderRoleNav();
  renderActiveRole();

  if (el.searchRoles) {
    el.searchRoles.addEventListener('input', onSearch);
  }

  setupCareerExplorer();
}

function renderRoleNav() {
  el.roleNav.innerHTML = '';

  if (!state.filteredRoles.length) {
    el.roleNav.innerHTML = '<p>No roles match that search.</p>';
    el.roleNav.style.setProperty('--role-count', '1');
    return;
  }

  el.roleNav.style.setProperty('--role-count', String(state.filteredRoles.length));

  state.filteredRoles.forEach((role) => {
    const theme = getThemeForRole(role);
    const active = role.id === state.activeRoleId;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = `role-chip ${active ? 'active' : ''}`;
    button.style.setProperty('--chip-bg', theme.chip);
    button.style.setProperty('--chip-text', theme.chipText || theme.text);
    button.setAttribute('aria-pressed', String(active));
    button.innerHTML = `
      <span class="role-title">${escapeHtml(role.title)}</span>
      ${active ? `<span class="role-company">${escapeHtml(role.company)}</span>` : ''}
      <span class="years">${escapeHtml(role.years)}</span>
    `;

    button.addEventListener('click', () => {
      state.activeRoleId = role.id;
      renderRoleNav();
      renderActiveRole();
    });

    el.roleNav.append(button);
  });
}

function renderActiveRole() {
  const activeRole = state.filteredRoles.find((r) => r.id === state.activeRoleId);
  if (!activeRole) {
    el.roleHero.innerHTML = '<p>Select a role to continue.</p>';
    el.measurements.innerHTML = '';
    el.wins.innerHTML = '';
    el.accomplishments.innerHTML = '';
    el.loved.innerHTML = '';
    return;
  }

  const theme = getThemeForRole(activeRole);
  const brandKey = getBrandKey(activeRole);
  const logoPath = getLogoPath(brandKey);

  document.documentElement.style.setProperty('--hero-bg', theme.hero);
  document.documentElement.style.setProperty('--hero-text', theme.text);
  document.documentElement.style.setProperty('--hero-accent', theme.accent);

  const primaryCards = buildMeasurementCards(activeRole)
    .map(
      (item) => `
        <div class="hero-stat hero-stat--summary">
          ${portfolioIcon(item.label)}
          <div class="label">${escapeHtml(item.label)}</div>
          <div class="value">${escapeHtml(item.value)}</div>
        </div>
      `
    )
    .join('');

  el.roleHero.className = `hero-card ${brandKey === 'ahs' ? 'theme-ahs' : ''}`;
  el.roleHero.dataset.company = brandKey;

  const displayLocation = getDisplayLocation(activeRole);

  el.roleHero.innerHTML = `
    <div class="hero-meta">${escapeHtml(activeRole.years)}</div>
    <div class="hero-location">${escapeHtml(displayLocation)}</div>
    <h2>${escapeHtml(activeRole.title)}</h2>
    <div class="hero-company">${escapeHtml(activeRole.company)}</div>
    <div class="hero-stats">${primaryCards}</div>
    <div class="hero-lower">
      <article class="hero-own-words" aria-label="The role in my own words">
        ${portfolioIcon('document')}
        <h3>The role in my own words</h3>
        <p>${escapeHtml(buildRoleInMyOwnWords(activeRole))}</p>
      </article>
      <div class="hero-logo">
        <img src="${escapeHtml(logoPath)}" alt="${escapeHtml(activeRole.company)} logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-block';" />
        <span class="hero-logo-fallback" style="display:none;">${escapeHtml(shortCompany(activeRole.company))}</span>
      </div>
    </div>
  `;

  renderMeasurements(activeRole);
  renderWins(activeRole);
  renderAccomplishments(activeRole);
  renderLoved(activeRole);
}

function renderMeasurements(role) {
  const items = buildRoleKpis(role);
  el.measurements.innerHTML = items
    .map(
      (item) => `
        <article class="stat-card">
          ${portfolioIcon(item)}
          <div class="value">${escapeHtml(item)}</div>
        </article>
      `
    )
    .join('');
}

function renderWins(role) {
  const wins = ROLE_MAJOR_WINS[role.id] ?? [];

  if (!wins.length) {
    el.wins.innerHTML = role.metricWins
      .map((item) => `<article class="stat-card"><div class="value">${escapeHtml(item.delta)}</div><div class="label">${escapeHtml(item.label)}</div><div>${escapeHtml(item.context)}</div></article>`)
      .join('');
    return;
  }

  el.wins.innerHTML = wins
    .map(
      (item) => `
        <article class="stat-card">
          ${portfolioIcon(item)}
          <div class="value win-text">${formatMetricWin(item)}</div>
        </article>
      `
    )
    .join('');
}

function renderAccomplishments(role) {
  const proudItems = ROLE_PROUD_OF[role.id] ?? role.highlights;
  el.accomplishments.innerHTML = proudItems
    .map((item, idx) => `<li><span class="num">${idx + 1}</span> ${escapeHtml(item)}</li>`)
    .join('');
}

function renderLoved(role) {
  const items = LOVED_BY_ROLE[role.id] ?? [
    'Building capability that lasts beyond any single launch',
    'Translating strategy into practical team execution',
    'Developing leaders who scale impact across functions',
  ];

  const bullets = items.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  el.loved.innerHTML = `<article class="loved-item"><ul class="loved-list">${bullets}</ul></article>`;
}

function onSearch(event) {
  const term = event.target.value.trim().toLowerCase();

  if (!term) {
    state.filteredRoles = [...state.data.roles];
  } else {
    state.filteredRoles = state.data.roles.filter((role) => {
      const content = [role.title, role.company, role.scope, ...role.highlights, ...role.metricWins.map((m) => m.label)].join(' ').toLowerCase();
      return content.includes(term);
    });
  }

  if (!state.filteredRoles.some((role) => role.id === state.activeRoleId)) {
    state.activeRoleId = state.filteredRoles[0]?.id ?? null;
  }

  renderRoleNav();
  renderActiveRole();
}

function setupCareerExplorer() {
  if (!el.fitQuizButton || !el.fitQuizModal || !el.careerExplorerRoot) {
    return;
  }

  window.__cePersonaPick = (persona) => {
    handlePersonaSelection(persona);
  };

  const openExplorer = () => {
    el.fitQuizModal.hidden = false;
    showExplorerScreen('who');
    el.ceDetail.hidden = true;
    state.explorer.selected = [];
    state.explorer.persona = null;
  };

  const closeExplorer = () => {
    el.fitQuizModal.hidden = true;
    el.fitQuizButton.focus();
  };

  el.fitQuizButton.addEventListener('click', openExplorer);
  el.fitQuizClose?.addEventListener('click', closeExplorer);

  document.querySelectorAll('[data-persona]').forEach((node) => {
    node.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const persona = node.getAttribute('data-persona') ?? 'browsing';
      handlePersonaSelection(persona);
    });
  });
  el.fitQuizModal.addEventListener('click', (event) => {
    if (event.target instanceof HTMLElement && event.target.dataset.closeQuiz === 'true') {
      closeExplorer();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !el.fitQuizModal.hidden) {
      closeExplorer();
    }
  });

  el.careerExplorerRoot.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const personaButton = target.closest('[data-persona]');
    if (personaButton instanceof HTMLElement) {
      handlePersonaSelection(personaButton.dataset.persona ?? 'browsing');
      return;
    }

    const storyButton = target.closest('[data-story-id]');
    if (storyButton instanceof HTMLElement) {
      openStoryExperience(storyButton.dataset.storyId ?? '');
      return;
    }

    const comboButton = target.closest('[data-combo]');
    if (comboButton instanceof HTMLElement) {
      applySuggestedCombo(Number(comboButton.dataset.combo));
    }
  });

  el.ceShowResults?.addEventListener('click', () => renderExplorerResults({ browseAll: false }));
  el.ceBrowseAll?.addEventListener('click', () => renderExplorerResults({ browseAll: true }));
  el.ceBackToWho?.addEventListener('click', () => showExplorerScreen('who'));
  el.ceResultsBack?.addEventListener('click', () => {
    if (state.explorer.persona === 'browsing') {
      showExplorerScreen('who');
      return;
    }
    showExplorerScreen('select');
  });
  el.ceTryAnother?.addEventListener('click', () => showExplorerScreen('select'));
  el.ceBackToSelect?.addEventListener('click', () => showExplorerScreen('select'));
  el.ceFilterBySkill?.addEventListener('click', () => showExplorerScreen('who'));

  document.getElementById('cePersonaRecruiter')?.addEventListener('click', () => handlePersonaSelection('recruiter'));
  document.getElementById('cePersonaHiringManager')?.addEventListener('click', () => handlePersonaSelection('hiring-manager'));
  document.getElementById('cePersonaBrowsing')?.addEventListener('click', () => handlePersonaSelection('browsing'));
}

function handlePersonaSelection(persona) {
  state.explorer.persona = PERSONA_FLOWS[persona] ? persona : 'browsing';
  state.explorer.selected = [];

  if (state.explorer.persona === 'browsing') {
    renderExplorerResults({ browseAll: true });
    return;
  }

  showExplorerScreen('select');

  try {
    renderExplorerOptions();
  } catch (error) {
    console.error('Career Explorer persona selection failed:', error);
    if (el.ceOptions) {
      el.ceOptions.innerHTML = '<p>Something went sideways loading options. Please close and reopen Career Explorer.</p>';
    }
  }
}

function showExplorerScreen(screen) {
  if (!el.ceScreenWho || !el.ceScreenSelect || !el.ceScreenResults) {
    return;
  }

  el.ceScreenWho.hidden = screen !== 'who';
  el.ceScreenSelect.hidden = screen !== 'select';
  el.ceScreenResults.hidden = screen !== 'results';
}

function renderExplorerOptions() {
  const flow = PERSONA_FLOWS[state.explorer.persona] ?? PERSONA_FLOWS.browsing;
  const options = Array.isArray(flow.options) ? flow.options : [];
  if (!el.ceSelectPrompt || !el.ceOptions) {
    return;
  }

  el.ceSelectPrompt.textContent = flow.prompt;
  el.ceOptions.innerHTML = '';

  if (flow.supportsSixtySecond) {
    const quickCard = document.createElement('button');
    quickCard.type = 'button';
    quickCard.className = 'ce-option ce-option--quick';
    quickCard.textContent = 'Give me the 60-second version';
    quickCard.addEventListener('click', () => renderExplorerResults({ sixtySecond: true }));
    el.ceOptions.append(quickCard);
  }

  options.forEach((option) => {
    const wrapper = document.createElement('label');
    wrapper.className = 'ce-option';
    const checked = state.explorer.selected.includes(option.key);

    wrapper.innerHTML = `
      <input type="checkbox" value="${escapeHtml(option.key)}" ${checked ? 'checked' : ''} />
      <span class="option-icon">${portfolioIcon(option.key)}</span>
      <span>${escapeHtml(option.label)}</span>
    `;

    const input = wrapper.querySelector('input');
    input?.addEventListener('change', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) {
        return;
      }

      const next = [...state.explorer.selected];
      if (target.checked) {
        if (next.length >= 3) {
          target.checked = false;
          return;
        }
        next.push(option.key);
      } else {
        const idx = next.indexOf(option.key);
        if (idx >= 0) {
          next.splice(idx, 1);
        }
      }

      state.explorer.selected = next;
      updateExplorerProgress();
    });

    el.ceOptions.append(wrapper);
  });

  updateExplorerProgress();
  renderSuggestedCombos();
}

function updateExplorerProgress() {
  const count = state.explorer.selected.length;
  if (el.ceProgress) {
    el.ceProgress.textContent = `${count} of 3 selected`;
  }
  if (el.ceShowResults) {
    el.ceShowResults.disabled = count === 0;
  }
}

function renderExplorerResults({ browseAll = false, sixtySecond = false } = {}) {
  const selected = browseAll ? [] : [...state.explorer.selected];
  const stories = rankStories({ selectedCapabilities: selected, sixtySecond, showAll: browseAll });
  el.ceCards.classList.toggle('ce-cards--quick', sixtySecond);
  el.ceCards.style.setProperty('--result-count', String(Math.max(1, stories.length)));

  state.explorer.lastResults = stories.map((story) => story.id);
  stories.forEach((story) => state.explorer.viewedStoryIds.add(story.id));

  const selectionLabel = selected.length
    ? selected.map((key) => CAPABILITY_LABELS[key] ?? key).join(' + ')
    : (sixtySecond ? 'the strongest cross-cutting proof points' : 'all stories');

  el.ceResultsHeading.textContent = selected.length
    ? `You asked for someone who can… ${selectionLabel}`
    : 'Here’s the evidence.';
  el.ceResultsSubhead.textContent = 'Projects below are ranked by match strength, diversity, and evidence quality.';

  // "Straight to the work" (browsing persona) never went through a
  // combination-picker, so "try another combination" is meaningless there --
  // swap in a simpler CTA that sends them to actually pick a persona/filter.
  const wasBrowsing = state.explorer.persona === 'browsing';
  if (el.ceReplayCombo) el.ceReplayCombo.hidden = wasBrowsing;
  if (el.ceReplayBrowsing) el.ceReplayBrowsing.hidden = !wasBrowsing;
  if (el.ceTryAnother) el.ceTryAnother.hidden = wasBrowsing;
  if (el.ceBackToSelect) el.ceBackToSelect.hidden = wasBrowsing;
  if (el.ceFilterBySkill) el.ceFilterBySkill.hidden = !wasBrowsing;
  if (el.ceSuggestedCombos) el.ceSuggestedCombos.hidden = wasBrowsing;

  el.ceCards.innerHTML = stories
    .map((story) => {
      const pdfPath = getStoryPdfPath(story.id);
      const isComingSoon = isStoryComingSoon(story.id);
      const actionLabel = pdfPath
        ? 'Open case study (PDF)'
        : (isComingSoon ? 'Coming soon' : 'Explore this story');

      const overrides = state.whatWinByStoryId[story.id] ?? {};
      const theWhat = overrides.what ?? story.summary;
      const theWin = overrides.win ?? story.heroMetrics[0] ?? 'Key evidence available';

      return `
      <article class="ce-card" style="--company-color: ${getThemeForRole(story).chip}">
        <p class="ce-company">${escapeHtml(story.company)} · ${escapeHtml(story.timeframe)}</p>
        <h4>${escapeHtml(story.hook)}</h4>

        <div class="ce-card-block ce-card-block--what">
          <p class="ce-card-label">The What</p>
          <p class="ce-summary">${escapeHtml(theWhat)}</p>
        </div>

        <div class="ce-card-block ce-card-block--win">
          <p class="ce-card-label">The Win</p>
          <p class="ce-metric">${escapeHtml(theWin)}</p>
        </div>

        <div class="ce-tags ce-card-tags">${story.tags.slice(0, 4).map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')}</div>
        <button class="btn btn--quiz ce-card-action" type="button" data-story-id="${escapeHtml(story.id)}" ${isComingSoon ? 'disabled aria-disabled="true" title="Case study coming soon"' : ''}>${actionLabel}</button>
      </article>
    `;
    })
    .join('');

  el.ceDetail.hidden = true;
  showExplorerScreen('results');
}

function rankStories({ selectedCapabilities, sixtySecond, showAll = false }) {
  const seen = state.explorer.viewedStoryIds;
  const allStories = [...CAREER_EXPLORER_STORIES];

  if (showAll) {
    return allStories;
  }

  const targetCount = sixtySecond ? 5 : 4;

  const scored = allStories.map((story) => {
    const base = selectedCapabilities.reduce((sum, key) => sum + (story.capabilityScores[key] ?? 0), 0);
    const evidenceBoost = Math.min(1.5, (story.heroMetrics?.length ?? 0) * 0.3);
    const unseenBoost = seen.has(story.id) ? 0 : 1;
    const sixtySecondBoost = sixtySecond ? Object.values(story.capabilityScores).reduce((a, b) => a + b, 0) * 0.15 : 0;
    return { story, score: base + evidenceBoost + unseenBoost + sixtySecondBoost };
  });

  scored.sort((a, b) => b.score - a.score);

  const selectedStories = [];
  const companyCounts = new Map();
  const typeCounts = new Map();

  for (const item of scored) {
    const companyPenalty = (companyCounts.get(item.story.company) ?? 0) * 0.6;
    const typePenalty = (typeCounts.get(item.story.storyType) ?? 0) * 0.5;

    if (item.score - companyPenalty - typePenalty < 1.2 && selectedStories.length > 0) {
      continue;
    }

    selectedStories.push(item.story);
    companyCounts.set(item.story.company, (companyCounts.get(item.story.company) ?? 0) + 1);
    typeCounts.set(item.story.storyType, (typeCounts.get(item.story.storyType) ?? 0) + 1);

    if (selectedStories.length === targetCount) {
      break;
    }
  }

  return selectedStories.length ? selectedStories : scored.slice(0, targetCount).map((item) => item.story);
}

function buildWhatWinByStoryId(items) {
  if (!Array.isArray(items)) {
    return {};
  }

  const byId = {};

  items.forEach((item) => {
    const index = Number(item?.index);
    if (!Number.isFinite(index) || index < 1) {
      return;
    }

    const story = CAREER_EXPLORER_STORIES.find((candidate) => candidate.id === item.storyId);
    if (!story) {
      return;
    }

    byId[story.id] = {
      what: item.what,
      win: item.win,
    };
  });

  return byId;
}

function openStoryExperience(storyId) {
  const pdfPath = getStoryPdfPath(storyId);
  if (pdfPath) {
    openStoryPdf(storyId, pdfPath);
    return;
  }

  if (isStoryComingSoon(storyId)) {
    return;
  }

  const specStory = getSpecStoryForBaseStory(storyId);
  if (specStory) {
    openSpecStoryDetail(storyId, specStory);
    return;
  }

  openStoryDetail(storyId);
}

function getSpecStoryForBaseStory(storyId) {
  const specStories = state.caseStudySpec?.stories;
  if (!Array.isArray(specStories)) {
    return null;
  }

  const storyMap = {
    'walmart-lifecycle': 'walmart-logistics',
    'samsung-ai-readiness': 'samsung-galaxy-ai',
  };

  const specId = storyMap[storyId];
  if (!specId) {
    return null;
  }

  return specStories.find((story) => story.id === specId) ?? null;
}

function openSpecStoryDetail(baseStoryId, specStory) {
  if (!el.ceDetail) {
    return;
  }

  const baseStory = CAREER_EXPLORER_STORIES.find((item) => item.id === baseStoryId);
  const { previousId, nextId, position, total } = getStoryNavigation(baseStoryId);
  const logoPath = getStoryLogoPath(specStory.company || baseStory?.company || 'Walmart');

  const highlights = (specStory.atAGlance ?? [])
    .map((item) => `<li><strong>${escapeHtml(item.stat ?? '')}</strong><span>${escapeHtml(item.label ?? '')}</span></li>`)
    .join('');

  const matched = (specStory.whyYoureSeeing?.matched ?? [])
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join('');

  const also = (specStory.whyYoureSeeing?.also ?? [])
    .map((item) => `<span>${escapeHtml(item)}</span>`)
    .join('');

  const talk = (specStory.ifWeTalk ?? [])
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join('');

  const role = (specStory.myRole ?? [])
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join('');

  const tags = (specStory.tags ?? []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join('');

  el.ceDetail.innerHTML = `
    <div class="ce-detail__backdrop" data-close-detail="true"></div>
    <article class="ce-spec-story" role="dialog" aria-modal="true" aria-label="Case study detail">
      <header class="ce-spec-story__topbar">
        <button type="button" id="ceCloseDetail" class="ce-spec-story__close">Close story</button>
        <div class="ce-spec-story__brand"><img src="${escapeHtml(logoPath)}" alt="${escapeHtml(specStory.company)} logo" /><span>· ${escapeHtml(specStory.year ?? '')}</span></div>
      </header>

      <div class="ce-spec-story__body">
        <main class="ce-spec-story__main">
          <h3>${escapeHtml(specStory.heading ?? baseStory?.hook ?? 'Case study')}</h3>
          <blockquote>${escapeHtml(specStory.subheading ?? baseStory?.summary ?? '')}</blockquote>
          <p class="ce-spec-story__meta">${escapeHtml(specStory.company ?? '')} · ${escapeHtml(specStory.year ?? '')}</p>
          <p class="ce-spec-story__tags">${tags}</p>

          <section class="ce-spec-story__section">
            <h4>Context</h4>
            <p>${escapeHtml(baseStory?.challenge ?? '')}</p>
          </section>
          <section class="ce-spec-story__section">
            <h4>The Calls I Made</h4>
            <ul>${(baseStory?.callsMade ?? []).map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
          </section>
          <section class="ce-spec-story__section">
            <h4>What Changed</h4>
            <ul>
              <li><strong>Business:</strong> ${escapeHtml(baseStory?.changed?.business ?? '')}</li>
              <li><strong>Capability:</strong> ${escapeHtml(baseStory?.changed?.capability ?? '')}</li>
              <li><strong>System:</strong> ${escapeHtml(baseStory?.changed?.systemic ?? '')}</li>
            </ul>
          </section>
        </main>

        <aside class="ce-spec-story__rail">
          <section class="ce-spec-card">
            <h5>At a Glance</h5>
            <ul class="ce-spec-glance">${highlights}</ul>
          </section>
          <section class="ce-spec-card ce-spec-card--tint">
            <h5>Why You're Seeing This</h5>
            <p>You said you care about:</p>
            <ul>${matched}</ul>
            <p>This story also demonstrates:</p>
            <div class="ce-spec-chip-cloud">${also}</div>
          </section>
          <section class="ce-spec-card">
            <h5>If We Talk, Ask Me About...</h5>
            <ol>${talk}</ol>
          </section>
          <section class="ce-spec-card">
            <h5>My Role in This</h5>
            <ul>${role}</ul>
          </section>
        </aside>
      </div>

      <footer class="ce-spec-story__footer">
        <button type="button" class="ce-story-nav" data-story-nav="prev" ${previousId ? `data-story-id="${escapeHtml(previousId)}"` : 'disabled'}>← Previous story</button>
        <p>${position} of ${total} stories</p>
        <button type="button" class="ce-story-nav ce-story-nav--next" data-story-nav="next" ${nextId ? `data-story-id="${escapeHtml(nextId)}"` : 'disabled'}>Next story →</button>
      </footer>
    </article>
  `;

  const closeDetail = () => {
    el.ceDetail.hidden = true;
  };

  el.ceDetail.hidden = false;
  el.ceDetail.querySelector('#ceCloseDetail')?.addEventListener('click', closeDetail);
  el.ceDetail.querySelector('[data-close-detail="true"]')?.addEventListener('click', closeDetail);
  el.ceDetail.querySelectorAll('[data-story-nav]').forEach((node) => {
    node.addEventListener('click', () => {
      const nextStoryId = node.getAttribute('data-story-id');
      if (nextStoryId) {
        openStoryExperience(nextStoryId);
      }
    });
  });
}

function openStoryPdf(storyId, pdfPath) {
  if (!el.ceDetail) {
    return;
  }

  const story = CAREER_EXPLORER_STORIES.find((item) => item.id === storyId);
  const safeTitle = story?.hook ?? 'Case study';

  // Each case study is a single richly-designed page, so we render it as an
  // image and show it inline. Images loaded via <img src="data:..."> are a
  // normal resource load, not a navigation, so none of the browser security
  // features that block data:/blob: navigation (or OneDrive's anti-framing
  // headers) come into play here. pdfPath is still the real hosted OneDrive
  // link, kept as a "view full PDF" fallback for printing/downloading.
  const pageImage = getStoryPdfPageImage(storyId);

  const imageMarkup = pageImage
    ? `<img class="ce-pdf-window__page-image" src="${escapeHtml(pageImage)}" alt="${escapeHtml(safeTitle)} case study" />`
    : `<p>Preview isn't available -- use the link below to view the full PDF.</p>`;

  const zoomControlsMarkup = pageImage ? `
        <div class="ce-pdf-window__zoom-controls" role="group" aria-label="Zoom controls">
          <button type="button" class="ce-pdf-window__zoom-btn" id="cePdfZoomOut" aria-label="Zoom out">−</button>
          <span class="ce-pdf-window__zoom-level" id="cePdfZoomLevel" aria-live="polite">100%</span>
          <button type="button" class="ce-pdf-window__zoom-btn" id="cePdfZoomIn" aria-label="Zoom in">+</button>
        </div>` : '';

  el.ceDetail.innerHTML = `
    <div class="ce-detail__backdrop" data-close-detail="true"></div>
    <article class="ce-pdf-window" role="dialog" aria-modal="true" aria-label="Case study preview">
      <header class="ce-pdf-window__header">
        <h3>${escapeHtml(safeTitle)}</h3>
        <div class="ce-pdf-window__actions">
          <a class="btn btn--ghost" href="${escapeHtml(pdfPath)}" target="_blank" rel="noopener noreferrer" download>Download PDF</a>
          <button class="btn btn--ghost" type="button" id="ceCloseDetail">Close</button>
        </div>
      </header>
      ${zoomControlsMarkup}
      <div class="ce-pdf-window__preview">
        ${imageMarkup}
      </div>
    </article>
  `;

  const closeDetail = () => {
    el.ceDetail.hidden = true;
  };

  el.ceDetail.hidden = false;
  el.ceDetail.querySelector('#ceCloseDetail')?.addEventListener('click', closeDetail);
  el.ceDetail.querySelector('[data-close-detail="true"]')?.addEventListener('click', closeDetail);

  // Incremental zoom: a single fit/native toggle was too coarse (either too
  // small to read or a jarring jump to full native resolution). Baseline
  // (100%) is the natural "fits within the preview pane" size -- same as
  // the plain CSS max-width/max-height contain behavior -- and higher
  // steps scale up from that measured baseline width, overflowing the pane
  // so the reader can scroll/pan around it.
  const ZOOM_STEPS = [100, 130, 160, 200, 250, 300];
  let zoomIndex = 0;
  let baseFittedWidth = null;

  const pageImageEl = el.ceDetail.querySelector('.ce-pdf-window__page-image');
  const zoomInBtn = el.ceDetail.querySelector('#cePdfZoomIn');
  const zoomOutBtn = el.ceDetail.querySelector('#cePdfZoomOut');
  const zoomLevelEl = el.ceDetail.querySelector('#cePdfZoomLevel');

  const ensureBaseWidth = () => {
    if (baseFittedWidth || !pageImageEl) return baseFittedWidth;
    baseFittedWidth = pageImageEl.getBoundingClientRect().width || null;
    return baseFittedWidth;
  };

  const applyZoom = () => {
    const pct = ZOOM_STEPS[zoomIndex];
    if (pageImageEl) {
      if (zoomIndex === 0) {
        pageImageEl.style.width = '';
        pageImageEl.style.maxWidth = '';
        pageImageEl.style.maxHeight = '';
      } else {
        const base = ensureBaseWidth();
        if (base) {
          pageImageEl.style.maxWidth = 'none';
          pageImageEl.style.maxHeight = 'none';
          pageImageEl.style.width = `${(base * pct) / 100}px`;
        }
      }
    }
    if (zoomLevelEl) zoomLevelEl.textContent = `${pct}%`;
    if (zoomOutBtn) zoomOutBtn.disabled = zoomIndex === 0;
    if (zoomInBtn) zoomInBtn.disabled = zoomIndex === ZOOM_STEPS.length - 1;
  };

  zoomInBtn?.addEventListener('click', () => {
    ensureBaseWidth();
    zoomIndex = Math.min(zoomIndex + 1, ZOOM_STEPS.length - 1);
    applyZoom();
  });
  zoomOutBtn?.addEventListener('click', () => {
    zoomIndex = Math.max(zoomIndex - 1, 0);
    applyZoom();
  });

  if (pageImageEl?.complete) {
    ensureBaseWidth();
  } else {
    pageImageEl?.addEventListener('load', ensureBaseWidth, { once: true });
  }

  applyZoom();
}

function openStoryDetail(storyId) {
  const story = CAREER_EXPLORER_STORIES.find((item) => item.id === storyId);
  if (!story || !el.ceDetail) {
    return;
  }

  const selected = state.explorer.selected.map((key) => CAPABILITY_LABELS[key] ?? key);
  const demonstrates = Object.entries(story.capabilityScores)
    .filter(([, value]) => value >= 2)
    .slice(0, 4)
    .map(([key]) => CAPABILITY_LABELS[key] ?? key);

  const year = extractStoryYear(story.timeframe);
  const logoPath = getStoryLogoPath(story.company);
  const chips = story.tags.slice(0, 3);
  const atGlance = story.heroMetrics.slice(0, 4);
  const visuals = getStoryVisualAssets(story.id);

  const challengeParts = splitSentences(story.challenge, 3);
  const sectionOneTitle = challengeParts[0] || story.challenge;
  const sectionOneBody = challengeParts.slice(1).join(' ') || story.summary;

  const beforeItems = [
    challengeParts[0] || 'Program-by-program execution created confusion.',
    story.callsMade[0] || 'Teams optimized local work, not overall outcomes.',
  ];
  const afterItems = [
    story.changed.capability || 'Unified lifecycle framing aligned teams and decisions.',
    story.callsMade[1] || 'Language shifted to seller-need and business outcome.',
  ];

  const conversationPrompts = story.askMeAbout.slice(0, 3);
  const timeline = ['End of April — Kickoff', 'Early May — Leadership Alignment', 'August — Launch'];
  const reflectionCards = [
    { title: "What I'm proud of", body: story.changed.business },
    { title: 'What I know now', body: story.whatIKnowNow },
    { title: 'If I had a do-over', body: story.doOver },
  ];

  const { previousId, nextId, position, total } = getStoryNavigation(story.id);

  el.ceDetail.innerHTML = `
    <div class="ce-detail__backdrop" data-close-detail="true"></div>
    <article class="ce-detail-card ce-story" role="dialog" aria-modal="true" aria-label="Career story detail">
      <header class="ce-story-header">
        <button class="ce-story-close" type="button" id="ceCloseDetail">Close story</button>
        <div class="ce-story-brand">
          <img src="${escapeHtml(logoPath)}" alt="${escapeHtml(story.company)} logo" />
          <span>· ${escapeHtml(year)}</span>
        </div>
      </header>

      <div class="ce-story-layout">
        <main class="ce-story-main">
          <h3 class="ce-story-title">${escapeHtml(story.hook)}</h3>
          <p class="ce-story-subtitle">${escapeHtml(story.summary)}</p>
          <p class="ce-story-meta">${escapeHtml(story.company)} · ${escapeHtml(year)}</p>
          <p class="ce-story-chip-row">${chips.map((chip) => `<span>${escapeHtml(chip)}</span>`).join('')}</p>

          <section class="ce-story-section">
            <h4>${escapeHtml(sectionOneTitle)}</h4>
            <div class="ce-story-media-block">
              <div class="ce-story-media ce-story-media--primary" style="background-image: url('${escapeHtml(visuals.primary)}');" aria-hidden="true"></div>
              <div class="ce-story-copy">
                <p>${escapeHtml(sectionOneBody)}</p>
                <p>${escapeHtml(story.callsMade[0] || story.callsMade[1] || story.summary)}</p>
              </div>
            </div>
          </section>

          <section class="ce-story-section">
            <h4>So I stopped thinking about programs.</h4>
            <p>${escapeHtml(story.callsMade[2] || story.changed.systemic)}</p>
            <div class="ce-story-compare">
              <article>
                <h5>Old</h5>
                <ul>${beforeItems.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
              </article>
              <div class="ce-story-arrow" aria-hidden="true">→</div>
              <article>
                <h5>New</h5>
                <ul>${afterItems.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
              </article>
            </div>
          </section>

          <section class="ce-story-highlight">
            <h4>The north star became simple.</h4>
            <p>Present a holistic solution without making any single program sound more important than another.</p>
          </section>

          <section class="ce-story-section">
            <h4>We built one language across the experience.</h4>
            <div class="ce-story-media-block ce-story-media-block--reverse">
              <div class="ce-story-media ce-story-media--secondary" style="background-image: url('${escapeHtml(visuals.secondary)}');" aria-hidden="true"></div>
              <div class="ce-story-copy">
                <p>${escapeHtml(story.myRole.built)}</p>
                <blockquote>${escapeHtml(story.whatIKnowNow)}</blockquote>
                <ul class="ce-story-checks">
                  <li>Is it accurate?</li>
                  <li>Did it drive the goal?</li>
                </ul>
              </div>
            </div>
          </section>

          <section class="ce-story-timeline">
            <h4>From kickoff to launch: about three months.</h4>
            <ol>${timeline.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ol>
          </section>

          <section class="ce-story-reflections">
            ${reflectionCards.map((card) => `
              <article>
                <h5>${escapeHtml(card.title)}</h5>
                <p>${escapeHtml(card.body)}</p>
              </article>
            `).join('')}
          </section>
        </main>

        <aside class="ce-story-rail">
          <section class="ce-rail-card ce-rail-card--glance">
            <h4>At a Glance</h4>
            <ul>${atGlance.map((metric) => `<li>${escapeHtml(metric)}</li>`).join('')}</ul>
          </section>

          <section class="ce-rail-card ce-rail-card--highlight">
            <h4>Why You're Seeing This</h4>
            <p>You said you care about:</p>
            <ul>${selected.length ? selected.map((item) => `<li>${escapeHtml(item)}</li>`).join('') : '<li>Open exploration</li>'}</ul>
            <p>This story also demonstrates:</p>
            <div class="ce-rail-chips">${demonstrates.map((item) => `<span>${escapeHtml(item)}</span>`).join('')}</div>
          </section>

          <section class="ce-rail-card">
            <h4>If We Talk, Ask Me About...</h4>
            <ol>${conversationPrompts.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ol>
          </section>

          <section class="ce-rail-card">
            <h4>My Role in This</h4>
            <ul>
              <li>${escapeHtml(story.myRole.owned)}</li>
              <li>${escapeHtml(story.myRole.built)}</li>
              <li>${escapeHtml(story.myRole.led)}</li>
              <li>${escapeHtml(story.myRole.influenced)}</li>
            </ul>
          </section>
        </aside>
      </div>

      <footer class="ce-story-footer">
        <button type="button" class="ce-story-nav" data-story-nav="prev" ${previousId ? `data-story-id="${escapeHtml(previousId)}"` : 'disabled'}>← Previous story</button>
        <p>${position} of ${total} stories</p>
        <button type="button" class="ce-story-nav ce-story-nav--next" data-story-nav="next" ${nextId ? `data-story-id="${escapeHtml(nextId)}"` : 'disabled'}>Next story →</button>
      </footer>
    </article>
  `;

  const closeDetail = () => {
    el.ceDetail.hidden = true;
  };

  el.ceDetail.hidden = false;
  el.ceDetail.querySelector('#ceCloseDetail')?.addEventListener('click', closeDetail);
  el.ceDetail.querySelector('[data-close-detail="true"]')?.addEventListener('click', closeDetail);
  el.ceDetail.querySelectorAll('[data-story-nav]').forEach((node) => {
    node.addEventListener('click', () => {
      const nextStoryId = node.getAttribute('data-story-id');
      if (nextStoryId) {
        openStoryDetail(nextStoryId);
      }
    });
  });
}

function getStoryNavigation(currentStoryId) {
  const sequence = state.explorer.lastResults.length
    ? state.explorer.lastResults
    : CAREER_EXPLORER_STORIES.map((story) => story.id);

  const index = sequence.indexOf(currentStoryId);
  const safeIndex = index >= 0 ? index : 0;

  return {
    previousId: safeIndex > 0 ? sequence[safeIndex - 1] : null,
    nextId: safeIndex < sequence.length - 1 ? sequence[safeIndex + 1] : null,
    position: safeIndex + 1,
    total: sequence.length,
  };
}

function renderSuggestedCombos() {
  if (!el.ceSuggestedCombos) {
    return;
  }

  el.ceSuggestedCombos.innerHTML = SUGGESTED_COMBOS
    .map((combo, index) => `
      <button type="button" class="ce-combo" data-combo="${index}">
        <strong>${escapeHtml(combo.name)}</strong>
        <span>${combo.picks.map((key) => escapeHtml(CAPABILITY_LABELS[key] ?? key)).join(' + ')}</span>
      </button>
    `)
    .join('');
}

function applySuggestedCombo(index) {
  const combo = SUGGESTED_COMBOS[index];
  if (!combo) {
    return;
  }

  state.explorer.selected = combo.picks.slice(0, 3);
  renderExplorerOptions();
  renderExplorerResults({ browseAll: false });
}

function buildMeasurementCards(role) {
  return [
    { label: 'Team size', value: role.teamSize || 'N/A' },
    { label: 'Scope', value: role.scopeCard || role.scope || 'N/A' },
    { label: 'Partners', value: role.partners || 'N/A' },
    { label: 'Mission', value: role.mission || 'N/A' },
  ];
}

function buildRoleInMyOwnWords(role) {
  if (role.roleInMyOwnWords) {
    return role.roleInMyOwnWords;
  }

  const highlightOne = role.highlights?.[0] || 'I focused on strengthening the team and improving execution quality';
  const highlightTwo = role.highlights?.[1] || 'I built practical systems that helped the organization move faster with more consistency';
  const firstMetric = role.metricWins?.[0];

  const scopeSentence = normalizeSentence(role.scope || 'I owned broad cross-functional priorities and delivery.');
  const missionSentence = normalizeSentence(role.mission || 'My mission was to align people, process, and performance around business outcomes.');
  const partnerSentence = normalizeSentence(`I partnered across ${role.partners || 'cross-functional teams'} while supporting ${role.teamSize || 'a broad organization'}.`);
  const highlightsSentence = normalizeSentence(`Two moments that define this role for me are ${stripTrailingPunctuation(highlightOne)} and ${stripTrailingPunctuation(highlightTwo)}.`);
  const metricSentence = firstMetric
    ? normalizeSentence(`I measured success through outcomes like ${firstMetric.label.toLowerCase()} (${firstMetric.delta}), which showed up in day-to-day performance.`)
    : 'I measured success through clear outcomes that teams and leaders could track and trust.';

  return `${scopeSentence} ${missionSentence} ${partnerSentence} ${highlightsSentence} ${metricSentence}`;
}

function normalizeSentence(text) {
  return `${stripTrailingPunctuation(text)}.`;
}

function stripTrailingPunctuation(text) {
  return String(text).trim().replace(/[.!?]+$/g, '');
}

function buildRoleKpis(role) {
  const kpis = ROLE_KPIS[role.id] ?? [];

  return [...kpis].sort((a, b) => {
    const aRank = KPI_DISPLAY_ORDER.indexOf(a);
    const bRank = KPI_DISPLAY_ORDER.indexOf(b);
    const safeARank = aRank === -1 ? Number.MAX_SAFE_INTEGER : aRank;
    const safeBRank = bRank === -1 ? Number.MAX_SAFE_INTEGER : bRank;

    if (safeARank === safeBRank) {
      return a.localeCompare(b);
    }

    return safeARank - safeBRank;
  });
}

function shortCompany(company) {
  if (company.includes('Samsung')) return 'Samsung';
  if (company.includes('Verizon')) return 'Verizon';
  if (company.includes('American Home Shield')) return 'AHS';
  if (company.includes('T-Mobile')) return 'T-Mobile';
  return company;
}

function getDisplayLocation(role) {
  return LOCATION_BY_ROLE[role.id] || role.location || 'Location unavailable';
}

function getBrandKey(role) {
  if (role.company.includes('American Home Shield')) return 'ahs';
  if (role.company.includes('Walmart')) return 'walmart';
  if (role.company.includes('Sprint')) return 'sprint';
  if (role.company.includes('T-Mobile')) return 'tmobile';
  if (role.company.includes('Samsung')) return 'samsung';
  if (role.company.includes('Verizon')) return 'verizon';
  return 'default';
}

function getThemeForRole(role) {
  return THEMES[getBrandKey(role)] ?? THEMES.default;
}

function getLogoPath(brandKey) {
  const logos = {
    walmart: 'logos/walmart.png',
    samsung: 'logos/samsung.png',
    tmobile: 'logos/tmobile.jpg',
    sprint: 'logos/sprint.jpg',
    verizon: 'logos/verizon.jpg',
    ahs: 'logos/ahs.png',
    default: 'logos/walmart.png',
  };

  return logos[brandKey] ?? logos.default;
}

function getStoryVisualAssets(storyId) {
  const defaults = {
    primary: 'story-visuals/walmart-lifecycle-primary.png',
    secondary: 'story-visuals/walmart-lifecycle-secondary.png',
  };

  const byStory = {
    'walmart-lifecycle': defaults,
  };

  return byStory[storyId] ?? defaults;
}

function getStoryPdfPageImageFileName(storyId) {
  const fileNameByStory = {
    'walmart-lifecycle': 'walmart-lifecycle-page-1.png',
    'walmart-opp': 'walmart-opp-page-1.png',
    'walmart-certification': 'walmart-certification-page-1.png',
    'samsung-turnaround': 'samsung-turnaround-page-1.png',
    'samsung-future-director': 'samsung-future-director-page-1.png',
    'samsung-ai-readiness': 'samsung-ai-readiness-page-1.png',
    'tmobile-transformation': 'tmobile-transformation-page-1.png',
    'sprint-sales-accountability': 'sprint-sales-accountability-page-1.png',
    'sprint-quiz-warehouse': 'sprint-quiz-warehouse-page-1.png',
    'verizon-building-the-bench': 'verizon-building-the-bench-page-1.png',
    'samsung-budget-portfolio': 'samsung-budget-portfolio-page-1.png',
    'samsung-influencing-700': 'samsung-influencing-700-page-1.png',
    'verizon-early-failure': 'verizon-early-failure-page-1.png',
  };

  return fileNameByStory[storyId] ?? null;
}

function getStoryPdfPageImage(storyId) {
  const fileName = getStoryPdfPageImageFileName(storyId);
  if (!fileName) {
    return null;
  }

  // Bundled build embeds these (see bundle_for_puppy_share.py) same as the
  // brand logos. Local dev falls back to the plain relative asset path.
  const embedded = typeof EMBEDDED_CASE_STUDY_PAGES !== 'undefined' ? EMBEDDED_CASE_STUDY_PAGES[fileName] : null;
  return embedded ?? `case-study-pages/${fileName}`;
}

function getStoryPdfPath(storyId) {
  const pdfUrlByStory = {
    "walmart-lifecycle": "case-studies/walmart-lifecycle.pdf",
    "walmart-opp": "case-studies/walmart-opp.pdf",
    "walmart-certification": "case-studies/walmart-certification.pdf",
    "samsung-turnaround": "case-studies/samsung-turnaround.pdf",
    "samsung-future-director": "case-studies/samsung-future-director.pdf",
    "samsung-ai-readiness": "case-studies/samsung-ai-readiness.pdf",
    "tmobile-transformation": "case-studies/tmobile-transformation.pdf",
    "sprint-sales-accountability": "case-studies/sprint-sales-accountability.pdf",
    "sprint-quiz-warehouse": "case-studies/sprint-quiz-warehouse.pdf",
    "verizon-building-the-bench": "case-studies/verizon-building-the-bench.pdf",
    "samsung-budget-portfolio": "case-studies/samsung-budget-portfolio.pdf",
    "samsung-influencing-700": "case-studies/samsung-influencing-700.pdf",
    "verizon-early-failure": "case-studies/verizon-early-failure.pdf"
};
  return pdfUrlByStory[storyId] ?? null;
}

function isStoryComingSoon(storyId) {
  const comingSoonStoryIds = new Set([]);

  return comingSoonStoryIds.has(storyId);
}

function getStoryLogoPath(company) {
  const normalized = String(company || '').toLowerCase();
  if (normalized.includes('walmart')) return getLogoPath('walmart');
  if (normalized.includes('samsung')) return getLogoPath('samsung');
  if (normalized.includes('t-mobile')) return getLogoPath('tmobile');
  if (normalized.includes('sprint')) return getLogoPath('sprint');
  if (normalized.includes('verizon')) return getLogoPath('verizon');
  if (normalized.includes('american home shield')) return getLogoPath('ahs');
  return getLogoPath('default');
}

function extractStoryYear(timeframe) {
  const matches = String(timeframe || '').match(/(20\d{2})/g);
  return matches?.[matches.length - 1] ?? 'N/A';
}

function splitSentences(text, limit = 2) {
  return String(text || '')
    .split(/(?<=[.!?])\s+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, limit);
}

function orderRoles(roles) {
  const preferredOrder = [
    'verizon-gsm',
    'verizon-district-trainer',
    'verizon-hrbp',
    'ahs-call-center-manager',
    'sprint',
    'tmobile',
    'samsung-sr-mgr',
    'samsung-director',
    'walmart-sm',
  ];

  const rank = new Map(preferredOrder.map((id, index) => [id, index]));
  return [...roles].sort((a, b) => {
    const aRank = rank.has(a.id) ? rank.get(a.id) : Number.MAX_SAFE_INTEGER;
    const bRank = rank.has(b.id) ? rank.get(b.id) : Number.MAX_SAFE_INTEGER;
    return aRank - bRank;
  });
}

function renderError(message) {
  document.body.innerHTML = `<main style="padding: 16px; font-family: sans-serif;"><h1>Error</h1><p>${escapeHtml(message)}</p></main>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

init().catch((error) => {
  console.error(error);
  renderError('Unexpected initialization failure.');
});

function portfolioIcon(label) {
  const text = String(label).toLowerCase();
  let lines = '<path d="M5 20V10h3v10m4 0V5h3v15m4 0V2h3v18"/>';
  if (/team|people|partner|customer acquisition|leader/.test(text)) lines = '<circle cx="12" cy="7" r="3"/><path d="M6 21v-3a6 6 0 0 1 12 0v3M3 10a3 3 0 0 1 0-6m18 6a3 3 0 0 0 0-6M2 20v-3a5 5 0 0 1 2-4m18 7v-3a5 5 0 0 0-2-4"/>';
  else if (/retention|sentiment|feedback/.test(text)) lines = '<path d="M12 21 3 12C-3 5 6-1 12 6c6-7 15-1 9 6Z"/>';
  else if (/mission|target/.test(text)) lines = '<circle cx="11" cy="13" r="9"/><circle cx="11" cy="13" r="5"/><path d="m11 13 9-10m-1-2v5h5"/>';
  else if (/document|audit|process/.test(text)) lines = '<path d="M5 2h10l5 5v15H5Zm10 0v6h5M8 12h9m-9 4h9m-9 3h9"/>';
  else if (/revenue|budget|sales|cost/.test(text)) lines = '<circle cx="12" cy="12" r="10"/><path d="M15 7h-4a3 3 0 0 0 0 6h2a3 3 0 0 1 0 6H8m4-15v17"/>';
  const capabilityIcons = {
    'lead-creative': '<path d="m12 2 9 4v6c0 5-5 8-9 10-4-2-9-5-9-10V6Zm-4 10 3 3 5-6"/>',
    'lead-big': '<circle cx="11" cy="13" r="9"/><circle cx="11" cy="13" r="5"/><path d="m11 13 9-10m-1-2v5h5"/>',
    'build-scratch': '<path d="M8 17c0-4-4-4-4-8a8 8 0 0 1 16 0c0 4-4 4-4 8Zm0 3h8m-6 3h4M12 6v8"/>',
    'hands-on-builder': '<path d="m14 4 1 5 5 1a7 7 0 0 1-8 6l-7 7-4-4 7-7a7 7 0 0 1 6-8Z"/>',
    'strategy-execution': '<circle cx="12" cy="12" r="10"/><path d="m17 7-3 7-7 3 3-7Z"/>',
    'enterprise-scale': '<circle cx="12" cy="12" r="10"/><ellipse cx="12" cy="12" rx="5" ry="10"/><path d="M2 12h20M4 6h16M4 18h16"/>',
    'influence-without-authority': '<circle cx="12" cy="12" r="3"/><circle cx="4" cy="4" r="2"/><circle cx="20" cy="4" r="2"/><circle cx="4" cy="20" r="2"/><circle cx="20" cy="20" r="2"/><path d="m6 6 4 4m4 4 4 4M6 18l4-4m4-4 4-4"/>',
    transformation: '<path d="M3 9a9 9 0 0 1 16-3l2 3m0-7v7h-7M21 15a9 9 0 0 1-16 3l-2-3m0 7v-7h7"/>',
    'business-impact': '<path d="M3 2v19h19M6 15l5-5 4 3 7-9m-6 0h6v6"/>',
    'ai-emerging-tech': '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4M10 10h4v4h-4Z"/>',
    ambiguity: '<path d="M8 7a4 4 0 1 1 6 4c-2 1-2 2-2 4m0 4v1"/>',
    Labor: '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3"/><path d="M12 1v4m0 14v4M1 12h4m14 0h4M4 4l3 3m10 10 3 3M4 20l3-3M17 7l3-3"/>'
  };
  lines = capabilityIcons[label] ?? lines;
  return `<svg class="portfolio-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${lines}</svg>`;
}
function formatMetricWin(value) {
  const match = String(value).match(/^([~+>]?\d[\d,.]*(?:%|K|M|x)?)(.*)$/);
  return match ? `<span class="win-number">${escapeHtml(match[1])}</span><span class="win-caption">${escapeHtml(match[2].trim())}</span>` : escapeHtml(value);
}

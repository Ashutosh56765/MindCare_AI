import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const app = express();

app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());

// Database file path
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_PATH = path.resolve(DATA_DIR, 'mindcare-db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory + persisted DB structure
interface DB {
  users: Array<{
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    studentStatus: string;
    institution: string;
    createdAt: string;
    preferences: {
      anonymousMode: boolean;
      dailyReminder: boolean;
      dataRetentionDays: number;
      preferredName?: string;
    };
  }>;
  moods: Array<{
    id: string;
    userId: string;
    moodScore: 1 | 2 | 3 | 4 | 5;
    moodLabel: string;
    stressLevel: number;
    emotions: string[];
    stressors: string[];
    note?: string;
    aiReflection?: string;
    timestamp: string;
  }>;
  screenings: Array<{
    id: string;
    userId: string;
    questionnaireType: 'PHQ-4' | 'GAD-2' | 'PHQ-2';
    answers: Array<{ questionId: string; questionText: string; score: number }>;
    totalScore: number;
    anxietyScore: number;
    depressionScore: number;
    severity: 'None/Minimal' | 'Mild' | 'Moderate' | 'Severe';
    explanation: string;
    recommendations: string[];
    isDisclaimerAcknowledged: boolean;
    timestamp: string;
  }>;
  chatSessions: Array<{
    id: string;
    userId: string;
    messages: Array<{
      id: string;
      role: 'user' | 'assistant' | 'system';
      content: string;
      timestamp: string;
      isCrisisWarning?: boolean;
    }>;
    updatedAt: string;
  }>;
  resources: Array<{
    id: string;
    title: string;
    category: 'Crisis Lines' | 'Student & Campus' | 'Therapy & Counseling' | 'Self-Care & Mindfulness' | 'Community & Peer';
    description: string;
    url: string;
    phone?: string;
    sms?: string;
    availableHours: string;
    country: string;
    tags: string[];
    verified: boolean;
  }>;
}

// Simple deterministic hash for password simulation (salted SHA-256)
function hashPassword(password: string): string {
  const salt = 'mindcare-salt-v1';
  return crypto.createHash('sha256').update(password + salt).digest('hex');
}

// Verified Mental Health & Student Resources seed
const DEFAULT_RESOURCES = [
  {
    id: 'res-1',
    title: '988 Suicide & Crisis Lifeline',
    category: 'Crisis Lines' as const,
    description: 'Free, confidential 24/7 support for anyone in suicidal crisis or emotional distress in the United States and Canada.',
    url: 'https://988lifeline.org',
    phone: '988',
    sms: 'Text 988',
    availableHours: '24/7, 365 days',
    country: 'United States & Canada',
    tags: ['Urgent', 'Crisis', 'Free', 'Confidential'],
    verified: true,
  },
  {
    id: 'res-2',
    title: 'Crisis Text Line',
    category: 'Crisis Lines' as const,
    description: 'Connect with a trained volunteer crisis counselor 24/7 over SMS message. Empathetic, free, confidential text support.',
    url: 'https://www.crisistextline.org',
    sms: 'Text HOME to 741741',
    availableHours: '24/7',
    country: 'US, UK, Canada',
    tags: ['Text Support', 'Free', '24/7'],
    verified: true,
  },
  {
    id: 'res-3',
    title: 'The Trevor Project (LGBTQ+ Youth)',
    category: 'Crisis Lines' as const,
    description: 'Leading national organization providing crisis intervention and suicide prevention services to LGBTQ+ young people under 25.',
    url: 'https://www.thetrevorproject.org',
    phone: '1-866-488-7386',
    sms: 'Text START to 678-678',
    availableHours: '24/7',
    country: 'United States',
    tags: ['LGBTQ+', 'Youth', 'Trained Counselors'],
    verified: true,
  },
  {
    id: 'res-4',
    title: 'Befrienders Worldwide',
    category: 'Crisis Lines' as const,
    description: 'Global network of 349 emotional support centres in 32 countries helping individuals facing distress or suicidal feelings.',
    url: 'https://www.befrienders.org',
    availableHours: 'Directory of Global Services',
    country: 'International',
    tags: ['International', 'Multilingual', 'Volunteer'],
    verified: true,
  },
  {
    id: 'res-5',
    title: 'Active Minds — Campus Mental Health',
    category: 'Student & Campus' as const,
    description: 'Premier nonprofit supporting mental health awareness and education for young adults on over 1,000 high school and college campuses.',
    url: 'https://www.activeminds.org',
    availableHours: 'Educational & Peer Network',
    country: 'United States',
    tags: ['Students', 'College', 'Stigma Reduction'],
    verified: true,
  },
  {
    id: 'res-6',
    title: 'The JED Foundation',
    category: 'Student & Campus' as const,
    description: 'Empowers teens and young adults with the skills and support to grow into healthy, thriving adults, and prevents suicide.',
    url: 'https://jedfoundation.org',
    availableHours: 'Online Guides & Toolkits',
    country: 'United States',
    tags: ['Teens', 'College Students', 'Transitions'],
    verified: true,
  },
  {
    id: 'res-7',
    title: 'Open Path Psychotherapy Collective',
    category: 'Therapy & Counseling' as const,
    description: 'Non-profit nationwide network of mental health clinicians providing low-cost, in-office and online psychotherapy ($30–$70/session).',
    url: 'https://openpathcollective.org',
    availableHours: 'Directory & Appointment booking',
    country: 'United States',
    tags: ['Affordable Therapy', 'Sliding Scale', 'Licensed Clinicians'],
    verified: true,
  },
  {
    id: 'res-8',
    title: '7 Cups — Free Peer Support Community',
    category: 'Community & Peer' as const,
    description: 'Online emotional support service connecting you with trained empathetic volunteer active listeners 24/7 in 189 countries.',
    url: 'https://www.7cups.com',
    availableHours: '24/7 Chat Rooms',
    country: 'International',
    tags: ['Free Peer Support', 'Safe Space', 'Active Listeners'],
    verified: true,
  },
  {
    id: 'res-9',
    title: 'UCLA Mindful Awareness Research Center',
    category: 'Self-Care & Mindfulness' as const,
    description: 'Free guided mindfulness meditation audio tracks, breathing exercises, and research-backed well-being practices.',
    url: 'https://www.uclahealth.org/programs/marc/free-guided-meditations',
    availableHours: 'On-demand Web & App',
    country: 'Global',
    tags: ['Guided Meditation', 'Research-Backed', 'Sleep & Anxiety'],
    verified: true,
  }
];

function generateSeedData(): DB {
  const demoUserId = 'user-demo-alex';
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  const moods: DB['moods'] = [
    {
      id: 'm-1',
      userId: demoUserId,
      moodScore: 4,
      moodLabel: 'Good',
      stressLevel: 3,
      emotions: ['Calm', 'Hopeful', 'Productive'],
      stressors: ['Academics'],
      note: 'Finished my group project report early! Took a relaxing walk around the quad before sunset.',
      aiReflection: 'Great work honoring your achievement and taking time to unwind outside. Balancing focus with gentle movement is wonderful for your nervous system.',
      timestamp: new Date(now - 1 * dayMs).toISOString(),
    },
    {
      id: 'm-2',
      userId: demoUserId,
      moodScore: 3,
      moodLabel: 'Okay',
      stressLevel: 5,
      emotions: ['Tired', 'Neutral', 'Thoughtful'],
      stressors: ['Sleep', 'Academics'],
      note: 'Stayed up late studying for midterm. Brain felt a bit cloudy in morning lecture, but coffee and water helped.',
      aiReflection: 'Late study nights can leave you drained. Remember that sleep is when memory consolidation happens—try prioritizing a calming 10-minute wind-down tonight.',
      timestamp: new Date(now - 2 * dayMs).toISOString(),
    },
    {
      id: 'm-3',
      userId: demoUserId,
      moodScore: 2,
      moodLabel: 'Low',
      stressLevel: 7,
      emotions: ['Overwhelmed', 'Anxious', 'Pressured'],
      stressors: ['Exams', 'Finances'],
      note: 'Lots of deadlines stacking up this week. Felt tight in my chest during afternoon library session.',
      aiReflection: 'It makes complete sense you felt tight when deadlines pile up. Remember you only need to tackle one step at a time. The 4-7-8 breath can help soften that chest tightness.',
      timestamp: new Date(now - 3 * dayMs).toISOString(),
    },
    {
      id: 'm-4',
      userId: demoUserId,
      moodScore: 4,
      moodLabel: 'Good',
      stressLevel: 4,
      emotions: ['Relieved', 'Connected', 'Grateful'],
      stressors: ['Social'],
      note: 'Had lunch with Sam from biology class. Talking about our shared stress made me feel much less alone.',
      aiReflection: 'Sharing vulnerabilities with friends reminds us that student stress is a shared journey, not an individual failing. Cherish these supportive connections.',
      timestamp: new Date(now - 4 * dayMs).toISOString(),
    },
    {
      id: 'm-5',
      userId: demoUserId,
      moodScore: 5,
      moodLabel: 'Great',
      stressLevel: 2,
      emotions: ['Joyful', 'Energized', 'Grounded'],
      stressors: [],
      note: 'Weekend hike and had 8 full hours of sleep. Feeling refreshed and optimistic about the upcoming month.',
      aiReflection: 'What a beautiful reset. Nature and restorative sleep are powerful anchors for emotional resilience.',
      timestamp: new Date(now - 5 * dayMs).toISOString(),
    },
    {
      id: 'm-6',
      userId: demoUserId,
      moodScore: 3,
      moodLabel: 'Okay',
      stressLevel: 6,
      emotions: ['Restless', 'Busy', 'Determined'],
      stressors: ['Future Career', 'Academics'],
      note: 'Drafting internship applications. Comparing myself with peers on LinkedIn caused some imposter syndrome.',
      aiReflection: 'Career comparison is so common among students. Your path and timing are uniquely yours; measure your progress against your own starting point, not someone else\'s highlight reel.',
      timestamp: new Date(now - 6 * dayMs).toISOString(),
    },
    {
      id: 'm-7',
      userId: demoUserId,
      moodScore: 4,
      moodLabel: 'Good',
      stressLevel: 3,
      emotions: ['Grounded', 'Proud', 'Focused'],
      stressors: ['Academics'],
      note: 'Practiced 10 minutes of box breathing before my calculus quiz. Felt noticeably calmer when reading questions.',
      aiReflection: 'You successfully applied a regulating tool in real time! That self-awareness is a huge milestone for long-term stress management.',
      timestamp: new Date(now - 7 * dayMs).toISOString(),
    }
  ];

  const screenings: DB['screenings'] = [
    {
      id: 'scr-1',
      userId: demoUserId,
      questionnaireType: 'PHQ-4',
      answers: [
        { questionId: 'phq4_1', questionText: 'Feeling nervous, anxious or on edge', score: 1 },
        { questionId: 'phq4_2', questionText: 'Not being able to stop or control worrying', score: 1 },
        { questionId: 'phq4_3', questionText: 'Little interest or pleasure in doing things', score: 0 },
        { questionId: 'phq4_4', questionText: 'Feeling down, depressed, or hopeless', score: 1 },
      ],
      totalScore: 3,
      anxietyScore: 2,
      depressionScore: 1,
      severity: 'Mild',
      explanation: 'Your score indicates mild levels of stress and situational worry, very common during midterms and heavy academic terms.',
      recommendations: [
        'Engage in daily 5-minute grounding exercises like 4-7-8 breathing.',
        'Schedule protected 20-minute study breaks away from digital screens.',
        'Consider campus peer wellness circles or talking with an academic advisor.'
      ],
      isDisclaimerAcknowledged: true,
      timestamp: new Date(now - 3 * dayMs).toISOString(),
    }
  ];

  return {
    users: [
      {
        id: demoUserId,
        name: 'Alex Rivera',
        email: 'alex@student.edu',
        passwordHash: hashPassword('password123'),
        studentStatus: 'undergraduate',
        institution: 'University Wellness Initiative',
        createdAt: new Date(now - 14 * dayMs).toISOString(),
        preferences: {
          anonymousMode: false,
          dailyReminder: true,
          dataRetentionDays: 90,
          preferredName: 'Alex'
        }
      }
    ],
    moods,
    screenings,
    chatSessions: [],
    resources: DEFAULT_RESOURCES,
  };
}

// Load or initialize DB
function loadDB(): DB {
  try {
    if (fs.existsSync(DB_PATH)) {
      const content = fs.readFileSync(DB_PATH, 'utf-8');
      const parsed = JSON.parse(content);
      // Ensure resources exist
      if (!parsed.resources || parsed.resources.length === 0) {
        parsed.resources = DEFAULT_RESOURCES;
      }
      return parsed;
    }
  } catch (err) {
    console.error('Error loading DB, creating fresh seed:', err);
  }
  const seed = generateSeedData();
  saveDB(seed);
  return seed;
}

function saveDB(data: DB) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing DB to disk:', err);
  }
}

let db = loadDB();

// Simple JWT-like signed token system for authentication
const JWT_SECRET = process.env.JWT_SECRET || 'mindcare-sdg3-secret-key-2026';

function signToken(userId: string): string {
  const payload = {
    userId,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(body).digest('base64url');
  return `${body}.${signature}`;
}

function verifyToken(token: string): { userId: string } | null {
  try {
    const [body, signature] = token.split('.');
    if (!body || !signature) return null;
    const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(body).digest('base64url');
    if (signature !== expectedSig) return null;
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8'));
    if (payload.exp && payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

// Auth Middleware
function authMiddleware(req: Request, res: Response, next: NextFunction) {
  let token = req.cookies?.mindcare_token;
  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.substring(7);
  }

  if (!token) {
    res.status(401).json({ error: 'Authentication required. Please sign in.' });
    return;
  }

  const verified = verifyToken(token);
  if (!verified) {
    res.status(401).json({ error: 'Session expired or invalid. Please sign in again.' });
    return;
  }

  const user = db.users.find((u) => u.id === verified.userId);
  if (!user) {
    res.status(401).json({ error: 'User account not found.' });
    return;
  }

  (req as any).user = user;
  next();
}

// Optional Auth (for public or demo pages)
function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  let token = req.cookies?.mindcare_token;
  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.substring(7);
  }

  if (token) {
    const verified = verifyToken(token);
    if (verified) {
      const user = db.users.find((u) => u.id === verified.userId);
      if (user) {
        (req as any).user = user;
      }
    }
  }
  next();
}

// Initialize Gemini API client
let geminiAI: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    geminiAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  } catch (err) {
    console.error('Failed to init GoogleGenAI:', err);
  }
}

// -------------------------------------------------------------
// REST ENDPOINTS
// -------------------------------------------------------------

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'MindCare AI',
    sdg: 'SDG 3 • Good Health and Well-being',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

// Auth: Register
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, password, studentStatus, institution } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ error: 'Name, email, and password are required.' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (db.users.some((u) => u.email === normalizedEmail)) {
    res.status(400).json({ error: 'An account with this email address already exists.' });
    return;
  }

  const newUser = {
    id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: hashPassword(password),
    studentStatus: studentStatus || 'undergraduate',
    institution: institution?.trim() || 'Student / Learner',
    createdAt: new Date().toISOString(),
    preferences: {
      anonymousMode: false,
      dailyReminder: true,
      dataRetentionDays: 90,
      preferredName: name.trim().split(' ')[0],
    },
  };

  db.users.push(newUser);
  saveDB(db);

  const token = signToken(newUser.id);
  res.cookie('mindcare_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const { passwordHash: _, ...safeUser } = newUser;
  res.status(201).json({
    message: 'Welcome to MindCare AI! Your safe space is ready.',
    user: safeUser,
    token,
  });
});

// Auth: Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = db.users.find((u) => u.email === normalizedEmail);

  if (!user || user.passwordHash !== hashPassword(password)) {
    res.status(401).json({ error: 'Invalid email or password. Please check your credentials.' });
    return;
  }

  const token = signToken(user.id);
  res.cookie('mindcare_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const { passwordHash: _, ...safeUser } = user;
  res.json({
    message: 'Welcome back!',
    user: safeUser,
    token,
  });
});

// Auth: Logout
app.post('/api/auth/logout', (_req: Request, res: Response) => {
  res.clearCookie('mindcare_token');
  res.json({ message: 'Signed out successfully. Take care!' });
});

// Auth: Me
app.get('/api/auth/me', authMiddleware, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { passwordHash: _, ...safeUser } = user;
  res.json({ user: safeUser });
});

// Profile: Get
app.get('/api/profile', authMiddleware, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { passwordHash: _, ...safeUser } = user;
  res.json({ profile: safeUser });
});

// Profile: Update
app.patch('/api/profile', authMiddleware, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { name, studentStatus, institution, preferences } = req.body;

  if (name) user.name = name.trim();
  if (studentStatus) user.studentStatus = studentStatus;
  if (institution) user.institution = institution.trim();
  if (preferences) {
    user.preferences = {
      ...user.preferences,
      ...preferences,
    };
  }

  saveDB(db);
  const { passwordHash: _, ...safeUser } = user;
  res.json({ message: 'Profile updated successfully.', profile: safeUser });
});

// Profile: Delete account (GDPR & privacy requirement)
app.delete('/api/profile', authMiddleware, (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  // Remove all user data
  db.users = db.users.filter((u) => u.id !== userId);
  db.moods = db.moods.filter((m) => m.userId !== userId);
  db.screenings = db.screenings.filter((s) => s.userId !== userId);
  db.chatSessions = db.chatSessions.filter((c) => c.userId !== userId);

  saveDB(db);
  res.clearCookie('mindcare_token');
  res.json({ message: 'Your account and all associated mental wellness data have been permanently deleted.' });
});

// Moods: List
app.get('/api/moods', authMiddleware, (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

  const userMoods = db.moods
    .filter((m) => m.userId === userId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);

  // Compute summary metrics
  const totalCheckins = userMoods.length;
  const avgMood = totalCheckins > 0 ? (userMoods.reduce((acc, curr) => acc + curr.moodScore, 0) / totalCheckins).toFixed(1) : '0';
  const avgStress = totalCheckins > 0 ? (userMoods.reduce((acc, curr) => acc + curr.stressLevel, 0) / totalCheckins).toFixed(1) : '0';

  res.json({
    moods: userMoods,
    summary: {
      totalCheckins,
      avgMood: parseFloat(avgMood),
      avgStress: parseFloat(avgStress),
    },
  });
});

// Moods: Create Check-in
app.post('/api/moods', authMiddleware, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { moodScore, moodLabel, stressLevel, emotions, stressors, note } = req.body;

  if (!moodScore || moodScore < 1 || moodScore > 5) {
    res.status(400).json({ error: 'Valid mood score between 1 and 5 is required.' });
    return;
  }

  // Generate an instant empathetic AI reflection if possible
  let aiReflection = '';
  try {
    if (geminiAI) {
      const prompt = `As MindCare AI, a gentle mental health companion for students, write a supportive, warm, 1-2 sentence non-diagnostic reflection for this check-in:
Mood: ${moodLabel || moodScore}/5
Stress Level: ${stressLevel || 5}/10
Emotions: ${(emotions || []).join(', ')}
Triggers: ${(stressors || []).join(', ')}
Personal Note: ${note || 'None'}
Keep it under 40 words, empathetic, validating, with a gentle touch.`;

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('AI reflection timeout')), 5000)
      );
      const aiResponse = await Promise.race([
        geminiAI.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        }),
        timeoutPromise,
      ]);
      aiReflection = aiResponse.text?.trim() || '';
    }
  } catch (err) {
    console.warn('Mood reflection handled via fallback:', err);
  }

  if (!aiReflection) {
    // Supportive fallback reflections based on mood
    const fallbacks: Record<number, string> = {
      5: 'Wonderful to see your spirit soaring today! Celebrate this energy and note what brought you peace.',
      4: 'Solid, grounded energy today. Keep protecting your boundaries and carrying this calm forward.',
      3: 'Neutral days are a natural part of being human. Give yourself grace and take things one breath at a time.',
      2: 'We hear you, and it is okay to feel low or drained. Be gentle with your expectations today.',
      1: 'Sending you warmth. You don\'t have to carry this all alone; remember to breathe and lean on trusted support.',
    };
    aiReflection = fallbacks[moodScore as 1 | 2 | 3 | 4 | 5] || 'Thank you for taking time to honor how you feel today.';
  }

  const newMood = {
    id: `m-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    userId,
    moodScore: moodScore as 1 | 2 | 3 | 4 | 5,
    moodLabel: moodLabel || ['Very Low', 'Low', 'Okay', 'Good', 'Great'][moodScore - 1],
    stressLevel: stressLevel || 5,
    emotions: Array.isArray(emotions) ? emotions : [],
    stressors: Array.isArray(stressors) ? stressors : [],
    note: note ? note.trim() : undefined,
    aiReflection,
    timestamp: new Date().toISOString(),
  };

  db.moods.unshift(newMood);
  saveDB(db);

  res.status(201).json({
    message: 'Check-in recorded successfully. Thank you for checking in with yourself!',
    mood: newMood,
  });
});

// Moods: Delete single entry
app.delete('/api/moods/:id', authMiddleware, (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const moodId = req.params.id;

  const initialCount = db.moods.length;
  db.moods = db.moods.filter((m) => !(m.id === moodId && m.userId === userId));

  if (db.moods.length === initialCount) {
    res.status(404).json({ error: 'Mood entry not found or unauthorized.' });
    return;
  }

  saveDB(db);
  res.json({ message: 'Mood record removed.' });
});

// Screening: Submit assessment (Evidence-informed PHQ-4)
app.post('/api/screening', authMiddleware, (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { questionnaireType, answers, isDisclaimerAcknowledged } = req.body;

  if (!isDisclaimerAcknowledged) {
    res.status(400).json({ error: 'You must acknowledge that this screening is an informational reflection tool and not a clinical diagnosis.' });
    return;
  }

  if (!Array.isArray(answers) || answers.length === 0) {
    res.status(400).json({ error: 'Valid questionnaire responses are required.' });
    return;
  }

  // Calculate scores for PHQ-4
  // Question 1 & 2: Anxiety (GAD-2 component)
  // Question 3 & 4: Depression (PHQ-2 component)
  const anxietyScore = (answers[0]?.score || 0) + (answers[1]?.score || 0);
  const depressionScore = (answers[2]?.score || 0) + (answers[3]?.score || 0);
  const totalScore = answers.reduce((acc: number, curr: any) => acc + (curr.score || 0), 0);

  let severity: 'None/Minimal' | 'Mild' | 'Moderate' | 'Severe' = 'None/Minimal';
  let explanation = '';
  let recommendations: string[] = [];

  if (totalScore <= 2) {
    severity = 'None/Minimal';
    explanation = 'Your responses reflect minimal psychological distress over the past two weeks. Your current coping strategies appear to be supporting you well.';
    recommendations = [
      'Maintain your daily sleep and rest routines.',
      'Continue mindful movement, hydration, and social connections.',
      'Check in weekly to build emotional self-awareness.'
    ];
  } else if (totalScore <= 5) {
    severity = 'Mild';
    explanation = 'Your responses suggest mild levels of anxiety or low mood. These fluctuations are very common among students during periods of academic deadlines.';
    recommendations = [
      'Try 5-minute box breathing or 4-7-8 relaxation exercises daily.',
      'Incorporate mindful study breaks using the Pomodoro technique.',
      'Reach out to campus peer wellness groups or trusted friends.'
    ];
  } else if (totalScore <= 8) {
    severity = 'Moderate';
    explanation = 'Your responses indicate moderate symptoms of stress, worry, or feeling low. When feelings linger, receiving supportive guidance makes a big difference.';
    recommendations = [
      'Consider connecting with your campus counseling center or health services.',
      'Practice sensory grounding (5-4-3-2-1 technique) when feeling overwhelmed.',
      'Explore verified free resources or low-cost sliding-scale counseling.'
    ];
  } else {
    severity = 'Severe';
    explanation = 'Your responses suggest substantial emotional distress. Please remember you do not have to navigate this alone—support is available and accessible.';
    recommendations = [
      'We strongly encourage speaking with a licensed mental health clinician or doctor.',
      'If you ever feel unsafe or overwhelmed, connect with the 988 Suicide & Crisis Lifeline (call/text 988).',
      'Contact your student wellness dean or academic support to relieve pressure.'
    ];
  }

  const newRecord = {
    id: `scr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    userId,
    questionnaireType: questionnaireType || 'PHQ-4',
    answers,
    totalScore,
    anxietyScore,
    depressionScore,
    severity,
    explanation,
    recommendations,
    isDisclaimerAcknowledged: true,
    timestamp: new Date().toISOString(),
  };

  db.screenings.unshift(newRecord);
  saveDB(db);

  res.status(201).json({
    message: 'Screening evaluation complete.',
    record: newRecord,
  });
});

// Screening: History
app.get('/api/screening/history', authMiddleware, (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const history = db.screenings
    .filter((s) => s.userId === userId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  res.json({ history });
});

// Resources: List
app.get('/api/resources', optionalAuth, (req: Request, res: Response) => {
  const category = req.query.category as string;
  let list = db.resources;
  if (category) {
    list = list.filter((r) => r.category === category);
  }
  res.json({ resources: list });
});

// Chat: Generative AI Assistant with Safety Guardrails
app.post('/api/chat', optionalAuth, async (req: Request, res: Response) => {
  const { message, history } = req.body;
  const user = (req as any).user;
  const userName = user?.preferences?.preferredName || user?.name?.split(' ')[0] || 'Friend';

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Message text is required.' });
    return;
  }

  const trimmed = message.trim();
  const lowerMsg = trimmed.toLowerCase();

  // 1. Critical Crisis Detection Safety Guardrail
  const crisisKeywords = [
    'kill myself', 'suicide', 'end my life', 'want to die', 'harm myself',
    'self harm', 'cutting myself', 'don\'t want to live', 'hang myself',
    'overdose', 'end it all', 'no reason to live'
  ];

  const containsCrisis = crisisKeywords.some((kw) => lowerMsg.includes(kw));

  if (containsCrisis) {
    res.json({
      role: 'assistant',
      isCrisisWarning: true,
      content: `I can hear how much pain you are carrying right now, ${userName}. Please know that you are not alone and your life matters deeply.\n\nBecause I am an AI, I cannot provide crisis care, but there are compassionate, trained people who want to support you right now, for free and in total confidence:\n\n• **988 Suicide & Crisis Lifeline**: Call or text **988** (Available 24/7 in the US & Canada, free & confidential).\n• **Crisis Text Line**: Text **HOME** to **741741** to connect with a crisis counselor.\n• **The Trevor Project** (LGBTQ+ youth): Call **1-866-488-7386** or text **START to 678-678**.\n• **International Befrienders**: Visit **befrienders.org** for hotlines worldwide.\n\nPlease reach out to one of these services or a trusted loved one or health professional right now. We want you to be safe.`,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // 2. Generative AI Chat Response via Gemini
  const systemPrompt = `You are MindCare AI, a supportive, empathetic, non-diagnostic mental wellness companion designed for students and young adults.
The user's name is ${userName}.
SDG Alignment: UN SDG 3 (Good Health and Well-being).

CRITICAL GUIDELINES:
- Be empathetic, calm, respectful, compassionate, and non-judgmental.
- Validate their emotions first before offering ideas.
- Ask at most ONE simple reflective question at a time.
- Offer short, practical, grounded suggestions (e.g., 4-7-8 breathing, 5-4-3-2-1 sensory grounding, gentle study break, sleep hygiene, expressive journaling).
- Respect the user's boundaries and never pressure them to share sensitive identifying details.
- NEVER diagnose mental illnesses, prescribe medications, or claim to replace a licensed therapist or physician.
- Clearly state that wellness screening and your tips are not medical diagnoses.
- If the user hints at severe distress or feeling unsafe, gently offer the 988 Crisis Lifeline and encourage reaching out to a professional.
- Keep responses concise (under 120 words), warm, easy to read on mobile screens, and soothing.`;

  try {
    if (geminiAI) {
      // Build conversation history for Gemini
      const conversationContents = [];

      // Add relevant history if provided
      if (Array.isArray(history) && history.length > 0) {
        for (const h of history.slice(-6)) {
          if (h.role === 'user' || h.role === 'assistant') {
            conversationContents.push({
              role: h.role === 'user' ? 'user' : 'model',
              parts: [{ text: h.content }],
            });
          }
        }
      }

      conversationContents.push({
        role: 'user',
        parts: [{ text: trimmed }],
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('AI response timed out')), 6000)
      );

      const response = await Promise.race([
        geminiAI.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: conversationContents as any,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.7,
          },
        }),
        timeoutPromise,
      ]);

      const reply = response.text?.trim() || 'I am right here with you. How is your breathing feeling right now?';

      res.json({
        role: 'assistant',
        content: reply,
        timestamp: new Date().toISOString(),
      });
      return;
    }
  } catch (err) {
    console.warn('Gemini chat handled via fallback:', err);
  }

  // 3. Empathetic Fallback Response Engine
  let fallbackReply = `Thank you for sharing that with me, ${userName}. Dealing with academic pressure and personal thoughts can take a heavy toll. Would you like to try a gentle 2-minute breathing exercise together, or would you prefer to talk through what feels heaviest right now?`;

  if (lowerMsg.includes('exam') || lowerMsg.includes('study') || lowerMsg.includes('test') || lowerMsg.includes('deadline')) {
    fallbackReply = `Academic pressure can feel so overwhelming, especially when deadlines stack up. Remember: your worth as a human is never defined by a letter grade. Let's take a slow, deep breath in... and out. What is one small, 15-minute piece of your study task you can look at, before giving yourself a proper rest?`;
  } else if (lowerMsg.includes('sleep') || lowerMsg.includes('tired') || lowerMsg.includes('insomnia') || lowerMsg.includes('night')) {
    fallbackReply = `Restless nights and racing thoughts are so difficult when you need your energy. Have you tried doing a 'brain dump' on paper to park your worries until tomorrow morning? A warm cup of chamomile tea or 5 slow deep breaths can also help signal safety to your body.`;
  } else if (lowerMsg.includes('lonely') || lowerMsg.includes('alone') || lowerMsg.includes('friend')) {
    fallbackReply = `Feeling lonely or disconnected is one of the most painful feelings, and so many students experience it silently. I'm really glad you reached out today. Is there one person in your life—a family member, an old classmate, or a mentor—you might send a simple 'thinking of you' message to?`;
  }

  res.json({
    role: 'assistant',
    content: fallbackReply,
    timestamp: new Date().toISOString(),
  });
});

// Demo Reset Endpoint
app.post('/api/demo/reset', (_req: Request, res: Response) => {
  db = generateSeedData();
  saveDB(db);
  res.json({ message: 'Demo data reset successfully.' });
});

// -------------------------------------------------------------
// VITE INTEGRATION FOR FULL-STACK SPA
// -------------------------------------------------------------
async function setupVite() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite middleware mounted in development mode.');
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
      console.log('Serving production static build from dist.');
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌿 MindCare AI Server running at http://0.0.0.0:${PORT}`);
    console.log(`✨ UN SDG 3 • Good Health & Well-being mental wellness platform`);
  });
}

setupVite().catch((err) => {
  console.error('Server startup failed:', err);
});

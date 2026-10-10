import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Award, Shield, HeartHandshake, Sparkles, BookOpen, Layers, Users, Activity, CheckCircle, BarChart3 } from 'lucide-react';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export const SdgModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: Slide[] = [
    {
      id: 1,
      title: 'MindCare AI',
      subtitle: 'Generative AI-Powered Mental Wellness Support for Students & Young Adults',
      icon: <Award className="w-8 h-8 text-teal-600" />,
      content: (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200/60 flex items-center gap-3">
            <span className="text-3xl">🎯</span>
            <div>
              <div className="text-xs uppercase font-bold tracking-wider text-teal-800">Global Goal Alignment</div>
              <div className="text-lg font-bold text-slate-900">United Nations SDG 3: Good Health and Well-being</div>
              <p className="text-xs text-slate-600">Target 3.4: By 2030, reduce premature mortality and promote mental health and well-being.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-semibold text-slate-500 block">Academic Team / Institution</span>
              <span className="text-sm font-bold text-slate-800">MindCare Research &amp; Wellness Initiative</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-semibold text-slate-500 block">Demonstration Scope</span>
              <span className="text-sm font-bold text-teal-700">Full-Stack Web App + Ethical AI Companion</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 italic text-center pt-2">
            "Empowering students to notice, regulate, and safely express emotional strain before it becomes a crisis."
          </p>
        </div>
      ),
    },
    {
      id: 2,
      title: 'Problem Statement',
      subtitle: 'The Invisible Crisis Among High School and University Students',
      icon: <Activity className="w-8 h-8 text-rose-600" />,
      content: (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-100">
              <div className="text-xl font-extrabold text-rose-600">60%+</div>
              <div className="text-[11px] text-slate-600 mt-0.5">Students report overwhelming stress during terms</div>
            </div>
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100">
              <div className="text-xl font-extrabold text-amber-600">2-6 Wks</div>
              <div className="text-[11px] text-slate-600 mt-0.5">Average campus counseling waitlist time</div>
            </div>
            <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100">
              <div className="text-xl font-extrabold text-indigo-600">45%</div>
              <div className="text-[11px] text-slate-600 mt-0.5">Avoid seeking help due to social or academic stigma</div>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 text-xs text-slate-700 space-y-2">
            <p>• <strong>Acute academic pressure:</strong> High GPA expectations, exams, financial insecurity, and internship competition create pervasive chronic stress.</p>
            <p>• <strong>Isolation in digital life:</strong> Students feel disconnected, suffering in silence late at night when university offices are closed.</p>
            <p>• <strong>No low-barrier stepping stone:</strong> Between "doing nothing" and "booking clinical therapy", students lack accessible, judgment-free daily wellness touchpoints.</p>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: 'Target Users & Needs',
      subtitle: 'Designing for Modern Student Life and Diverse Learning Environments',
      icon: <Users className="w-8 h-8 text-indigo-600" />,
      content: (
        <div className="grid grid-cols-2 gap-3 text-left">
          <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-100 space-y-1.5">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <span>🎓</span> Undergraduate &amp; College Youth
            </h4>
            <p className="text-xs text-slate-600">Experiencing first-time independence, exam anxiety, roommate conflicts, and sleep dysregulation.</p>
            <span className="inline-block text-[10px] font-semibold text-teal-700 bg-white px-2 py-0.5 rounded-md">Need: 24/7 de-escalation &amp; study calm</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-1.5">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <span>🔬</span> Graduate &amp; Research Students
            </h4>
            <p className="text-xs text-slate-600">High imposter syndrome, long laboratory/dissertation hours, and career trajectory worry.</p>
            <span className="inline-block text-[10px] font-semibold text-purple-700 bg-white px-2 py-0.5 rounded-md">Need: Objective trend reflection</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-1.5 col-span-2">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <span>🛡️</span> Privacy-Conscious Individuals
            </h4>
            <p className="text-xs text-slate-600">Students hesitant to put mental health records on public or campus records who need complete privacy, data export, and easy deletion.</p>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: 'Existing Challenges & Alternatives',
      subtitle: 'Why Current Mental Health Approaches Fall Short for Young Adults',
      icon: <Activity className="w-8 h-8 text-amber-600" />,
      content: (
        <div className="space-y-2.5 text-xs text-slate-700">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <strong className="text-slate-900 block mb-0.5">Commercial Meditation Apps (e.g., Calm, Headspace)</strong>
            <span>High monthly subscription fees ($70+/yr); static audio libraries that cannot respond empathetically to specific student exam crises or syllabus burnout.</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <strong className="text-slate-900 block mb-0.5">Generic Unconstrained LLM Chatbots</strong>
            <span>Lack mental health safety guardrails; risk hallucinating clinical advice or providing inappropriate medical diagnoses without emergency protocols.</span>
          </div>
          <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-900">
            <strong className="block mb-0.5 text-teal-950 font-bold">The MindCare AI Difference</strong>
            <span>100% free, evidence-informed non-diagnostic screening (PHQ-4), strict crisis triggers with verified hotlines (988), and purposeful student grounding exercises.</span>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      title: 'The Proposed Solution',
      subtitle: 'A Safe, Integrated Multi-Modal Mental Wellness Web App',
      icon: <Sparkles className="w-8 h-8 text-teal-600" />,
      content: (
        <div className="grid grid-cols-2 gap-3 text-left text-xs">
          <div className="p-3 rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100">
            <div className="font-bold text-teal-900 mb-1 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-teal-600" /> Daily Mood Check-in
            </div>
            <p className="text-slate-600">Expressive 1-5 scale, stress slider, emotion tags, and instant validating AI reflections.</p>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
            <div className="font-bold text-indigo-900 mb-1 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-indigo-600" /> MindCare AI Companion
            </div>
            <p className="text-slate-600">Empathetic conversational agent powered by Gemini 3.8 Flash with safety guardrails.</p>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
            <div className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-amber-600" /> PHQ-4 Wellness Screening
            </div>
            <p className="text-slate-600">Transparent scoring of ultra-brief anxiety/depression indicators with clear non-diagnostic framing.</p>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-100">
            <div className="font-bold text-sky-900 mb-1 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-sky-600" /> Interactive Self-Care Toolkit
            </div>
            <p className="text-slate-600">Animated box breathing pacer, 5-4-3-2-1 sensory grounding, and study break intervals.</p>
          </div>
        </div>
      ),
    },
    {
      id: 6,
      title: 'Core Features & Interaction',
      subtitle: 'Designed to Cultivate Agency, Self-Compassion, and Routine',
      icon: <Layers className="w-8 h-8 text-teal-600" />,
      content: (
        <div className="space-y-2 text-xs text-slate-700">
          <div className="p-2.5 rounded-xl bg-slate-50 flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center shrink-0">1</span>
            <div><strong>One-Tap Daily Pulse:</strong> Quick check-in logs mood, stress, and optional diary note with no cognitive overload.</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center shrink-0">2</span>
            <div><strong>Visual Analytics &amp; History:</strong> Recharts line and bar graphs visualize emotional recovery and trigger correlation.</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 font-bold flex items-center justify-center shrink-0">3</span>
            <div><strong>Active Crisis Safeguards:</strong> Prominent 988 banner, text line connections, and safety keyword intercept.</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">4</span>
            <div><strong>Privacy &amp; Data Deletion:</strong> 1-click export of health data and complete GDPR-compliant account wipe.</div>
          </div>
        </div>
      ),
    },
    {
      id: 7,
      title: 'System Architecture',
      subtitle: 'Full-Stack Modern Web Engineering with Server-Side AI Orchestration',
      icon: <BarChart3 className="w-8 h-8 text-indigo-600" />,
      content: (
        <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
          <div className="p-3 rounded-2xl bg-teal-50 border border-teal-200">
            <div className="font-bold text-teal-900 mb-1">Frontend Tier</div>
            <div className="text-slate-600 space-y-1 text-[11px]">
              <div>React 19 + TypeScript</div>
              <div>Tailwind CSS v4</div>
              <div>Recharts Visualizations</div>
              <div>Motion &amp; Lucide Icons</div>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-200">
            <div className="font-bold text-indigo-900 mb-1">Backend Server</div>
            <div className="text-slate-600 space-y-1 text-[11px]">
              <div>Node.js &amp; Express</div>
              <div>Secure Auth &amp; Cookies</div>
              <div>Input Sanitization</div>
              <div>Persistent JSON Store</div>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200">
            <div className="font-bold text-purple-900 mb-1">AI Intelligence</div>
            <div className="text-slate-600 space-y-1 text-[11px]">
              <div>@google/genai SDK</div>
              <div>gemini-3.8-flash</div>
              <div>Empathetic System Guard</div>
              <div>Deterministic Fallback</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 8,
      title: 'User Journey',
      subtitle: 'From High Stress to Grounded Clarity in Under 3 Minutes',
      icon: <Users className="w-8 h-8 text-teal-600" />,
      content: (
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-600 text-white font-bold flex items-center justify-center shrink-0">A</div>
            <div className="p-2 rounded-xl bg-slate-50 flex-1"><strong>Landing &amp; Onboarding:</strong> Student enters via 1-click Demo or Register.</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-600 text-white font-bold flex items-center justify-center shrink-0">B</div>
            <div className="p-2 rounded-xl bg-slate-50 flex-1"><strong>Morning Check-in:</strong> Selects "Okay / 3" &amp; "Academics" stress trigger in 20 seconds.</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-600 text-white font-bold flex items-center justify-center shrink-0">C</div>
            <div className="p-2 rounded-xl bg-slate-50 flex-1"><strong>Regulating Exercise:</strong> Follows visual Box Breathing pacer before calculus lecture.</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-600 text-white font-bold flex items-center justify-center shrink-0">D</div>
            <div className="p-2 rounded-xl bg-slate-50 flex-1"><strong>Late-Night Chat:</strong> Decompresses with MindCare AI companion when racing thoughts occur.</div>
          </div>
        </div>
      ),
    },
    {
      id: 9,
      title: 'Lean Canvas Overview',
      subtitle: 'Strategic Feasibility, Sustainability, and Social Impact',
      icon: <BookOpen className="w-8 h-8 text-teal-600" />,
      content: (
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <strong>Problem:</strong> Fragmented student mental health support, waitlists, stigma.
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <strong>Customer Segments:</strong> High school, undergraduate, and graduate learners.
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <strong>Unique Value:</strong> Free, instant, ethical non-diagnostic AI support + screening.
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <strong>Key Metrics:</strong> Active daily check-ins, screening completion, pacer usage.
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <strong>Channels:</strong> Student wellness centers, university orientation, peer groups.
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <strong>Cost/Sustainability:</strong> Scalable serverless hosting, API micro-budgets.
          </div>
        </div>
      ),
    },
    {
      id: 10,
      title: 'Responsible AI & Safety',
      subtitle: 'Ethics, Clinical Non-Diagnostic Boundaries & Crisis Escalation',
      icon: <Shield className="w-8 h-8 text-emerald-600" />,
      content: (
        <div className="space-y-2.5 text-xs text-slate-700">
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/80">
            <strong className="text-emerald-950 block">1. Non-Diagnostic Framing</strong>
            <span>All screening explicitly displays: "Informational reflection tool only. Not a medical diagnosis or substitute for professional clinical care."</span>
          </div>
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200/80">
            <strong className="text-rose-950 block">2. Dual-Layer Crisis Safeguards</strong>
            <span>Rule-based string matching intercepts high-risk keywords before prompt execution, serving verified hotlines (988) even if AI services are down.</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <strong className="text-slate-900 block">3. Data Dignity &amp; Privacy</strong>
            <span>Zero ad tracking. Never selling student conversations. Complete data download and instant account deletion.</span>
          </div>
        </div>
      ),
    },
    {
      id: 11,
      title: 'Implementation Roadmap',
      subtitle: 'Phased Milestones Toward Scaled University Integration',
      icon: <Activity className="w-8 h-8 text-teal-600" />,
      content: (
        <div className="space-y-2 text-xs">
          <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-between">
            <div><strong>Phase 1 (Completed):</strong> Core Full-stack app, Gemini AI Chat, PHQ-4, Breathing Tools.</div>
            <span className="text-[10px] bg-teal-600 text-white font-bold px-2 py-0.5 rounded-full">Done</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div><strong>Phase 2:</strong> Campus Counseling Directory API &amp; Peer Support Group Integrations.</div>
            <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-full">Next</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div><strong>Phase 3:</strong> Longitudinal efficacy study with university ethics board (IRB).</div>
            <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-full">Future</span>
          </div>
        </div>
      ),
    },
    {
      id: 12,
      title: 'SDG 3 Impact & Conclusion',
      subtitle: 'Good Health and Well-being for Every Student',
      icon: <HeartHandshake className="w-8 h-8 text-teal-600" />,
      content: (
        <div className="space-y-3 text-center">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-teal-500 to-indigo-600 text-white flex items-center justify-center mx-auto text-3xl shadow-lg">
            🌱
          </div>
          <h4 className="text-base font-bold text-slate-900">Mental Health Is Health.</h4>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            By reducing stigma, eliminating cost barriers, and providing respectful, evidence-informed guidance 24/7, <strong>MindCare AI</strong> turns UN Sustainable Development Goal 3 into a living reality for students worldwide.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-md transition-all"
            >
              Explore Live MindCare App
            </button>
          </div>
        </div>
      ),
    },
  ];

  if (!isOpen) return null;

  const current = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold">
              SDG 3 Project Presentation
            </span>
            <span className="text-xs text-slate-400">Slide {currentSlide + 1} of {slides.length}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Close presentation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slide Content Area */}
        <div className="flex-1 py-6 overflow-y-auto">
          <div className="flex items-start gap-3.5 mb-4">
            <div className="p-2.5 rounded-2xl bg-teal-50 border border-teal-100 shrink-0">
              {current.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{current.title}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{current.subtitle}</p>
            </div>
          </div>

          <div className="mt-4">{current.content}</div>
        </div>

        {/* Footer Navigation */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
            disabled={currentSlide === 0}
            className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          {/* Dots Indicator */}
          <div className="hidden sm:flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentSlide ? 'w-6 bg-teal-600' : 'bg-slate-200 hover:bg-slate-300'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1))}
            disabled={currentSlide === slides.length - 1}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-all"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

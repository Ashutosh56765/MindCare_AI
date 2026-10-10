import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Heart,
  Sparkles,
  ShieldCheck,
  Award,
  ArrowRight,
  Smile,
  MessageSquare,
  Activity,
  Wind,
  CheckCircle2,
  Clock,
  Compass,
  Presentation,
  ShieldAlert
} from 'lucide-react';
import { SdgModal } from '../components/presentation/SdgModal';
import { CrisisModal } from '../components/common/CrisisModal';

export const LandingPage: React.FC = () => {
  const { user, loginDemo } = useAuth();
  const navigate = useNavigate();
  const [sdgModalOpen, setSdgModalOpen] = useState(false);
  const [crisisModalOpen, setCrisisModalOpen] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const handleDemo = async () => {
    setDemoLoading(true);
    try {
      await loginDemo();
      navigate('/dashboard');
    } catch (e) {
      console.error(e);
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
        {/* Soft Background Radial Blurs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-teal-200/30 via-indigo-200/20 to-purple-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* SDG 3 Target Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-semibold shadow-xs">
              <Award className="w-4 h-4 text-teal-600" />
              <span>Aligned with UN SDG 3 • Good Health &amp; Well-being (Target 3.4)</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Your Safe Harbor for{' '}
              <span className="bg-gradient-to-r from-teal-600 via-teal-700 to-indigo-600 bg-clip-text text-transparent">
                Student Mental Wellness
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              An evidence-informed, AI-powered sanctuary designed for students navigating academic pressure, anxiety, and burnout. Complete gentle daily check-ins, reflect with an empathetic companion, and find grounded peace.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              {user ? (
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-md shadow-teal-600/25 transition-all flex items-center justify-center gap-2"
                >
                  <span>Go to My Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-md shadow-teal-600/25 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Start Free Check-in</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={handleDemo}
                    disabled={demoLoading}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-200 shadow-xs transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    <span>{demoLoading ? 'Launching Demo...' : 'Explore Student Demo'}</span>
                  </button>
                </>
              )}
              <button
                onClick={() => setSdgModalOpen(true)}
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-sm border border-indigo-200/80 transition-all flex items-center justify-center gap-2"
              >
                <Presentation className="w-4 h-4 text-indigo-600" />
                <span>SDG 3 Academic Presentation</span>
              </button>
            </div>

            {/* Trust Highlights */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-600" /> 100% Private &amp; Non-judgmental
              </span>
              <span className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-500" /> Non-Diagnostic Educational Framework
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-500" /> 24/7 Crisis Hotline Quick Links
              </span>
            </div>
          </div>

          {/* Interactive Feature Snapshot Preview */}
          <div className="mt-14 max-w-4xl mx-auto rounded-3xl bg-white/90 border border-slate-200/80 shadow-2xl p-6 sm:p-8 backdrop-blur-md">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
                  <Wind className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">MindCare Daily Grounding</h3>
                  <p className="text-xs text-slate-500">Experience our 4-second box breath regulator right now</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to="/self-care"
                  className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 font-semibold text-xs rounded-xl border border-teal-200 transition-colors"
                >
                  Open Full Breathing Tool
                </Link>
                <Link
                  to="/chat"
                  className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-xl border border-indigo-200 transition-colors"
                >
                  Talk with Companion
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-center">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center">
                <div className="text-2xl mb-1">🌿</div>
                <div className="font-bold text-slate-800 text-sm">Gentle Mood Check-in</div>
                <div className="text-xs text-slate-500 mt-1">Expressive 1-5 scale with instant validating reflections</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center">
                <div className="text-2xl mb-1">📋</div>
                <div className="font-bold text-slate-800 text-sm">PHQ-4 Screening</div>
                <div className="text-xs text-slate-500 mt-1">Transparent self-assessment for anxiety and depressive symptoms</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center">
                <div className="text-2xl mb-1">💜</div>
                <div className="font-bold text-slate-800 text-sm">Empathetic AI Chat</div>
                <div className="text-xs text-slate-500 mt-1">Grounded conversation powered by Gemini 3.8 Flash</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
            Comprehensive Support
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Designed for Student Realities
          </h2>
          <p className="text-sm text-slate-600">
            Built from the ground up to address student isolation, academic pressure, and emotional distress without clinical intimidation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Daily Mood Pulse */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Smile className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Daily Mood Check-in</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Log your emotional state in under 30 seconds. Choose from expressive mood icons, tag stressors (exams, sleep, relationships), and receive instant validating AI reflections.
              </p>
            </div>
            <Link
              to="/mood-checkin"
              className="text-xs font-bold text-teal-600 hover:text-teal-700 inline-flex items-center gap-1"
            >
              Log a Check-in <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: AI Wellness Companion */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">MindCare AI Companion</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                A safe, non-judgmental space to unpack racing thoughts. Powered by Gemini 3.8 Flash with strict safety boundaries: always empathetic, non-diagnostic, and equipped with crisis triggers.
              </p>
            </div>
            <Link
              to="/chat"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
            >
              Start Conversation <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3: PHQ-4 Screening */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">PHQ-4 Wellness Screening</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Evidence-informed ultra-brief questionnaire evaluating anxiety and low mood over the past two weeks. Transparent scoring breakdown, supportive guidance, and zero clinical claims.
              </p>
            </div>
            <Link
              to="/screening"
              className="text-xs font-bold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1"
            >
              Take Screening <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 4: Interactive Self-Care */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Wind className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Guided Self-Care Routines</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Animated Box Breathing pacer, 5-4-3-2-1 Sensory Grounding for acute panic, mindful Pomodoro study-break timers, and sleep hygiene checklists.
              </p>
            </div>
            <Link
              to="/self-care"
              className="text-xs font-bold text-purple-600 hover:text-purple-700 inline-flex items-center gap-1"
            >
              Practice Exercises <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 5: Mood History & Trends */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Mood History &amp; Analytics</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Interactive Recharts graphs tracking your emotional journey over 7 and 30 days. Identify triggers, observe recovery patterns, and export your personal data anytime.
              </p>
            </div>
            <Link
              to="/history"
              className="text-xs font-bold text-teal-600 hover:text-teal-700 inline-flex items-center gap-1"
            >
              Explore Trends <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 6: Verified Resource Centre */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Verified Support Directory</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Direct connections to free, confidential crisis hotlines (988), student advocacy networks (Active Minds, The JED Foundation), and low-cost sliding scale therapy.
              </p>
            </div>
            <Link
              to="/resources"
              className="text-xs font-bold text-rose-600 hover:text-rose-700 inline-flex items-center gap-1"
            >
              Browse Directory <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* SDG 3 Impact Highlight Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
              <Award className="w-4 h-4" />
              <span>United Nations Sustainable Development Goal 3</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Target 3.4: Promoting Mental Health &amp; Well-being for All
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Mental health is a fundamental pillar of human dignity and student potential. By removing cost barriers, reducing social stigma, and offering 24/7 non-diagnostic self-reflection, MindCare AI directly advances the UN 2030 Agenda for Sustainable Development.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => setSdgModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <Presentation className="w-4 h-4" />
                <span>Open 12-Slide Academic Presentation</span>
              </button>
              <button
                onClick={() => setCrisisModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs border border-white/20 transition-all flex items-center gap-2"
              >
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>View Emergency Protocols</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900">How MindCare Works</h2>
          <p className="text-sm text-slate-600">A simple, compassionate 3-step loop to restore your balance.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 font-extrabold text-lg flex items-center justify-center mx-auto">
              1
            </div>
            <h4 className="font-bold text-slate-900 text-base">Check in with Yourself</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Take 30 seconds to acknowledge your mood score, stress level, and primary triggers with zero judgment.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 font-extrabold text-lg flex items-center justify-center mx-auto">
              2
            </div>
            <h4 className="font-bold text-slate-900 text-base">Reflect &amp; De-escalate</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Receive a gentle AI reflection, do a 4-minute box breath, or chat about the exam deadline keeping you up.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 font-extrabold text-lg flex items-center justify-center mx-auto">
              3
            </div>
            <h4 className="font-bold text-slate-900 text-base">Observe Your Growth</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Track weekly patterns on interactive charts, notice stress triggers, and connect with counselors when needed.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials / Student Voices */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Student Voices</h2>
          <p className="text-xs sm:text-sm text-slate-500">Real perspectives on navigating academic stress.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <p className="text-xs text-slate-700 italic leading-relaxed">
              "During midterm week, I was having chest tightness and couldn't sleep. The box breathing tool and the AI's gentle validation helped me decompress without feeling pressured."
            </p>
            <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
              <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs">M</div>
              <div>
                <div className="text-xs font-bold text-slate-800">Maya K.</div>
                <div className="text-[10px] text-slate-500">2nd Year Bioengineering</div>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <p className="text-xs text-slate-700 italic leading-relaxed">
              "The PHQ-4 screening was refreshing because it didn't claim to diagnose me. It just gave me clear, objective language to describe my burnout to my campus counselor."
            </p>
            <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
              <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center text-xs">J</div>
              <div>
                <div className="text-xs font-bold text-slate-800">Jordan T.</div>
                <div className="text-[10px] text-slate-500">Master's Student in Economics</div>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <p className="text-xs text-slate-700 italic leading-relaxed">
              "Being able to download all my check-ins or delete my account completely with one click made me trust this platform far more than generic commercial wellness apps."
            </p>
            <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
              <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-800 font-bold flex items-center justify-center text-xs">S</div>
              <div>
                <div className="text-xs font-bold text-slate-800">Siddharth N.</div>
                <div className="text-[10px] text-slate-500">Computer Science Senior</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <SdgModal isOpen={sdgModalOpen} onClose={() => setSdgModalOpen(false)} />
      <CrisisModal isOpen={crisisModalOpen} onClose={() => setCrisisModalOpen(false)} />
    </div>
  );
};

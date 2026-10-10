import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import {
  Heart,
  Smile,
  Sparkles,
  ArrowRight,
  Wind,
  MessageSquare,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const MoodCheckinPage: React.FC = () => {
  const navigate = useNavigate();

  const [moodScore, setMoodScore] = useState<number>(4);
  const [stressLevel, setStressLevel] = useState<number>(4);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [selectedStressors, setSelectedStressors] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  const moodOptions = [
    { score: 1, label: 'Very Low', emoji: '🌧️', desc: 'Heavy, drained, or hurting', color: 'from-slate-100 to-rose-50 border-rose-200 text-rose-800' },
    { score: 2, label: 'Low', emoji: '😔', desc: 'Down or discouraged', color: 'from-slate-100 to-amber-50 border-amber-200 text-amber-800' },
    { score: 3, label: 'Okay', emoji: '😐', desc: 'Neutral, floating, getting by', color: 'from-slate-100 to-slate-50 border-slate-200 text-slate-800' },
    { score: 4, label: 'Good', emoji: '😊', desc: 'Calm, steady, or hopeful', color: 'from-slate-100 to-teal-50 border-teal-200 text-teal-800' },
    { score: 5, label: 'Great', emoji: '🌟', desc: 'Energized, joyful, thriving', color: 'from-slate-100 to-indigo-50 border-indigo-200 text-indigo-800' },
  ];

  const emotionList = [
    'Calm', 'Hopeful', 'Grateful', 'Focused', 'Content',
    'Tired', 'Anxious', 'Overwhelmed', 'Restless', 'Lonely',
    'Frustrated', 'Numb', 'Pressured', 'Optimistic'
  ];

  const stressorList = [
    'Academics & Exams', 'Deadlines', 'Sleep Debt', 'Career & Internships',
    'Finances', 'Social Relationships', 'Family Expectations', 'Physical Health'
  ];

  const toggleEmotion = (em: string) => {
    setSelectedEmotions((prev) =>
      prev.includes(em) ? prev.filter((item) => item !== em) : [...prev, em]
    );
  };

  const toggleStressor = (st: string) => {
    setSelectedStressors((prev) =>
      prev.includes(st) ? prev.filter((item) => item !== st) : [...prev, st]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const selectedMoodObj = moodOptions.find((m) => m.score === moodScore);
      const res = await api.createMood({
        moodScore,
        moodLabel: selectedMoodObj?.label || 'Good',
        stressLevel,
        emotions: selectedEmotions,
        stressors: selectedStressors,
        note: note.trim() || undefined,
      });

      // Celebration confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#0D9488', '#6366F1', '#14B8A6', '#A855F7'],
      });

      setResult(res.mood);
    } catch (err: any) {
      setError(err.message || 'Failed to record check-in.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStressLabel = (lvl: number) => {
    if (lvl <= 2) return { text: 'Deeply Calm / Relaxed', color: 'text-teal-700 bg-teal-50 border-teal-200' };
    if (lvl <= 4) return { text: 'Low / Manageable Tension', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (lvl <= 6) return { text: 'Moderate Everyday Stress', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    if (lvl <= 8) return { text: 'High Strain / Tightness', color: 'text-orange-700 bg-orange-50 border-orange-200' };
    return { text: 'Intense Overwhelm', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  const stressInfo = getStressLabel(stressLevel);

  // If submitted successfully, show reflection result screen
  if (result) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-6 animate-in fade-in">
        <div className="p-8 rounded-3xl bg-white border border-teal-100 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-teal-500 to-indigo-600 text-white flex items-center justify-center mx-auto text-3xl shadow-md">
            🌿
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-900">Check-in Completed</h2>
            <p className="text-xs text-slate-500">
              Thank you for pausing to listen to your inner world today.
            </p>
          </div>

          {/* AI Reflection Card */}
          <div className="p-5 rounded-2xl bg-teal-50/70 border border-teal-200/80 text-left space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-900">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>MindCare Wellness Reflection</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
              "{result.aiReflection}"
            </p>
          </div>

          {/* Quick next step buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2"
            >
              <span>View Dashboard &amp; Trends</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/self-care')}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs border border-indigo-200 transition-all flex items-center justify-center gap-2"
            >
              <Wind className="w-4 h-4" />
              <span>Try Box Breathing</span>
            </button>
            <button
              onClick={() => navigate('/chat')}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200 transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-teal-600" />
              <span>Talk to Companion</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200/60">
          Daily Reflection
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          How are you feeling right now?
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          No right or wrong answers. This is your private harbor to pause and notice what's here.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-xs text-rose-700">
          <AlertCircle className="w-4 h-4 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Mood Score Selector */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-bold">1</span>
              <span>Select Your Core Mood</span>
            </h2>
            <span className="text-xs text-slate-400">Tap to select</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {moodOptions.map((opt) => {
              const isSelected = moodScore === opt.score;
              return (
                <button
                  key={opt.score}
                  type="button"
                  onClick={() => setMoodScore(opt.score)}
                  className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                    isSelected
                      ? `bg-gradient-to-b ${opt.color} ring-2 ring-teal-500 shadow-md scale-102 font-bold`
                      : 'bg-slate-50/70 hover:bg-slate-50 border-slate-200/80 text-slate-600'
                  }`}
                >
                  <span className="text-3xl">{opt.emoji}</span>
                  <div className="text-xs font-semibold">{opt.label}</div>
                  <div className="text-[10px] text-slate-400 leading-tight hidden sm:block">
                    {opt.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Stress Level Slider */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-bold">2</span>
              <span>Current Stress Level (1 to 10)</span>
            </h2>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${stressInfo.color}`}>
              {stressLevel}/10 &bull; {stressInfo.text}
            </span>
          </div>

          <div className="space-y-2 pt-2">
            <input
              type="range"
              min="1"
              max="10"
              value={stressLevel}
              onChange={(e) => setStressLevel(parseInt(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-medium">
              <span>1 - Completely at ease</span>
              <span>5 - Moderate</span>
              <span>10 - Total overwhelm</span>
            </div>
          </div>
        </div>

        {/* Step 3: Emotion Tags */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-bold">3</span>
            <span>What emotions are present? (Select all that apply)</span>
          </h2>

          <div className="flex flex-wrap gap-2">
            {emotionList.map((em) => {
              const active = selectedEmotions.includes(em);
              return (
                <button
                  key={em}
                  type="button"
                  onClick={() => toggleEmotion(em)}
                  className={`text-xs px-3.5 py-1.5 rounded-full border transition-all ${
                    active
                      ? 'bg-teal-600 text-white border-teal-600 shadow-2xs font-semibold'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {em}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 4: Primary Stressors */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-bold">4</span>
            <span>Are there specific triggers or stressors today?</span>
          </h2>

          <div className="flex flex-wrap gap-2">
            {stressorList.map((st) => {
              const active = selectedStressors.includes(st);
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => toggleStressor(st)}
                  className={`text-xs px-3.5 py-1.5 rounded-full border transition-all ${
                    active
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs font-semibold'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {st}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 5: Optional Reflection Note */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-bold">5</span>
            <span>Private Reflection Note (Optional)</span>
          </h2>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Write freely. What's on your mind? What gave you relief or created tension today? (Encrypted and private)"
            className="w-full p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 px-6 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{submitting ? 'Recording & Generating AI Reflection...' : 'Save Today\'s Check-in'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

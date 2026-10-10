import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { MoodEntry, ScreeningRecord } from '../types';
import {
  Heart,
  Smile,
  Activity,
  MessageSquare,
  Wind,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Flame,
  Calendar,
  AlertCircle,
  RefreshCw,
  Clock,
  Compass
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [summary, setSummary] = useState({ totalCheckins: 0, avgMood: 0, avgStress: 0 });
  const [screenings, setScreenings] = useState<ScreeningRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [moodRes, screenRes] = await Promise.all([
        api.getMoods(30),
        api.getScreeningHistory(),
      ]);
      setMoods(moodRes.moods);
      setSummary(moodRes.summary);
      setScreenings(screenRes.history);
    } catch (err: any) {
      setError(err.message || 'Unable to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const todayStr = new Date().toDateString();
  const todaysMood = moods.find(
    (m) => new Date(m.timestamp).toDateString() === todayStr
  );

  // Prepare chart data (chronological)
  const chartData = [...moods]
    .slice(0, 7)
    .reverse()
    .map((m) => ({
      date: new Date(m.timestamp).toLocaleDateString(undefined, { weekday: 'short', month: 'numeric', day: 'numeric' }),
      mood: m.moodScore,
      stress: m.stressLevel,
    }));

  const getMoodEmoji = (score: number) => {
    switch (score) {
      case 5: return '🌟';
      case 4: return '😊';
      case 3: return '😐';
      case 2: return '😔';
      case 1: return '🌧️';
      default: return '🙂';
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-3 border-teal-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Gathering your wellness harbor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {getGreeting()}, {user?.preferences?.preferredName || user?.name?.split(' ')[0] || 'Friend'}
            </h1>
            <span className="text-2xl">🌱</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })} &bull; Here is your emotional balance summary
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchData}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors border border-slate-200"
            title="Refresh dashboard data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            to="/mood-checkin"
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Smile className="w-4 h-4" />
            <span>{todaysMood ? 'Update Today\'s Mood' : 'Log Today\'s Pulse'}</span>
          </Link>
          <Link
            to="/chat"
            className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs border border-indigo-200 flex items-center gap-1.5 transition-all"
          >
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            <span>Talk to AI</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-xs text-rose-700">
          <AlertCircle className="w-4 h-4 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Today's Mood Snapshot */}
      <div className="rounded-3xl bg-gradient-to-br from-teal-50 via-white to-indigo-50/60 p-6 sm:p-8 border border-teal-100 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 bg-white/80 px-2.5 py-1 rounded-full border border-teal-200/60">
              Today's Sanctuary
            </span>

            {todaysMood ? (
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{getMoodEmoji(todaysMood.moodScore)}</span>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Mood: {todaysMood.moodLabel} ({todaysMood.moodScore}/5)
                    </h3>
                    <div className="text-xs text-slate-500 flex items-center gap-3 mt-0.5">
                      <span>Stress Level: <strong className="text-slate-700">{todaysMood.stressLevel}/10</strong></span>
                      <span>&bull;</span>
                      <span>Logged at {new Date(todaysMood.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>

                {todaysMood.aiReflection && (
                  <div className="p-3.5 rounded-2xl bg-white/90 border border-teal-200/80 text-xs text-slate-700 shadow-xs mt-3 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-teal-900 block mb-0.5">MindCare Reflection:</strong>
                      <p className="italic leading-relaxed">{todaysMood.aiReflection}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-1 pt-1">
                <h3 className="text-lg font-bold text-slate-900">You haven't checked in with yourself today.</h3>
                <p className="text-xs text-slate-500">
                  Taking 30 seconds to honor your emotional pulse creates steady psychological grounding.
                </p>
              </div>
            )}
          </div>

          {!todaysMood && (
            <Link
              to="/mood-checkin"
              className="px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-md shadow-teal-600/20 transition-all flex items-center gap-2 shrink-0"
            >
              <Smile className="w-4 h-4" />
              <span>Complete Daily Check-in</span>
            </Link>
          )}
        </div>
      </div>

      {/* 4 Metric Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">Average Mood</span>
            <Smile className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {summary.avgMood > 0 ? `${summary.avgMood} / 5` : '—'}
          </div>
          <div className="text-[11px] text-teal-700 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3" />
            <span>Over past {moods.length} entries</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">Average Stress</span>
            <Activity className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {summary.avgStress > 0 ? `${summary.avgStress} / 10` : '—'}
          </div>
          <div className="text-[11px] text-indigo-700 font-medium">
            <span>{summary.avgStress <= 4 ? 'Low / Manageable' : summary.avgStress <= 7 ? 'Moderate Tension' : 'Elevated'}</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">Check-in Pulse</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {summary.totalCheckins} Days
          </div>
          <div className="text-[11px] text-amber-700 font-medium">
            <span>Consistent self-awareness</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">PHQ-4 Screening</span>
            <Calendar className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {screenings.length > 0 ? screenings[0].severity : 'Not Taken'}
          </div>
          <div className="text-[11px] text-purple-700 font-medium">
            {screenings.length > 0 ? (
              <Link to="/screening" className="underline">View latest assessment</Link>
            ) : (
              <Link to="/screening" className="underline">Take 2-min screening</Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Chart + Self-Care Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Mood Trend (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Weekly Emotional Curve</h3>
              <p className="text-xs text-slate-500">Mood Score (1-5) &amp; Stress Level (1-10) over recent entries</p>
            </div>
            <Link
              to="/history"
              className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              Full Analytics <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {chartData.length > 0 ? (
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0D9488" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="stressGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1E293B', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="mood"
                    name="Mood (1-5)"
                    stroke="#0D9488"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#moodGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="stress"
                    name="Stress (1-10)"
                    stroke="#6366F1"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#stressGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-6 pt-2 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-teal-600 inline-block" /> Mood Score
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" /> Stress Level
                </span>
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 space-y-2">
              <Compass className="w-8 h-8 text-slate-300" />
              <p className="text-xs">No entries recorded yet. Complete a check-in to generate trends.</p>
            </div>
          )}
        </div>

        {/* Suggested Self-Care Tools (1 col) */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Quick Restorative Tools</h3>
            <Link to="/self-care" className="text-xs font-semibold text-teal-600 hover:text-teal-700">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {/* Tool 1 */}
            <Link
              to="/self-care"
              className="p-3.5 rounded-2xl bg-teal-50/60 hover:bg-teal-50 border border-teal-100 transition-colors flex items-center justify-between group block"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                  <Wind className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs group-hover:text-teal-700 transition-colors">
                    Box Breathing Pacer
                  </h4>
                  <p className="text-[11px] text-slate-500">4-4-4-4 nervous system reset</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
            </Link>

            {/* Tool 2 */}
            <Link
              to="/self-care"
              className="p-3.5 rounded-2xl bg-indigo-50/60 hover:bg-indigo-50 border border-indigo-100 transition-colors flex items-center justify-between group block"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs group-hover:text-indigo-700 transition-colors">
                    5-4-3-2-1 Sensory Grounding
                  </h4>
                  <p className="text-[11px] text-slate-500">Anchor for anxiety &amp; panic</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </Link>

            {/* Tool 3 */}
            <Link
              to="/chat"
              className="p-3.5 rounded-2xl bg-purple-50/60 hover:bg-purple-50 border border-purple-100 transition-colors flex items-center justify-between group block"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs group-hover:text-purple-700 transition-colors">
                    MindCare AI Companion
                  </h4>
                  <p className="text-[11px] text-slate-500">24/7 empathetic listening space</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="p-3 rounded-2xl bg-slate-50 text-[11px] text-slate-600 space-y-1">
              <span className="font-bold text-slate-800 block">Today's Micro-Reflection:</span>
              <p className="italic">"You don't need to finish everything today. You only need to take the next gentle breath."</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Check-ins List */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Recent Check-in Logs</h3>
            <p className="text-xs text-slate-500">Your recent reflections and notes</p>
          </div>
          <Link to="/history" className="text-xs font-bold text-teal-600 hover:text-teal-700">
            View All ({moods.length})
          </Link>
        </div>

        {moods.length > 0 ? (
          <div className="space-y-3">
            {moods.slice(0, 4).map((entry) => (
              <div
                key={entry.id}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/70 border border-slate-100 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{getMoodEmoji(entry.moodScore)}</span>
                    <span className="text-xs font-bold text-slate-900">{entry.moodLabel}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-semibold">
                      Stress {entry.stressLevel}/10
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(entry.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  {entry.note && (
                    <p className="text-xs text-slate-700 italic max-w-2xl">
                      "{entry.note}"
                    </p>
                  )}

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {entry.emotions.map((em, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                        {em}
                      </span>
                    ))}
                    {entry.stressors.map((st, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-rose-50 border border-rose-100 text-rose-700 font-medium">
                        Trigger: {st}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 space-y-2">
            <Smile className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs">No check-in history yet. Start today by recording how you feel.</p>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { MoodEntry } from '../types';
import {
  Compass,
  Smile,
  Activity,
  Trash2,
  Download,
  Filter,
  Calendar,
  AlertCircle,
  Clock,
  Sparkles,
  BarChart3,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const HistoryPage: React.FC = () => {
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<'7' | '14' | '30' | 'all'>('30');
  const [moodFilter, setMoodFilter] = useState<'all' | 'positive' | 'neutral' | 'difficult'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchMoods = async () => {
    setLoading(true);
    try {
      const res = await api.getMoods(100);
      setMoods(res.moods);
    } catch (err: any) {
      setError(err.message || 'Failed to load mood history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoods();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this mood check-in?')) return;
    setDeletingId(id);
    try {
      await api.deleteMood(id);
      setMoods((prev) => prev.filter((m) => m.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete entry');
    } finally {
      setDeletingId(null);
    }
  };

  // Filter moods based on time & category
  const filteredMoods = moods.filter((m) => {
    // Time filter
    if (timeFilter !== 'all') {
      const days = parseInt(timeFilter);
      const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
      if (new Date(m.timestamp).getTime() < cutoff) return false;
    }

    // Mood filter
    if (moodFilter === 'positive' && m.moodScore < 4) return false;
    if (moodFilter === 'neutral' && m.moodScore !== 3) return false;
    if (moodFilter === 'difficult' && m.moodScore > 2) return false;

    return true;
  });

  // Prepare chronological chart data
  const chronologicalData = [...filteredMoods]
    .reverse()
    .map((m) => ({
      date: new Date(m.timestamp).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' }),
      mood: m.moodScore,
      stress: m.stressLevel,
    }));

  // Mood distribution
  const moodDistributionCounts = [
    { name: 'Great (5)', count: filteredMoods.filter((m) => m.moodScore === 5).length, color: '#0D9488' },
    { name: 'Good (4)', count: filteredMoods.filter((m) => m.moodScore === 4).length, color: '#14B8A6' },
    { name: 'Okay (3)', count: filteredMoods.filter((m) => m.moodScore === 3).length, color: '#64748B' },
    { name: 'Low (2)', count: filteredMoods.filter((m) => m.moodScore === 2).length, color: '#F59E0B' },
    { name: 'Very Low (1)', count: filteredMoods.filter((m) => m.moodScore === 1).length, color: '#F43F5E' },
  ].filter((d) => d.count > 0);

  // Common stressor frequencies
  const stressorMap: Record<string, number> = {};
  filteredMoods.forEach((m) => {
    m.stressors.forEach((s) => {
      stressorMap[s] = (stressorMap[s] || 0) + 1;
    });
  });

  const stressorData = Object.entries(stressorMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Export JSON
  const exportJSON = () => {
    const dataStr = JSON.stringify(filteredMoods, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MindCare-Mood-Export-${Date.now()}.json`;
    a.click();
  };

  // Export CSV
  const exportCSV = () => {
    const headers = ['Date', 'Mood Score', 'Mood Label', 'Stress Level', 'Emotions', 'Stressors', 'Note'];
    const rows = filteredMoods.map((m) => [
      `"${new Date(m.timestamp).toISOString()}"`,
      m.moodScore,
      `"${m.moodLabel}"`,
      m.stressLevel,
      `"${m.emotions.join('; ')}"`,
      `"${m.stressors.join('; ')}"`,
      `"${(m.note || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MindCare-Mood-Export-${Date.now()}.csv`;
    a.click();
  };

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200/60">
            Wellness Analytics
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Mood History &amp; Trends
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Gain longitudinal self-awareness into emotional shifts, stress peaks, and recovery.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={exportJSON}
            className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Download className="w-4 h-4 text-teal-600" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-xs text-rose-700">
          <AlertCircle className="w-4 h-4 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Time filters */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Range:
          </span>
          {(['7', '14', '30', 'all'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeFilter(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                timeFilter === t
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              {t === 'all' ? 'All Time' : `${t} Days`}
            </button>
          ))}
        </div>

        {/* Category filters */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> State:
          </span>
          {[
            { id: 'all', label: 'All Moods' },
            { id: 'positive', label: 'Good & Great' },
            { id: 'neutral', label: 'Neutral' },
            { id: 'difficult', label: 'Low & Very Low' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setMoodFilter(cat.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                moodFilter === cat.id
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Timeline Chart (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Longitudinal Mood &amp; Stress Trend</h3>
              <p className="text-xs text-slate-500">Tracking daily fluctuations and coping stability</p>
            </div>
            <span className="text-xs text-slate-400">{filteredMoods.length} Entries Filtered</span>
          </div>

          {chronologicalData.length > 0 ? (
            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chronologicalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="histMood" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0D9488" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="histStress" x1="0" y1="0" x2="0" y2="1">
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
                    fill="url(#histMood)"
                  />
                  <Area
                    type="monotone"
                    dataKey="stress"
                    name="Stress (1-10)"
                    stroke="#6366F1"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#histStress)"
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
            <div className="h-72 flex items-center justify-center text-slate-400 text-xs">
              No entries found in this filter range.
            </div>
          )}
        </div>

        {/* Mood Distribution Breakdown (1 col) */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Mood Distribution</h3>
          {moodDistributionCounts.length > 0 ? (
            <div className="space-y-4">
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={moodDistributionCounts}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={65}
                      innerRadius={35}
                      paddingAngle={3}
                    >
                      {moodDistributionCounts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-1.5 pt-1">
                {moodDistributionCounts.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-700">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-900">{item.count} days</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-44 flex items-center justify-center text-slate-400 text-xs">
              No distribution data available.
            </div>
          )}
        </div>
      </div>

      {/* Top Triggers Radar / Bar Chart */}
      {stressorData.length > 0 && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Most Frequent Stress Triggers</h3>
          <p className="text-xs text-slate-500">Notice which academic or life areas are creating pressure</p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            {stressorData.map((st, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="text-xs font-bold text-slate-800 truncate">{st.name}</div>
                <div className="text-lg font-extrabold text-indigo-600">{st.count} entries</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Check-ins Timeline List */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-base">Detailed Check-in Log</h3>

        {filteredMoods.length > 0 ? (
          <div className="space-y-3">
            {filteredMoods.map((entry) => (
              <div
                key={entry.id}
                className="p-4 sm:p-5 rounded-2xl bg-slate-50 hover:bg-slate-100/60 border border-slate-100 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-2xl">{getMoodEmoji(entry.moodScore)}</span>
                    <span className="text-xs font-bold text-slate-900">{entry.moodLabel}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-semibold">
                      Stress: {entry.stressLevel}/10
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(entry.timestamp).toLocaleDateString(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {entry.note && (
                    <p className="text-xs text-slate-700 italic bg-white/80 p-2.5 rounded-xl border border-slate-200/60 max-w-3xl">
                      "{entry.note}"
                    </p>
                  )}

                  {entry.aiReflection && (
                    <div className="flex items-start gap-2 text-xs text-teal-800 bg-teal-50/70 p-2.5 rounded-xl border border-teal-100">
                      <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                      <span className="italic leading-relaxed">{entry.aiReflection}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {entry.emotions.map((em, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                        {em}
                      </span>
                    ))}
                    {entry.stressors.map((st, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-rose-50 border border-rose-100 text-rose-700 font-medium">
                        {st}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleDelete(entry.id)}
                    disabled={deletingId === entry.id}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete check-in"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 text-xs">
            No entries found matching this filter criteria.
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { WellnessResource } from '../types';
import {
  BookOpen,
  Phone,
  MessageSquare,
  ExternalLink,
  ShieldCheck,
  Search,
  Filter,
  Heart,
  Clock,
  Sparkles,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { CrisisModal } from '../components/common/CrisisModal';

export const ResourcesPage: React.FC = () => {
  const [resources, setResources] = useState<WellnessResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [crisisModalOpen, setCrisisModalOpen] = useState(false);

  const categories = [
    'All',
    'Crisis Lines',
    'Student & Campus',
    'Therapy & Counseling',
    'Community & Peer',
    'Self-Care & Mindfulness',
  ];

  const fetchResources = async () => {
    setLoading(true);
    try {
      const res = await api.getResources();
      setResources(res.resources);
    } catch (err: any) {
      setError(err.message || 'Failed to load resources.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const filteredResources = resources.filter((r) => {
    if (selectedCategory !== 'All' && r.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchDesc = r.description.toLowerCase().includes(q);
      const matchTag = r.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTag) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200/60">
          Professional Directory
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Verified Wellness &amp; Crisis Support
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Direct access to certified crisis lifelines, low-cost student therapy networks, and trusted peer organizations.
        </p>
      </div>

      {/* Immediate Crisis Callout */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-rose-500 via-rose-600 to-indigo-700 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">🚨</span>
            <h3 className="font-bold text-base">In Acute Distress or Emergency?</h3>
          </div>
          <p className="text-xs text-rose-100 max-w-xl">
            Free, confidential support is available right now. Call or text <strong>988</strong> (USA &amp; Canada) or text <strong>HOME to 741741</strong> to reach a compassionate counselor 24/7.
          </p>
        </div>
        <button
          onClick={() => setCrisisModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-white text-rose-700 font-bold text-xs shadow-md hover:bg-rose-50 transition-all shrink-0"
        >
          View All Emergency Helplines
        </button>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, campus, therapy..."
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="text-xs text-slate-400 self-end sm:self-center">
            Showing {filteredResources.length} verified services
          </div>
        </div>

        {/* Category buttons */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Resources Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((res) => (
          <div
            key={res.id}
            className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200/60">
                  {res.category}
                </span>
                {res.verified && (
                  <span className="text-[10px] text-teal-700 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> Verified
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base">{res.title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{res.description}</p>
              </div>

              <div className="space-y-1.5 pt-1 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>Availability: <strong>{res.availableHours}</strong></span>
                </div>
                <div className="text-slate-400">Region: {res.country}</div>
              </div>

              <div className="flex flex-wrap gap-1 pt-1">
                {res.tags.map((tag, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-600">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {res.phone && (
                  <a
                    href={`tel:${res.phone}`}
                    className="p-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 transition-colors"
                    title={`Call ${res.phone}`}
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                )}
                {res.sms && (
                  <a
                    href={`sms:${res.sms.replace(/[^0-9]/g, '')}`}
                    className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors"
                    title={`SMS ${res.sms}`}
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>
                )}
              </div>

              <a
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                <span>Visit Resource</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && !loading && (
        <div className="p-12 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
          <BookOpen className="w-8 h-8 mx-auto text-slate-300 mb-2" />
          <p className="text-xs">No resources matched your search filter.</p>
        </div>
      )}

      {/* Help-Seeking Guidance Article Section */}
      <div className="p-8 rounded-3xl bg-slate-900 text-slate-200 space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-teal-400 text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5" /> Help-Seeking Guidance
          </div>
          <h2 className="text-2xl font-bold text-white">How to Talk to Someone About Your Mental Health</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
            <strong className="text-white text-sm block">1. Preparing What to Say</strong>
            <p className="leading-relaxed">
              You don't need a polished script. Starting with simple honesty like: <em>"I've been feeling really overwhelmed lately and I think I need someone to talk to"</em> is more than enough to open the door.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
            <strong className="text-white text-sm block">2. Campus Counseling Expectations</strong>
            <p className="leading-relaxed">
              Most universities provide free initial counseling consultations covered by student health fees. Intake appointments are confidential and focused on identifying your immediate stress triggers.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
            <strong className="text-white text-sm block">3. Affordable Sliding-Scale Options</strong>
            <p className="leading-relaxed">
              If campus counseling is backed up, non-profit collectives like <strong>Open Path Collective</strong> offer licensed psychotherapy between $30 and $70 per session specifically for students.
            </p>
          </div>
        </div>
      </div>

      <CrisisModal isOpen={crisisModalOpen} onClose={() => setCrisisModalOpen(false)} />
    </div>
  );
};

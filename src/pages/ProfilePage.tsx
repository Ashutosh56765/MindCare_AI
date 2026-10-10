import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  User as UserIcon,
  Shield,
  Trash2,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Save,
  Lock,
  Mail,
  School,
  Sparkles
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateUser, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [preferredName, setPreferredName] = useState(user?.preferences?.preferredName || '');
  const [studentStatus, setStudentStatus] = useState(user?.studentStatus || 'undergraduate');
  const [institution, setInstitution] = useState(user?.institution || '');
  const [anonymousMode, setAnonymousMode] = useState<boolean>(user?.preferences?.anonymousMode ?? false);
  const [dailyReminder, setDailyReminder] = useState<boolean>(user?.preferences?.dailyReminder ?? true);
  const [dataRetentionDays, setDataRetentionDays] = useState<number>(user?.preferences?.dataRetentionDays ?? 90);

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSavedSuccess(false);

    try {
      await updateUser({
        name: name.trim(),
        studentStatus: studentStatus as any,
        institution: institution.trim(),
        preferences: {
          anonymousMode,
          dailyReminder,
          dataRetentionDays,
          preferredName: preferredName.trim() || undefined,
        },
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = async () => {
    try {
      const [moods, screenings] = await Promise.all([
        api.getMoods(200),
        api.getScreeningHistory(),
      ]);

      const exportBundle = {
        user: {
          name: user?.name,
          email: user?.email,
          createdAt: user?.createdAt,
        },
        moodEntries: moods.moods,
        screeningHistory: screenings.history,
        exportedAt: new Date().toISOString(),
      };

      const dataStr = JSON.stringify(exportBundle, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `MindCare-Account-Export-${Date.now()}.json`;
      a.click();
    } catch (err: any) {
      alert('Failed to export data: ' + err.message);
    }
  };

  const handleResetDemoData = async () => {
    if (!window.confirm('Reset all demo student data back to initial seed?')) return;
    try {
      await api.resetDemoData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    } catch (err: any) {
      alert('Failed to reset demo data: ' + err.message);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await deleteAccount();
      navigate('/');
    } catch (err: any) {
      alert('Failed to delete account: ' + err.message);
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Page Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200/60">
          Account &amp; Dignity
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Profile &amp; Privacy Control
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage your personal details, AI anonymity preferences, and data ownership.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
          <span>Your preferences have been saved successfully.</span>
        </div>
      )}

      {resetSuccess && (
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-800 flex items-center gap-2 animate-in fade-in">
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>Demo database reset to initial academic state.</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-8">
        {/* Personal Details Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-teal-600" />
            <span>Learner Identity</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Preferred First Name / Nickname
              </label>
              <input
                type="text"
                value={preferredName}
                onChange={(e) => setPreferredName(e.target.value)}
                placeholder="What should MindCare call you?"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-500 bg-slate-50 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Learner Stage</label>
              <select
                value={studentStatus}
                onChange={(e) => setStudentStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                <option value="undergraduate">Undergraduate Student</option>
                <option value="graduate">Graduate / PhD Student</option>
                <option value="high_school">High School Student</option>
                <option value="other">Lifelong Learner</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Campus or Institution</label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="e.g., Campus Name or Department"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Privacy & Confidentiality Preferences */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-teal-600" />
            <span>Privacy &amp; Data Safeguards</span>
          </h2>

          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/60 border border-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={anonymousMode}
                onChange={(e) => setAnonymousMode(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-800 block">AI Anonymity Shield</span>
                <span className="text-slate-500">
                  When enabled, your name and institution are never passed to the Gemini AI assistant.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/60 border border-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={dailyReminder}
                onChange={(e) => setDailyReminder(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-800 block">Daily Check-in Prompt Banner</span>
                <span className="text-slate-500">
                  Shows a gentle reminder on your dashboard if you haven't logged today's pulse.
                </span>
              </div>
            </label>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Data Retention Period
              </label>
              <select
                value={dataRetentionDays}
                onChange={(e) => setDataRetentionDays(parseInt(e.target.value))}
                className="w-full sm:w-64 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                <option value={30}>Keep entries for 30 days</option>
                <option value={90}>Keep entries for 90 days (Recommended)</option>
                <option value={365}>Keep entries for 1 academic year</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-md shadow-teal-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Data Export & Demo Reset Actions */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">Data Ownership &amp; Demonstration Tools</h2>
        <p className="text-xs text-slate-500">
          You own your mental health records. Download an archival JSON copy anytime.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportData}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4 text-teal-600" />
            <span>Export Complete Health Bundle (JSON)</span>
          </button>
          <button
            onClick={handleResetDemoData}
            className="px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs flex items-center gap-2 transition-colors border border-indigo-200/60"
          >
            <RotateCcw className="w-4 h-4 text-indigo-600" />
            <span>Reset Demo Seed Records</span>
          </button>
        </div>
      </div>

      {/* Danger Zone: Account Deletion */}
      <div className="p-6 sm:p-8 rounded-3xl bg-rose-50/50 border border-rose-200/80 space-y-4">
        <div>
          <h2 className="text-base font-bold text-rose-950 flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-rose-600" />
            <span>Permanent Account &amp; Data Deletion</span>
          </h2>
          <p className="text-xs text-rose-800 mt-1">
            Permanently remove your user account, all recorded mood entries, screening scores, and conversation logs. This action cannot be reversed.
          </p>
        </div>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-xs transition-colors"
        >
          Delete My Account &amp; Clear All Records
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-100 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Confirm Account Deletion</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently erase your account and all associated wellness entries? This is immediate and irreversible.
            </p>
            <div className="flex items-center justify-end gap-2 pt-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Yes, Permanently Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

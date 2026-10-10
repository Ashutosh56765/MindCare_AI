import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ScreeningRecord } from '../types';
import {
  CalendarHeart,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Phone,
  Clock,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { CrisisModal } from '../components/common/CrisisModal';

export const ScreeningPage: React.FC = () => {
  const [history, setHistory] = useState<ScreeningRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [disclaimerAgreed, setDisclaimerAgreed] = useState(false);
  const [crisisModalOpen, setCrisisModalOpen] = useState(false);
  const [activeResult, setActiveResult] = useState<ScreeningRecord | null>(null);

  const questions = [
    {
      id: 'phq4_1',
      category: 'Anxiety Subscale (GAD-2)',
      text: 'Feeling nervous, anxious, or on edge',
    },
    {
      id: 'phq4_2',
      category: 'Anxiety Subscale (GAD-2)',
      text: 'Not being able to stop or control worrying',
    },
    {
      id: 'phq4_3',
      category: 'Depression Subscale (PHQ-2)',
      text: 'Little interest or pleasure in doing things',
    },
    {
      id: 'phq4_4',
      category: 'Depression Subscale (PHQ-2)',
      text: 'Feeling down, depressed, or hopeless',
    },
  ];

  const scaleOptions = [
    { score: 0, label: 'Not at all' },
    { score: 1, label: 'Several days' },
    { score: 2, label: 'More than half the days' },
    { score: 3, label: 'Nearly every day' },
  ];

  const [answers, setAnswers] = useState<Record<string, number>>({
    phq4_1: 0,
    phq4_2: 0,
    phq4_3: 0,
    phq4_4: 0,
  });

  const loadHistory = async () => {
    setLoading(true);
    try {
      const res = await api.getScreeningHistory();
      setHistory(res.history);
      if (res.history.length > 0 && !activeResult) {
        setActiveResult(res.history[0]);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleScoreChange = (qId: string, score: number) => {
    setAnswers((prev) => ({ ...prev, [qId]: score }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disclaimerAgreed) {
      setError('Please acknowledge the non-diagnostic clinical disclaimer before proceeding.');
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const payloadAnswers = questions.map((q) => ({
        questionId: q.id,
        questionText: q.text,
        score: answers[q.id] || 0,
      }));

      const res = await api.submitScreening({
        questionnaireType: 'PHQ-4',
        answers: payloadAnswers,
        isDisclaimerAcknowledged: true,
      });

      setActiveResult(res.record);
      await loadHistory();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'None/Minimal':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Mild':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'Moderate':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Severe':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200/60">
          Evidence-Informed Instrument
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          PHQ-4 Wellness Screening
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          A standardized 4-question ultra-brief reflection tool to gauge psychological strain and anxiety over the past 2 weeks.
        </p>
      </div>

      {/* Prominent Non-Diagnostic Clinical Disclaimer */}
      <div className="p-5 rounded-3xl bg-amber-50/70 border border-amber-200/80 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
          <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Non-Diagnostic Educational Disclosure</span>
        </div>
        <p className="text-xs text-amber-800 leading-relaxed">
          This screening is an <strong>educational self-awareness tool</strong>, not a clinical psychiatric diagnosis or medical evaluation. Elevated scores simply indicate areas where added self-care, campus counseling, or discussing your feelings with a physician or therapist could be beneficial.
        </p>
      </div>

      {/* Active / Latest Screening Result Display (if exists) */}
      {activeResult && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-teal-100 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Screening Evaluation Summary
              </span>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mt-0.5">
                <span>Total Score: {activeResult.totalScore} / 12</span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getSeverityBadge(activeResult.severity)}`}>
                  {activeResult.severity}
                </span>
              </h2>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Completed {new Date(activeResult.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>

          {/* Subscales breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100 space-y-1">
              <div className="text-xs font-bold text-teal-900">Anxiety Subscale (GAD-2)</div>
              <div className="text-xl font-extrabold text-teal-700">{activeResult.anxietyScore} / 6</div>
              <p className="text-[11px] text-slate-500">Measures worry and tension indicators</p>
            </div>
            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-1">
              <div className="text-xs font-bold text-indigo-900">Depression Subscale (PHQ-2)</div>
              <div className="text-xl font-extrabold text-indigo-700">{activeResult.depressionScore} / 6</div>
              <p className="text-[11px] text-slate-500">Measures mood and loss of interest/anhedonia</p>
            </div>
          </div>

          {/* Clinical Interpretation */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <h3 className="text-xs font-bold text-slate-800">Interpretation</h3>
            <p className="text-xs text-slate-700 leading-relaxed">{activeResult.explanation}</p>
          </div>

          {/* Recommendations */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-800">Supportive Recommended Steps:</h3>
            <div className="space-y-1.5">
              {activeResult.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Crisis Banner if moderate or severe */}
          {(activeResult.severity === 'Moderate' || activeResult.severity === 'Severe') && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="font-bold text-rose-900 text-xs">Remember: You are never alone.</span>
                <p className="text-[11px] text-rose-700 mt-0.5">Free 24/7 counselors are ready to support you without judgment.</p>
              </div>
              <button
                onClick={() => setCrisisModalOpen(true)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors shrink-0"
              >
                Connect with 988 Crisis Line
              </button>
            </div>
          )}
        </div>
      )}

      {/* New Screening Form */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-8">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Take a New Screening</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Over the <strong>last 2 weeks</strong>, how often have you been bothered by the following problems?
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-6">
          {questions.map((q, idx) => (
            <div key={q.id} className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="font-bold text-xs sm:text-sm text-slate-900">
                  {idx + 1}. {q.text}
                </span>
                <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded-md self-start sm:self-auto">
                  {q.category}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {scaleOptions.map((opt) => {
                  const isChecked = answers[q.id] === opt.score;
                  return (
                    <button
                      key={opt.score}
                      type="button"
                      onClick={() => handleScoreChange(q.id, opt.score)}
                      className={`p-3 rounded-xl border text-center text-xs transition-all ${
                        isChecked
                          ? 'bg-teal-600 text-white font-bold border-teal-600 shadow-2xs'
                          : 'bg-white hover:bg-slate-100/80 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="font-bold text-sm mb-0.5">{opt.score}</div>
                      <div className="text-[11px] leading-tight">{opt.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Consent Checkbox */}
        <div className="pt-2">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={disclaimerAgreed}
              onChange={(e) => setDisclaimerAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 shrink-0"
            />
            <span className="text-xs text-slate-700 leading-normal">
              I acknowledge that this questionnaire is an informational reflection tool and <strong className="text-slate-900">not a clinical diagnosis</strong>. I understand that for medical guidance, I should consult a doctor or licensed mental health professional.
            </span>
          </label>
        </div>

        <div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-6 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{submitting ? 'Calculating Transparent Score...' : 'Calculate &amp; View Results'}</span>
          </button>
        </div>
      </form>

      {/* Historical Screenings Table / Cards */}
      {history.length > 0 && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Past Screening History</h3>
          <div className="space-y-3">
            {history.map((record) => (
              <div
                key={record.id}
                onClick={() => setActiveResult(record)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  activeResult?.id === record.id
                    ? 'border-teal-500 bg-teal-50/40 ring-1 ring-teal-500'
                    : 'border-slate-100 bg-slate-50 hover:bg-slate-100/60'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">
                      Score: {record.totalScore}/12
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getSeverityBadge(record.severity)}`}>
                      {record.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Anxiety: {record.anxietyScore}/6 &bull; Depression: {record.depressionScore}/6
                  </p>
                </div>
                <div className="text-xs text-slate-400">
                  {new Date(record.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <CrisisModal isOpen={crisisModalOpen} onClose={() => setCrisisModalOpen(false)} />
    </div>
  );
};

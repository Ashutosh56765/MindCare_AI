import React, { useState } from 'react';
import { AlertTriangle, Phone, ShieldAlert, Heart, X, ExternalLink } from 'lucide-react';

export const CrisisModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [breatheCount, setBreatheCount] = useState(4);
  const [breathePhase, setBreathePhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');

  React.useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setBreatheCount((prev) => {
        if (prev <= 1) {
          setBreathePhase((current) => {
            if (current === 'Inhale') return 'Hold';
            if (current === 'Hold') return 'Exhale';
            if (current === 'Exhale') return 'Rest';
            return 'Inhale';
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-rose-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Immediate Support &amp; Crisis Services</h3>
              <p className="text-xs text-slate-500">Free, confidential, and available 24 hours a day, 7 days a week</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Immediate Calm Pacer */}
        <div className="my-5 p-4 rounded-2xl bg-gradient-to-r from-teal-50 to-indigo-50 border border-teal-100/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-teal-500 text-white font-bold flex items-center justify-center text-lg shadow-sm">
              {breatheCount}
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-teal-700">Calming Breath Pacer</div>
              <div className="text-base font-bold text-slate-800">{breathePhase}... Take a slow, gentle breath</div>
            </div>
          </div>
          <Heart className="w-6 h-6 text-teal-600 animate-pulse hidden sm:block" />
        </div>

        <div className="space-y-3.5 mb-6">
          {/* 988 */}
          <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 hover:border-rose-200 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-base">988 Suicide &amp; Crisis Lifeline</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">USA &amp; Canada</span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">Call or text 988. Free, confidential, English &amp; Spanish.</p>
            </div>
            <div className="flex gap-2">
              <a
                href="tel:988"
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs rounded-xl shadow-sm inline-flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" /> Call 988
              </a>
              <a
                href="sms:988"
                className="px-3 py-2 bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 font-medium text-xs rounded-xl shadow-sm inline-flex items-center gap-1.5 transition-colors"
              >
                Text 988
              </a>
            </div>
          </div>

          {/* Crisis Text Line */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 hover:border-indigo-200 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-base">Crisis Text Line</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">US, UK, Canada</span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">Text HOME to 741741 to connect with a volunteer counselor.</p>
            </div>
            <a
              href="sms:741741?body=HOME"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-xl shadow-sm inline-flex items-center gap-1.5 transition-colors"
            >
              Text HOME to 741741
            </a>
          </div>

          {/* Trevor Project */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 hover:border-amber-200 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-base">The Trevor Project</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">LGBTQ+ Youth</span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">Call 1-866-488-7386 or text START to 678-678.</p>
            </div>
            <a
              href="tel:18664887386"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs rounded-xl shadow-sm inline-flex items-center gap-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" /> Call Trevor
            </a>
          </div>

          {/* International */}
          <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-base">International Crisis Directory</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">Worldwide</span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">Find emergency helplines in the UK (111), Australia (13 11 14), Europe, and Asia.</p>
            </div>
            <a
              href="https://www.befrienders.org"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs rounded-xl shadow-sm inline-flex items-center gap-1.5 transition-colors"
            >
              <span>Global Directory</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-600 text-[11px] leading-relaxed">
          <strong>Important Clinical Notice:</strong> MindCare AI provides supportive wellness tools, mood reflections, and psychoeducation. It does not provide medical diagnosis, emergency medical assistance, or therapy. If you or someone you know is in immediate physical danger, call your local emergency services (such as 911 in the US) or go to the nearest hospital emergency room.
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold transition-colors"
          >
            I Understand — Back to MindCare
          </button>
        </div>
      </div>
    </div>
  );
};

export const CrisisBanner: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white text-xs py-2 px-4 shadow-sm relative z-30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-rose-500/20 text-rose-300">
              <AlertTriangle className="w-3.5 h-3.5" />
            </span>
            <span className="text-slate-200">
              In distress or feeling overwhelmed? <strong className="text-white font-semibold">Help is free, private &amp; 24/7.</strong> Call or text <span className="underline decoration-teal-400 font-bold text-white">988</span> (US/CA) or text <span className="underline decoration-indigo-400 font-bold text-white">HOME to 741741</span>.
            </span>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-rose-500/90 hover:bg-rose-500 text-white text-[11px] font-semibold px-3 py-1 rounded-full border border-rose-400/40 shadow-sm transition-all flex items-center gap-1.5 shrink-0"
          >
            <Phone className="w-3 h-3" />
            <span>Crisis Helplines &amp; Pacer</span>
          </button>
        </div>
      </div>
      <CrisisModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

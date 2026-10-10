import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldAlert, Award, ExternalLink, Presentation } from 'lucide-react';
import { CrisisModal } from '../common/CrisisModal';
import { SdgModal } from '../presentation/SdgModal';

export const Footer: React.FC = () => {
  const [crisisOpen, setCrisisOpen] = useState(false);
  const [sdgOpen, setSdgOpen] = useState(false);

  return (
    <>
      <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
            {/* Column 1: Brand & SDG */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center text-white shadow-md shadow-teal-500/30">
                  <Heart className="w-5 h-5 fill-white/20" />
                </div>
                <span className="font-heading font-extrabold text-xl tracking-tight text-white">
                  MindCare<span className="text-teal-400">AI</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                An empathetic, generative AI-powered mental wellness support platform designed for students and young adults navigating academic pressure, stress, and anxiety.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-950/60 border border-teal-800/80 text-teal-300 text-xs">
                <Award className="w-4 h-4 text-teal-400" />
                <span>Aligned with UN SDG 3: Good Health and Well-being</span>
              </div>
            </div>

            {/* Column 2: Navigation */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase font-bold tracking-wider text-slate-200">Wellness Tools</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link to="/chat" className="text-slate-400 hover:text-teal-300 transition-colors">
                    AI Mental Wellness Chat
                  </Link>
                </li>
                <li>
                  <Link to="/mood-checkin" className="text-slate-400 hover:text-teal-300 transition-colors">
                    Daily Mood Check-in
                  </Link>
                </li>
                <li>
                  <Link to="/screening" className="text-slate-400 hover:text-teal-300 transition-colors">
                    PHQ-4 Wellness Screening
                  </Link>
                </li>
                <li>
                  <Link to="/self-care" className="text-slate-400 hover:text-teal-300 transition-colors">
                    Box Breathing &amp; Grounding
                  </Link>
                </li>
                <li>
                  <Link to="/history" className="text-slate-400 hover:text-teal-300 transition-colors">
                    Mood History &amp; Charts
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Resources & Support */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase font-bold tracking-wider text-slate-200">Support &amp; Project</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link to="/resources" className="text-slate-400 hover:text-teal-300 transition-colors">
                    Verified Resource Centre
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => setSdgOpen(true)}
                    className="text-left text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                  >
                    <Presentation className="w-3.5 h-3.5" />
                    <span>Academic Project Deck (12 Slides)</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCrisisOpen(true)}
                    className="text-left text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Immediate Crisis Helplines</span>
                  </button>
                </li>
                <li>
                  <a
                    href="https://sdgs.un.org/goals/goal3"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-teal-300 transition-colors flex items-center gap-1"
                  >
                    <span>UN SDG 3 Official Target 3.4</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Urgent Help Card */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
                <ShieldAlert className="w-4 h-4" />
                <span>24/7 Crisis Hotline</span>
              </div>
              <p className="text-[11px] text-slate-300">
                If you are in distress or having thoughts of self-harm, please connect with trained compassionate counselors:
              </p>
              <div className="pt-1">
                <button
                  onClick={() => setCrisisOpen(true)}
                  className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors text-center"
                >
                  Call or Text 988 (USA/CA)
                </button>
              </div>
            </div>
          </div>

          {/* Clinical Disclaimer & Copyright */}
          <div className="pt-8 space-y-4">
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              <span className="font-semibold text-slate-300">Non-Diagnostic &amp; Ethical AI Notice:</span> MindCare AI is an educational and supportive mental wellness companion designed to encourage emotional self-reflection and healthy habits. It is <strong className="text-slate-300">not a licensed medical provider, diagnostic instrument, or clinical psychotherapy service</strong>. The screening assessments and AI responses do not substitute for professional medical advice, evaluation, diagnosis, or treatment.
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
              <div>
                &copy; {new Date().getFullYear()} MindCare AI. Built in support of UN Sustainable Development Goal 3 (Good Health and Well-being).
              </div>
              <div className="flex items-center gap-4">
                <Link to="/profile" className="hover:text-slate-400">
                  Privacy Settings
                </Link>
                <span>&bull;</span>
                <span>Zero Ads</span>
                <span>&bull;</span>
                <span>100% Student-First</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <CrisisModal isOpen={crisisOpen} onClose={() => setCrisisOpen(false)} />
      <SdgModal isOpen={sdgOpen} onClose={() => setSdgOpen(false)} />
    </>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Compass, ArrowRight, Wind } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 text-center">
      <div className="max-w-md w-full space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto text-3xl shadow-sm border border-teal-100">
          <Compass className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200/60">
            404 &bull; Page Not Found
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            You've Found an Uncharted Trail
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Take a gentle breath. Even when we step off the intended path, we can always find our way back to calm.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2"
          >
            <span>Return to Home Harbor</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/self-care"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200 transition-all flex items-center justify-center gap-2"
          >
            <Wind className="w-4 h-4 text-teal-600" />
            <span>Practice 4-4-4-4 Breath</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

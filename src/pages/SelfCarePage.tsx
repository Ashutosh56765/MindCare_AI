import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Wind,
  Sparkles,
  BookOpen,
  Clock,
  Moon,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Download,
  Flame,
  Volume2,
  VolumeX
} from 'lucide-react';

export const SelfCarePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'breathing' | 'grounding' | 'journal' | 'study' | 'sleep'>('breathing');

  // -------------------------------------------------------------
  // 1. BREATHING PACER STATE
  // -------------------------------------------------------------
  const [breathMode, setBreathMode] = useState<'box' | '478' | 'coherent'>('box');
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [breathSecondsLeft, setBreathSecondsLeft] = useState(4);
  const [breathCycles, setBreathCycles] = useState(0);

  const breathConfigs = {
    box: { name: 'Box Breathing (4-4-4-4)', inhale: 4, hold: 4, exhale: 4, rest: 4, desc: 'Used by athletes and first responders to stabilize heart rate and panic.' },
    '478': { name: '4-7-8 Relaxing (Sleep & Calm)', inhale: 4, hold: 7, exhale: 8, rest: 0, desc: 'Natural tranquilizer for the nervous system, ideal before bedtime.' },
    coherent: { name: 'Coherent Breathing (5-5)', inhale: 5, hold: 0, exhale: 5, rest: 0, desc: 'Balances autonomic nervous system and promotes emotional clarity.' },
  };

  useEffect(() => {
    if (!isBreathingActive) return;

    const timer = setInterval(() => {
      setBreathSecondsLeft((prev) => {
        if (prev <= 1) {
          const cfg = breathConfigs[breathMode];
          // Determine next phase
          if (breathPhase === 'Inhale') {
            if (cfg.hold > 0) {
              setBreathPhase('Hold');
              return cfg.hold;
            } else {
              setBreathPhase('Exhale');
              return cfg.exhale;
            }
          } else if (breathPhase === 'Hold') {
            setBreathPhase('Exhale');
            return cfg.exhale;
          } else if (breathPhase === 'Exhale') {
            if (cfg.rest > 0) {
              setBreathPhase('Rest');
              return cfg.rest;
            } else {
              setBreathCycles((c) => c + 1);
              setBreathPhase('Inhale');
              return cfg.inhale;
            }
          } else {
            // Rest -> Inhale
            setBreathCycles((c) => c + 1);
            setBreathPhase('Inhale');
            return cfg.inhale;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isBreathingActive, breathPhase, breathMode]);

  const toggleBreathing = () => {
    if (!isBreathingActive) {
      setBreathSecondsLeft(breathConfigs[breathMode].inhale);
      setBreathPhase('Inhale');
      setIsBreathingActive(true);
    } else {
      setIsBreathingActive(false);
    }
  };

  const resetBreathing = () => {
    setIsBreathingActive(false);
    setBreathPhase('Inhale');
    setBreathSecondsLeft(breathConfigs[breathMode].inhale);
    setBreathCycles(0);
  };

  // -------------------------------------------------------------
  // 2. 5-4-3-2-1 GROUNDING STATE
  // -------------------------------------------------------------
  const [groundingChecks, setGroundingChecks] = useState<Record<string, boolean>>({});

  const groundingSteps = [
    { key: 'see', count: 5, title: '5 Things you can SEE', desc: 'Look around you: a pen, a plant, sunlight on the wall, a book spine, a texture on your sleeve.' },
    { key: 'touch', count: 4, title: '4 Things you can TOUCH', desc: 'Feel your feet grounded on the floor, the fabric of your jeans, the cool edge of your desk, your watch.' },
    { key: 'hear', count: 3, title: '3 Things you can HEAR', desc: 'Listen closely: birds outside, the hum of your laptop fan, distant traffic, your own breath.' },
    { key: 'smell', count: 2, title: '2 Things you can SMELL', desc: 'Notice the aroma of your morning coffee, hand soap, fresh air from a window, or paper.' },
    { key: 'taste', count: 1, title: '1 Thing you can TASTE', desc: 'A sip of cold water, the lingering flavor of tea, a mint, or simply swallow and notice.' },
  ];

  const toggleGroundingCheck = (key: string) => {
    const updated = { ...groundingChecks, [key]: !groundingChecks[key] };
    setGroundingChecks(updated);

    // If all completed, trigger gentle confetti celebration
    const allDone = groundingSteps.every((s) => updated[s.key]);
    if (allDone) {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    }
  };

  // -------------------------------------------------------------
  // 3. GUIDED JOURNALING STATE
  // -------------------------------------------------------------
  const journalingPrompts = [
    { category: 'Academic Stress', prompt: 'What is one pressure I am carrying today that I can give myself permission to set down for an hour?' },
    { category: 'Self-Compassion', prompt: 'If my closest friend was experiencing the exact same struggle I am facing, what gentle words would I say to them?' },
    { category: 'Evening Decompression', prompt: 'What is one small thing that went reasonably well today, no matter how tiny or ordinary?' },
    { category: 'Future Anxiety', prompt: 'What is one thing within my direct control today, versus what is completely outside my control?' },
  ];

  const [selectedPromptIndex, setSelectedPromptIndex] = useState(0);
  const [journalContent, setJournalContent] = useState('');
  const [savedJournalNotes, setSavedJournalNotes] = useState<string[]>([]);

  const saveJournal = () => {
    if (!journalContent.trim()) return;
    setSavedJournalNotes((prev) => [journalContent, ...prev]);
    setJournalContent('');
    confetti({ particleCount: 30, spread: 45 });
  };

  const downloadJournal = () => {
    const text = `MindCare AI Self-Care Reflection\nDate: ${new Date().toLocaleDateString()}\nPrompt: ${journalingPrompts[selectedPromptIndex].prompt}\n\nReflection:\n${journalContent}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MindCare-Reflection-${Date.now()}.txt`;
    a.click();
  };

  // -------------------------------------------------------------
  // 4. STUDY BREAK POMODORO STATE
  // -------------------------------------------------------------
  const [studySeconds, setStudySeconds] = useState(25 * 60);
  const [studyRunning, setStudyRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    if (!studyRunning) return;
    const interval = setInterval(() => {
      setStudySeconds((prev) => {
        if (prev <= 1) {
          if (!isBreak) {
            setIsBreak(true);
            confetti({ particleCount: 35, spread: 60 });
            return 5 * 60; // 5 min break
          } else {
            setIsBreak(false);
            return 25 * 60; // 25 min study
          }
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [studyRunning, isBreak]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // -------------------------------------------------------------
  // 5. SLEEP HYGIENE CHECKLIST
  // -------------------------------------------------------------
  const [sleepChecks, setSleepChecks] = useState<Record<number, boolean>>({});
  const sleepTips = [
    'Digital Sunset: Put phone and laptop on night mode or away 30 minutes before sleep.',
    'Brain Dump: Write down tomorrow\'s 3 key tasks on a notepad to release cognitive loop.',
    'Room Temperature: Keep your bedroom cool (~65°F / 18°C) for optimal melatonin release.',
    'Consistent Wake Window: Aim to wake up at the same hour, even on weekends, to stabilize circadian rhythm.',
    'Caffeine Cut-off: Cease coffee, energy drinks, and black tea at least 8 hours prior to bedtime.'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Page Title */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200/60">
          Personalized Self-Care
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Nervous System Rest &amp; Regulation
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Evidence-informed somatic grounding, breath pacing, and mindful breaks designed for busy students.
        </p>
      </div>

      {/* Tabs Selector */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200/80 max-w-2xl mx-auto">
        <button
          onClick={() => setActiveTab('breathing')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'breathing'
              ? 'bg-white text-teal-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Wind className="w-3.5 h-3.5" />
          <span>Breath Pacer</span>
        </button>
        <button
          onClick={() => setActiveTab('grounding')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'grounding'
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>5-4-3-2-1 Grounding</span>
        </button>
        <button
          onClick={() => setActiveTab('journal')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'journal'
              ? 'bg-white text-purple-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Reflective Journal</span>
        </button>
        <button
          onClick={() => setActiveTab('study')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'study'
              ? 'bg-white text-amber-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Study Break Timer</span>
        </button>
        <button
          onClick={() => setActiveTab('sleep')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'sleep'
              ? 'bg-white text-sky-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Moon className="w-3.5 h-3.5" />
          <span>Sleep Hygiene</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: BREATH PACER */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'breathing' && (
        <div className="p-6 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-8 animate-in fade-in">
          {/* Mode Selector */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {(['box', '478', 'coherent'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  setBreathMode(mode);
                  resetBreathing();
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  breathMode === mode
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {breathConfigs[mode].name}
              </button>
            ))}
          </div>

          <p className="text-xs text-slate-500 text-center max-w-md mx-auto">
            {breathConfigs[breathMode].desc}
          </p>

          {/* Visual Breathing Circle */}
          <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
            {/* Outer pulsating glow */}
            <div
              className={`absolute inset-0 rounded-full transition-all duration-1000 ${
                isBreathingActive
                  ? breathPhase === 'Inhale'
                    ? 'scale-115 bg-teal-100/60 shadow-xl shadow-teal-500/20'
                    : breathPhase === 'Exhale'
                    ? 'scale-90 bg-indigo-50/60 shadow-xs'
                    : 'scale-105 bg-teal-50/80 shadow-md shadow-teal-500/10'
                  : 'bg-slate-100/60 scale-95'
              }`}
            />

            {/* Inner Core Ball */}
            <div className="relative z-10 w-44 h-44 rounded-full bg-gradient-to-tr from-teal-500 to-indigo-600 text-white flex flex-col items-center justify-center shadow-lg transition-transform duration-700">
              <span className="text-3xl font-extrabold tracking-tight">
                {isBreathingActive ? breathSecondsLeft : 'Ready'}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-100 mt-1">
                {isBreathingActive ? breathPhase : 'Press Start'}
              </span>
            </div>
          </div>

          {/* Stats & Controls */}
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="text-xs text-slate-500">
              Completed Cycles: <strong className="text-slate-800">{breathCycles}</strong>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleBreathing}
                className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-md shadow-teal-600/20 transition-all flex items-center gap-2"
              >
                {isBreathingActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isBreathingActive ? 'Pause Breath' : 'Start Breath Session'}</span>
              </button>
              <button
                onClick={resetBreathing}
                className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                title="Reset session"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: 5-4-3-2-1 GROUNDING */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'grounding' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6 animate-in fade-in">
          <div>
            <h3 className="font-bold text-slate-900 text-base">5-4-3-2-1 Sensory Grounding Technique</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              When panic, dissociation, or acute worry hits, reconnect with the physical room through your senses.
            </p>
          </div>

          <div className="space-y-4">
            {groundingSteps.map((step) => {
              const isChecked = !!groundingChecks[step.key];
              return (
                <div
                  key={step.key}
                  onClick={() => toggleGroundingCheck(step.key)}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                    isChecked
                      ? 'bg-teal-50/60 border-teal-300 ring-1 ring-teal-400'
                      : 'bg-slate-50/80 hover:bg-slate-50 border-slate-200/80'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold transition-colors ${
                      isChecked ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isChecked ? <CheckCircle2 className="w-4 h-4" /> : step.count}
                  </div>
                  <div className="space-y-1">
                    <h4 className={`text-xs sm:text-sm font-bold ${isChecked ? 'text-teal-900' : 'text-slate-800'}`}>
                      {step.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: GUIDED JOURNALING */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'journal' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6 animate-in fade-in">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Guided Reflective Journal</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Unpack cognitive knots. Writing externalizes thoughts and eases emotional cognitive load.
            </p>
          </div>

          {/* Prompts list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {journalingPrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedPromptIndex(idx)}
                className={`p-3.5 rounded-2xl border text-left text-xs transition-all ${
                  selectedPromptIndex === idx
                    ? 'bg-purple-50 border-purple-300 text-purple-950 font-semibold ring-1 ring-purple-300'
                    : 'bg-slate-50 hover:bg-slate-100/70 border-slate-200 text-slate-700'
                }`}
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-purple-700 mb-0.5">
                  {p.category}
                </div>
                <div>{p.prompt}</div>
              </button>
            ))}
          </div>

          {/* Active Prompt Box */}
          <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 text-xs text-purple-900 font-medium">
            <strong>Today's Prompt:</strong> {journalingPrompts[selectedPromptIndex].prompt}
          </div>

          <textarea
            value={journalContent}
            onChange={(e) => setJournalContent(e.target.value)}
            rows={5}
            placeholder="Type your reflection here. No filter or judgment required..."
            className="w-full p-4 rounded-2xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={downloadJournal}
              disabled={!journalContent.trim()}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-40"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download (.txt)</span>
            </button>
            <button
              onClick={saveJournal}
              disabled={!journalContent.trim()}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-40"
            >
              Save Reflection Note
            </button>
          </div>

          {savedJournalNotes.length > 0 && (
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-bold text-slate-800">Saved Today:</h4>
              {savedJournalNotes.map((note, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-slate-50 text-xs text-slate-700 italic border border-slate-100">
                  "{note}"
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4: STUDY BREAK TIMER */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'study' && (
        <div className="p-6 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-8 animate-in fade-in text-center">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              {isBreak ? '🌿 Mindful 5-Minute Recovery Break' : '📚 25-Minute Focused Study Interval'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isBreak
                ? 'Step away from screens. Hydrate, stretch your spine, or look at something 20 feet away.'
                : 'Commit to single-task focus. When the timer finishes, enjoy a restorative micro-break.'}
            </p>
          </div>

          <div className="text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-900 font-mono">
            {formatTimer(studySeconds)}
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setStudyRunning(!studyRunning)}
              className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-md shadow-amber-600/20 transition-all flex items-center gap-2"
            >
              {studyRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{studyRunning ? 'Pause Interval' : 'Start Focus Timer'}</span>
            </button>
            <button
              onClick={() => {
                setStudyRunning(false);
                setIsBreak(false);
                setStudySeconds(25 * 60);
              }}
              className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Reset timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 max-w-md mx-auto text-xs text-amber-900 text-left">
            <strong>The 20-20-20 Rule for Eye Strain:</strong> Every 20 minutes, look at an object 20 feet away for at least 20 seconds to relax your optic nerves.
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 5: SLEEP HYGIENE */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'sleep' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6 animate-in fade-in">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Student Sleep Hygiene Ritual</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Sleep is the foundation of cognitive recall and emotional regulation. Check off your evening anchors:
            </p>
          </div>

          <div className="space-y-3">
            {sleepTips.map((tip, idx) => {
              const checked = !!sleepChecks[idx];
              return (
                <div
                  key={idx}
                  onClick={() => setSleepChecks({ ...sleepChecks, [idx]: !checked })}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                    checked
                      ? 'bg-sky-50 border-sky-300 ring-1 ring-sky-300'
                      : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200/80'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                      checked ? 'bg-sky-600 text-white' : 'border border-slate-300'
                    }`}
                  >
                    {checked && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <span className={`text-xs ${checked ? 'text-sky-950 font-semibold' : 'text-slate-700'}`}>
                    {tip}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ChatMessage } from '../types';
import {
  Send,
  Sparkles,
  ShieldAlert,
  Wind,
  RotateCcw,
  Copy,
  Check,
  Heart,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { CrisisModal } from '../components/common/CrisisModal';

export const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: `Hello ${user?.preferences?.preferredName || user?.name?.split(' ')[0] || 'Friend'}, I'm your MindCare companion. 🌿\n\nI'm here to offer a calm, non-judgmental space to reflect on academic pressure, stress, or whatever is weighing on your mind.\n\nHow have you been feeling today?`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [crisisModalOpen, setCrisisModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const promptStarters = [
    'I feel completely overwhelmed by upcoming exam deadlines',
    'My heart is racing and I need help grounding right now',
    'I can\'t sleep because my mind is spinning through tomorrow',
    'I\'m experiencing imposter syndrome and feeling isolated',
  ];

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Build history for backend AI
      const historyPayload = messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

      const botReply = await api.sendChatMessage(text, historyPayload);

      setMessages((prev) => [
        ...prev,
        {
          id: botReply.id || `bot-${Date.now()}`,
          role: 'assistant',
          content: botReply.content,
          timestamp: botReply.timestamp || new Date().toISOString(),
          isCrisisWarning: botReply.isCrisisWarning,
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: 'assistant',
          content: 'I am here with you, though my connection flickered for a moment. Please take a deep breath. Would you like to try our 4-minute guided breathing tool or talk through what feels heaviest right now?',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        role: 'assistant',
        content: `Welcome back to a fresh moment. How is your body feeling right now? Take a gentle breath before you type.`,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 h-[calc(100vh-8rem)] flex flex-col">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs mb-4 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-teal-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900">MindCare Companion</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold uppercase tracking-wider">
                Supportive &bull; Safe
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Non-diagnostic wellness listening partner powered by Gemini 3.8 Flash
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCrisisModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-semibold flex items-center gap-1 transition-colors"
            title="Immediate Crisis Resources"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Crisis (988)</span>
          </button>
          <button
            onClick={handleResetChat}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors"
            title="Reset conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="mb-3 px-4 py-2 rounded-2xl bg-teal-50/70 border border-teal-100 text-[11px] text-teal-900 flex items-center justify-between shrink-0">
        <span className="flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <span>MindCare AI does not diagnose or replace clinical treatment. Conversations are strictly confidential.</span>
        </span>
        <button
          onClick={() => setCrisisModalOpen(true)}
          className="text-teal-700 underline font-semibold hover:text-teal-900 ml-2 shrink-0"
        >
          Helplines
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 px-2 py-2 pr-3">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 text-sm font-bold mt-1">
                  🌿
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 shadow-xs text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-teal-600 text-white rounded-tr-xs'
                    : msg.isCrisisWarning
                    ? 'bg-rose-50 border-2 border-rose-300 text-rose-950 rounded-tl-xs'
                    : 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-xs'
                }`}
              >
                {msg.isCrisisWarning && (
                  <div className="flex items-center gap-2 pb-2 mb-2 border-b border-rose-200 text-rose-700 font-bold text-xs">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Immediate Crisis Support Alert</span>
                  </div>
                )}

                <div className="whitespace-pre-wrap">{msg.content}</div>

                <div
                  className={`mt-2 flex items-center justify-between gap-2 text-[10px] ${
                    isUser ? 'text-teal-100' : 'text-slate-400'
                  }`}
                >
                  <span>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {!isUser && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="hover:text-slate-700 transition-colors flex items-center gap-1"
                      title="Copy advice"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-teal-600" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 text-xs font-bold mt-1">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 text-sm font-bold mt-1">
              🌿
            </div>
            <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs rounded-tl-xs flex items-center gap-2 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 text-slate-400">MindCare is reflecting thoughtfully...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Starters (if conversation is short) */}
      {messages.length <= 3 && !loading && (
        <div className="py-2 shrink-0">
          <div className="text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
            <HelpCircle className="w-3 h-3" /> Quick Student Prompts:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {promptStarters.map((starter, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(starter)}
                className="text-[11px] px-3 py-1.5 rounded-full bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 hover:border-teal-300 transition-all text-left shadow-2xs"
              >
                {starter}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="pt-2 shrink-0"
      >
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Share how you're feeling, or what's on your mind..."
            disabled={loading}
            className="w-full pl-4 pr-24 py-3.5 rounded-2xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-xs disabled:opacity-60 transition-all"
          />
          <div className="absolute right-2 flex items-center gap-1">
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="text-center pt-2">
          <p className="text-[10px] text-slate-400">
            For emergencies, call or text <strong>988</strong> immediately. MindCare AI provides wellness reflection and does not replace medical treatment.
          </p>
        </div>
      </form>

      <CrisisModal isOpen={crisisModalOpen} onClose={() => setCrisisModalOpen(false)} />
    </div>
  );
};

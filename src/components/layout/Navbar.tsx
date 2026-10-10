import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Heart,
  MessageSquare,
  Sparkles,
  BarChart2,
  BookOpen,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  Presentation,
  ShieldAlert,
  CalendarHeart,
  Smile,
  Compass
} from 'lucide-react';
import { CrisisModal } from '../common/CrisisModal';
import { SdgModal } from '../presentation/SdgModal';

export const Navbar: React.FC = () => {
  const { user, logout, loginDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [crisisModalOpen, setCrisisModalOpen] = useState(false);
  const [sdgModalOpen, setSdgModalOpen] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: BarChart2, authRequired: true },
    { label: 'AI Companion', path: '/chat', icon: MessageSquare },
    { label: 'Check-in', path: '/mood-checkin', icon: Smile, authRequired: true },
    { label: 'Screening', path: '/screening', icon: CalendarHeart, authRequired: true },
    { label: 'Self-Care', path: '/self-care', icon: Sparkles },
    { label: 'History', path: '/history', icon: Compass, authRequired: true },
    { label: 'Resources', path: '/resources', icon: BookOpen },
  ];

  const handleDemoClick = async () => {
    setIsDemoLoading(true);
    try {
      await loginDemo();
      navigate('/dashboard');
    } catch (err) {
      console.error('Demo login failed:', err);
    } finally {
      setIsDemoLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 via-teal-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
                  <Heart className="w-5 h-5 fill-white/20 stroke-[2.2]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-heading font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
                      MindCare<span className="text-teal-600 font-bold ml-0.5">AI</span>
                    </span>
                    <span className="text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-teal-100 text-teal-800 uppercase hidden sm:inline-block">
                      SDG 3
                    </span>
                  </div>
                  <div className="text-[10px] font-medium text-slate-400 hidden sm:block">Mental Wellness Support</div>
                </div>
              </Link>
            </div>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                if (link.authRequired && !user) return null;
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      active
                        ? 'bg-teal-50 text-teal-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${active ? 'text-teal-600' : 'text-slate-400'}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Action buttons on right */}
            <div className="hidden sm:flex items-center gap-2.5">
              {/* SDG 3 Presentation Deck Trigger */}
              <button
                onClick={() => setSdgModalOpen(true)}
                title="View Academic SDG 3 Project Deck"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 transition-colors border border-indigo-100"
              >
                <Presentation className="w-3.5 h-3.5 text-indigo-600" />
                <span>SDG 3 Deck</span>
              </button>

              {/* Crisis Quick Access Button */}
              <button
                onClick={() => setCrisisModalOpen(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100/80 transition-colors border border-rose-200"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                <span>988 Help</span>
              </button>

              {user ? (
                /* Authenticated User Menu */
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1 pl-2.5 pr-2 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all text-xs font-semibold text-slate-800"
                  >
                    <span className="max-w-[100px] truncate">{user.preferences?.preferredName || user.name}</span>
                    <div className="w-7 h-7 rounded-xl bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-52 rounded-2xl bg-white shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2"
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-3.5 py-2 border-b border-slate-100">
                        <div className="text-xs font-bold text-slate-800 truncate">{user.name}</div>
                        <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span>Profile &amp; Privacy</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2 px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-400" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Non-authenticated guest buttons */
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDemoClick}
                    disabled={isDemoLoading}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-colors"
                  >
                    {isDemoLoading ? 'Loading Demo...' : 'Demo Account'}
                  </button>
                  <Link
                    to="/login"
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-sm shadow-teal-600/20 transition-all"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu toggle button */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setCrisisModalOpen(true)}
                className="p-1.5 rounded-xl text-rose-600 bg-rose-50 border border-rose-200"
                aria-label="Urgent crisis help"
              >
                <ShieldAlert className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200/80 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
            {navLinks.map((link) => {
              if (link.authRequired && !user) return null;
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    active ? 'bg-teal-50 text-teal-700' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSdgModalOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100"
              >
                <Presentation className="w-4 h-4" />
                <span>View SDG 3 Academic Project Deck</span>
              </button>

              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    <span>My Profile &amp; Privacy Settings</span>
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleDemoClick();
                    }}
                    className="w-full py-2.5 rounded-xl text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 text-center"
                  >
                    Try Student Demo Account
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 text-center"
                    >
                      Log In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-2.5 rounded-xl text-xs font-semibold text-white bg-teal-600 text-center shadow-sm"
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Modals mounted globally */}
      <CrisisModal isOpen={crisisModalOpen} onClose={() => setCrisisModalOpen(false)} />
      <SdgModal isOpen={sdgModalOpen} onClose={() => setSdgModalOpen(false)} />
    </>
  );
};

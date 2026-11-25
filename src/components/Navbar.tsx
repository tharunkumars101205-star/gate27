import { useState, useRef, useEffect } from 'react';
import {
  BookOpen,
  CheckSquare,
  Clock,
  GitCompare,
  LayoutDashboard,
  LogOut,
  RefreshCw,
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import type { NavSection } from '../types/study';

interface NavbarProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
}

const NAV_ITEMS: { id: NavSection; label: string; shortLabel: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', shortLabel: 'Dashboard', icon: LayoutDashboard },
  { id: 'syllabus', label: 'Complete Syllabus', shortLabel: 'Syllabus', icon: BookOpen },
  { id: 'todo', label: 'Daily To-Do', shortLabel: 'To-Do', icon: CheckSquare },
  { id: 'timer', label: 'Study Timer', shortLabel: 'Timer', icon: Clock },
  { id: 'progress', label: 'Duo Progress', shortLabel: 'Progress', icon: GitCompare },
];

export function Navbar({ activeSection, onNavigate }: NavbarProps) {
  const { member, user, logout, signInWithGoogle } = useStudy();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const displayName = member?.displayName ?? 'Student';

  return (
    <>
      {/* Desktop & Mobile Top Bar (Strict 3-Zone Contract) */}
      <header className="sticky top-0 z-30 bg-[#060B14]/95 backdrop-blur border-b border-slate-800/80">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="text-lg font-semibold tracking-tight text-slate-100 hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            GATE 2027 ECE
          </button>

          {/* Zone 2: Exact 5 Single-Line Text Navigation Links */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Primary Navigation">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={`relative py-1.5 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'text-cyan-400'
                      : 'text-slate-400 hover:text-slate-100'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute inset-x-0 -bottom-[19px] h-[2px] bg-cyan-400" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Single Primary Account Action */}
          <div className="relative shrink-0" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="px-4 py-2 rounded-lg bg-[#0B1220] border border-slate-800 hover:border-cyan-500/50 text-sm font-medium text-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {displayName}
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-60 rounded-xl bg-[#0B1220] border border-slate-800 shadow-2xl p-2 z-40">
                <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                  <p className="text-sm font-semibold text-slate-100">{displayName}</p>
                  <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    setMenuOpen(false);
                    await logout();
                    await signInWithGoogle();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/70 rounded-lg transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                  Switch Google Account
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setMenuOpen(false);
                    await logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-red-300 hover:bg-slate-800/70 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-slate-400" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation (Compact <= 15% Viewport Cap) */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-[#060B14]/95 backdrop-blur border-t border-slate-800/90 px-2 py-1.5"
        aria-label="Mobile Navigation"
      >
        <div className="grid grid-cols-5 gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg transition-colors min-h-[44px] cursor-pointer ${
                  isActive ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4 mb-0.5" />
                <span className="text-[11px] font-medium whitespace-nowrap truncate max-w-full">
                  {item.shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}

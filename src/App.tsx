import { useState } from 'react';
import { AuthGate } from './components/AuthGate';
import { DashboardView } from './components/DashboardView';
import { DuoProgressView } from './components/DuoProgressView';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { SyllabusView } from './components/SyllabusView';
import { TimerView } from './components/TimerView';
import { TodoView } from './components/TodoView';
import { StudyProvider, useStudy } from './context/StudyContext';
import { TimerProvider } from './context/TimerContext';
import type { NavSection } from './types/study';

function TrackerShell() {
  const { user, member, authReady, membershipChecked } = useStudy();
  const [activeSection, setActiveSection] = useState<NavSection>('dashboard');

  if (!authReady || !user || !membershipChecked || !member) {
    return <AuthGate />;
  }

  return (
    <div className="min-h-screen bg-[#060B14] text-slate-100 flex flex-col">
      <Navbar activeSection={activeSection} onNavigate={setActiveSection} />

      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24 md:pb-12">
        {activeSection === 'dashboard' && (
          <DashboardView onNavigate={setActiveSection} />
        )}
        {activeSection === 'syllabus' && <SyllabusView />}
        {activeSection === 'todo' && <TodoView />}
        {activeSection === 'timer' && <TimerView />}
        {activeSection === 'progress' && <DuoProgressView />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <StudyProvider>
        <TimerProvider>
          <TrackerShell />
        </TimerProvider>
      </StudyProvider>
    </ErrorBoundary>
  );
}

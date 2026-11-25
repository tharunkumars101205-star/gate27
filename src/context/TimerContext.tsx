import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { GATE_2027_ECE_SYLLABUS } from '../data/gateSyllabus';
import { useStudy } from './StudyContext';

export type TimerMode = 'countdown' | 'stopwatch';
export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

interface TimerContextValue {
  mode: TimerMode;
  status: TimerStatus;
  subjectId: string;
  note: string;
  targetMinutes: number;
  displaySeconds: number;
  elapsedSeconds: number;
  savingSession: boolean;
  lastSavedMessage: string | null;
  setMode: (mode: TimerMode) => void;
  setSubjectId: (subjectId: string) => void;
  setNote: (note: string) => void;
  setTargetMinutes: (mins: number) => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  finishAndSave: () => Promise<void>;
  clearSavedMessage: () => void;
}

const TimerContext = createContext<TimerContextValue | null>(null);

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const { myProfileId, saveStudySession } = useStudy();

  const [mode, setModeState] = useState<TimerMode>('countdown');
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [subjectId, setSubjectId] = useState<string>(GATE_2027_ECE_SYLLABUS[0].id);
  const [note, setNote] = useState<string>('');
  const [targetMinutes, setTargetMinutesState] = useState<number>(50);

  const [accumulatedMs, setAccumulatedMs] = useState<number>(0);
  const [startedAtMs, setStartedAtMs] = useState<number | null>(null);
  const [nowMs, setNowMs] = useState<number>(() => Date.now());
  const [savingSession, setSavingSession] = useState<boolean>(false);
  const [lastSavedMessage, setLastSavedMessage] = useState<string | null>(null);

  const autoSavedRef = useRef<boolean>(false);

  // Reset independent timer if signed-in student changes
  useEffect(() => {
    setStatus('idle');
    setAccumulatedMs(0);
    setStartedAtMs(null);
    setLastSavedMessage(null);
    autoSavedRef.current = false;
  }, [myProfileId]);

  useEffect(() => {
    if (status !== 'running') return;
    setNowMs(Date.now());
    const interval = window.setInterval(() => {
      setNowMs(Date.now());
    }, 250);
    return () => window.clearInterval(interval);
  }, [status]);

  const currentElapsedMs =
    status === 'running' && startedAtMs !== null
      ? accumulatedMs + Math.max(0, nowMs - startedAtMs)
      : accumulatedMs;

  const elapsedSeconds = Math.floor(currentElapsedMs / 1000);
  const targetTotalSeconds = targetMinutes * 60;

  const displaySeconds =
    mode === 'countdown'
      ? Math.max(0, targetTotalSeconds - elapsedSeconds)
      : elapsedSeconds;

  const handleAutoCompleteCountdown = useCallback(async () => {
    if (autoSavedRef.current) return;
    autoSavedRef.current = true;
    setStatus('completed');
    setStartedAtMs(null);
    setAccumulatedMs(targetTotalSeconds * 1000);

    setSavingSession(true);
    try {
      await saveStudySession({
        subjectId,
        mode: 'countdown',
        durationSeconds: Math.max(60, targetTotalSeconds),
        note,
      });
      const subj = GATE_2027_ECE_SYLLABUS.find((s) => s.id === subjectId)?.name ?? 'Study';
      setLastSavedMessage(`Saved ${targetMinutes}m countdown session for ${subj}.`);
    } finally {
      setSavingSession(false);
    }
  }, [note, saveStudySession, subjectId, targetMinutes, targetTotalSeconds]);

  useEffect(() => {
    if (
      mode === 'countdown' &&
      status === 'running' &&
      elapsedSeconds >= targetTotalSeconds &&
      targetTotalSeconds > 0
    ) {
      void handleAutoCompleteCountdown();
    }
  }, [elapsedSeconds, handleAutoCompleteCountdown, mode, status, targetTotalSeconds]);

  const setMode = (nextMode: TimerMode) => {
    if (status === 'running' || status === 'paused') return;
    setModeState(nextMode);
    setStatus('idle');
    setAccumulatedMs(0);
    setStartedAtMs(null);
    setLastSavedMessage(null);
    autoSavedRef.current = false;
  };

  const setTargetMinutes = (mins: number) => {
    if (status === 'running' || status === 'paused') return;
    const clamped = Math.min(360, Math.max(1, Math.round(mins)));
    setTargetMinutesState(clamped);
    setStatus('idle');
    setAccumulatedMs(0);
    setStartedAtMs(null);
    autoSavedRef.current = false;
  };

  const start = () => {
    if (!subjectId) return;
    autoSavedRef.current = false;
    setLastSavedMessage(null);
    setAccumulatedMs(0);
    setStartedAtMs(Date.now());
    setNowMs(Date.now());
    setStatus('running');
  };

  const pause = () => {
    if (status !== 'running' || startedAtMs === null) return;
    const elapsedNow = accumulatedMs + Math.max(0, Date.now() - startedAtMs);
    setAccumulatedMs(elapsedNow);
    setStartedAtMs(null);
    setStatus('paused');
  };

  const resume = () => {
    if (status !== 'paused') return;
    setStartedAtMs(Date.now());
    setNowMs(Date.now());
    setStatus('running');
  };

  const reset = () => {
    setStatus('idle');
    setAccumulatedMs(0);
    setStartedAtMs(null);
    autoSavedRef.current = false;
  };

  const finishAndSave = async () => {
    if (elapsedSeconds < 60) return;
    const totalSecToSave =
      mode === 'countdown'
        ? Math.min(targetTotalSeconds, elapsedSeconds)
        : elapsedSeconds;

    setStatus('idle');
    setAccumulatedMs(0);
    setStartedAtMs(null);
    autoSavedRef.current = false;

    setSavingSession(true);
    try {
      await saveStudySession({
        subjectId,
        mode,
        durationSeconds: totalSecToSave,
        note,
      });
      const mins = Math.round(totalSecToSave / 60);
      const subj = GATE_2027_ECE_SYLLABUS.find((s) => s.id === subjectId)?.name ?? 'Study';
      setLastSavedMessage(`Saved ${mins}m ${mode} session for ${subj}.`);
      setNote('');
    } finally {
      setSavingSession(false);
    }
  };

  const clearSavedMessage = () => setLastSavedMessage(null);

  return (
    <TimerContext.Provider
      value={{
        mode,
        status,
        subjectId,
        note,
        targetMinutes,
        displaySeconds,
        elapsedSeconds,
        savingSession,
        lastSavedMessage,
        setMode,
        setSubjectId,
        setNote,
        setTargetMinutes,
        start,
        pause,
        resume,
        reset,
        finishAndSave,
        clearSavedMessage,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer(): TimerContextValue {
  const ctx = useContext(TimerContext);
  if (!ctx) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return ctx;
}

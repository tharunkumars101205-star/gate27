import { Pause, Play, RotateCcw, Save, CheckCircle2 } from 'lucide-react';
import { GATE_2027_ECE_SYLLABUS } from '../data/gateSyllabus';
import { useStudy } from '../context/StudyContext';
import { useTimer } from '../context/TimerContext';
import { formatDateLabel, formatDurationClock, formatStudyHours } from '../lib/istTime';
import { computeStudentStats } from '../lib/studyStats';

export function TimerView() {
  const { myProfileId, syllabusByProfile, summaryByProfile } = useStudy();
  const {
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
  } = useTimer();

  const tharunStats = computeStudentStats(
    syllabusByProfile.tharun,
    summaryByProfile.tharun
  );
  const sreeStats = computeStudentStats(
    syllabusByProfile.sreevishnu,
    summaryByProfile.sreevishnu
  );

  const isRunningOrPaused = status === 'running' || status === 'paused';
  const targetTotalSeconds = targetMinutes * 60;
  const countdownProgressPct =
    mode === 'countdown' && targetTotalSeconds > 0
      ? Math.min(100, Math.round((elapsedSeconds / targetTotalSeconds) * 100))
      : 0;

  const myName = myProfileId === 'sreevishnu' ? 'Sreevishnu' : 'Tharun';

  const tharunSessions = summaryByProfile.tharun?.recentSessions ?? [];
  const sreeSessions = summaryByProfile.sreevishnu?.recentSessions ?? [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Independent Student Study Timer (7 cols) */}
        <section className="lg:col-span-7 bg-[#0B1220] border border-slate-800/90 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
            <div>
              <h1 className="text-2xl font-semibold text-slate-100">
                {myName}&apos;s Study Timer
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Completed sessions save automatically to your shared study hours
              </p>
            </div>

            {/* Countdown vs Stopwatch Toggle */}
            <div className="inline-flex items-center p-1 rounded-xl bg-[#060B14] border border-slate-800 self-start">
              <button
                type="button"
                disabled={isRunningOrPaused}
                onClick={() => setMode('countdown')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50 ${
                  mode === 'countdown'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Countdown
              </button>
              <button
                type="button"
                disabled={isRunningOrPaused}
                onClick={() => setMode('stopwatch')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50 ${
                  mode === 'stopwatch'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Stopwatch
              </button>
            </div>
          </div>

          {/* Subject & Optional Note */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">
                Select Subject Before Starting
              </label>
              <select
                value={subjectId}
                disabled={isRunningOrPaused}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#060B14] border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 disabled:opacity-60"
              >
                {GATE_2027_ECE_SYLLABUS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5">
                Session Focus (Optional)
              </label>
              <input
                type="text"
                maxLength={200}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g., Network theorems & PYQs"
                className="w-full px-3 py-2.5 rounded-xl bg-[#060B14] border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Countdown Duration Presets */}
          {mode === 'countdown' && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Session Length:</span>
                {[25, 50, 90].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    disabled={isRunningOrPaused}
                    onClick={() => setTargetMinutes(mins)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono-tabular font-medium border transition-colors cursor-pointer disabled:opacity-50 ${
                      targetMinutes === mins
                        ? 'bg-cyan-500/15 border-cyan-500/70 text-cyan-300'
                        : 'bg-[#060B14] border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-400" htmlFor="custom-mins">
                  Custom (min):
                </label>
                <input
                  id="custom-mins"
                  type="number"
                  min={1}
                  max={360}
                  disabled={isRunningOrPaused}
                  value={targetMinutes}
                  onChange={(e) => setTargetMinutes(Number(e.target.value) || 50)}
                  className="w-20 px-2.5 py-1 rounded-lg bg-[#060B14] border border-slate-800 text-xs font-mono-tabular text-slate-100 focus:outline-none focus:border-cyan-500 disabled:opacity-50"
                />
              </div>
            </div>
          )}

          {/* Main Tabular Clock Display */}
          <div className="py-8 px-6 rounded-2xl bg-[#060B14] border border-slate-800/80 text-center space-y-5">
            <div className="text-5xl sm:text-7xl font-semibold text-slate-100 font-mono-tabular tracking-tight">
              {formatDurationClock(displaySeconds)}
            </div>

            {mode === 'countdown' && (
              <div className="max-w-md mx-auto space-y-1.5">
                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 transition-all duration-300"
                    style={{ width: `${countdownProgressPct}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 font-mono-tabular">
                  {countdownProgressPct}% of {targetMinutes} min session
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {status === 'idle' || status === 'completed' ? (
                <button
                  type="button"
                  onClick={start}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors cursor-pointer"
                >
                  <Play className="w-4 h-4" />
                  <span>Start {mode === 'countdown' ? `${targetMinutes}m Timer` : 'Stopwatch'}</span>
                </button>
              ) : status === 'running' ? (
                <button
                  type="button"
                  onClick={pause}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-colors cursor-pointer"
                >
                  <Pause className="w-4 h-4" />
                  <span>Pause</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={resume}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors cursor-pointer"
                >
                  <Play className="w-4 h-4" />
                  <span>Resume</span>
                </button>
              )}

              <button
                type="button"
                disabled={status === 'idle' && elapsedSeconds === 0}
                onClick={reset}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white text-sm font-medium transition-colors disabled:opacity-40 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>

              {elapsedSeconds >= 60 && status !== 'completed' && (
                <button
                  type="button"
                  disabled={savingSession}
                  onClick={finishAndSave}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingSession ? 'Saving...' : 'Save Session'}</span>
                </button>
              )}
            </div>

            {lastSavedMessage && (
              <div className="inline-flex items-center gap-2 text-xs text-emerald-400 pt-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>{lastSavedMessage}</span>
              </div>
            )}
          </div>
        </section>

        {/* Right: Total Study Hours for Each Student & Recent Sessions (5 cols) */}
        <section className="lg:col-span-5 space-y-6">
          {/* Student Study Hours Cards */}
          <div className="bg-[#0B1220] border border-slate-800/90 rounded-2xl p-6 space-y-5">
            <h2 className="text-lg font-semibold text-slate-100">Total Study Hours</h2>

            <div className="divide-y divide-slate-800/80">
              {[
                { name: 'Tharun', stats: tharunStats, isMe: myProfileId === 'tharun' },
                { name: 'Sreevishnu', stats: sreeStats, isMe: myProfileId === 'sreevishnu' },
              ].map((student) => (
                <div key={student.name} className="py-4 first:pt-0 last:pb-0 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-semibold text-slate-100">
                        {student.name}
                      </span>
                      {student.isMe && (
                        <span className="text-xs text-cyan-400">· You</span>
                      )}
                    </div>
                    <span className="text-xl font-semibold text-cyan-400 font-mono-tabular">
                      {formatStudyHours(student.stats.studySecondsTotal)} total
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-[#060B14] border border-slate-800/70">
                      <span className="text-slate-400">Today</span>
                      <p className="text-base font-semibold text-slate-100 font-mono-tabular mt-0.5">
                        {formatStudyHours(student.stats.studySecondsToday)}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#060B14] border border-slate-800/70">
                      <span className="text-slate-400">This Week</span>
                      <p className="text-base font-semibold text-slate-100 font-mono-tabular mt-0.5">
                        {formatStudyHours(student.stats.studySecondsWeek)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Study Sessions */}
          <div className="bg-[#0B1220] border border-slate-800/90 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-semibold text-slate-100">Recent Study Sessions</h2>

            {tharunSessions.length === 0 && sreeSessions.length === 0 ? (
              <p className="text-xs text-slate-500 py-4">
                No completed study sessions logged yet. Start the 50-minute timer to log your first session.
              </p>
            ) : (
              <ul className="divide-y divide-slate-800/70">
                {[
                  ...tharunSessions.map((s) => ({ ...s, student: 'Tharun' })),
                  ...sreeSessions.map((s) => ({ ...s, student: 'Sreevishnu' })),
                ]
                  .sort((a, b) => b.createdAtMs - a.createdAtMs)
                  .slice(0, 8)
                  .map((sess) => (
                    <li key={sess.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-200 truncate">
                          {sess.subjectName}
                        </p>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          {sess.student} · {formatDateLabel(sess.studyDate)}
                          {sess.note ? ` · ${sess.note}` : ''}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-emerald-400 font-mono-tabular shrink-0">
                        {Math.round(sess.durationSeconds / 60)}m
                      </span>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

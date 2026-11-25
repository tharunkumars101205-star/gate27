import { useEffect, useState } from 'react';
import { Calendar, Check, CheckCircle2, Circle, Edit3, X } from 'lucide-react';
import { ALL_SYLLABUS_TOPICS_MAP, GATE_2027_ECE_SYLLABUS } from '../data/gateSyllabus';
import { useStudy } from '../context/StudyContext';
import {
  DEFAULT_GATE_2027_EXAM_IST,
  formatExamIstDisplay,
  formatIstDisplayDate,
  formatStudyHours,
  getIstCountdown,
  getIstDateString,
} from '../lib/istTime';
import { computeStudentStats } from '../lib/studyStats';
import type { NavSection, ProfileId } from '../types/study';

interface DashboardViewProps {
  onNavigate: (section: NavSection) => void;
}

export function DashboardView({ onNavigate }: DashboardViewProps) {
  const {
    myProfileId,
    profiles,
    groupConfig,
    syllabusByProfile,
    summaryByProfile,
    toggleTask,
    updateExamDate,
  } = useStudy();

  const [nowMs, setNowMs] = useState<number>(() => Date.now());
  const [editingExam, setEditingExam] = useState(false);
  const [examInput, setExamInput] = useState(DEFAULT_GATE_2027_EXAM_IST);
  const [savingExam, setSavingExam] = useState(false);

  const activeExamDate = groupConfig?.eceExamDate || DEFAULT_GATE_2027_EXAM_IST;

  useEffect(() => {
    setExamInput(activeExamDate);
  }, [activeExamDate]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const countdown = getIstCountdown(activeExamDate, nowMs);
  const todayDisplay = formatIstDisplayDate(new Date(nowMs));
  const todayIst = getIstDateString(new Date(nowMs));

  const tharunStats = computeStudentStats(
    syllabusByProfile.tharun,
    summaryByProfile.tharun,
    new Date(nowMs)
  );
  const sreeStats = computeStudentStats(
    syllabusByProfile.sreevishnu,
    summaryByProfile.sreevishnu,
    new Date(nowMs)
  );

  const myStats = myProfileId === 'sreevishnu' ? sreeStats : tharunStats;
  const totalTodayCompleted =
    tharunStats.todayCompletedTasksCount + sreeStats.todayCompletedTasksCount;
  const totalTodayPending =
    tharunStats.todayPendingTasksCount + sreeStats.todayPendingTasksCount;

  const handleSaveExamDate = async () => {
    if (!/^2027-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):[0-5][0-9]$/.test(examInput)) {
      return;
    }
    setSavingExam(true);
    try {
      await updateExamDate(examInput);
      setEditingExam(false);
    } finally {
      setSavingExam(false);
    }
  };

  const renderStudentPanel = (profileId: ProfileId, displayName: 'Tharun' | 'Sreevishnu') => {
    const isMe = myProfileId === profileId;
    const isLinked = Boolean(profiles[profileId]);
    const stats = profileId === 'tharun' ? tharunStats : sreeStats;
    const syllabusStatuses = syllabusByProfile[profileId]?.statuses ?? {};

    // Recent completed topics (up to 4) & next pending topics (up to 3)
    const completedTopicTitles: string[] = [];
    const pendingTopicTitles: string[] = [];
    for (const subject of GATE_2027_ECE_SYLLABUS) {
      for (const chapter of subject.chapters) {
        for (const topic of chapter.topics) {
          const st = syllabusStatuses[topic.id] ?? 'not_started';
          if (st === 'completed' && completedTopicTitles.length < 4) {
            completedTopicTitles.push(`${subject.code} · ${topic.title}`);
          } else if (st !== 'completed' && pendingTopicTitles.length < 3) {
            pendingTopicTitles.push(`${subject.code} · ${topic.title}`);
          }
        }
      }
    }

    return (
      <section
        key={profileId}
        className="bg-[#0B1220] border border-slate-800/90 rounded-2xl p-6 flex flex-col gap-6"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>{isMe ? 'Your Profile' : 'Study Partner'}</span>
              <span aria-hidden="true">·</span>
              <span className={isLinked ? 'text-cyan-400' : 'text-slate-500'}>
                {isLinked ? 'Synced' : 'Awaiting Sign-In'}
              </span>
            </div>
            <h2 className="text-xl font-semibold text-slate-100 mt-1">{displayName}</h2>
          </div>

          <div className="text-right">
            <p className="text-2xl font-semibold text-emerald-400 font-mono-tabular">
              {stats.overallPercentage}%
            </p>
            <p className="text-xs text-slate-400 font-mono-tabular">
              {stats.completedTopics} / {stats.totalTopics} topics
            </p>
          </div>
        </div>

        {/* Syllabus Bar + Breakdown */}
        <div className="space-y-2.5">
          <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${stats.overallPercentage}%` }}
            />
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-mono-tabular">
            <span className="text-emerald-400">{stats.completedTopics} Completed</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-400">{stats.inProgressTopics} In Progress</span>
            <span aria-hidden="true">·</span>
            <span>{stats.notStartedTopics} Pending</span>
          </div>
        </div>

        {/* Study Hours & Today Task Counters */}
        <div className="grid grid-cols-3 gap-4 py-3 border-y border-slate-800/70">
          <div>
            <p className="text-xs text-slate-400">Today Hours</p>
            <p className="text-lg font-semibold text-cyan-400 font-mono-tabular mt-0.5">
              {formatStudyHours(stats.studySecondsToday)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Weekly Hours</p>
            <p className="text-lg font-semibold text-slate-100 font-mono-tabular mt-0.5">
              {formatStudyHours(stats.studySecondsWeek)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Total Hours</p>
            <p className="text-lg font-semibold text-slate-100 font-mono-tabular mt-0.5">
              {formatStudyHours(stats.studySecondsTotal)}
            </p>
          </div>
        </div>

        {/* Today's Tasks */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200">
              Today&apos;s Tasks ({todayIst})
            </h3>
            <span className="text-xs text-slate-400 font-mono-tabular">
              {stats.todayCompletedTasksCount} done · {stats.todayPendingTasksCount} pending
            </span>
          </div>

          {stats.todayTasks.length === 0 ? (
            <div className="py-4 text-xs text-slate-500">
              No tasks scheduled for today.
              {isMe && (
                <button
                  type="button"
                  onClick={() => onNavigate('todo')}
                  className="ml-2 text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
                >
                  Add a task
                </button>
              )}
            </div>
          ) : (
            <ul className="divide-y divide-slate-800/60">
              {stats.todayTasks.slice(0, 6).map((task) => {
                const subjName =
                  GATE_2027_ECE_SYLLABUS.find((s) => s.id === task.subjectId)?.code ?? 'ECE';
                const topicLabel =
                  task.topicTitle || ALL_SYLLABUS_TOPICS_MAP[task.topicId]?.topicTitle || '';
                return (
                  <li key={task.id} className="py-2.5 flex items-start gap-3">
                    {isMe ? (
                      <button
                        type="button"
                        onClick={() => toggleTask(task.id)}
                        aria-label={`Toggle ${task.title}`}
                        className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer shrink-0"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </button>
                    ) : (
                      <span className="mt-0.5 shrink-0">
                        {task.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-500" />
                        )}
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm leading-snug ${
                          task.completed ? 'line-through text-slate-500' : 'text-slate-200'
                        }`}
                      >
                        {task.title}
                      </p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {subjName}
                        {topicLabel ? ` · ${topicLabel}` : ''}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Topics Snapshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/70">
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-emerald-400">Recently Completed Topics</p>
            {completedTopicTitles.length === 0 ? (
              <p className="text-xs text-slate-500">None marked completed yet</p>
            ) : (
              <ul className="space-y-1">
                {completedTopicTitles.map((item, idx) => (
                  <li key={idx} className="text-xs text-slate-300 truncate">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-slate-400">Upcoming Pending Topics</p>
            {pendingTopicTitles.length === 0 ? (
              <p className="text-xs text-emerald-400">All topics completed</p>
            ) : (
              <ul className="space-y-1">
                {pendingTopicTitles.map((item, idx) => (
                  <li key={idx} className="text-xs text-slate-400 truncate">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="space-y-8">
      {/* 1. Prominent GATE 2027 Countdown Banner */}
      <section className="bg-[#0B1220] border border-slate-800/90 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex flex-wrap items-center gap-2 text-xs text-cyan-400">
              <span>GATE 2027 Examination Countdown</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-400">Indian Standard Time (IST)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-100 [text-wrap:balance]">
              Electronics &amp; Communication Engineering
            </h1>

            {!editingExam ? (
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <span className="inline-flex items-center gap-1.5 text-sm text-slate-300">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  Target Window: {formatExamIstDisplay(activeExamDate)}
                </span>
                <button
                  type="button"
                  onClick={() => setEditingExam(true)}
                  className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit ECE Date
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <input
                  type="datetime-local"
                  value={examInput}
                  min="2027-01-01T00:00"
                  max="2027-12-31T23:59"
                  onChange={(e) => setExamInput(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-[#060B14] border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="button"
                  disabled={savingExam}
                  onClick={handleSaveExamDate}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setExamInput(activeExamDate);
                    setEditingExam(false);
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:text-white text-xs transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* DAYS : HOURS : MINUTES : SECONDS */}
          <div className="grid grid-cols-4 gap-3 sm:gap-4 shrink-0">
            {[
              { label: 'Days', value: String(countdown.days).padStart(3, '0') },
              { label: 'Hours', value: String(countdown.hours).padStart(2, '0') },
              { label: 'Minutes', value: String(countdown.minutes).padStart(2, '0') },
              { label: 'Seconds', value: String(countdown.seconds).padStart(2, '0') },
            ].map((block) => (
              <div
                key={block.label}
                className="min-w-[68px] sm:min-w-[84px] px-3 py-3.5 rounded-xl bg-[#060B14] border border-slate-800 text-center"
              >
                <div className="text-2xl sm:text-4xl font-semibold text-cyan-400 font-mono-tabular leading-none">
                  {block.value}
                </div>
                <div className="text-[11px] text-slate-400 mt-2">{block.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. 4-Column Overview Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0B1220] border border-slate-800/90 rounded-xl p-5">
          <p className="text-xs text-slate-400">Today&apos;s Date (IST)</p>
          <p className="text-base font-semibold text-slate-100 mt-1.5">{todayDisplay}</p>
        </div>

        <div className="bg-[#0B1220] border border-slate-800/90 rounded-xl p-5">
          <p className="text-xs text-slate-400">Your Syllabus Completion</p>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl font-semibold text-emerald-400 font-mono-tabular">
              {myStats.overallPercentage}%
            </span>
            <span className="text-xs text-slate-400 font-mono-tabular">
              ({myStats.completedTopics}/{myStats.totalTopics})
            </span>
          </div>
        </div>

        <div className="bg-[#0B1220] border border-slate-800/90 rounded-xl p-5">
          <p className="text-xs text-slate-400">Today&apos;s Completed Tasks</p>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl font-semibold text-emerald-400 font-mono-tabular">
              {totalTodayCompleted}
            </span>
            <span className="text-xs text-slate-400 font-mono-tabular">
              Tharun {tharunStats.todayCompletedTasksCount} · Sreevishnu{' '}
              {sreeStats.todayCompletedTasksCount}
            </span>
          </div>
        </div>

        <div className="bg-[#0B1220] border border-slate-800/90 rounded-xl p-5">
          <p className="text-xs text-slate-400">Today&apos;s Pending Tasks</p>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl font-semibold text-cyan-400 font-mono-tabular">
              {totalTodayPending}
            </span>
            <span className="text-xs text-slate-400 font-mono-tabular">
              Tharun {tharunStats.todayPendingTasksCount} · Sreevishnu{' '}
              {sreeStats.todayPendingTasksCount}
            </span>
          </div>
        </div>
      </section>

      {/* 3. Side-by-Side Student Progress Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {renderStudentPanel('tharun', 'Tharun')}
        {renderStudentPanel('sreevishnu', 'Sreevishnu')}
      </div>
    </div>
  );
}

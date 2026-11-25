import React, { useMemo, useState } from 'react';
import { Check, CheckCircle2, Circle, Edit2, Plus, Trash2, X } from 'lucide-react';
import { ALL_SYLLABUS_TOPICS_MAP, GATE_2027_ECE_SYLLABUS } from '../data/gateSyllabus';
import { useStudy } from '../context/StudyContext';
import { formatDateLabel, getIstDateString } from '../lib/istTime';
import type { ProfileId } from '../types/study';

export function TodoView() {
  const {
    myProfileId,
    partnerProfileId,
    myTasks,
    summaryByProfile,
    addTask,
    toggleTask,
    updateTask,
    deleteTask,
  } = useStudy();

  const todayIst = getIstDateString();
  const activeMyId: ProfileId = myProfileId ?? 'tharun';
  const activePartnerId: ProfileId = partnerProfileId ?? 'sreevishnu';
  const myName = activeMyId === 'tharun' ? 'Tharun' : 'Sreevishnu';
  const partnerName = activePartnerId === 'tharun' ? 'Tharun' : 'Sreevishnu';

  // New task form state
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState(GATE_2027_ECE_SYLLABUS[0].id);
  const [topicId, setTopicId] = useState('');
  const [targetDate, setTargetDate] = useState(todayIst);
  const [submitting, setSubmitting] = useState(false);

  // Filters
  const [dateFilter, setDateFilter] = useState<'today' | 'all'>('today');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // Edit task inline state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSubjectId, setEditSubjectId] = useState('');
  const [editTopicId, setEditTopicId] = useState('');
  const [editTargetDate, setEditTargetDate] = useState('');

  const availableTopicsForForm = useMemo(() => {
    const subj = GATE_2027_ECE_SYLLABUS.find((s) => s.id === subjectId);
    if (!subj) return [];
    return subj.chapters.flatMap((c) =>
      c.topics.map((t) => ({ id: t.id, label: `${c.title} — ${t.title}` }))
    );
  }, [subjectId]);

  const availableTopicsForEdit = useMemo(() => {
    const subj = GATE_2027_ECE_SYLLABUS.find((s) => s.id === editSubjectId);
    if (!subj) return [];
    return subj.chapters.flatMap((c) =>
      c.topics.map((t) => ({ id: t.id, label: `${c.title} — ${t.title}` }))
    );
  }, [editSubjectId]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await addTask({
        title,
        subjectId,
        topicId,
        targetDate,
      });
      setTitle('');
      setTopicId('');
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (task: (typeof myTasks)[number]) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditSubjectId(task.subjectId);
    setEditTopicId(task.topicId);
    setEditTargetDate(task.targetDate);
  };

  const handleSaveEdit = async (taskId: string) => {
    if (!editTitle.trim()) return;
    await updateTask(taskId, {
      title: editTitle,
      subjectId: editSubjectId,
      topicId: editTopicId,
      targetDate: editTargetDate,
    });
    setEditingId(null);
  };

  const filteredMyTasks = useMemo(() => {
    return [...myTasks]
      .filter((t) => {
        if (dateFilter === 'today' && t.targetDate !== todayIst) return false;
        if (statusFilter === 'pending' && t.completed) return false;
        if (statusFilter === 'completed' && !t.completed) return false;
        return true;
      })
      .sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return a.targetDate.localeCompare(b.targetDate);
      });
  }, [dateFilter, myTasks, statusFilter, todayIst]);

  const partnerTasks = useMemo(() => {
    const list = summaryByProfile[activePartnerId]?.tasksSnapshot ?? [];
    return list.filter((t) => {
      if (dateFilter === 'today' && t.targetDate !== todayIst) return false;
      if (statusFilter === 'pending' && t.completed) return false;
      if (statusFilter === 'completed' && !t.completed) return false;
      return true;
    });
  }, [activePartnerId, dateFilter, statusFilter, summaryByProfile, todayIst]);

  const myPendingCount = filteredMyTasks.filter((t) => !t.completed).length;
  const myCompletedCount = filteredMyTasks.filter((t) => t.completed).length;
  const partnerPendingCount = partnerTasks.filter((t) => !t.completed).length;
  const partnerCompletedCount = partnerTasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-6">
      {/* Header & Shared Filter Bar */}
      <section className="bg-[#0B1220] border border-slate-800/90 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">Daily To-Do Planner</h1>
          <p className="text-sm text-slate-400 mt-1">
            Plan daily GATE 2027 ECE targets and track {partnerName}&apos;s live task progress
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center p-1 rounded-xl bg-[#060B14] border border-slate-800">
            <button
              type="button"
              onClick={() => setDateFilter('today')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                dateFilter === 'today'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Today ({formatDateLabel(todayIst)})
            </button>
            <button
              type="button"
              onClick={() => setDateFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                dateFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Dates
            </button>
          </div>

          <div className="inline-flex items-center p-1 rounded-xl bg-[#060B14] border border-slate-800">
            {(
              [
                { id: 'all', label: 'All' },
                { id: 'pending', label: 'Pending' },
                { id: 'completed', label: 'Completed' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setStatusFilter(opt.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  statusFilter === opt.id
                    ? 'bg-slate-800 text-cyan-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Two Columns: My Planner + Partner's Live Planner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: My Planner (7 cols) */}
        <section className="lg:col-span-7 bg-[#0B1220] border border-slate-800/90 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-100">{myName}&apos;s Tasks</h2>
              <p className="text-xs text-slate-400 font-mono-tabular mt-0.5">
                {myPendingCount} pending · {myCompletedCount} completed
              </p>
            </div>
          </div>

          {/* Add Task Form */}
          <form
            onSubmit={handleAddTask}
            className="p-4 rounded-xl bg-[#060B14] border border-slate-800/80 space-y-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs text-slate-400 mb-1">Task Description</label>
                <input
                  type="text"
                  required
                  maxLength={200}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Solve 30 PYQs on Bode Plots"
                  className="w-full px-3 py-2 rounded-lg bg-[#0B1220] border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Target Date</label>
                <input
                  type="date"
                  required
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0B1220] border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Subject</label>
                <select
                  value={subjectId}
                  onChange={(e) => {
                    setSubjectId(e.target.value);
                    setTopicId('');
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-[#0B1220] border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  {GATE_2027_ECE_SYLLABUS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Topic (Optional)</label>
                <select
                  value={topicId}
                  onChange={(e) => setTopicId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0B1220] border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="">General / Mixed Revision</option>
                  {availableTopicsForForm.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={submitting || !title.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{submitting ? 'Adding...' : 'Add Task'}</span>
              </button>
            </div>
          </form>

          {/* Task List */}
          {filteredMyTasks.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500">
              No tasks found for the selected filter.
            </div>
          ) : (
            <ul className="divide-y divide-slate-800/70">
              {filteredMyTasks.map((task) => {
                const subjName =
                  GATE_2027_ECE_SYLLABUS.find((s) => s.id === task.subjectId)?.name ??
                  task.subjectId;
                const topicLabel =
                  task.topicTitle || ALL_SYLLABUS_TOPICS_MAP[task.topicId]?.topicTitle || '';

                if (editingId === task.id) {
                  return (
                    <li key={task.id} className="py-4 space-y-3">
                      <input
                        type="text"
                        maxLength={200}
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-[#060B14] border border-cyan-500/60 text-sm text-slate-100 focus:outline-none"
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <select
                          value={editSubjectId}
                          onChange={(e) => {
                            setEditSubjectId(e.target.value);
                            setEditTopicId('');
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-[#060B14] border border-slate-800 text-xs text-slate-200"
                        >
                          {GATE_2027_ECE_SYLLABUS.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                        <select
                          value={editTopicId}
                          onChange={(e) => setEditTopicId(e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#060B14] border border-slate-800 text-xs text-slate-200"
                        >
                          <option value="">General / Mixed Revision</option>
                          {availableTopicsForEdit.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.label}
                            </option>
                          ))}
                        </select>
                        <input
                          type="date"
                          value={editTargetDate}
                          onChange={(e) => setEditTargetDate(e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#060B14] border border-slate-800 text-xs text-slate-200"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(task.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 text-xs cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          Cancel
                        </button>
                      </div>
                    </li>
                  );
                }

                return (
                  <li key={task.id} className="py-3.5 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <button
                        type="button"
                        onClick={() => toggleTask(task.id)}
                        aria-label={`Mark ${task.title} ${task.completed ? 'pending' : 'completed'}`}
                        className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer shrink-0"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>

                      <div className="min-w-0">
                        <p
                          className={`text-sm font-medium ${
                            task.completed ? 'line-through text-slate-500' : 'text-slate-100'
                          }`}
                        >
                          {task.title}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-400 mt-1">
                          <span className="text-cyan-400">{subjName}</span>
                          {topicLabel && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="truncate max-w-xs">{topicLabel}</span>
                            </>
                          )}
                          <span aria-hidden="true">·</span>
                          <span className="font-mono-tabular">
                            {formatDateLabel(task.targetDate)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => startEdit(task)}
                        aria-label={`Edit ${task.title}`}
                        className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800/70 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteTask(task.id)}
                        aria-label={`Delete ${task.title}`}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800/70 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Right: Partner's Tasks (5 cols) */}
        <section className="lg:col-span-5 bg-[#0B1220] border border-slate-800/90 rounded-2xl p-6 space-y-5">
          <div className="border-b border-slate-800/80 pb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-100">
                {partnerName}&apos;s Tasks
              </h2>
              <span className="text-xs text-cyan-400">Live View</span>
            </div>
            <p className="text-xs text-slate-400 font-mono-tabular mt-0.5">
              {partnerPendingCount} pending · {partnerCompletedCount} completed
            </p>
          </div>

          {partnerTasks.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500">
              {partnerName} has no tasks matching this filter.
            </div>
          ) : (
            <ul className="divide-y divide-slate-800/70">
              {partnerTasks.map((task) => {
                const subjName =
                  GATE_2027_ECE_SYLLABUS.find((s) => s.id === task.subjectId)?.code ?? 'ECE';
                const topicLabel =
                  task.topicTitle || ALL_SYLLABUS_TOPICS_MAP[task.topicId]?.topicTitle || '';
                return (
                  <li key={task.id} className="py-3 flex items-start gap-3">
                    {task.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm ${
                          task.completed ? 'line-through text-slate-500' : 'text-slate-200'
                        }`}
                      >
                        {task.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5 truncate">
                        <span className="text-cyan-400">{subjName}</span>
                        {topicLabel ? ` · ${topicLabel}` : ''} ·{' '}
                        <span className="font-mono-tabular">
                          {formatDateLabel(task.targetDate)}
                        </span>
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

import { useMemo, useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronRight, Circle, Clock, Search } from 'lucide-react';
import { GATE_2027_ECE_SYLLABUS } from '../data/gateSyllabus';
import { useStudy } from '../context/StudyContext';
import { computeStudentStats } from '../lib/studyStats';
import type { ProfileId, TopicStatus } from '../types/study';

export function SyllabusView() {
  const { myProfileId, partnerProfileId, syllabusByProfile, summaryByProfile, setTopicStatus } =
    useStudy();

  const activeMyId: ProfileId = myProfileId ?? 'tharun';
  const activePartnerId: ProfileId = partnerProfileId ?? 'sreevishnu';

  const [viewingProfile, setViewingProfile] = useState<'me' | 'partner'>('me');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | TopicStatus>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    GATE_2027_ECE_SYLLABUS.forEach((s, i) => {
      initial[s.id] = i === 0;
    });
    return initial;
  });

  const targetProfileId = viewingProfile === 'me' ? activeMyId : activePartnerId;
  const isReadOnly = viewingProfile === 'partner';

  const targetStatuses = syllabusByProfile[targetProfileId]?.statuses ?? {};
  const partnerStatuses = syllabusByProfile[activePartnerId]?.statuses ?? {};

  const myStats = computeStudentStats(
    syllabusByProfile[activeMyId],
    summaryByProfile[activeMyId]
  );
  const partnerStats = computeStudentStats(
    syllabusByProfile[activePartnerId],
    summaryByProfile[activePartnerId]
  );

  const displayedStats = viewingProfile === 'me' ? myStats : partnerStats;
  const targetName = targetProfileId === 'tharun' ? 'Tharun' : 'Sreevishnu';
  const partnerName = activePartnerId === 'tharun' ? 'Tharun' : 'Sreevishnu';

  const toggleSubjectExpand = (subjectId: string) => {
    setExpandedSubjects((prev) => ({
      ...prev,
      [subjectId]: !prev[subjectId],
    }));
  };

  const filteredSubjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return GATE_2027_ECE_SYLLABUS.filter(
      (subj) => selectedSubjectId === 'all' || subj.id === selectedSubjectId
    )
      .map((subj) => {
        const chapters = subj.chapters
          .map((chap) => {
            const topics = chap.topics.filter((topic) => {
              const st = targetStatuses[topic.id] ?? 'not_started';
              if (statusFilter !== 'all' && st !== statusFilter) return false;
              if (q) {
                return (
                  topic.title.toLowerCase().includes(q) ||
                  chap.title.toLowerCase().includes(q) ||
                  subj.name.toLowerCase().includes(q)
                );
              }
              return true;
            });
            return { ...chap, topics };
          })
          .filter((chap) => chap.topics.length > 0);
        return { ...subj, chapters };
      })
      .filter((subj) => subj.chapters.length > 0);
  }, [searchQuery, selectedSubjectId, statusFilter, targetStatuses]);

  const statusMeta = (st: TopicStatus) => {
    if (st === 'completed') {
      return { label: 'Completed', color: 'text-emerald-400', Icon: CheckCircle2 };
    }
    if (st === 'in_progress') {
      return { label: 'In Progress', color: 'text-amber-400', Icon: Clock };
    }
    return { label: 'Not Started', color: 'text-slate-400', Icon: Circle };
  };

  return (
    <div className="space-y-6">
      {/* Header & Overall Syllabus Summary */}
      <section className="bg-[#0B1220] border border-slate-800/90 rounded-2xl p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-100">
              Complete GATE 2027 ECE Syllabus
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Viewing {targetName}&apos;s syllabus progress · {displayedStats.completedTopics} of{' '}
              {displayedStats.totalTopics} topics completed ({displayedStats.overallPercentage}%)
            </p>
          </div>

          {/* Switch between My Progress & Partner's Progress */}
          <div className="inline-flex items-center p-1 rounded-xl bg-[#060B14] border border-slate-800 self-start">
            <button
              type="button"
              onClick={() => setViewingProfile('me')}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                viewingProfile === 'me'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              My Syllabus ({activeMyId === 'tharun' ? 'Tharun' : 'Sreevishnu'})
            </button>
            <button
              type="button"
              onClick={() => setViewingProfile('partner')}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                viewingProfile === 'partner'
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              {partnerName}&apos;s Syllabus (View)
            </button>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="space-y-2">
          <div className="w-full h-2.5 rounded-full bg-[#060B14] overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${displayedStats.overallPercentage}%` }}
            />
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono-tabular">
            <span className="text-emerald-400">
              {displayedStats.completedTopics} Completed
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-400">
              {displayedStats.inProgressTopics} In Progress
            </span>
            <span aria-hidden="true">·</span>
            <span>{displayedStats.notStartedTopics} Not Started</span>
          </div>
        </div>

        {/* Subject-Wise Completion Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {displayedStats.subjectStats.map((sub) => {
            const isSelected = selectedSubjectId === sub.subjectId;
            return (
              <button
                key={sub.subjectId}
                type="button"
                onClick={() => {
                  const next = isSelected ? 'all' : sub.subjectId;
                  setSelectedSubjectId(next);
                  if (next !== 'all') {
                    setExpandedSubjects((prev) => ({ ...prev, [next]: true }));
                  }
                }}
                className={`text-left p-3.5 rounded-xl border transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-blue-950/40 border-cyan-500/70'
                    : 'bg-[#060B14] border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-cyan-400">{sub.code}</span>
                  <span className="text-xs font-semibold text-slate-200 font-mono-tabular">
                    {sub.percentage}%
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-200 truncate mt-1">
                  {sub.name}
                </p>
                <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden mt-2">
                  <div
                    className={`h-full transition-all duration-300 ${
                      sub.percentage === 100 ? 'bg-emerald-500' : 'bg-cyan-500'
                    }`}
                    style={{ width: `${sub.percentage}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 font-mono-tabular mt-1.5">
                  {sub.completedTopics}/{sub.totalTopics} topics
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Filter Toolbar */}
      <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search syllabus chapters or topics..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0B1220] border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedSubjectId}
            onChange={(e) => {
              setSelectedSubjectId(e.target.value);
              if (e.target.value !== 'all') {
                setExpandedSubjects((prev) => ({ ...prev, [e.target.value]: true }));
              }
            }}
            aria-label="Filter by subject"
            className="px-3 py-2 rounded-xl bg-[#0B1220] border border-slate-800 text-xs font-medium text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All 10 Subjects</option>
            {GATE_2027_ECE_SYLLABUS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <div className="inline-flex items-center p-1 rounded-xl bg-[#0B1220] border border-slate-800">
            {(
              [
                { id: 'all', label: 'All' },
                { id: 'not_started', label: 'Not Started' },
                { id: 'in_progress', label: 'In Progress' },
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

      {/* Subjects, Chapters & Subtopics List */}
      {filteredSubjects.length === 0 ? (
        <div className="bg-[#0B1220] border border-slate-800/90 rounded-2xl p-10 text-center space-y-2">
          <p className="text-sm font-medium text-slate-300">
            No syllabus topics match your current filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedSubjectId('all');
              setStatusFilter('all');
              setSearchQuery('');
            }}
            className="text-xs text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSubjects.map((subject, idx) => {
            const subStat = displayedStats.subjectStats.find(
              (s) => s.subjectId === subject.id
            );
            const isExpanded =
              searchQuery.trim().length > 0 ||
              selectedSubjectId !== 'all' ||
              statusFilter !== 'all' ||
              Boolean(expandedSubjects[subject.id]);

            return (
              <div
                key={subject.id}
                className="bg-[#0B1220] border border-slate-800/90 rounded-2xl overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleSubjectExpand(subject.id)}
                  className="w-full px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-900/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-cyan-400 shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span className="text-sm font-mono-tabular text-cyan-400 shrink-0">
                      {String(idx + 1).padStart(2, '0')}.
                    </span>
                    <h2 className="text-base font-semibold text-slate-100 truncate">
                      {subject.name}
                    </h2>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-xs text-slate-400 font-mono-tabular hidden sm:inline">
                      {subStat?.completedTopics ?? 0}/{subStat?.totalTopics ?? 0} topics
                    </span>
                    <span
                      className={`text-sm font-semibold font-mono-tabular ${
                        (subStat?.percentage ?? 0) === 100
                          ? 'text-emerald-400'
                          : 'text-cyan-400'
                      }`}
                    >
                      {subStat?.percentage ?? 0}%
                    </span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-slate-800/80 divide-y divide-slate-800/70">
                    {subject.chapters.map((chapter) => (
                      <div key={chapter.id} className="px-6 py-5 space-y-3">
                        <h3 className="text-sm font-semibold text-slate-200">
                          {chapter.title}
                        </h3>
                        <div className="divide-y divide-slate-800/50">
                          {chapter.topics.map((topic) => {
                            const currentStatus: TopicStatus =
                              targetStatuses[topic.id] ?? 'not_started';
                            const partnerStatus: TopicStatus =
                              partnerStatuses[topic.id] ?? 'not_started';
                            const partnerMeta = statusMeta(partnerStatus);
                            const currentMeta = statusMeta(currentStatus);

                            return (
                              <div
                                key={topic.id}
                                className="py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3"
                              >
                                <div className="min-w-0 space-y-1">
                                  <p
                                    className={`text-sm ${
                                      currentStatus === 'completed'
                                        ? 'text-emerald-300'
                                        : 'text-slate-200'
                                    }`}
                                  >
                                    {topic.title}
                                  </p>
                                  {!isReadOnly && (
                                    <p className="text-xs text-slate-500">
                                      {partnerName}:{' '}
                                      <span className={partnerMeta.color}>
                                        {partnerMeta.label}
                                      </span>
                                    </p>
                                  )}
                                </div>

                                {isReadOnly ? (
                                  <div
                                    className={`inline-flex items-center gap-1.5 text-xs font-medium shrink-0 ${currentMeta.color}`}
                                  >
                                    <currentMeta.Icon className="w-4 h-4" />
                                    <span>{currentMeta.label}</span>
                                  </div>
                                ) : (
                                  <div className="inline-flex items-center p-1 rounded-lg bg-[#060B14] border border-slate-800 shrink-0 self-start lg:self-auto">
                                    {(
                                      [
                                        { id: 'not_started', label: 'Not Started' },
                                        { id: 'in_progress', label: 'In Progress' },
                                        { id: 'completed', label: 'Completed' },
                                      ] as const
                                    ).map((btn) => {
                                      const active = currentStatus === btn.id;
                                      let activeClass = 'bg-slate-800 text-slate-100';
                                      if (active && btn.id === 'completed') {
                                        activeClass = 'bg-emerald-600 text-white';
                                      } else if (active && btn.id === 'in_progress') {
                                        activeClass = 'bg-amber-600 text-white';
                                      }
                                      return (
                                        <button
                                          key={btn.id}
                                          type="button"
                                          onClick={() => setTopicStatus(topic.id, btn.id)}
                                          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                                            active
                                              ? activeClass
                                              : 'text-slate-400 hover:text-slate-200'
                                          }`}
                                        >
                                          {btn.label}
                                        </button>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

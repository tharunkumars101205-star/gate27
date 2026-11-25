import { useStudy } from '../context/StudyContext';
import { formatStudyHours } from '../lib/istTime';
import { computeStudentStats } from '../lib/studyStats';

export function DuoProgressView() {
  const { syllabusByProfile, summaryByProfile } = useStudy();

  const tharun = computeStudentStats(syllabusByProfile.tharun, summaryByProfile.tharun);
  const sree = computeStudentStats(syllabusByProfile.sreevishnu, summaryByProfile.sreevishnu);

  const maxTodayTasks = Math.max(
    1,
    tharun.todayCompletedTasksCount + tharun.todayPendingTasksCount,
    sree.todayCompletedTasksCount + sree.todayPendingTasksCount
  );

  const maxHoursToday = Math.max(3600, tharun.studySecondsToday, sree.studySecondsToday);
  const maxHoursWeek = Math.max(3600 * 10, tharun.studySecondsWeek, sree.studySecondsWeek);

  const comparisonRows = [
    {
      label: 'Daily tasks completed',
      tharunText: `${tharun.todayCompletedTasksCount} / ${
        tharun.todayCompletedTasksCount + tharun.todayPendingTasksCount
      }`,
      sreeText: `${sree.todayCompletedTasksCount} / ${
        sree.todayCompletedTasksCount + sree.todayPendingTasksCount
      }`,
      tharunPct: Math.min(
        100,
        Math.round((tharun.todayCompletedTasksCount / maxTodayTasks) * 100)
      ),
      sreePct: Math.min(
        100,
        Math.round((sree.todayCompletedTasksCount / maxTodayTasks) * 100)
      ),
      barColor: 'bg-cyan-500',
    },
    {
      label: 'Syllabus completed',
      tharunText: `${tharun.overallPercentage}% (${tharun.completedTopics}/${tharun.totalTopics})`,
      sreeText: `${sree.overallPercentage}% (${sree.completedTopics}/${sree.totalTopics})`,
      tharunPct: tharun.overallPercentage,
      sreePct: sree.overallPercentage,
      barColor: 'bg-emerald-500',
    },
    {
      label: 'Study hours today',
      tharunText: formatStudyHours(tharun.studySecondsToday),
      sreeText: formatStudyHours(sree.studySecondsToday),
      tharunPct: Math.min(
        100,
        Math.round((tharun.studySecondsToday / maxHoursToday) * 100)
      ),
      sreePct: Math.min(100, Math.round((sree.studySecondsToday / maxHoursToday) * 100)),
      barColor: 'bg-blue-500',
    },
    {
      label: 'Weekly study hours',
      tharunText: formatStudyHours(tharun.studySecondsWeek),
      sreeText: formatStudyHours(sree.studySecondsWeek),
      tharunPct: Math.min(100, Math.round((tharun.studySecondsWeek / maxHoursWeek) * 100)),
      sreePct: Math.min(100, Math.round((sree.studySecondsWeek / maxHoursWeek) * 100)),
      barColor: 'bg-cyan-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Core Duo Progress Comparison Table */}
      <section className="bg-[#0B1220] border border-slate-800/90 rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-800/80">
          <h1 className="text-2xl font-semibold text-slate-100">Duo Progress Comparison</h1>
          <p className="text-sm text-slate-400 mt-1">
            Side-by-side live comparison between Tharun and Sreevishnu
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 bg-[#060B14]/70 text-xs font-medium text-slate-400">
                <th className="py-3.5 px-6 w-1/3">Progress</th>
                <th className="py-3.5 px-6 w-1/3">Tharun</th>
                <th className="py-3.5 px-6 w-1/3">Sreevishnu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {comparisonRows.map((row) => (
                <tr key={row.label} className="hover:bg-slate-900/30 transition-colors">
                  <td className="py-5 px-6 text-sm font-medium text-slate-200 align-top">
                    {row.label}
                  </td>
                  <td className="py-5 px-6 align-top">
                    <div className="space-y-2 max-w-xs">
                      <span className="text-sm font-semibold text-slate-100 font-mono-tabular">
                        {row.tharunText}
                      </span>
                      <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                        <div
                          className={`h-full ${row.barColor} transition-all duration-300`}
                          style={{ width: `${row.tharunPct}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6 align-top">
                    <div className="space-y-2 max-w-xs">
                      <span className="text-sm font-semibold text-slate-100 font-mono-tabular">
                        {row.sreeText}
                      </span>
                      <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                        <div
                          className={`h-full ${row.barColor} transition-all duration-300`}
                          style={{ width: `${row.sreePct}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. Subject-Wise Completion Comparison */}
      <section className="bg-[#0B1220] border border-slate-800/90 rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-800/80">
          <h2 className="text-lg font-semibold text-slate-100">
            Subject-Wise Syllabus Comparison
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Completion across all 10 official GATE 2027 ECE subjects
          </p>
        </div>

        <div className="divide-y divide-slate-800/70">
          {tharun.subjectStats.map((tSub, idx) => {
            const sSub = sree.subjectStats[idx];
            return (
              <div
                key={tSub.subjectId}
                className="px-6 py-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
              >
                <div className="md:col-span-4">
                  <p className="text-sm font-medium text-slate-100">{tSub.name}</p>
                  <p className="text-xs text-slate-500 font-mono-tabular">
                    {tSub.totalTopics} topics
                  </p>
                </div>

                <div className="md:col-span-4 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Tharun</span>
                    <span className="font-mono-tabular font-semibold text-slate-200">
                      {tSub.percentage}% ({tSub.completedTopics}/{tSub.totalTopics})
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        tSub.percentage === 100 ? 'bg-emerald-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${tSub.percentage}%` }}
                    />
                  </div>
                </div>

                <div className="md:col-span-4 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Sreevishnu</span>
                    <span className="font-mono-tabular font-semibold text-slate-200">
                      {sSub.percentage}% ({sSub.completedTopics}/{sSub.totalTopics})
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        sSub.percentage === 100 ? 'bg-emerald-500' : 'bg-cyan-500'
                      }`}
                      style={{ width: `${sSub.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

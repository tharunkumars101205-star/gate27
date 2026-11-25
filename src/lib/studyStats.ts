import { GATE_2027_ECE_SYLLABUS, TOTAL_SYLLABUS_TOPICS } from '../data/gateSyllabus';
import { getCurrentIstWeekDates, getIstDateString } from './istTime';
import type {
  StudentSummaryDoc,
  SyllabusProgressDoc,
  TaskSnapshotItem,
  TopicStatus,
} from '../types/study';

export interface SubjectCompletionStat {
  subjectId: string;
  code: string;
  name: string;
  totalTopics: number;
  completedTopics: number;
  inProgressTopics: number;
  notStartedTopics: number;
  percentage: number;
}

export interface StudentComputedStats {
  totalTopics: number;
  completedTopics: number;
  inProgressTopics: number;
  notStartedTopics: number;
  overallPercentage: number;
  subjectStats: SubjectCompletionStat[];
  todayCompletedTasksCount: number;
  todayPendingTasksCount: number;
  todayTasks: TaskSnapshotItem[];
  allPendingTasksCount: number;
  studySecondsToday: number;
  studySecondsWeek: number;
  studySecondsTotal: number;
}

export function computeStudentStats(
  syllabus: SyllabusProgressDoc | null,
  summary: StudentSummaryDoc | null,
  now: Date = new Date()
): StudentComputedStats {
  const statuses: Record<string, TopicStatus> = syllabus?.statuses ?? {};
  const todayIst = getIstDateString(now);
  const weekDates = getCurrentIstWeekDates(now);

  let completedTopics = 0;
  let inProgressTopics = 0;

  const subjectStats: SubjectCompletionStat[] = GATE_2027_ECE_SYLLABUS.map((subject) => {
    let subTotal = 0;
    let subCompleted = 0;
    let subInProgress = 0;

    for (const chapter of subject.chapters) {
      for (const topic of chapter.topics) {
        subTotal += 1;
        const st = statuses[topic.id] ?? 'not_started';
        if (st === 'completed') subCompleted += 1;
        else if (st === 'in_progress') subInProgress += 1;
      }
    }

    completedTopics += subCompleted;
    inProgressTopics += subInProgress;

    const percentage = subTotal > 0 ? Math.round((subCompleted / subTotal) * 100) : 0;

    return {
      subjectId: subject.id,
      code: subject.code,
      name: subject.name,
      totalTopics: subTotal,
      completedTopics: subCompleted,
      inProgressTopics: subInProgress,
      notStartedTopics: Math.max(0, subTotal - subCompleted - subInProgress),
      percentage,
    };
  });

  const overallPercentage =
    TOTAL_SYLLABUS_TOPICS > 0
      ? Math.round((completedTopics / TOTAL_SYLLABUS_TOPICS) * 100)
      : 0;

  const allTasks = summary?.tasksSnapshot ?? [];
  const todayTasks = allTasks.filter((t) => t.targetDate === todayIst);
  const todayCompletedTasksCount = todayTasks.filter((t) => t.completed).length;
  const todayPendingTasksCount = todayTasks.filter((t) => !t.completed).length;
  const allPendingTasksCount = allTasks.filter((t) => !t.completed).length;

  const dailyStudySeconds = summary?.dailyStudySeconds ?? {};
  const studySecondsToday = dailyStudySeconds[todayIst] ?? 0;
  const studySecondsWeek = weekDates.reduce(
    (sum, dt) => sum + (dailyStudySeconds[dt] ?? 0),
    0
  );
  const studySecondsTotal = summary?.totalStudySeconds ?? 0;

  return {
    totalTopics: TOTAL_SYLLABUS_TOPICS,
    completedTopics,
    inProgressTopics,
    notStartedTopics: Math.max(0, TOTAL_SYLLABUS_TOPICS - completedTopics - inProgressTopics),
    overallPercentage,
    subjectStats,
    todayCompletedTasksCount,
    todayPendingTasksCount,
    todayTasks,
    allPendingTasksCount,
    studySecondsToday,
    studySecondsWeek,
    studySecondsTotal,
  };
}

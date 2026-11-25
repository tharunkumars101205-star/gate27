export type ProfileId = 'tharun' | 'sreevishnu';

export type TopicStatus = 'not_started' | 'in_progress' | 'completed';

export type NavSection =
  | 'dashboard'
  | 'syllabus'
  | 'todo'
  | 'timer'
  | 'progress';

export interface SyllabusTopic {
  id: string;
  title: string;
}

export interface SyllabusChapter {
  id: string;
  title: string;
  topics: SyllabusTopic[];
}

export interface SyllabusSubject {
  id: string;
  code: string;
  name: string;
  chapters: SyllabusChapter[];
}

export interface StudentProfileDoc {
  profileId: ProfileId;
  displayName: 'Tharun' | 'Sreevishnu';
  ownerUid: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface GroupMemberDoc {
  uid: string;
  profileId: ProfileId;
  displayName: 'Tharun' | 'Sreevishnu';
  joinedAt?: unknown;
}

export interface StudyGroupDoc {
  groupId: 'gate-2027-ece';
  eceExamDate: string; // YYYY-MM-DDTHH:mm in IST
  createdByUid: string;
  updatedByUid: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface SyllabusProgressDoc {
  profileId: ProfileId;
  ownerUid: string;
  statuses: Record<string, TopicStatus>;
  completedCount: number;
  inProgressCount: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface TaskSnapshotItem {
  id: string;
  title: string;
  subjectId: string;
  topicId: string;
  topicTitle: string;
  targetDate: string;
  completed: boolean;
  completedAtMs: number;
  updatedAtMs: number;
}

export interface SessionSnapshotItem {
  id: string;
  subjectId: string;
  subjectName: string;
  mode: 'countdown' | 'stopwatch';
  durationSeconds: number;
  studyDate: string;
  note: string;
  createdAtMs: number;
}

export interface StudentSummaryDoc {
  profileId: ProfileId;
  ownerUid: string;
  tasksSnapshot: TaskSnapshotItem[];
  recentSessions: SessionSnapshotItem[];
  dailyStudySeconds: Record<string, number>;
  totalStudySeconds: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface DailyTaskDoc {
  id: string;
  profileId: ProfileId;
  ownerUid: string;
  visibleToUids: string[];
  title: string;
  subjectId: string;
  topicId: string;
  topicTitle: string;
  targetDate: string; // YYYY-MM-DD (IST)
  completed: boolean;
  completedAtMs: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface StudySessionDoc {
  id: string;
  profileId: ProfileId;
  ownerUid: string;
  visibleToUids: string[];
  subjectId: string;
  subjectName: string;
  mode: 'countdown' | 'stopwatch';
  durationSeconds: number;
  studyDate: string; // YYYY-MM-DD (IST)
  note: string;
  createdAt?: unknown;
}

/**
 * Security rules verification matrix for GATE 2027 ECE Duo Study Tracker.
 * Each of the 12 Dirty Dozen payloads targets a distinct invariant in firestore.rules.
 */
export interface DirtyDozenCase {
  id: number;
  name: string;
  targetPath: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  expected: 'PERMISSION_DENIED';
  payload?: Record<string, unknown>;
}

export const DIRTY_DOZEN_CASES: DirtyDozenCase[] = [
  { id: 1, name: 'Unauthenticated Read', targetPath: 'groups/gate-2027-ece', operation: 'get', expected: 'PERMISSION_DENIED' },
  { id: 2, name: 'Unverified Email Write', targetPath: 'users/u1', operation: 'create', expected: 'PERMISSION_DENIED', payload: { uid: 'u1' } },
  { id: 3, name: 'PII Cross-Read', targetPath: 'users/u1', operation: 'get', expected: 'PERMISSION_DENIED' },
  { id: 4, name: 'Shadow Field Injection on Task', targetPath: 'groups/gate-2027-ece/tasks/t1', operation: 'create', expected: 'PERMISSION_DENIED', payload: { isAdmin: true } },
  { id: 5, name: 'Identity Spoofing on Task', targetPath: 'groups/gate-2027-ece/tasks/t2', operation: 'create', expected: 'PERMISSION_DENIED', payload: { ownerUid: 'u1', profileId: 'tharun' } },
  { id: 6, name: 'Cross-Student Task Edit', targetPath: 'groups/gate-2027-ece/tasks/t1', operation: 'update', expected: 'PERMISSION_DENIED', payload: { completed: true } },
  { id: 7, name: 'Cross-Student Syllabus Tampering', targetPath: 'groups/gate-2027-ece/syllabusProgress/tharun', operation: 'update', expected: 'PERMISSION_DENIED', payload: { completedCount: 99 } },
  { id: 8, name: 'Rogue Third Profile Creation', targetPath: 'groups/gate-2027-ece/profiles/hacker', operation: 'create', expected: 'PERMISSION_DENIED', payload: { profileId: 'hacker' } },
  { id: 9, name: 'Non-Atomic Membership Forgery', targetPath: 'groups/gate-2027-ece/members/u3', operation: 'create', expected: 'PERMISSION_DENIED', payload: { uid: 'u3', profileId: 'tharun' } },
  { id: 10, name: 'ID Poisoning', targetPath: 'groups/gate-2027-ece/tasks/invalid..id', operation: 'create', expected: 'PERMISSION_DENIED' },
  { id: 11, name: 'Timestamp Forgery', targetPath: 'groups/gate-2027-ece/studySessions/s1', operation: 'create', expected: 'PERMISSION_DENIED', payload: { createdAt: '2020-01-01T00:00:00Z' } },
  { id: 12, name: 'Unbounded List Scraping', targetPath: 'groups/gate-2027-ece/tasks', operation: 'list', expected: 'PERMISSION_DENIED' },
];

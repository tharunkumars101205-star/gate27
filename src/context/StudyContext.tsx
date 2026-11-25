import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';
import { ALL_SYLLABUS_TOPICS_MAP, GATE_2027_ECE_SYLLABUS } from '../data/gateSyllabus';
import { DEFAULT_GATE_2027_EXAM_IST, getIstDateString } from '../lib/istTime';
import type {
  DailyTaskDoc,
  GroupMemberDoc,
  ProfileId,
  SessionSnapshotItem,
  StudentProfileDoc,
  StudentSummaryDoc,
  StudyGroupDoc,
  StudySessionDoc,
  SyllabusProgressDoc,
  TaskSnapshotItem,
  TopicStatus,
} from '../types/study';

const GROUP_ID = 'gate-2027-ece';

interface StudyContextValue {
  user: User | null;
  authReady: boolean;
  authError: string | null;
  signingIn: boolean;
  member: GroupMemberDoc | null;
  membershipChecked: boolean;
  claimingProfile: boolean;
  profiles: Record<ProfileId, StudentProfileDoc | null>;
  groupConfig: StudyGroupDoc | null;
  syllabusByProfile: Record<ProfileId, SyllabusProgressDoc | null>;
  summaryByProfile: Record<ProfileId, StudentSummaryDoc | null>;
  myTasks: DailyTaskDoc[];
  mySessions: StudySessionDoc[];
  myProfileId: ProfileId | null;
  partnerProfileId: ProfileId | null;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  claimProfile: (profileId: ProfileId) => Promise<void>;
  setTopicStatus: (topicId: string, status: TopicStatus) => Promise<void>;
  addTask: (input: {
    title: string;
    subjectId: string;
    topicId: string;
    targetDate: string;
  }) => Promise<void>;
  toggleTask: (taskId: string) => Promise<void>;
  updateTask: (
    taskId: string,
    updates: {
      title: string;
      subjectId: string;
      topicId: string;
      targetDate: string;
    }
  ) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  saveStudySession: (input: {
    subjectId: string;
    mode: 'countdown' | 'stopwatch';
    durationSeconds: number;
    note?: string;
  }) => Promise<void>;
  updateExamDate: (istDateTime: string) => Promise<void>;
}

const StudyContext = createContext<StudyContextValue | null>(null);

function makeId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${Date.now()}_${rand}`.replace(/[^a-zA-Z0-9_-]/g, '_');
}

function buildTasksSnapshot(tasks: DailyTaskDoc[]): TaskSnapshotItem[] {
  return [...tasks]
    .sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      if (a.targetDate !== b.targetDate) return b.targetDate.localeCompare(a.targetDate);
      return b.id.localeCompare(a.id);
    })
    .slice(0, 200)
    .map((t) => ({
      id: t.id,
      title: t.title,
      subjectId: t.subjectId,
      topicId: t.topicId,
      topicTitle: t.topicTitle,
      targetDate: t.targetDate,
      completed: t.completed,
      completedAtMs: t.completedAtMs,
      updatedAtMs: Date.now(),
    }));
}

function buildSessionsSnapshot(sessions: StudySessionDoc[]): SessionSnapshotItem[] {
  return [...sessions]
    .sort((a, b) => b.id.localeCompare(a.id))
    .slice(0, 50)
    .map((s) => ({
      id: s.id,
      subjectId: s.subjectId,
      subjectName: s.subjectName,
      mode: s.mode,
      durationSeconds: s.durationSeconds,
      studyDate: s.studyDate,
      note: s.note,
      createdAtMs: Date.now(),
    }));
}

export function StudyProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  const [member, setMember] = useState<GroupMemberDoc | null>(null);
  const [membershipChecked, setMembershipChecked] = useState(false);
  const [claimingProfile, setClaimingProfile] = useState(false);

  const [profiles, setProfiles] = useState<Record<ProfileId, StudentProfileDoc | null>>({
    tharun: null,
    sreevishnu: null,
  });

  const [groupConfig, setGroupConfig] = useState<StudyGroupDoc | null>(null);

  const [syllabusByProfile, setSyllabusByProfile] = useState<
    Record<ProfileId, SyllabusProgressDoc | null>
  >({
    tharun: null,
    sreevishnu: null,
  });

  const [summaryByProfile, setSummaryByProfile] = useState<
    Record<ProfileId, StudentSummaryDoc | null>
  >({
    tharun: null,
    sreevishnu: null,
  });

  const [myTasks, setMyTasks] = useState<DailyTaskDoc[]>([]);
  const [mySessions, setMySessions] = useState<StudySessionDoc[]>([]);

  // 1. Auth state listener & private user record sync
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setAuthReady(true);

      if (!firebaseUser) {
        setMember(null);
        setMembershipChecked(true);
        setProfiles({ tharun: null, sreevishnu: null });
        setGroupConfig(null);
        setSyllabusByProfile({ tharun: null, sreevishnu: null });
        setSummaryByProfile({ tharun: null, sreevishnu: null });
        setMyTasks([]);
        setMySessions([]);
        return;
      }

      setMembershipChecked(false);
      const userPath = `users/${firebaseUser.uid}`;
      try {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const snap = await getDoc(userRef);
        const safeEmail = (firebaseUser.email || 'unknown@example.com').slice(0, 254);
        const safeName = (firebaseUser.displayName || 'GATE Student').slice(0, 100);

        if (!snap.exists()) {
          await setDoc(userRef, {
            uid: firebaseUser.uid,
            email: safeEmail,
            displayName: safeName,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } else {
          await updateDoc(userRef, {
            email: safeEmail,
            displayName: safeName,
            updatedAt: serverTimestamp(),
          });
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, userPath);
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Listen to profiles (tharun / sreevishnu) and current user's membership
  useEffect(() => {
    if (!authReady || !user) return;

    const tharunProfilePath = `groups/${GROUP_ID}/profiles/tharun`;
    const sreeProfilePath = `groups/${GROUP_ID}/profiles/sreevishnu`;
    const memberPath = `groups/${GROUP_ID}/members/${user.uid}`;

    const unsubTharun = onSnapshot(
      doc(db, 'groups', GROUP_ID, 'profiles', 'tharun'),
      (snap) => {
        setProfiles((prev) => ({
          ...prev,
          tharun: snap.exists() ? (snap.data() as StudentProfileDoc) : null,
        }));
      },
      (err) => handleFirestoreError(err, OperationType.GET, tharunProfilePath)
    );

    const unsubSree = onSnapshot(
      doc(db, 'groups', GROUP_ID, 'profiles', 'sreevishnu'),
      (snap) => {
        setProfiles((prev) => ({
          ...prev,
          sreevishnu: snap.exists() ? (snap.data() as StudentProfileDoc) : null,
        }));
      },
      (err) => handleFirestoreError(err, OperationType.GET, sreeProfilePath)
    );

    const unsubMember = onSnapshot(
      doc(db, 'groups', GROUP_ID, 'members', user.uid),
      (snap) => {
        setMember(snap.exists() ? (snap.data() as GroupMemberDoc) : null);
        setMembershipChecked(true);
      },
      (err) => handleFirestoreError(err, OperationType.GET, memberPath)
    );

    return () => {
      unsubTharun();
      unsubSree();
      unsubMember();
    };
  }, [authReady, user]);

  // 3. Once verified member, subscribe to shared group config, both students' syllabusProgress & studentSummaries, and own tasks/sessions
  useEffect(() => {
    if (!authReady || !user || !member) return;

    const groupPath = `groups/${GROUP_ID}`;
    const unsubGroup = onSnapshot(
      doc(db, 'groups', GROUP_ID),
      (snap) => {
        setGroupConfig(snap.exists() ? (snap.data() as StudyGroupDoc) : null);
      },
      (err) => handleFirestoreError(err, OperationType.GET, groupPath)
    );

    const unsubSylTharun = onSnapshot(
      doc(db, 'groups', GROUP_ID, 'syllabusProgress', 'tharun'),
      (snap) => {
        setSyllabusByProfile((prev) => ({
          ...prev,
          tharun: snap.exists() ? (snap.data() as SyllabusProgressDoc) : null,
        }));
      },
      (err) =>
        handleFirestoreError(err, OperationType.GET, `groups/${GROUP_ID}/syllabusProgress/tharun`)
    );

    const unsubSylSree = onSnapshot(
      doc(db, 'groups', GROUP_ID, 'syllabusProgress', 'sreevishnu'),
      (snap) => {
        setSyllabusByProfile((prev) => ({
          ...prev,
          sreevishnu: snap.exists() ? (snap.data() as SyllabusProgressDoc) : null,
        }));
      },
      (err) =>
        handleFirestoreError(
          err,
          OperationType.GET,
          `groups/${GROUP_ID}/syllabusProgress/sreevishnu`
        )
    );

    const unsubSumTharun = onSnapshot(
      doc(db, 'groups', GROUP_ID, 'studentSummaries', 'tharun'),
      (snap) => {
        setSummaryByProfile((prev) => ({
          ...prev,
          tharun: snap.exists() ? (snap.data() as StudentSummaryDoc) : null,
        }));
      },
      (err) =>
        handleFirestoreError(err, OperationType.GET, `groups/${GROUP_ID}/studentSummaries/tharun`)
    );

    const unsubSumSree = onSnapshot(
      doc(db, 'groups', GROUP_ID, 'studentSummaries', 'sreevishnu'),
      (snap) => {
        setSummaryByProfile((prev) => ({
          ...prev,
          sreevishnu: snap.exists() ? (snap.data() as StudentSummaryDoc) : null,
        }));
      },
      (err) =>
        handleFirestoreError(
          err,
          OperationType.GET,
          `groups/${GROUP_ID}/studentSummaries/sreevishnu`
        )
    );

    const tasksPath = `groups/${GROUP_ID}/tasks`;
    const tasksQuery = query(
      collection(db, 'groups', GROUP_ID, 'tasks'),
      where('ownerUid', '==', user.uid)
    );
    const unsubTasks = onSnapshot(
      tasksQuery,
      (snap) => {
        const items = snap.docs.map((d) => d.data() as DailyTaskDoc);
        setMyTasks(items);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, tasksPath)
    );

    const sessionsPath = `groups/${GROUP_ID}/studySessions`;
    const sessionsQuery = query(
      collection(db, 'groups', GROUP_ID, 'studySessions'),
      where('ownerUid', '==', user.uid)
    );
    const unsubSessions = onSnapshot(
      sessionsQuery,
      (snap) => {
        const items = snap.docs.map((d) => d.data() as StudySessionDoc);
        setMySessions(items);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, sessionsPath)
    );

    return () => {
      unsubGroup();
      unsubSylTharun();
      unsubSylSree();
      unsubSumTharun();
      unsubSumSree();
      unsubTasks();
      unsubSessions();
    };
  }, [authReady, user, member]);

  const myProfileId: ProfileId | null = member?.profileId ?? null;
  const partnerProfileId: ProfileId | null =
    myProfileId === 'tharun' ? 'sreevishnu' : myProfileId === 'sreevishnu' ? 'tharun' : null;

  const partnerUid = partnerProfileId ? profiles[partnerProfileId]?.ownerUid ?? null : null;

  // Ensure initial syllabusProgress and studentSummaries exist for the claimed profile
  useEffect(() => {
    if (!user || !member) return;
    const pid = member.profileId;

    async function ensureInitialized() {
      const sylRef = doc(db, 'groups', GROUP_ID, 'syllabusProgress', pid);
      const sumRef = doc(db, 'groups', GROUP_ID, 'studentSummaries', pid);
      try {
        const [sylSnap, sumSnap] = await Promise.all([getDoc(sylRef), getDoc(sumRef)]);
        if (!sylSnap.exists()) {
          await setDoc(sylRef, {
            profileId: pid,
            ownerUid: user!.uid,
            statuses: {},
            completedCount: 0,
            inProgressCount: 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
        if (!sumSnap.exists()) {
          await setDoc(sumRef, {
            profileId: pid,
            ownerUid: user!.uid,
            tasksSnapshot: [],
            recentSessions: [],
            dailyStudySeconds: {},
            totalStudySeconds: 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `groups/${GROUP_ID}/studentSummaries/${pid}`);
      }
    }

    void ensureInitialized();
  }, [user, member]);

  // Keep visibleToUids synced when partner joins after tasks/sessions were created
  useEffect(() => {
    if (!user || !partnerUid) return;

    const tasksNeedingPartner = myTasks.filter((t) => !t.visibleToUids.includes(partnerUid));
    const sessionsNeedingPartner = mySessions.filter((s) => !s.visibleToUids.includes(partnerUid));

    if (tasksNeedingPartner.length === 0 && sessionsNeedingPartner.length === 0) return;

    const syncVisibility = async () => {
      try {
        const batch = writeBatch(db);
        const visibleToUids = [user.uid, partnerUid];
        for (const t of tasksNeedingPartner.slice(0, 50)) {
          batch.update(doc(db, 'groups', GROUP_ID, 'tasks', t.id), {
            visibleToUids,
            updatedAt: serverTimestamp(),
          });
        }
        for (const s of sessionsNeedingPartner.slice(0, 50)) {
          batch.update(doc(db, 'groups', GROUP_ID, 'studySessions', s.id), {
            visibleToUids,
          });
        }
        await batch.commit();
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `groups/${GROUP_ID}/tasks`);
      }
    };

    void syncVisibility();
  }, [user, partnerUid, myTasks, mySessions]);

  const signInWithGoogle = async () => {
    setAuthError(null);
    setSigningIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Sign-in failed. Please try again.';
      setAuthError(msg);
    } finally {
      setSigningIn(false);
    }
  };

  const logout = async () => {
    setAuthError(null);
    await signOut(auth);
  };

  const claimProfile = async (profileId: ProfileId) => {
    if (!user) return;
    setClaimingProfile(true);
    setAuthError(null);
    const displayName = profileId === 'tharun' ? 'Tharun' : 'Sreevishnu';

    try {
      const groupRef = doc(db, 'groups', GROUP_ID);
      const profileRef = doc(db, 'groups', GROUP_ID, 'profiles', profileId);
      const memberRef = doc(db, 'groups', GROUP_ID, 'members', user.uid);

      const batch = writeBatch(db);
      const [groupSnap, profileSnap] = await Promise.all([
        getDoc(groupRef).catch(() => null),
        getDoc(profileRef),
      ]);

      if (profileSnap.exists()) {
        throw new Error(`${displayName}'s profile is already claimed by another Google account.`);
      }

      if (!groupSnap || !groupSnap.exists()) {
        batch.set(groupRef, {
          groupId: GROUP_ID,
          eceExamDate: DEFAULT_GATE_2027_EXAM_IST,
          createdByUid: user.uid,
          updatedByUid: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      batch.set(profileRef, {
        profileId,
        displayName,
        ownerUid: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      batch.set(memberRef, {
        uid: user.uid,
        profileId,
        displayName,
        joinedAt: serverTimestamp(),
      });

      await batch.commit();
    } catch (err) {
      if (err instanceof Error && err.message.includes('already claimed')) {
        setAuthError(err.message);
      } else {
        handleFirestoreError(err, OperationType.WRITE, `groups/${GROUP_ID}/profiles/${profileId}`);
      }
    } finally {
      setClaimingProfile(false);
    }
  };

  const setTopicStatus = async (topicId: string, status: TopicStatus) => {
    if (!user || !myProfileId) return;
    const path = `groups/${GROUP_ID}/syllabusProgress/${myProfileId}`;
    const current = syllabusByProfile[myProfileId];
    const nextStatuses: Record<string, TopicStatus> = { ...(current?.statuses ?? {}) };

    if (status === 'not_started') {
      delete nextStatuses[topicId];
    } else {
      nextStatuses[topicId] = status;
    }

    let completedCount = 0;
    let inProgressCount = 0;
    for (const val of Object.values(nextStatuses)) {
      if (val === 'completed') completedCount += 1;
      else if (val === 'in_progress') inProgressCount += 1;
    }

    try {
      const ref = doc(db, 'groups', GROUP_ID, 'syllabusProgress', myProfileId);
      if (!current) {
        await setDoc(ref, {
          profileId: myProfileId,
          ownerUid: user.uid,
          statuses: nextStatuses,
          completedCount,
          inProgressCount,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } else {
        await updateDoc(ref, {
          statuses: nextStatuses,
          completedCount,
          inProgressCount,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const getVisibleToUids = (): string[] => {
    if (!user) return [];
    if (partnerUid && partnerUid !== user.uid) {
      return [user.uid, partnerUid];
    }
    return [user.uid];
  };

  const addTask = async (input: {
    title: string;
    subjectId: string;
    topicId: string;
    targetDate: string;
  }) => {
    if (!user || !myProfileId) return;
    const trimmedTitle = input.title.trim().slice(0, 200);
    if (!trimmedTitle) return;

    const taskId = makeId('task');
    const topicInfo = input.topicId ? ALL_SYLLABUS_TOPICS_MAP[input.topicId] : undefined;
    const targetDate = /^\d{4}-\d{2}-\d{2}$/.test(input.targetDate)
      ? input.targetDate
      : getIstDateString();

    const newTask: DailyTaskDoc = {
      id: taskId,
      profileId: myProfileId,
      ownerUid: user.uid,
      visibleToUids: getVisibleToUids(),
      title: trimmedTitle,
      subjectId: input.subjectId.slice(0, 60),
      topicId: (input.topicId || '').slice(0, 100),
      topicTitle: (topicInfo?.topicTitle || '').slice(0, 200),
      targetDate,
      completed: false,
      completedAtMs: 0,
    };

    const nextTasksSnapshot = buildTasksSnapshot([newTask, ...myTasks]);

    try {
      const batch = writeBatch(db);
      batch.set(doc(db, 'groups', GROUP_ID, 'tasks', taskId), {
        ...newTask,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      batch.update(doc(db, 'groups', GROUP_ID, 'studentSummaries', myProfileId), {
        tasksSnapshot: nextTasksSnapshot,
        updatedAt: serverTimestamp(),
      });
      await batch.commit();
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `groups/${GROUP_ID}/tasks/${taskId}`);
    }
  };

  const toggleTask = async (taskId: string) => {
    if (!user || !myProfileId) return;
    const existingTask = myTasks.find((t) => t.id === taskId);
    if (!existingTask) return;

    const nextCompleted = !existingTask.completed;
    const nextCompletedAtMs = nextCompleted ? Date.now() : 0;

    const updatedTasks = myTasks.map((t) =>
      t.id === taskId
        ? { ...t, completed: nextCompleted, completedAtMs: nextCompletedAtMs }
        : t
    );

    try {
      const batch = writeBatch(db);
      batch.update(doc(db, 'groups', GROUP_ID, 'tasks', taskId), {
        completed: nextCompleted,
        completedAtMs: nextCompletedAtMs,
        updatedAt: serverTimestamp(),
      });
      batch.update(doc(db, 'groups', GROUP_ID, 'studentSummaries', myProfileId), {
        tasksSnapshot: buildTasksSnapshot(updatedTasks),
        updatedAt: serverTimestamp(),
      });
      await batch.commit();
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `groups/${GROUP_ID}/tasks/${taskId}`);
    }
  };

  const updateTask = async (
    taskId: string,
    updates: {
      title: string;
      subjectId: string;
      topicId: string;
      targetDate: string;
    }
  ) => {
    if (!user || !myProfileId) return;
    const existingTask = myTasks.find((t) => t.id === taskId);
    if (!existingTask) return;

    const trimmedTitle = updates.title.trim().slice(0, 200);
    if (!trimmedTitle) return;

    const topicInfo = updates.topicId ? ALL_SYLLABUS_TOPICS_MAP[updates.topicId] : undefined;
    const targetDate = /^\d{4}-\d{2}-\d{2}$/.test(updates.targetDate)
      ? updates.targetDate
      : existingTask.targetDate;

    const updatedTask: DailyTaskDoc = {
      ...existingTask,
      title: trimmedTitle,
      subjectId: updates.subjectId.slice(0, 60),
      topicId: (updates.topicId || '').slice(0, 100),
      topicTitle: (topicInfo?.topicTitle || '').slice(0, 200),
      targetDate,
    };

    const updatedTasks = myTasks.map((t) => (t.id === taskId ? updatedTask : t));

    try {
      const batch = writeBatch(db);
      batch.update(doc(db, 'groups', GROUP_ID, 'tasks', taskId), {
        title: updatedTask.title,
        subjectId: updatedTask.subjectId,
        topicId: updatedTask.topicId,
        topicTitle: updatedTask.topicTitle,
        targetDate: updatedTask.targetDate,
        updatedAt: serverTimestamp(),
      });
      batch.update(doc(db, 'groups', GROUP_ID, 'studentSummaries', myProfileId), {
        tasksSnapshot: buildTasksSnapshot(updatedTasks),
        updatedAt: serverTimestamp(),
      });
      await batch.commit();
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `groups/${GROUP_ID}/tasks/${taskId}`);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!user || !myProfileId) return;
    const remaining = myTasks.filter((t) => t.id !== taskId);

    try {
      const batch = writeBatch(db);
      batch.delete(doc(db, 'groups', GROUP_ID, 'tasks', taskId));
      batch.update(doc(db, 'groups', GROUP_ID, 'studentSummaries', myProfileId), {
        tasksSnapshot: buildTasksSnapshot(remaining),
        updatedAt: serverTimestamp(),
      });
      await batch.commit();
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `groups/${GROUP_ID}/tasks/${taskId}`);
    }
  };

  const saveStudySession = async (input: {
    subjectId: string;
    mode: 'countdown' | 'stopwatch';
    durationSeconds: number;
    note?: string;
  }) => {
    if (!user || !myProfileId) return;
    const durationSeconds = Math.min(43200, Math.max(60, Math.round(input.durationSeconds)));
    const subject = GATE_2027_ECE_SYLLABUS.find((s) => s.id === input.subjectId);
    const subjectName = (subject?.name || 'GATE 2027 ECE').slice(0, 100);
    const studyDate = getIstDateString();
    const sessionId = makeId('sess');
    const safeNote = (input.note || '').trim().slice(0, 200);

    const newSession: StudySessionDoc = {
      id: sessionId,
      profileId: myProfileId,
      ownerUid: user.uid,
      visibleToUids: getVisibleToUids(),
      subjectId: input.subjectId.slice(0, 60),
      subjectName,
      mode: input.mode,
      durationSeconds,
      studyDate,
      note: safeNote,
    };

    const currentSummary = summaryByProfile[myProfileId];
    const nextDailyStudySeconds = { ...(currentSummary?.dailyStudySeconds ?? {}) };
    nextDailyStudySeconds[studyDate] = (nextDailyStudySeconds[studyDate] ?? 0) + durationSeconds;

    // Keep last 365 days max to honor blueprint/rules bounds
    const sortedKeys = Object.keys(nextDailyStudySeconds).sort();
    while (sortedKeys.length > 365) {
      const oldest = sortedKeys.shift();
      if (oldest) delete nextDailyStudySeconds[oldest];
    }

    const nextTotalStudySeconds = (currentSummary?.totalStudySeconds ?? 0) + durationSeconds;
    const nextRecentSessions = buildSessionsSnapshot([newSession, ...mySessions]);

    try {
      const batch = writeBatch(db);
      batch.set(doc(db, 'groups', GROUP_ID, 'studySessions', sessionId), {
        ...newSession,
        createdAt: serverTimestamp(),
      });
      batch.update(doc(db, 'groups', GROUP_ID, 'studentSummaries', myProfileId), {
        recentSessions: nextRecentSessions,
        dailyStudySeconds: nextDailyStudySeconds,
        totalStudySeconds: nextTotalStudySeconds,
        updatedAt: serverTimestamp(),
      });
      await batch.commit();
    } catch (err) {
      handleFirestoreError(
        err,
        OperationType.CREATE,
        `groups/${GROUP_ID}/studySessions/${sessionId}`
      );
    }
  };

  const updateExamDate = async (istDateTime: string) => {
    if (!user || !member) return;
    if (!/^2027-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):[0-5][0-9]$/.test(istDateTime)) {
      return;
    }

    try {
      await updateDoc(doc(db, 'groups', GROUP_ID), {
        eceExamDate: istDateTime,
        updatedByUid: user.uid,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `groups/${GROUP_ID}`);
    }
  };

  const value = useMemo<StudyContextValue>(
    () => ({
      user,
      authReady,
      authError,
      signingIn,
      member,
      membershipChecked,
      claimingProfile,
      profiles,
      groupConfig,
      syllabusByProfile,
      summaryByProfile,
      myTasks,
      mySessions,
      myProfileId,
      partnerProfileId,
      signInWithGoogle,
      logout,
      claimProfile,
      setTopicStatus,
      addTask,
      toggleTask,
      updateTask,
      deleteTask,
      saveStudySession,
      updateExamDate,
    }),
    [
      user,
      authReady,
      authError,
      signingIn,
      member,
      membershipChecked,
      claimingProfile,
      profiles,
      groupConfig,
      syllabusByProfile,
      summaryByProfile,
      myTasks,
      mySessions,
      myProfileId,
      partnerProfileId,
    ]
  );

  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
}

export function useStudy(): StudyContextValue {
  const ctx = useContext(StudyContext);
  if (!ctx) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return ctx;
}

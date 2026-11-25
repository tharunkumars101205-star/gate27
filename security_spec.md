# Security Specification: GATE 2027 ECE Duo Study Tracker

## 1. Data Invariants
1. Only authenticated users with verified emails (`request.auth.token.email_verified == true`) can interact with the database.
2. Private PII (`email`) is strictly isolated in `/users/{userId}` and readable/writable only by `request.auth.uid == userId`.
3. Only the fixed private study group `gate-2027-ece` and the two student slots (`tharun`, `sreevishnu`) exist.
4. Claiming a student profile (`profiles/{profileId}`) and creating a membership (`members/{uid}`) must occur atomically via `existsAfter` / `getAfter` so at most two users (Tharun and Sreevishnu) can join the private study group.
5. Students can read each other's syllabus progress, daily tasks, and study hours, but can ONLY create, update, or delete their own owned records (`ownerUid == request.auth.uid` and matching `members/{uid}.profileId`).
6. All `ownerUid`, `profileId`, `id`, and `createdAt` fields are immutable after creation; `createdAt` and `updatedAt` must equal `request.time`.
7. No `list` rules execute `get()` or `exists()`; list queries strictly evaluate `resource.data` against `request.auth.uid`.

## 2. The "Dirty Dozen" Payloads (All Must Return PERMISSION_DENIED)
1. **Unauthenticated Read**: `get(/groups/gate-2027-ece)` with `auth == null`.
2. **Unverified Email Write**: `create(/users/u1, ...)` with `email_verified: false`.
3. **PII Cross-Read**: User B (`u2`) reading `/users/u1` (Tharun's email).
4. **Shadow Field Injection on Task**: `create(/groups/gate-2027-ece/tasks/t1, { ..., isAdmin: true })`.
5. **Identity Spoofing on Task**: User B (`u2`) creating a task with `ownerUid: "u1"` and `profileId: "tharun"`.
6. **Cross-Student Task Edit**: User B (`u2`) updating User A's (`u1`) task `completed: true`.
7. **Cross-Student Syllabus Tampering**: User B (`u2`) updating `/groups/gate-2027-ece/syllabusProgress/tharun`.
8. **Rogue Third Profile Creation**: User C (`u3`) creating `/groups/gate-2027-ece/profiles/hacker`.
9. **Non-Atomic Membership Forgery**: User C (`u3`) creating `/groups/gate-2027-ece/members/u3` without atomically claiming an unclaimed profile.
10. **ID Poisoning**: Creating a task with a 1500-character ID or invalid characters (`../evil`).
11. **Timestamp Forgery**: Creating a study session with backdated `createdAt` (`new Date('2020-01-01')`) instead of `serverTimestamp()`.
12. **Unbounded List / Blanket Scraping**: `list(/groups/gate-2027-ece/tasks)` by an outsider `u3` whose UID is neither `ownerUid` nor in `visibleToUids`.

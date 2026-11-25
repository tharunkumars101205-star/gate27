const IST_TIMEZONE = 'Asia/Kolkata';

export const DEFAULT_GATE_2027_EXAM_IST = '2027-02-06T09:30';

/**
 * Returns YYYY-MM-DD in Indian Standard Time (IST, UTC+05:30).
 */
export function getIstDateString(date: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: IST_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const year = parts.find((p) => p.type === 'year')?.value ?? '2026';
  const month = parts.find((p) => p.type === 'month')?.value ?? '01';
  const day = parts.find((p) => p.type === 'day')?.value ?? '01';
  return `${year}-${month}-${day}`;
}

/**
 * Returns human-readable today's date in IST, e.g., "Wednesday, 25 Nov 2026".
 */
export function formatIstDisplayDate(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: IST_TIMEZONE,
    weekday: 'long',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

/**
 * Formats YYYY-MM-DD string cleanly for UI display.
 */
export function formatDateLabel(dateStr: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const [y, m, d] = dateStr.split('-').map(Number);
  const utc = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: IST_TIMEZONE,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(utc);
}

/**
 * Parses an IST datetime string (YYYY-MM-DDTHH:mm) into UTC epoch milliseconds.
 */
export function parseIstDateTimeToMs(istDateTime: string): number {
  const safe = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(istDateTime)
    ? istDateTime
    : DEFAULT_GATE_2027_EXAM_IST;
  return new Date(`${safe}:00+05:30`).getTime();
}

export interface CountdownBreakdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export function getIstCountdown(targetIstDateTime: string, nowMs: number = Date.now()): CountdownBreakdown {
  const targetMs = parseIstDateTimeToMs(targetIstDateTime);
  const diffMs = targetMs - nowMs;

  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, isPast: false };
}

/**
 * Returns the 7 IST date strings (Monday -> Sunday) for the current IST week.
 */
export function getCurrentIstWeekDates(now: Date = new Date()): string[] {
  const todayIst = getIstDateString(now);
  const [y, m, d] = todayIst.split('-').map(Number);
  const noonUtc = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const dayOfWeek = noonUtc.getUTCDay(); // 0=Sun, 1=Mon, ...
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const dt = new Date(noonUtc.getTime() + (mondayOffset + i) * 86400 * 1000);
    const yy = dt.getUTCFullYear();
    const mm = String(dt.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(dt.getUTCDate()).padStart(2, '0');
    dates.push(`${yy}-${mm}-${dd}`);
  }
  return dates;
}

export function formatStudyHours(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds <= 0) return '0.0h';
  const hours = totalSeconds / 3600;
  return `${hours.toFixed(1)}h`;
}

export function formatDurationClock(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const hrs = Math.floor(clamped / 3600);
  const mins = Math.floor((clamped % 3600) / 60);
  const secs = clamped % 60;
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function formatExamIstDisplay(istDateTime: string): string {
  const ms = parseIstDateTimeToMs(istDateTime);
  return (
    new Intl.DateTimeFormat('en-IN', {
      timeZone: IST_TIMEZONE,
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(ms)) + ' IST'
  );
}

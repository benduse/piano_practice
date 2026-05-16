// progress-store.js — shared storage module
// Used by: plan-timeline.js, index.html dashboard widget
// Storage key: 'piano_progress'
//
// Schema:
// {
//   completedWeeks:  number[],          // e.g. [1, 2, 3]
//   completedTasks:  { [weekId]: number[] }, // e.g. { "1": [0, 2] }
//   startDate:       string | null,     // ISO date "YYYY-MM-DD"
//   streakDates:     string[],          // ISO dates of each practice session
// }

const PROGRESS_KEY = 'piano_progress';
const TOTAL_WEEKS  = 12;
const DAYS_PER_WEEK = 7;

// ── Read / Write ─────────────────────────────────────────────────────────────

function getProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      // Ensure all fields exist for older saves
      p.completedWeeks  = p.completedWeeks  || [];
      p.completedTasks  = p.completedTasks  || {};
      p.startDate       = p.startDate       || null;
      p.streakDates     = p.streakDates     || [];
      return p;
    }
  } catch (_) {}
  return { completedWeeks: [], completedTasks: {}, startDate: null, streakDates: [] };
}

function setProgress(state) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(state));
}

function clearProgress() {
  localStorage.removeItem(PROGRESS_KEY);
}

// ── Streak ───────────────────────────────────────────────────────────────────

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

// Records today as a practice session. Call on any meaningful interaction.
function recordPracticeDay(state) {
  const today = todayISO();
  if (!state.streakDates.includes(today)) {
    state.streakDates.push(today);
  }
  return state;
}

// Returns current consecutive-day streak count
function calcStreak(streakDates) {
  if (!streakDates.length) return 0;
  const sorted = [...streakDates].sort().reverse(); // newest first
  let streak = 0;
  let cursor = new Date(todayISO());

  for (const dateStr of sorted) {
    const d = new Date(dateStr);
    const diff = Math.round((cursor - d) / 86400000); // ms → days
    if (diff === 0 || diff === 1) {
      streak++;
      cursor = d;
    } else {
      break;
    }
  }
  return streak;
}

// ── Estimated completion ─────────────────────────────────────────────────────

// Returns estimated finish date string, or null if not enough data
function estimatedCompletion(state) {
  const done = state.completedWeeks.length;
  if (!state.startDate || done === 0) return null;

  const start     = new Date(state.startDate);
  const today     = new Date(todayISO());
  const daysElapsed = Math.max(1, Math.round((today - start) / 86400000));
  const daysPerWeek = daysElapsed / done;
  const weeksLeft   = TOTAL_WEEKS - done;
  const daysLeft    = Math.round(weeksLeft * daysPerWeek);

  const finish = new Date(today);
  finish.setDate(finish.getDate() + daysLeft);

  return finish.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

// ── Export / Import ──────────────────────────────────────────────────────────

function exportProgress() {
  const state = getProgress();
  const json  = JSON.stringify(state, null, 2);
  const blob  = new Blob([json], { type: 'application/json' });
  const url   = URL.createObjectURL(blob);
  const a     = document.createElement('a');
  a.href      = url;
  a.download  = `piano-progress-${todayISO()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importProgress(file, onDone) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const parsed = JSON.parse(e.target.result);
      // Basic validation
      if (!Array.isArray(parsed.completedWeeks)) throw new Error('Invalid file');
      parsed.completedTasks = parsed.completedTasks || {};
      parsed.streakDates    = parsed.streakDates    || [];
      setProgress(parsed);
      if (typeof onDone === 'function') onDone();
    } catch (_) {
      alert('Could not import: invalid progress file.');
    }
  };
  reader.readAsText(file);
}

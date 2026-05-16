// plan-timeline.js — interactive timeline renderer
// Depends on: plan-data.js (PLAN_DATA), progress-store.js

// ── Reset ────────────────────────────────────────────────────────────────────

function resetProgress() {
  if (!confirm('Reset all progress? This cannot be undone.')) return;
  clearProgress();
  renderTimeline();
}

// ── Status helpers ───────────────────────────────────────────────────────────

function weekStatus(weekId, completedWeeks) {
  if (completedWeeks.includes(weekId)) return 'done';
  const nextId = nextIncomplete(completedWeeks);
  if (weekId === nextId) return 'current';
  return 'locked';
}

function nextIncomplete(completedWeeks) {
  for (let i = 1; i <= TOTAL_WEEKS; i++) {
    if (!completedWeeks.includes(i)) return i;
  }
  return null;
}

// ── Mark week complete ───────────────────────────────────────────────────────

function markComplete(weekId) {
  let state = getProgress();
  if (state.completedWeeks.includes(weekId)) return;
  if (!state.startDate) state.startDate = todayISO();
  state.completedWeeks.push(weekId);
  state = recordPracticeDay(state);
  setProgress(state);
  celebrateWeek();
  renderTimeline();
  const next = nextIncomplete(state.completedWeeks);
  if (next) expandNode(next);
}

// ── Per-task checkbox ────────────────────────────────────────────────────────

function toggleTask(weekId, taskIndex) {
  let state = getProgress();
  const key  = String(weekId);
  state.completedTasks[key] = state.completedTasks[key] || [];
  const idx = state.completedTasks[key].indexOf(taskIndex);
  if (idx === -1) {
    state.completedTasks[key].push(taskIndex);
  } else {
    state.completedTasks[key].splice(idx, 1);
  }
  state = recordPracticeDay(state);
  setProgress(state);
  // Update just the checkbox UI — no full re-render needed
  const cb = document.querySelector(`.tl-task-cb[data-week="${weekId}"][data-task="${taskIndex}"]`);
  if (cb) {
    const done = state.completedTasks[key].includes(taskIndex);
    cb.checked = done;
    cb.closest('li').classList.toggle('tl-task--done', done);
  }
  updateStreakBadge(state);
}

// ── Expand / collapse ────────────────────────────────────────────────────────

let openWeekId = null;

function expandNode(weekId) {
  openWeekId = weekId;
  document.querySelectorAll('.tl-detail').forEach(el => {
    el.hidden = Number(el.dataset.week) !== weekId;
  });
  document.querySelectorAll('.tl-node').forEach(el => {
    el.classList.toggle('tl-node--open', Number(el.dataset.week) === weekId);
  });
  const node = document.querySelector(`.tl-node[data-week="${weekId}"]`);
  if (node) node.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function toggleNode(weekId, status) {
  if (status === 'locked') return;
  openWeekId === weekId ? (openWeekId = null, collapseAll()) : expandNode(weekId);
}

function collapseAll() {
  document.querySelectorAll('.tl-detail').forEach(el => (el.hidden = true));
  document.querySelectorAll('.tl-node').forEach(el => el.classList.remove('tl-node--open'));
}

// ── Streak badge live update ─────────────────────────────────────────────────

function updateStreakBadge(state) {
  const badge = document.getElementById('tl-streak-count');
  if (badge) badge.textContent = calcStreak(state.streakDates);
}

// ── Import file handler ──────────────────────────────────────────────────────

function handleImport(input) {
  importProgress(input.files[0], () => renderTimeline());
}

// ── Confetti (Canvas API — no library) ──────────────────────────────────────

function celebrateWeek() {
  const canvas = document.getElementById('tl-confetti');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.display = 'block';

  const pieces = Array.from({ length: 90 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height - canvas.height,
    r: Math.random() * 8 + 4,
    d: Math.random() * 80 + 20,
    color: ['#6366f1','#a855f7','#10b981','#f59e0b','#ec4899'][Math.floor(Math.random() * 5)],
    tiltAngle: 0,
    tiltSpeed: Math.random() * 0.1 + 0.05
  }));

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.tiltAngle += p.tiltSpeed;
      p.y += (Math.cos(frame / 20 + p.d) + 1.5) * 1.5;
      const tilt = Math.sin(p.tiltAngle) * 12;
      ctx.beginPath();
      ctx.lineWidth   = p.r;
      ctx.strokeStyle = p.color;
      ctx.moveTo(p.x + tilt + p.r / 4, p.y);
      ctx.lineTo(p.x + tilt, p.y + tilt + p.r / 4);
      ctx.stroke();
    });
    frame++;
    if (frame < 130) requestAnimationFrame(draw);
    else { ctx.clearRect(0, 0, canvas.width, canvas.height); canvas.style.display = 'none'; }
  }
  draw();
}

// ── HTML builders ────────────────────────────────────────────────────────────

function buildProgressBar(state) {
  const { completedWeeks, streakDates } = state;
  const count   = completedWeeks.length;
  const pct     = Math.round((count / TOTAL_WEEKS) * 100);
  const allDone = count === TOTAL_WEEKS;
  const streak  = calcStreak(streakDates);
  const eta     = estimatedCompletion(state);

  const streakHtml = `
    <div class="tl-streak" title="Consecutive practice days">
      🔥 <span id="tl-streak-count">${streak}</span>
      <span class="tl-streak-label">day streak</span>
    </div>`;

  const etaHtml = eta
    ? `<div class="tl-eta">📅 Est. finish: <strong>${eta}</strong></div>`
    : '';

  return `
    <div class="tl-progress-wrap">
      <div class="tl-progress-header">
        <span class="tl-progress-label">${allDone ? '🎉 Program Complete!' : `Week ${count === 0 ? 1 : Math.min(count + 1, TOTAL_WEEKS)} of ${TOTAL_WEEKS}`}</span>
        <div class="tl-progress-meta">
          ${streakHtml}
          <span class="tl-progress-pct">${pct}%</span>
        </div>
      </div>
      <div class="tl-progress-bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
        <div class="tl-progress-fill" style="width:${pct}%"></div>
      </div>
      ${etaHtml}
      <div class="tl-progress-actions">
        <button class="btn btn-secondary btn-sm" onclick="window.print()">🖨 Print</button>
        <button class="btn btn-secondary btn-sm" onclick="exportProgress()">⬇ Export</button>
        <label class="btn btn-secondary btn-sm tl-import-label">
          ⬆ Import
          <input type="file" accept=".json" class="tl-import-input" onchange="handleImport(this)">
        </label>
        <button class="btn btn-ghost btn-sm" onclick="resetProgress()">↺ Reset</button>
      </div>
    </div>`;
}

function buildMonthHeader(month) {
  return `
    <div class="tl-month-marker">
      <div class="tl-month-badge">Month ${month.month}: ${month.monthTitle}</div>
    </div>`;
}

function buildNode(week, status) {
  const icons  = { done: '✓', current: '▶', locked: '' };
  const labels = { done: 'Completed', current: 'In Progress', locked: 'Locked' };
  return `
    <div class="tl-step">
      <div class="tl-node tl-node--${status}"
           data-week="${week.id}"
           role="button"
           tabindex="${status === 'locked' ? -1 : 0}"
           aria-expanded="${openWeekId === week.id}"
           aria-label="${week.title} — ${labels[status]}"
           onclick="toggleNode(${week.id}, '${status}')"
           onkeydown="if(event.key==='Enter'||event.key===' ')toggleNode(${week.id},'${status}')">
        <span class="tl-node-icon">${icons[status]}</span>
        <span class="tl-node-num">${week.id}</span>
      </div>
      <div class="tl-node-label tl-node-label--${status}">${week.title}</div>
    </div>`;
}

function buildDetail(week, status, completedTasks) {
  const isDone      = status === 'done';
  const isCurrent   = status === 'current';
  const doneTasks   = completedTasks[String(week.id)] || [];
  const canInteract = isDone || isCurrent;

  const taskItems = week.tasks.map((t, i) => {
    const checked = doneTasks.includes(i) ? 'checked' : '';
    const doneClass = doneTasks.includes(i) ? 'tl-task--done' : '';
    const cbHtml = canInteract
      ? `<input type="checkbox" class="tl-task-cb" data-week="${week.id}" data-task="${i}"
               ${checked} onchange="toggleTask(${week.id}, ${i})" aria-label="${t}">`
      : '';
    return `<li class="${doneClass}">${cbHtml}<span>${t}</span></li>`;
  }).join('');

  const taskCount  = week.tasks.length;
  const doneCount  = doneTasks.length;
  const taskProgress = canInteract
    ? `<div class="tl-task-progress">${doneCount}/${taskCount} tasks</div>`
    : '';

  const actionBtn = isCurrent
    ? `<button class="btn btn-complete" onclick="markComplete(${week.id})">✓ Mark Week ${week.id} Complete</button>`
    : isDone
      ? `<div class="tl-done-badge">✓ Completed</div>`
      : `<div class="tl-locked-msg">🔒 Complete previous weeks to unlock</div>`;

  return `
    <div class="tl-detail" data-week="${week.id}" hidden>
      <div class="tl-detail-inner tl-detail--${status}">
        <div class="tl-detail-header">
          <h3 class="tl-detail-title">${week.title}</h3>
          ${taskProgress}
        </div>
        <ul class="tl-task-list">${taskItems}</ul>
        <div class="tl-goal-box"><strong>Goal:</strong> ${week.goal}</div>
        <div class="tl-detail-action">${actionBtn}</div>
      </div>
    </div>`;
}

// ── Main render ──────────────────────────────────────────────────────────────

function renderTimeline() {
  const root = document.getElementById('timeline-root');
  if (!root) return;

  const state = getProgress();
  const { completedWeeks, completedTasks } = state;
  openWeekId = null;

  let html = buildProgressBar(state);
  html += '<div class="tl-path">';

  PLAN_DATA.forEach(month => {
    html += buildMonthHeader(month);
    month.weeks.forEach(week => {
      const status = weekStatus(week.id, completedWeeks);
      html += '<div class="tl-row">';
      html += buildNode(week, status);
      html += buildDetail(week, status, completedTasks);
      html += '</div>';
    });
  });

  html += '</div>';
  root.innerHTML = html;

  const current = nextIncomplete(completedWeeks);
  if (current) expandNode(current);
}

// ── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', renderTimeline);

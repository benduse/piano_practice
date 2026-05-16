# VI-IV-I-V Piano Practice Program

## Why I Built This

I'm learning piano and just mastered the C major chords. I love songs by Sia, Adventist hymns, Bruno Mars, John Legend, Aitana, Becky G, and Alan Walker.

I kept noticing my favorite songs use the same chord pattern: the **vi-IV-I-V progression** — in C major that's **Am - F - C - G**. Once I recognized it everywhere, I wanted a focused way to practice it so I could play real songs instead of random exercises.

Most beginner resources teach scales and theory first. I learn best by playing music I actually love. So I built this.

---

## What It Does

### 5 Pages

| Page | File | Description |
|---|---|---|
| Overview | `index.html` | Explains the progression + live progress dashboard |
| 3-Month Plan | `practice_plan.html` | Interactive path timeline with week-by-week goals |
| Transpose Tool | `transpose_tool.html` | Click any key to see vi-IV-I-V in that key |
| Song Library | `songs_library.html` | 50 songs with search, filter, and key info |
| Practice Tips | `practice_tips.html` | Style guides for pop, EDM, hymns, and left hand |

### Features

**Interactive Timeline (3-Month Plan)**
- Visual path with 12 step nodes — one per week
- Nodes show status: ✓ done (green) / ▶ current (pulsing) / 🔒 locked
- Click a node to expand the week's tasks and goal
- Per-task checkboxes to track individual items within a week
- "Mark Week Complete" button advances to the next week
- Confetti animation on week completion

**Progress Tracking (persists across sessions)**
- All progress saved to `localStorage` — no account or backend needed
- 🔥 Streak counter — tracks consecutive days you practiced
- 📅 Estimated completion date — calculated from your actual pace
- Export progress as a `.json` file
- Import a saved `.json` to restore progress on any device
- Reset button to start over

**Dashboard Widget (Overview page)**
- Shows current week, % complete, streak, and estimated finish date
- "Continue Week N" button links directly to your current step
- Only appears once you've started the plan

**Song Library**
- 50 songs that use vi-IV-I-V or a close variation
- Search by song or artist
- Filter by category: Pop Hits, Your Artists, Worship, Classics
- Original key shown for every song

**Transpose Tool**
- 9 keys: C, G, D, A, E, F, Bb, Eb, Ab
- Shows the correct chord names for vi-IV-I-V in each key instantly

---

## How to Use

1. Open `index.html` in any browser — no server needed
2. Go to **3-Month Plan** and start Week 1
3. Check off tasks as you practice each day
4. Mark the week complete when you've hit the goal
5. Use **Export** to back up your progress

To fork for your own songs: edit `plan-data.js` (week tasks and goals) and the `songs` array in `songs_library.html`.

---

## File Structure

```
piano_practice/
│
├── index.html              # Overview + dashboard widget
├── practice_plan.html      # Interactive timeline shell (content rendered by JS)
├── transpose_tool.html     # Key transposer
├── songs_library.html      # 50-song table with search/filter
├── practice_tips.html      # Style and technique tips
│
├── app.css                 # Global styles (header, nav, cards, footer, layout)
├── app.js                  # Shared JS (hamburger nav toggle)
│
├── plan-data.js            # ← Edit this to change weeks/tasks/goals
├── plan-timeline.js        # Timeline renderer + expand/complete/checkbox logic
├── plan-timeline.css       # Timeline-specific styles (nodes, detail cards, streak)
│
└── progress-store.js       # Shared storage module
                            #   getProgress / setProgress / clearProgress
                            #   calcStreak / estimatedCompletion
                            #   exportProgress / importProgress
                            #   recordPracticeDay
```

### Modularity

The plan is fully data-driven:
- **`plan-data.js`** is the only file you need to edit to change the 12-week curriculum
- **`progress-store.js`** is a standalone module — any future page can load it and read/write progress
- **`plan-timeline.js`** reads `PLAN_DATA` + `localStorage` and renders everything — no week content is hardcoded in HTML
- `practice_plan.html` is a thin shell with one `<div id="timeline-root">` mount point

### localStorage Schema

```json
{
  "completedWeeks":  [1, 2, 3],
  "completedTasks":  { "1": [0, 2], "2": [1] },
  "startDate":       "2026-01-15",
  "streakDates":     ["2026-01-15", "2026-01-16", "2026-01-17"]
}
```

---

## My Goal

In 3 months I want to hear a new song, recognize "that's vi-IV-I-V", and sit down and play a basic version in C major within 10 minutes.

Built for my own practice journey — shared in case it helps other beginners who learn best by playing songs they love.

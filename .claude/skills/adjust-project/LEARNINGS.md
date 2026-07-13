# Learnings — adjusting projects

Adjustment-specific heuristics. Read before editing; append after every run (step
5). Keep entries general and terse. For craft rules (what makes a good lesson)
and verification tactics, see `.claude/skills/generate-project/` — don't
duplicate them here.

## Scoping the change

- Restate the feedback as a concrete edit list first; "chapter 3 drags" is a
  symptom, not an instruction. Read the lessons and name the specific fix.
- Prefer the smallest change. Rescoping one lesson rarely justifies touching its
  neighbors; verify before assuming a ripple.
- Prose/goal/checkpoint edits need no renumbering and no reverify — treat them as
  the cheap path and don't over-engineer them.

## Renumbering (the main hazard)

- Filename `lesson-XX.md` and the `lesson:` frontmatter must always match —
  mismatches are the most common breakage.
- Insert/split (shift up): rename from the **highest** lesson downward so you
  never clobber an existing file. Remove/merge (shift down): rename from the
  **lowest** affected lesson upward.
- After any count/order change, update two things in the project's
  `src/content/projects/<slug>.md` frontmatter: total `lessons` and the chapter's
  `parts[].count`. There is no `currentDay` — learner progress is client-only,
  stored in localStorage and hydrated on load.
- prev/next and syllabus links are derived from lesson order — never hand-edit
  them.

## Appending a new final chapter

- When you append a chapter *after* the old terminal lesson, the old capstone is no
  longer the end: retitle it (drop "Capstone:") and soften any "the project is
  complete" checkpoint/body to point forward at the new chapter. Grep the old last
  lesson for finality language ("complete", "from here you extend", "you have
  built") - it reads wrong once something follows it.
- Only two project-frontmatter numbers change for a pure append: total `lessons`
  and a new `parts[]` entry (name + count). Re-check `size` still matches the new
  total (Small <=35, Medium 36-50, Large >=51).
- The new chapter's overview claim must be folded into BOTH the project `overview`
  (extend the arc sentence) and `caveats.note` (don't leave the note underselling a
  capability the new chapter just added, and drop any `future` item that now
  describes a gap you just closed).

## Reverify when the new chapter sits atop many unbuilt lessons

- You do NOT have to rebuild all N prior lessons to reverify an appended chapter.
  Build a compact but faithful **substrate** (a direct programmatic API for the
  state the new lessons mutate) as one base commit, then do one commit per new
  lesson on top. Keeps the reverify repo honest without re-deriving 40 lessons.
- Commit the substrate as `substrate: ...` (not `Lesson NN`), so `git log` still
  reads one-commit-per-lesson for the lessons that actually changed.

## Continuity after an edit

- Changing an early lesson's behavior can strand a later lesson that depended on
  it. Re-verify from the first changed lesson *forward*, not just the lesson
  itself.
- Chapters are folders now, not a frontmatter field — moving a lesson between
  chapters means moving its file to a different `NN-chapter-slug` folder.
  There's no more silent "chapter string doesn't match any part" footgun; just
  make sure the folder's `NN` still lines up with the right `parts[]` entry (by
  position) after the move.

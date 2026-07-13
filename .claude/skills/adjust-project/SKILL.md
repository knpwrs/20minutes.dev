---
name: adjust-project
description: >-
  Revise an existing project from feedback — rewrite, split, merge, insert,
  remove, or reorder lessons; fix broken specs and continuity gaps; retune
  scope; update project metadata; then re-validate, re-verify the affected
  lessons, and self-improve. Use when the user has feedback on an existing
  project ("lesson 6 is too hard", "add a lesson about X", "the B-tree chapter
  drags", "reorder these", a learner report, or a verification report). For
  creating a brand-new project use generate-project instead; not for site
  layout/components.
argument-hint: "<project-slug-or-title> <feedback>"
---

# Adjust a Project

Apply feedback to a project that already exists, with minimal, surgical changes,
then prove the change didn't break the arc.

This skill shares the craft rules of `generate-project`. **Before editing, read:**
- `.claude/skills/generate-project/SKILL.md` — "Design principles" and
  "Anti-patterns" (what a good lesson is). They govern edits here too.
- `.claude/skills/generate-project/LEARNINGS.md` — shared craft heuristics.
- `LEARNINGS.md` (next to this file) — adjustment-specific heuristics.

## Repo facts you must respect (see generate-project for detail)

- Lessons: `src/content/lessons/<slug>/<NN-chapter-slug>/lesson-XX.md` — the
  `NN-chapter-slug` folder gives the chapter and its order, the filename keeps
  the lesson's global number. Schema in `src/content.config.ts`. The markdown
  body is the "Background".
- Metadata: the project's file in the `projects` content collection,
  `src/content/projects/<slug>.md` (frontmatter: `lessons` total,
  `parts[{name,count}]`, `size`, `tech`, `desc`, `blurb`,
  `overview`, `caveats`, and `resources` — the recommended-reading list you can
  also update). Pages derive everything from this collection.
- The syllabus is **derived**: a lesson's chapter is its `NN-chapter-slug` folder
  (the leading `NN` picks the matching `parts[]` entry by position — there's no
  `chapter` frontmatter field to keep in sync), and prev/next comes from lesson
  order. So there are no cross-links to fix by hand — but folder numbering and
  `parts[]` order must stay coherent.
- Validate with `npx astro build` after every change.

## Process

### 1 — Locate the project and pin down the feedback
- Identify the target from the invocation (slug or title). If it's missing or
  ambiguous, ask — you may list the existing projects as options, but always
  allow the user to name their own; whatever they choose wins.
- Restate the feedback as an explicit, concrete **change list** before touching
  anything. Feedback can be a learner's words, a defect ("lesson 6's expected
  value is wrong"), a structural ask ("insert a lesson", "reorder"), or a
  verification report from `generate-project`. If the feedback is vague
  ("chapter 3 drags"), read those lessons and turn it into specific edits first.
- Read the current state: the project's `src/content/projects/<slug>.md` and the
  affected lesson files (and their neighbors — edits ripple forward).

### 2 — Plan the change (smallest that satisfies the feedback)
Map feedback → concrete edits. Common shapes:
- **Rescope a lesson** — rewrite its spec/goal/code so it's a true ~20-min step.
- **Split a lesson** — one lesson becomes two; everything after shifts up by one.
- **Merge lessons** — two trivial lessons become one; everything after shifts down.
- **Insert / remove a lesson** — same shift up / down.
- **Reorder** — renumber the moved lessons; re-check that every spec still only
  depends on earlier lessons.
- **Rewrite prose only** — background/goal/checkpoint; no renumbering, no
  reverify.
- **Metadata** — size, tech, blurb, chapter names/counts.

For anything beyond a couple of in-place edits (especially renumbering or
reordering), **present the plan and get the user's confirmation** before applying.

### 3 — Apply the edits
Follow the **renumbering protocol** whenever lesson count/order changes:
1. A file's name (`lesson-XX.md`) and its `lesson:` frontmatter must always
   match the lesson's global number.
2. Shifting **up** (insert/split): rename affected files from the **highest
   lesson downward** so you never overwrite an existing file; bump each
   `lesson:` too.
3. Shifting **down** (remove/merge): rename from the **lowest affected lesson
   upward**.
4. Then update the project's `src/content/projects/<slug>.md` frontmatter: total
   `lessons` and the affected chapter's `parts[].count`. (There is no
   `currentDay` — progress is client-only localStorage.)
5. If a lesson changes chapter, **move its file to the new `NN-chapter-slug`
   folder** (add/rename a part if the feedback restructures chapters) — chapter
   membership is the folder, not a frontmatter field.

Author real content — no placeholders — matching the house voice. Then
`npx astro build` and fix any schema errors.

### 4 — Re-verify
Edits ripple forward, so re-verify with the **sequential lesson-agent** method
and brief in `.claude/skills/generate-project/references/verifier-prompt.md`
(one `sonnet` agent per lesson, synchronous, committing one commit per lesson on
a git repo).
- **Build all the way through** — from the earliest changed lesson to the
  **last** lesson of the project. A changed early lesson can strand any later
  lesson, so don't stop at the affected chapter. (Lessons before the first edit
  are unaffected; you may start the chain there, but carry through to the end.)
- To produce a clean, reviewable **one-commit-per-lesson repo** of the whole
  project, rebuild from lesson 1 and run the **finalize pass** (a runnable entry
  point for an app, or a documented API + usage example for a library, plus
  `CAVEATS.md`, per generate-project §4). Report the repo path, how to exercise
  it, and confirm `git log` is one commit per lesson plus the `capstone:`
  finalize commits. Then copy the finalize agent's `site_caveats` into the
  project's `caveats` field into `src/content/projects/<slug>.md` and re-run
  `npx astro build`.
- Confirm no later lesson lost a prerequisite and no expected value drifted.
- **Skip verification** only for prose-only or metadata-only edits — there's no
  behavior to check.

### 5 — Self-improve (required)
- Append durable, adjustment-specific heuristics to this skill's `LEARNINGS.md`
  (renumbering pitfalls, recurring feedback→edit mappings, when reverify was or
  wasn't warranted).
- If the feedback exposed a **craft** lesson that authoring should have caught,
  add it to `.claude/skills/generate-project/LEARNINGS.md` so new projects avoid
  it.
- If a step here was wrong or missing, edit this SKILL.md. Keep edits terse and
  additive. State what you changed and why in your final summary.

## Guardrails

- Prefer the **smallest** change that addresses the feedback; don't rewrite a
  whole chapter to fix one lesson.
- Never leave filename and `lesson:` frontmatter out of sync, or a lesson filed
  under an `NN-chapter-slug` folder whose `NN` has no matching `parts[]` entry
  (the lesson would map to an undefined chapter).
- Don't renumber without updating `lessons` and `parts[].count`.
- Keep the project buildable at every step; run `npx astro build` before
  declaring done.

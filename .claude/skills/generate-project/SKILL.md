---
name: generate-project
description: >-
  Author a new "twenty minutes a day" learning project for this site.
  Plans the lesson-by-lesson arc, writes the lesson markdown + project metadata in the
  repo's content-collection format, then verifies each lesson by spawning subagents
  that actually build it in a real language, tunes the lessons from their
  feedback, and self-improves. Use when the user wants to create, author, or
  generate a new project, add a build-project curriculum, or expand the project
  catalog. Not for editing site layout/components — only project content.
argument-hint: "<subject> [--langs go,python] [--lessons N] [--size Small|Medium|Large]"
---

# Generate a Project

## The process, briefly

A project is **AI-generated and then verified by building it**. This skill plans the
lesson-by-lesson arc and authors every lesson (§§1–3 below); then each lesson is
implemented from scratch in a real language against its own spec and checked against
known-good values (§4). The authoring is machine-written; the per-lesson build is what
makes the specs trustworthy. This is stated openly on the site's **About page**, so
hold every project to a bar worth standing behind publicly: real specs, real expected
values, honest scope — never a placeholder or an unverified value.

## What a project is

A **project** is an incremental build project — a database, a compiler, an
emulator, a renderer — split into daily lessons. It is defined entirely by its
format, not by any one source:

- **One lesson (~20 minutes).** A competent engineer who is *new to
  the topic* should hit the lesson's spec — write the code that satisfies it — and
  stop, all inside roughly twenty minutes.
- **Spec-first.** Every lesson opens with a concrete spec (Given / When / Then with
  exact values) — a small, checkable target. Leading with the spec and then
  writing code to satisfy it is a useful way to build; keep the wording plain and
  do **not** dress it up in strict test-driven / "write the failing test first"
  language. This site is not selling a methodology.
- **Opens with an overview.** Every lesson starts with a 1–2 sentence overview of
  *what you're building today and why it matters* (the lesson's `overview`
  field), before the spec.
- **Language-agnostic.** The learner picks their language. Specs describe
  *behavior and values*, never a specific library or stdlib call. Each lesson
  carries one short code *hint* in some language — clearly a hint, not the
  answer.
- **Cumulative.** Each lesson depends only on capabilities built on earlier
  lessons, and the project ends in a real, usable deliverable — a runnable program
  for an application/tool, or a documented, well-tested public API for a library.
- **Chaptered.** Lessons are grouped into chapters (parts) of ~6–16 lessons; the
  last lesson of each chapter yields something demoable (a run, or a usage
  example).

Read `LEARNINGS.md` (next to this file) before you start — it holds hard-won
heuristics from previous runs.

## Where projects live (repo integration)

Study one real example before writing anything:

- **Canonical lesson:** `src/content/lessons/build-a-sql-database/01-in-memory-tables/lesson-06.md`
  — copy its shape exactly. See `templates/lesson.md` here for the annotated
  template.
- **Schema (authoritative):** `src/content.config.ts` — the `lessons`
  collection. Frontmatter that fails this schema fails the build.
- **Project metadata:** the `projects` content collection — add one markdown file
  `src/content/projects/<slug>.md` (the filename is the slug). All metadata lives
  in its frontmatter; the body is unused. Schema in `src/content.config.ts`.
  Fields: `title`, `order` (integer — position in the list; next unused value),
  `lessons` (total count), `size` (`Small`/`Medium`/`Large`, chosen by lesson
  count — Small ≤35, Medium 36–50, Large ≥51), `tech[]` (2–3 **concept/subject**
  tags like `B-trees`, `NFA`, `Sockets`, `PPU` — **never a programming language**;
  the language is the learner's choice, so a tech tag naming one contradicts the
  whole premise), `estMin` (always 20),
  **`desc`** (ONE short sentence, ~60-120 characters: this is the card blurb on
  the projects index, so it has to fit a card. Active voice naming what you build
  or do, e.g. "Turn SQL text into answers: tokenize, parse, and execute real
  queries over tables you build yourself." Do NOT dump the lesson arc here:
  multi-sentence descs overflow the card, and that is the single most common
  authoring mistake. The schema caps `desc` at 180 chars, but aim well under,
  one clause or two),
  **`blurb`** (a fuller one-or-two-sentence pitch shown on the project overview
  page header and used as the page meta description; longer than `desc` but still
  tight),
  **`overview`** (2–4
  sentence orientation — what the learner builds over the whole run and the end
  result; blank lines separate paragraphs; rendered at the top of the overview
  page as "What you'll build over the next N lessons"). **The overview must set a
  realistic expectation of the end result** — name what genuinely works at the end
  and, for an ambitious subject (emulator, database, browser), what it
  deliberately stops short of. Say "a working core / teaching-grade X", not "a
  working X", when the project builds a foundation rather than a complete product.
  Keep it consistent with `caveats`: never let the overview promise something the
  caveats admit isn't done. Under-promise slightly rather than over-promise. Then
  `parts` (`[{ name, count }]`), `caveats` (`{ note, future[] }` — filled from the
  finalize pass in §4, not at authoring time), and **`resources`** (a curated
  further-reading list — `[{ title, author?, url?, note? }]` — classic related
  books and key references/specs for the subject; author 4–6 at creation, add
  `url` only for stable official sources). Chapter membership is **structural**,
  not a frontmatter field to keep in sync: each lesson lives in an `NN-chapter`
  folder (see below), and that leading `NN` picks the matching entry (by position)
  out of `parts[]`; `parts[].name` just supplies the display name shown for that
  slot. Everything (homepage, projects page, per-project pages) derives from this
  collection — never hard-code a project list.
- Lessons go in `src/content/lessons/<slug>/<NN-chapter-slug>/lesson-XX.md` — the
  folder's two-digit prefix + slugified chapter name give the chapter **and** its
  order (e.g. `03-control-flow`); the filename keeps the lesson's *global* number
  (`lesson-37.md`), not a per-chapter one.

After writing files, run `npx astro build` — it validates every lesson against
the schema. Fix all errors before verifying.

## Design principles (the craft)

1. **One new idea per lesson.** If a lesson teaches two things, split it.
2. **The spec must be executable.** Concrete inputs, concrete expected output.
   "Understand tokenization" is not a spec; "`tokenize("a b")` returns
   `["a","b"]`" is.
3. **Twenty-minute box.** Spec + the minimal implementation that satisfies it, ~20 min. Not a
   blank-page design task, not a whole subsystem. `references/scope-rubric.md` is
   the calibration: one concept, one behavior, one small def — with concrete
   `too_big`/`too_small` triggers and objective diff-size anchors.
4. **Strict continuity.** A lesson may only rely on what earlier lessons built.
   When in doubt, trace the dependency back to the lesson that introduced it.
5. **Language-neutral specs.** Behavior and values only. The `code` hint may pick
   a language, but the spec must not.
6. **Walking skeleton, usable throughout.** Prefer an arc where the project is
   usable end to end early and stays that way at *every* commit, not one that only
   comes together at the end. **What "usable" means depends on the product:**
   - **An application or tool** (emulator, shell, HTTP server, database CLI, ray
     tracer, git) should have a **runnable entry point within the first lesson or
     two** — a run loop that does nothing yet, a CLI that prints — then thicken it.
   - **A library** (a regex engine, a data structure, a parser meant to be
     imported) does **not** need a binary at all — the tested public API *is* the
     product. Keep that API importable and its tests green each lesson; a `main`
     would be artificial. Do not force one.
   Where a subject genuinely can't do anything until later (a parser needs a lexer
   first), get to the earliest usable surface — a REPL, or the first public
   function under test — as soon as the design allows. Every lesson still finishes
   green with a commit-and-stop checkpoint; the finalize pass (§4) completes
   families + writes `CAVEATS.md`, and adds a runnable entry point **only if the
   product is meant to be run**.
7. **Match the house voice.** Goal = one sentence. Background = 1–2 short
   paragraphs. Checkpoint = one or two sentences ending in "Commit." Keep code
   hints under ~8 lines.
8. **Specs pin the edges, not just the middle.** Put a `Then` *at* the overflow/
   wrap boundary (`0xFF` INC → `0x00`), never only a mid-range value, and name
   **every** effect an operation has — every flag it sets *and* the ones it clears.
   A mid-range-only spec passes in the reference language yet breaks a port to one
   without silent integer truncation (JS, Python); an under-named flag set leaves
   stale state. This is the single most repeated verification finding — see
   `LEARNINGS.md` for the cases.

## Process

### 1 — Scope
**The subject is the user's to choose — never pick it for them.** It is the
argument to the skill (e.g. `/generate-project Build a Key-Value Store`).

- If the invocation included a subject, use it **exactly as given** and move on.
  Do not offer alternatives or a menu of subjects.
- If no subject was given, ask for one. You **may** suggest a few example
  subjects to spark ideas — but the user must **always** be able to provide their
  own. If you use `AskUserQuestion`, its automatic "Other" row supplies the
  free-text path; phrase the question so it's obvious those options are just
  suggestions and a custom subject is welcome. Whatever they type wins.
- Once you have the subject, sanity-check it against the existing projects for
  heavy overlap and *mention* it if you see it — but the subject still stands;
  don't substitute your own.

For everything else, pick sensible **defaults and state them** rather than
interrogating the user: size inferred from the subject, ~30–45 lessons, and a
single verification language (add a second only if the user asks). Confirm the
subject + defaults in one line, then proceed. Write the scope to the scratchpad.

### 2 — Plan the arc (first pass)
Produce a one-line-per-lesson outline: `lesson · chapter · title · the single
spec idea · the ~20-min deliverable`. Then read back over it and check, on paper,
every lesson against `references/scope-rubric.md` and the principles above (one
idea, one behavior, executable spec, continuity). Revise the outline until it
holds. Save it to the scratchpad.

### 3 — Write the project
- Create the project's `src/content/projects/<slug>.md` (frontmatter only),
  including the **`overview`** written from the planned arc — what the learner
  builds over the N lessons and the runnable end result — and the **`resources`**
  reading list. (`caveats` is filled later, by finalize.)
- Write each `lesson-XX.md` (in its `NN-chapter` folder) from `templates/lesson.md`
  with **real** authored content — genuine specs with real expected values, a
  correct code hint, background prose, and a checkpoint. Do not leave
  placeholders.
- `npx astro build` and fix schema errors.

### 4 — Verify with a sequential chain of lesson-agents
Lessons build on each other, so verification is a **sequential chain over one
cumulative project** — **one subagent per lesson**, not one agent for the whole
project and not parallel agents. **Build every lesson, all the way to the end** —
there is no static-review shortcut; the whole point is to prove the entire arc
compiles and stays green. (For a large project — roughly 40+ lessons — a
**serial, chapter-aligned batch** is an acceptable scale-up: one agent implements
a contiguous sub-arc in order, re-running the full suite after each lesson and
returning per-lesson JSON, and you commit per batch. It is still serial and still
cumulative — just coarser commit granularity. Give each batch agent the next
chapter's dangerous conventions explicitly so it asserts the trap value, not the
intuitive-but-wrong one.)

- Create a fresh scratch project directory for the verification language and
  `git init` it. This repo is a deliverable — you'll hand it back for review.
  Put it somewhere durable and report its path (e.g. under the session scratchpad
  at `<scratch>/verify/<slug>-<lang>`), not a directory that gets cleaned up.
- Walk the lessons **in order, from lesson 1 to the last lesson**. For each
  lesson, spawn one `model: sonnet` subagent **synchronously**
  (`run_in_background: false`) and wait for it before starting the next — the
  next lesson depends on this lesson's code. Hand it the filled-in brief from
  `references/verifier-prompt.md`: the project dir (already holding prior
  lessons' work), today's lesson file, and the language + its test framework.
- Each lesson-agent comes to the project **fresh**, exactly like a learner
  returning the next day: it reads the existing code, implements today's spec,
  confirms it works and every earlier check still passes, and reports on today
  only. Fresh context per lesson is the point — it keeps the ~20-minute judgment
  honest.
- **Keep it usable (walking skeleton).** For a product meant to be run, once the
  project can run anything end to end the lesson-agent stands up a minimal entry
  point and, on every later lesson, runs the binary/demo after its test passes;
  `runs_today` reports that. For a **library** the deliverable is the tested API,
  so "usable" just means it stays importable and green — `runs_today` is `"n/a"`
  and no entry point is expected. Don't bolt a `main` onto a library to satisfy
  this.
- **One commit per lesson — the orchestrator commits, not the agent.** Lesson
  agents never run git (one once tried `rm -rf .git`). After each agent returns
  green, *you* `git add -A && git commit -m "Lesson NN · <title>"` (defect notes
  in the body). The result is a history where each commit is exactly one lesson's
  work — walk it to review the project as a learner would experience it.
- If a lesson's spec can't be satisfied as written, the agent records the defect
  and implements the most reasonable interpretation so the project stays green
  and the lesson still gets its commit.

**Finalize into a usable reference.** The lesson-by-lesson chain implements only
the exact behavior the lessons' specs test, and (for an app) has no entry point.
After the last lesson's commit, run a **finalize pass** on the same repo — spawn a
`model: sonnet` agent with `references/finalize-prompt.md` — to:
- **Make it usable end to end — how depends on the product.** If the product is
  meant to be **run** (emulator, shell, server, CLI, renderer), add a real **entry
  point**: a built-in, asset-free demo that drives the whole pipeline and produces
  visible output, plus an input-loading mode if it consumes files. If the product
  is a **library** (a regex engine, a data structure), do **not** add a binary —
  instead make sure the public API is coherent and demonstrated by a runnable
  **usage example** (an example test or a short README snippet); the test suite is
  the demonstration. Decide by asking "would a user of this thing run it, or import
  it?"
- Go **as far as reasonable**: complete the families/patterns the lessons
  introduced (the rest of a demonstrated instruction/rule family) so real input
  runs meaningfully further — without inventing subsystems no lesson covered.
- **Fail gracefully** on anything unimplemented (clear "unimplemented X at Y"),
  never hang. (For a library, this is about the public API's error handling — a
  bad pattern reports a clear error rather than panicking.)
- Write **`CAVEATS.md`** at the repo root: how to use it (run command for an app,
  or a usage example for a library), what's implemented, what's partial/stubbed,
  and a prioritized **future-work** checklist.
- Keep all existing tests + linter green. Commit as separate `capstone:` commits —
  never amend the lesson-by-lesson history.

Then **surface the caveats on the site**: copy the finalize agent's `site_caveats`
(a one-line `note` + a prioritized `future` list) into the project's `caveats`
field in `src/content/projects/<slug>.md` — the overview page renders it as "Scope
& extensions". Re-run `npx astro build`.

**Reconcile the overview with reality.** The `overview` was written at authoring
time (§3) on an *estimate* of the end result; finalize now knows the truth. If the
finished program does less than the overview implied (e.g. it reaches a ROM's main
loop but doesn't play games), **tighten the overview to match the caveats** so the
two never contradict. Better the overview slightly under-sells than over-promises.

**Second language (optional).** Only if cross-language robustness matters, run a
second, independent lesson chain (and its own finalize pass) on a *separate* git
repo. Two independent projects are the one place parallelism is safe — but default
to a single language.

At the end, report the repo path(s), **how to exercise it** (the exact run command
and what it produces for an app, or the usage example / `run the tests` for a
library) and confirm `git log --oneline` shows one commit per lesson (lesson 1
through the last) plus the `capstone:` finalize commits.

### 5 — Tune
Aggregate the reports and apply fixes:
- Split lessons flagged **too_big**; enrich or merge lessons flagged
  **too_small**. Trust the rubric: when `scope` and `proxy_scope` **agree**, act
  on it; when they **disagree** (`estimate_vs_proxy: "disagree"`), read that
  lesson yourself and decide — a big mechanical diff may be fine, a tiny but
  head-scratching one may still be too much.
- Rewrite **ambiguous** specs with concrete values.
- Fix **continuity** gaps (a lesson needing something not yet built) by
  reordering or inserting a prerequisite lesson.
- Correct any **wrong expected values** a verifier caught.
Re-run `npx astro build`. Re-verify only substantively changed lessons.

### 6 — Self-improve (required — do not skip)
Reflect on generating *this* project and update the skill itself:
- Append **durable, generalizable** heuristics to `LEARNINGS.md` — planning
  rules, recurring 20-min-scope traps, verifier-briefing improvements. Not
  project-specific trivia.
- If a step in this SKILL.md was wrong, missing, or needed correction mid-run,
  **edit this file** to fix the process.
- Keep edits additive and terse; prune anything a new learning contradicts.
State in your final summary exactly what you changed in the skill and why.

## Anti-patterns (reject these in review)

- A lesson that introduces two concepts.
- A spec that can't be turned into a concrete, checkable target ("explore", "understand", "get
  familiar with").
- A spec coupled to a language's stdlib or a specific framework.
- A lesson that depends on code from a later lesson.
- A filler lesson with no working deliverable.
- Reproducing another work's exact exercise order — design your own arc from the
  subject's first principles.

## Templates & references

- `templates/lesson.md` — the annotated `lesson-XX.md` template.
- `references/scope-rubric.md` — the 20-minute calibration: primary signals,
  `too_big`/`too_small` triggers, and objective diff-size bands. Used in planning
  and pasted into each verifier.
- `references/verifier-prompt.md` — the brief to hand each per-lesson verifier.
- `references/finalize-prompt.md` — the brief for the finalize pass that makes the
  reference repo runnable and writes `CAVEATS.md`.
- `LEARNINGS.md` — accumulated heuristics; read first, update last.

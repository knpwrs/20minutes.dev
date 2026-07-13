---
# File path: src/content/lessons/<slug>/<NN-chapter-slug>/lesson-XX.md
# The NN-chapter-slug folder (e.g. 03-control-flow) gives the chapter AND its
# order; the filename keeps the lesson's GLOBAL number (e.g. lesson-37.md), not
# a per-chapter one. There is no `chapter:` frontmatter field — chapter is
# derived from the folder.
# Every field below is validated by src/content.config.ts — keep the shape exact.

project: <slug>          # matches PROJECTS[].slug in src/data/projects.ts
lesson: 1                # 1-indexed GLOBAL lesson number, matches the XX in the filename
title: <Lesson title>    # short, concrete (e.g. "Reading the page header")

# 1–2 sentences shown FIRST, above everything: what you're building today and why
# it matters. Plain language — no "write the failing test first" framing.
overview: <What today builds, and why it earns its place in the project.>

# One sentence: today's concrete target, shown above the spec. Plain, not dogmatic.
goal: <Build the smallest real thing that satisfies today's spec.>

spec:
  scenario: <A short name for the behavior this lesson pins down>
  status: failing        # schema default; drives the "TO DO" → "DONE" state badge
  lines:                 # Given / When / Then / And, with CONCRETE values.
    - kw: Given
      text: '<a precise starting condition, with literal inputs>'
    - kw: When
      text: <the single action>
    - kw: Then
      text: <an exact, checkable expected result>

# A hint, not the answer: <~8 lines in one language. Comment lines are dimmed.
# On a lesson whose point is deriving a trick, name the strategy — do NOT show it.
code:
  lang: <go|python|rust|c|...>
  source: |
    // one small nudge toward the solution
    ...

# Optional. Keep generic — a concept or spec section, not a specific book/product
# unless it is a stable public reference.
reading: <optional pointer>

# One or two sentences. Says what now works; tell them to commit and stop.
checkpoint: <What now works.> Commit and stop for today.
---

<!--
  The body is the lesson's "Background": 1–2 short paragraphs of teaching prose,
  rendered as markdown. Explain just enough to make today's spec make sense and
  motivate why it matters. **Bold** key terms and use `inline code` for literals.
  Do not restate the goal or the spec. No headings needed.
-->

<One paragraph of context that makes today's spec feel obvious in hindsight.>

<An optional second short paragraph: what this unlocks, or the one gotcha.>

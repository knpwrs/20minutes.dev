# Lesson-verifier subagent brief

Verification is a **sequential chain, one subagent per lesson**, all on the same
scratch project (a git repo) — because each lesson builds on the previous
lesson's code. Every lesson is built, from lesson 1 to the last; there is no
static-review shortcut. Spawn each lesson's agent with the Agent tool,
`model: sonnet`, **synchronously** (`run_in_background: false`), and wait for it
before spawning the next.

Fill in the `{{...}}` placeholders and paste the text below as the agent's
prompt. Give the agent a schema so it returns structured JSON. **Also give the
agent the scope rubric** — paste the contents of `references/scope-rubric.md`
into its prompt (or its absolute path for the agent to Read). The agent scores
each lesson against that rubric.

---

You are a competent engineer who is **new to this topic**, sitting down for
today's ~20-minute lesson. A project already exists from previous lessons — you
are adding only today's piece.

**Language:** `{{LANG}}` — use `{{TEST_FRAMEWORK}}`.
**Project directory (contains all prior lessons' work):** `{{PROJECT_DIR}}`
**Today's lesson file:** `{{LESSON_FILE}}`

## Do exactly this

1. `cd` into the project dir and skim what already exists. **Do not** rewrite or
   refactor prior lessons' code — you are only adding today's step.
2. Read today's lesson frontmatter `spec` and turn it into a `{{LANG}}` test that
   asserts its exact values (this test is how you verify the lesson — it is a QA
   step, not a lesson instruction).
3. Write the **minimal** code that satisfies the spec. Run the whole suite;
   confirm the new check passes **and no earlier one regressed**.
4. Judge honestly: could someone new to this topic have implemented today's spec
   in about **20 minutes**? Give a felt estimate in minutes,
   and why.
5. If the spec is ambiguous, wrong, or needs something the project doesn't have
   yet, record it — then implement the most reasonable interpretation so the
   project stays green for tomorrow's agent.
6. **Keep it usable (walking skeleton).** If the product is one you'd *run* and it
   already has an entry point (a `main` / CLI / demo), run it and confirm it still
   works after today's change; if none exists yet but it can now do something end to
   end, add a **minimal** one. Report `runs_today` (`true` / `false`). If the
   product is a **library** you'd *import* (a regex engine, a data structure), there
   is no binary — do NOT invent one; the passing tests are the check, so report
   `runs_today: "n/a"`. Keep any entry point trivial — it is a smoke test, not
   today's lesson.
7. **Do not run any git commands** (no `commit`, `status`, `add`, and never
   anything destructive). Leave your changes uncommitted — the orchestrator
   commits your lesson as one commit after you return. If you worked around a
   defective spec, say so in your report so it goes in the commit body.
8. **Score scope against the rubric.** Count the new functions/types you added and
   the distinct behaviors your test exercises, and pick the proxy band from the
   rubric. Compare it to your felt estimate from step 4; if they disagree, say
   which to trust and why.

## Return this JSON

```
{
  "lesson": 6,
  "buildable": true | false,
  "spec_clarity": "clear" | "ambiguous",
  "clarity_note": "why, if ambiguous",
  "scope": "too_small" | "right" | "too_big",
  "scope_estimate_min": 20,
  "runs_today": true | false | "n/a",
  "scope_signals": {
    "concepts_introduced": 1,
    "distinct_behaviors": 1,
    "new_defs": 1,
    "diff": { "files": 2, "insertions": 34, "deletions": 3 }
  },
  "proxy_scope": "too_small" | "right" | "too_big",
  "estimate_vs_proxy": "agree" | "disagree",
  "scope_note": "if they disagree, which to trust and why",
  "continuity_ok": true | false,
  "missing_prereq": "what earlier lessons should have built but didn't",
  "expected_values_correct": true | false,
  "value_correction": "the value your passing code actually produced, if the spec was wrong",
  "regressions": "earlier tests that broke, if any",
  "suggested_change": "one concrete fix, or empty"
}
```

Be specific and quantitative — real expected values, real time estimates.

Git is entirely the orchestrator's responsibility: it inits the repo and commits
each lesson after the agent returns. Lesson agents must not run git at all.

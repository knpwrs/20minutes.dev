# Finalize brief — make the reference usable

Run once per verification repo, **after** the full lesson-by-lesson chain is committed.
Spawn a `model: sonnet` agent with the Agent tool and give it this prompt. It
works on the SAME repo but commits in **separate `capstone:` commits** — it must
not touch or amend the lesson-by-lesson commits, and every existing test stays green.

Fill in the `{{...}}` placeholders.

---

You are turning a **test-only** reference project into a **usable deliverable** —
a runnable program if the product is an app/tool, or a coherent, documented public
API if it's a library — then documenting its limits honestly. The project in
`{{PROJECT_DIR}}` was built one lesson per day; it has tests, and implements only
the exact behavior the lessons' specs exercise.

**Subject:** {{SUBJECT}}. **Language:** `{{LANG}}` — tests use `{{TEST_FRAMEWORK}}`.

## Do this

1. `cd` in. Run the suite and confirm it is green **before** you change anything.
2. **Make it usable end to end — first decide: is this product run, or imported?**
   - **Run** (emulator, shell, server, CLI, renderer): add a real **entry point** —
     a built-in, asset-free **demo** that drives the whole pipeline and prints or
     writes visible output; if the subject consumes external input (a ROM, a source
     file, a corpus), also add a mode that loads a path and runs it.
   - **Imported** (a regex engine, a data structure, a parser library): do **NOT**
     add a binary — it would be artificial. Instead confirm the public API is
     coherent and add a runnable **usage example** (an example test, or a short
     README snippet that compiles/runs) exercising it end to end. The test suite is
     the demonstration.
3. **Go as far as reasonable.** Complete the families and patterns the lessons
   already introduced — the rest of a demonstrated opcode/instruction/rule family —
   so real input runs meaningfully further. Do **not** invent whole subsystems the
   project never covers. Time-box it; when in doubt, stop and record it in caveats.
4. Anything still unimplemented must **fail fast with a clear message** (what, and
   where — e.g. PC + opcode, or file + line), never hang or panic obscurely.
5. Keep every existing test green and the linter/vet clean. Add a couple of cheap
   tests for the new entry point / demo.
6. Write **`CAVEATS.md`** at the repo root:
   - **Use it** — the exact run command(s) and output for an app, or a short usage
     example (plus `run the tests`) for a library.
   - **Implemented** — the families/features that work end to end.
   - **Partial / stubbed** — what's incomplete and how it degrades.
   - **Future work** — a prioritized checklist to reach completeness.
7. Commit as one or more commits with subjects prefixed `capstone:` — separate
   from the lesson-by-lesson history. **Do not amend lesson commits.**

## Return this JSON

```
{
  "runs": true | false,
  "run_command": "the command a reviewer types",
  "demo_output": "what it produced — dimensions, sample values, exit status",
  "completeness": "one paragraph: how far real input gets before an unimplemented path",
  "caveats_written": true | false,
  "tests_green": true | false,
  "capstone_commits": ["capstone: ..."],
  "site_caveats": {
    "note": "one honest sentence on how complete the finished program is",
    "future": ["prioritized extension 1", "extension 2", "..."]
  }
}
```

`site_caveats` is copied verbatim into the project's `caveats` field in
`src/content/projects/<slug>.md` — keep `note` to one sentence and `future` to 4–6
concrete, learner-facing items (the biggest missing pieces), not an exhaustive TODO.

For an app, confirm the run command actually works before reporting `runs: true`.
For a **library**, there is no binary: set `runs` to whether the usage example +
test suite pass, and `run_command` to how to run the tests (or the example).

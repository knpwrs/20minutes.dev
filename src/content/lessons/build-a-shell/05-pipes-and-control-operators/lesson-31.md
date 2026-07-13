---
project: build-a-shell
lesson: 31
title: The && operator
overview: The `&&` operator runs the next command only if the last one succeeded. Today you add your first conditional connector, the one behind every "build && test" you have ever typed.
goal: Implement `&&` so the pipeline after it runs only when the previous pipeline's status was zero.
spec:
  scenario: Conditional AND
  status: failing
  lines:
    - kw: Given
      text: 'the line: true && echo yes'
    - kw: When
      text: the shell runs it
    - kw: Then
      text: 'the output is "yes\n" (the left side succeeded, so the right side ran)'
    - kw: And
      text: '"false && echo yes" prints nothing (the left side failed, so the right side is skipped)'
code:
  lang: c
  source: |
    // after running the left pipeline, check last_status before the right one
    run_pipeline(left);
    if (connector == AND && last_status == 0)
        run_pipeline(right);       // only on success
checkpoint: '`&&` chains commands on success. Commit and stop here.'
---

`&&` is a **conditional connector**: it runs the pipeline to its right **only if**
the pipeline to its left succeeded, meaning exited with status `0`. It is how you
say "do this, and *only if that worked*, do the next thing" - `mkdir build && cd
build`, `make && make test`. If the left side fails, the right side is skipped
entirely and the failure status carries forward.

Slot it into the connector loop from yesterday. Where `;` always runs the next
pipeline, `&&` consults the **last status** first and runs the next pipeline only
when it is zero. This "stop early on failure" behavior is called **short-circuit**
evaluation, and it is the same idea as `&&` in most programming languages -
except here each operand is a whole command whose success is its exit status.

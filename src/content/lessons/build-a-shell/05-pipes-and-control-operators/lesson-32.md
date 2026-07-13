---
project: build-a-shell
lesson: 32
title: The || operator
overview: The `||` operator is the mirror of `&&` - it runs the next command only if the last one failed. Today you add it and settle how `&&` and `||` combine on one line.
goal: Implement `||` so the next pipeline runs only when the previous one failed, evaluating connectors left to right.
spec:
  scenario: Conditional OR
  status: failing
  lines:
    - kw: Given
      text: 'the line: false || echo fallback'
    - kw: When
      text: the shell runs it
    - kw: Then
      text: 'the output is "fallback\n" (the left side failed, so the right side ran)'
    - kw: And
      text: '"true && echo a || echo b" prints "a\n" (connectors apply left to right, equal precedence)'
code:
  lang: c
  source: |
    // || is the complement of &&: run the right side only on failure
    if (connector == OR  && last_status != 0) run_pipeline(right);
    if (connector == AND && last_status == 0) run_pipeline(right);
    // walk connectors left to right; each looks at the current last_status
checkpoint: '`||` provides a fallback on failure. Commit and stop here.'
---

`||` runs its right-hand pipeline **only if** the left one **failed** (non-zero
status) - the natural fallback: `make || echo "build broke"`, `ping -c1 host ||
notify-down`. It short-circuits the opposite way from `&&`: on success it skips the
right side, since there is nothing to fall back to.

The interesting question is how `&&` and `||` mix. In the shell they have **equal
precedence** and associate **left to right**, so `true && echo a || echo b` is
read as `(true && echo a) || echo b` - `true` succeeds, `echo a` runs, and because
that succeeded the `|| echo b` is skipped. Implement it exactly that way: walk the
connectors left to right, and at each one decide whether to run the next pipeline
based on the current last status. No precedence table, no parentheses - just a
left-to-right fold, which is what real shells do here.

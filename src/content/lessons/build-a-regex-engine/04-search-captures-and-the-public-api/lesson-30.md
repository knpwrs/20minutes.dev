---
project: build-a-regex-engine
lesson: 30
title: Captures that survive backtracking
overview: Yesterday's groups recorded cleanly because nothing had to be undone. Today you make captures correct when the matcher tries a path, records a group, then backtracks - the discipline that separates a toy from a real extractor.
goal: Save and restore the group slots across backtracking so a failed branch leaves no stale offsets.
spec:
  scenario: Group offsets are undone when a branch fails
  status: failing
  lines:
    - kw: Given
      text: 'the pattern "(a)(b)?"'
    - kw: When
      text: 'FindStringSubmatch runs against "ab"'
    - kw: Then
      text: 'it returns ["ab", "a", "b"], and against "a" returns ["a", "a", ""] - the optional group is empty'
    - kw: And
      text: 'FindStringSubmatch for "(a)(b)?b" against "ab" returns ["ab", "a", ""]'
    - kw: And
      text: 'FindStringSubmatch for "(a|b)c" against "bc" returns ["bc", "b"]'
code:
  lang: go
  source: |
    // Before trying a branch that might fail (an alternation side, the
    // "take it" arm of ?, one repetition count of *), SAVE the slots;
    // if that branch fails, RESTORE them before trying the next.
    saved := append([]int(nil), slots...)
    if tryBranch() { return true }
    copy(slots, saved) // undo whatever tryBranch recorded
checkpoint: Captures now stay correct across backtracking - failed branches leave no stale group offsets. Commit and stop here.
---

Yesterday's groups matched on the first try, so recording their spans was enough. But a
backtracking matcher constantly tries a path and abandons it. Consider `(a)(b)?b` against
`ab`: the `(b)?` greedily grabs the `b` and records it as group 2 - but then the trailing
literal `b` has nothing left to match, so the matcher backs off, lets `(b)?` match empty,
and consumes the `b` with the literal instead. If you don't **undo** that first recording,
group 2 wrongly reports `b` when it should be empty.

The fix is a save/restore discipline: at every point where the matcher tries one
alternative before another - the two sides of `|`, the "include it" versus "skip it" arms
of `?`, each repetition count of `*` - copy the slots before the attempt and copy them
back if it fails. Then the only offsets that survive are the ones on the path that
actually succeeded. This is exactly why extracting *where* and *which group* matched is so
much easier with backtracking than with the NFA: the matcher's own trial-and-error order
gives you a natural place to record and roll back. (Doing captures on the linear-time NFA
needs a cleverer machine - the Pike VM - which is where you'd go next.)

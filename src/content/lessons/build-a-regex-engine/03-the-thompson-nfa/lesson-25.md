---
project: build-a-regex-engine
lesson: 25
title: Wildcards and classes in the NFA
overview: The simulator only knows how to match exact bytes. Today you teach its states to match any character and character-class sets, so the NFA covers the same alphabet the backtracker does.
goal: Extend NFA compilation and stepping so Dot and Class nodes match during simulation.
spec:
  scenario: The NFA matches dot and character classes
  status: failing
  lines:
    - kw: Given
      text: nfaMatch built over the NFA
    - kw: When
      text: 'it runs "a.c" against "axc"'
    - kw: Then
      text: 'it reports true, and "a.c" against "ac" reports false'
    - kw: And
      text: 'nfaMatch for "[a-z]" against "q" reports true, and against "5" reports false'
    - kw: And
      text: 'anchors compile away - "^abc$" and "abc" produce the same whole-string match'
code:
  lang: go
  source: |
    // Give a state a way to say "do I accept this byte?":
    //   Char  -> byte == Ch
    //   Any   -> true (from Dot)
    //   Class -> (byte in Set) != Negate
    // The step loop calls that test instead of a bare == on Ch.
    // Anchors: compile ^ and $ to a plain pass-through (Split-like).
checkpoint: The NFA matches `.` and character classes, and treats anchors as pass-throughs. Commit and stop here.
---

Your simulator's step loop currently tests `s.Ch == ch` - it only knows exact bytes.
To match `.` and `[a-z]`, generalize that test: give each consuming state a way to
answer "do you accept this byte?" A `Char` accepts one specific byte, an `Any` state
(compiled from `Dot`) accepts anything, and a `Class` state accepts a byte when it is
in the set - or not in it, if negated. The rest of the simulation is unchanged; only
the accept test grows.

Anchors need a quick decision too. Since `nfaMatch` already matches the whole string,
`^` and `$` are redundant *at the ends* - so the simplest correct move for now is to
compile them as pass-through states that consume nothing, exactly like a one-armed
`Split`. That keeps patterns like `^abc$` working (they mean the same as `abc` under
whole-string matching). With this, the NFA recognizes the full core syntax - and
tomorrow you get to watch it shrug off the pattern that would hang the backtracker.

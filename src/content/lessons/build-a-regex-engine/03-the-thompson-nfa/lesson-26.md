---
project: build-a-regex-engine
lesson: 26
title: The pathological pattern
overview: Today you cash in the whole chapter. The NFA matches a pattern that would make a backtracker explore an exponential number of paths - and it does so instantly. This is why Thompson simulation matters.
goal: Confirm the NFA matches the classic blow-up pattern in linear time.
spec:
  scenario: The NFA handles a pattern that defeats backtracking
  status: failing
  lines:
    - kw: Given
      text: 'the pattern "a?a?a?aaa" (three optional a''s followed by three required a''s)'
    - kw: When
      text: 'nfaMatch runs it against "aaa"'
    - kw: Then
      text: 'it reports true, and against "aa" reports false'
    - kw: And
      text: 'the same shape scaled to n=25 - "a?" repeated 25 times then "a" repeated 25 times - matched against 25 a''s reports true and returns immediately'
code:
  lang: go
  source: |
    // Build the classic blow-up family for size n:
    pat := strings.Repeat("a?", n) + strings.Repeat("a", n)
    in  := strings.Repeat("a", n)
    // A backtracker tries ~2^n ways to split the a?'s; the NFA visits
    // at most (#states x len(in)) state-steps. Time the two if curious.
checkpoint: The NFA matches the exponential blow-up pattern in linear time. Chapter three is complete. Commit and stop here.
---

The pattern `a?a?a?aaa` (in general, `a?` repeated `n` times followed by `a` repeated
`n` times) is the textbook trap. A backtracking matcher tries every way to distribute
the input `a`s among the optional and required slots - about 2^n combinations - so at
`n=25` it effectively hangs. The NFA doesn't care: its state set never holds more than
a handful of states, so it finishes in a single linear pass. Matched against 25 `a`s,
it returns `true` immediately.

This is the result the whole chapter was built for, and it's the reason production
engines like Go's own `regexp` use NFA simulation rather than backtracking. You now
have **two** matchers with different strengths: the backtracker is simple and, as
you'll see next chapter, makes capture groups easy; the NFA is bulletproof on
adversarial patterns. Keep both - the final chapter builds the public API on top,
using each where it shines.

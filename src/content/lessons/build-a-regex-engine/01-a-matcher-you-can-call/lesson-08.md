---
project: build-a-regex-engine
lesson: 8
title: The optional quantifier
overview: '`?` means zero or one - the last member of the quantifier family. With it in place your engine already matches a surprising range of real patterns, so today ends the chapter with a small demo.'
goal: Parse `x?` into a Quest node that matches the preceding element zero or one time.
spec:
  scenario: Optional matches zero or one time
  status: failing
  lines:
    - kw: Given
      text: 'the pattern "ab?c"'
    - kw: When
      text: 'Match is called against "ac"'
    - kw: Then
      text: 'it reports true, and "ab?c" against "abc" also reports true'
    - kw: And
      text: 'Match for "ab?c" against "abbc" reports false'
    - kw: And
      text: 'Match for "^h.llo$" against "hello" reports true'
code:
  lang: go
  source: |
    type Quest struct{ Sub any }

    // ? tries the element once; if that path fails, it tries
    // skipping it entirely. Same two-options-in-order idea as Star,
    // but with no loop - at most one copy.
checkpoint: '`?` matches zero or one, completing the quantifier family. Your engine handles a real range of patterns. Commit and stop here.'
---

`?` makes an element optional: `colou?r` matches both `color` and `colour`. Like the
star it has two moves - match the element, or skip it - but with no repetition, so
there is no loop. Try the element first (greedy: prefer to include it), and fall back
to skipping it if the rest of the pattern fails.

That completes the classic quantifier family - `* + ?` - and it is worth pausing to
see how far you've come. In eight short lessons you have a matcher that handles
literals, `.`, `^`, `$`, and all three quantifiers. Try it on `^h.llo$` against
`hello`, or `ab*c` against a few strings. It genuinely works. What it *can't* do yet
is anything with structure - `(ab)+`, or `cat|dog` - because a flat list of nodes
has nowhere to put a group. That is exactly what the next chapter builds.

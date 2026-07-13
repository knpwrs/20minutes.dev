---
project: build-a-regex-engine
lesson: 29
title: Capturing groups
overview: Capture groups remember which slice of text each set of parentheses matched. This is the feature that turns a matcher into an extractor - pulling fields out of dates, logs, and URLs.
goal: Number the groups and record each one's matched span, then return them from FindStringSubmatch.
spec:
  scenario: FindStringSubmatch returns the whole match and each group
  status: failing
  lines:
    - kw: Given
      text: 'the pattern "(a+)(b+)"'
    - kw: When
      text: 'FindStringSubmatch runs against "aaabb"'
    - kw: Then
      text: 'it returns ["aaabb", "aaa", "bb"] - the whole match, then each group'
    - kw: And
      text: 'FindStringSubmatch for "abc" against "abc" returns ["abc"] - group 0 only, no capture groups'
    - kw: And
      text: 'for a non-matching input it returns nil'
code:
  lang: go
  source: |
    // Number groups by their opening paren, left to right (group 0 is
    // the whole match). Keep a slots array of [start,end) per group.
    // When the matcher ENTERS a group, record its start; when it
    // LEAVES, record its end. On success, slice s by each group's slots.
    // (Today's patterns match without backtracking through a group -
    //  making captures survive a failed branch is tomorrow's job.)
checkpoint: FindStringSubmatch reports the whole match plus each captured group. Commit and stop here.
---

A **capture group** records the span of text its parentheses matched. Number the groups
by the position of their opening `(`, left to right, with group 0 reserved for the whole
match. `(a+)(b+)` against `aaabb` captures `aaa` as group 1 and `bb` as group 2, so
`FindStringSubmatch` returns `["aaabb", "aaa", "bb"]`. A pattern with no groups just
returns the whole match - `["abc"]`.

This is why the backtracking matcher is the right tool for captures: as it walks the
pattern it enters and leaves each group in a well-defined order, so you can stamp a
group's start when you enter and its end when you leave, then slice the input by those
offsets once the whole match succeeds. Today's patterns are the easy case - each group
matches cleanly on the first try, so the offsets you record are the ones you keep.
Tomorrow handles what happens when the matcher has to change its mind.

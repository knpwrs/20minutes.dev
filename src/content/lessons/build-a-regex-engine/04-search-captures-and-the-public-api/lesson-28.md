---
project: build-a-regex-engine
lesson: 28
title: Finding where a match is
overview: A yes-or-no answer isn't enough for real work - you need to know where the match is. Find returns the start and end offsets of the leftmost match, which every later query builds on.
goal: Add Find, returning the start and end byte offsets of the leftmost match, or nil if there is none.
spec:
  scenario: Find returns the offsets of the leftmost match
  status: failing
  lines:
    - kw: Given
      text: 'the pattern "b+"'
    - kw: When
      text: 'Find runs against "aabbbc"'
    - kw: Then
      text: 'it returns the offsets [2, 5]'
    - kw: And
      text: 'Find for "b+" against "xyz" returns nil'
    - kw: And
      text: 'Find for "a" against "banana" returns [1, 2] - the leftmost a'
code:
  lang: go
  source: |
    // Reuse the BACKTRACKING matcher - it knows positions.
    // Try start positions left to right; at the first start that
    // matches, capture where the match ended (thread an "end" out of
    // the matcher when the pattern's nodes are exhausted).
    // Return []int{start, end}; nil if no start works.
checkpoint: Find returns the [start, end) offsets of the leftmost match. Commit and stop here.
---

Search tools, editors, and tokenizers all need the *location* of a match, not just
its existence. `Find` scans start positions from left to right and returns the offsets
of the first one that matches - `[2, 5]` for `b+` in `aabbbc`, meaning "bytes 2 up to
5". Leftmost is the rule: for `a` in `banana`, it reports the `a` at index 1, the
earliest one, and stops.

This is where you reach back for the **backtracking** matcher rather than the NFA. The
backtracker walks the text position by position, so it already knows where it is; you
just need it to report where a successful match *ended*. The usual way is to have the
matcher call back (or set a field) at the moment the pattern's nodes are all satisfied,
recording the current text offset as the end. That "tell me where you finished" hook is
exactly what tomorrow's capture groups extend - they record where each parenthesized
sub-part finished, too.

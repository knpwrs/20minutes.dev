---
project: build-a-text-editor
lesson: 30
title: Wrapping around
overview: Search should not dead-end at the last match - it should wrap to the top and keep going. Today you make find-next and find-previous wrap around the ends of the buffer.
goal: Make FindNext wrap to the first match when none follows the cursor, and FindPrev wrap to the last match when none precedes it.
spec:
  scenario: Search wraps around the buffer ends
  status: failing
  lines:
    - kw: Given
      text: 'an editor over "foo bar foo" with the cursor at Row 0, Col 8 (the last "foo")'
    - kw: When
      text: 'FindNext("foo") is called with no match ahead'
    - kw: Then
      text: 'it wraps to the first match and moves the cursor to Row 0, Col 0'
    - kw: And
      text: 'with the cursor at Row 0, Col 0, FindPrev("foo") finds nothing before it and wraps to the last match at Row 0, Col 8'
code:
  lang: go
  source: |
    // FindNext: if nothing is found after the cursor, search from the
    // start of the whole text (the first match) before giving up.
    // FindPrev: if nothing is found before the cursor, take the LAST
    // match in the whole text.
    // only return false when the query is truly absent everywhere.
checkpoint: Search wraps around both ends of the buffer. Commit and stop here.
---

A search that stops at the last match is annoying: you know the word appears earlier
too, but "find next" refuses. Real editors **wrap**. When `FindNext` finds nothing
after the cursor, it starts over from the top of the buffer and takes the first
match; when `FindPrev` finds nothing before the cursor, it wraps to the bottom and
takes the last. From the final `"foo"`, find-next lands back on the first `"foo"`;
from the first, find-previous jumps to the last.

The rule for reporting failure tightens accordingly: a search returns `false` only
when the query appears **nowhere** in the buffer, not merely when it is absent ahead
of (or behind) the cursor. This is the boundary that separates "you have cycled past
the end" from "this string is not in the file", and pinning both wrap directions is
what proves search cycles cleanly instead of getting stuck at the edges. With
wrapping, search is a complete loop through every match in either direction.

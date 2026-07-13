---
project: build-a-text-editor
lesson: 29
title: Finding the previous match
overview: Search runs both ways. Today you add a backward find that moves the cursor to the nearest match before it, the mirror of finding the next one.
goal: Search backward from the cursor for a query and move the cursor to the previous match.
spec:
  scenario: Finding the previous occurrence
  status: failing
  lines:
    - kw: Given
      text: 'an editor over "foo bar foo" with the cursor at Row 0, Col 8 (the second "foo")'
    - kw: When
      text: 'FindPrev("foo") is called'
    - kw: Then
      text: 'it returns true and moves the cursor to Row 0, Col 0 (the first "foo", before the cursor)'
    - kw: And
      text: 'searching for a missing string returns false and leaves the cursor put'
code:
  lang: go
  source: |
    // search the text BEFORE the current offset, and take the LAST match
    // there (the one nearest the cursor):
    //   idx := strings.LastIndex(text[:e.Offset()], q)
    // on a hit, move via PositionAt(idx); otherwise return false
checkpoint: The editor can jump to the previous match of a query. Commit and stop here.
---

Finding the **previous** match is the natural counterpart to finding the next one,
and it flips two things. First, you search only the text **before** the cursor, the
region `[:offset]`, because a previous match must lie behind you. Second, within that
region you want the match **nearest** the cursor, which is the *last* occurrence in
that slice - so where forward search takes the first index it finds, backward search
takes the last.

Everything else is shared: a hit still comes back as a byte offset that `PositionAt`
turns into a cursor, and a miss still returns `false` with the cursor untouched.
With both directions in place, you can walk a query's matches forward and backward
through the file. The one behavior still missing is what happens at the ends - when
there is no next match ahead, or no previous match behind - which is where
wrap-around comes in next.

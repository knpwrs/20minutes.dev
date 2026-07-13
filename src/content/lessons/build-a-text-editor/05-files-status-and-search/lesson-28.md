---
project: build-a-text-editor
lesson: 28
title: Finding the next match
overview: Search is how you move through a real file. Today you find the next occurrence of a query after the cursor and move there, converting a flat buffer offset back into a row and column.
goal: Search forward from the cursor for a query and move the cursor to the next match, reporting whether one was found.
spec:
  scenario: Finding the next occurrence
  status: failing
  lines:
    - kw: Given
      text: 'an editor over "foo bar foo" with the cursor at Row 0, Col 0'
    - kw: When
      text: 'FindNext("bar") is called, then FindNext("foo")'
    - kw: Then
      text: 'FindNext("bar") returns true and moves the cursor to Row 0, Col 4; FindNext("foo") then moves it to Row 0, Col 8 (the match after the cursor)'
    - kw: And
      text: 'over "ab\nfoo" FindNext("foo") moves the cursor to Row 1, Col 0, and searching for a missing string returns false and leaves the cursor put'
code:
  lang: go
  source: |
    // search Text() starting just AFTER the current offset, so repeated
    // finds advance. On a hit, turn the byte offset back into a cursor:
    func (b *Buffer) PositionAt(off int) (row, col int) {
      // find the line whose start <= off, then col = off - LineStart(row)
    }
    // FindNext: idx := strings.Index(text[e.Offset()+1:], q); adjust, move
checkpoint: The editor can jump to the next match of a query. Commit and stop here.
---

Search is the other way, besides the arrow keys, that you get around a file. Finding
the **next** match means scanning the text from just after the cursor for the query
and moving there. Starting the scan one past the current offset is what lets you
press "find" repeatedly and walk through every occurrence instead of sticking on the
one you are already on.

A match comes back as a flat **byte offset**, but the cursor lives in `(row, col)`,
so you need the inverse of chapter one's offset formula: `PositionAt` finds which
line's span contains the offset and subtracts that line's start to get the column.
It is the mirror of `Offset()`, and search is the first feature that needs to go
*backwards* from a buffer position to a cursor - the next lessons lean on it too.
When nothing matches, the cursor stays where it is and the call reports `false`, so
the caller can tell the difference between "found it" and "not here".

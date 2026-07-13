---
project: build-a-text-editor
lesson: 39
title: An undo and redo session
overview: Undo and redo only earn trust when they compose across a real sequence of edits. Today you drive a mixed session and step backward and forward through it.
goal: Run a sequence of edits and confirm undo and redo walk through the history correctly.
spec:
  scenario: Walking a history back and forth
  status: failing
  lines:
    - kw: Given
      text: an editor over an empty buffer
    - kw: When
      text: 'the characters of "abc" are typed, then Enter, then the characters of "xyz", giving "abc\nxyz"'
    - kw: Then
      text: 'one Undo gives Text() "abc\n" (cursor Row 1, Col 0), a second Undo gives Text() "abc" (cursor Row 0, Col 3)'
    - kw: And
      text: 'a Redo then gives Text() "abc\n" again with the cursor at Row 1, Col 0'
code:
  lang: go
  source: |
    for _, c := range "abc" { e.InsertChar(c) } // undo group 1
    e.Enter()                                    // undo group 2
    for _, c := range "xyz" { e.InsertChar(c) } // undo group 3
    e.Undo(); e.Undo(); e.Redo()
    // assert Text() and cursor at each step
checkpoint: Undo and redo compose across a real editing session. Commit and stop here.
---

This session ties the whole chapter together. Typing `"abc"` is one coalesced group;
Enter is its own; typing `"xyz"` is a third. So the history has exactly three steps,
and undo walks them in reverse: the first undo peels off the `"xyz"` run and puts the
cursor back at the start of the new line, the second undoes the Enter and drops you
to the end of `"abc"`. Each step restores the cursor along with the text, so you are
returned to precisely where each edit began.

Redo then retraces the path forward, re-applying the Enter and landing you back at
`"abc\n"` with the cursor where it belonged. The coalescing, the two stacks, and the
cursor-carrying snapshots all show their work at once here, exactly as they will when
a person hammers undo and redo in a real edit. With the model proven end to end
through its history, only one thing is left: to run the entire editor from a single
scripted session - open, edit, search, save - and check it lands precisely where the
design says it should.

---
project: build-a-text-editor
lesson: 19
title: A short editing session
overview: With typing, Enter, and delete in hand, a sequence of keystrokes should compose into exactly the text you expect. Today you replay a small session end to end and pin the result.
goal: Apply a scripted sequence of edits from an empty buffer and confirm the exact text and cursor.
spec:
  scenario: A scripted run of edits
  status: failing
  lines:
    - kw: Given
      text: an editor over an empty buffer at Row 0, Col 0
    - kw: When
      text: 'the characters of "cat" are typed, then Enter, then the characters of "dog", then one Backspace'
    - kw: Then
      text: 'Text() is "cat\ndo" and the cursor is at Row 1, Col 2'
    - kw: And
      text: 'the buffer reports LineCount() 2'
code:
  lang: go
  source: |
    // drive the editor with the operations from this chapter, in order:
    for _, c := range "cat" { e.InsertChar(c) }
    e.Enter()
    for _, c := range "dog" { e.InsertChar(c) }
    e.Backspace()
    // then assert Text() and the cursor position
checkpoint: A scripted editing session produces exactly the expected text - chapter three is complete. Commit and stop here.
---

Individual edits are only trustworthy if they **compose**, so this lesson runs a
little session and checks the whole outcome at once. Typing `"cat"` fills the first
line and leaves the cursor at its end; Enter splits to a new line; typing `"dog"`
fills that; one backspace trims the final `g`. The result is `"cat\ndo"` with the
cursor at row 1, column 2 - and getting there exercises the offset translation, the
piece-splitting insert, the line-splitting Enter, and the in-line delete, all in
sequence.

This is the pattern the capstone scales up: an editor is ultimately a machine that
turns a **stream of keystrokes** into a buffer state, and the way to trust it is to
feed it a script and assert the exact text and cursor it produces. No terminal is
involved - the "keystrokes" are just method calls - which is precisely what makes
the behavior reproducible and checkable. The editing core is now complete; the
remaining chapters make it something you can see, save, search, and undo.

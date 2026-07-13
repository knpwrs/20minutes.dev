---
project: build-a-text-editor
lesson: 12
title: Smart Home and End
overview: Jumping to the start or end of a line is navigation you reach for constantly - and good editors make Home smart about indentation. Today you add Home that toggles between the first non-blank character and column 0, plus End.
goal: Make Home toggle between the first non-blank column and column 0, and End jump to the end of the line.
spec:
  scenario: Toggling to the start of a line and jumping to its end
  status: failing
  lines:
    - kw: Given
      text: 'an editor over "  hello" (two leading spaces, so the first non-blank column is 2) with the cursor at Row 0, Col 5'
    - kw: When
      text: Home is called repeatedly, then End
    - kw: Then
      text: 'the first Home moves to Col 2 (the first non-blank character), a second Home moves to Col 0, and a third Home returns to Col 2 (it toggles)'
    - kw: And
      text: 'End moves the cursor to Col 7 (the length of "  hello")'
code:
  lang: go
  source: |
    // firstNonBlank: index of the first char that isn't a space or tab
    // (or the line length if the line is all blank).
    func (e *Editor) Home() {
      fnb := e.firstNonBlank(e.Row)
      if e.Col != fnb { e.Col = fnb } else { e.Col = 0 } // toggle
    }
    func (e *Editor) End() { e.Col = e.Buf.LineLen(e.Row) }
checkpoint: Home toggles to the indentation or the margin, and End snaps to the line's end. Commit and stop here.
---

`Home` and `End` are the two moves your hands make without thinking - to the front of
the line to fix a word, to the end to keep typing. `End` is the simple one: set the
column to the line's length, one past the last character, the position you append
from (the same "one past the end is legal" rule horizontal movement established).

`Home` is where the real behavior lives. On an indented line, jumping straight to
column 0 usually overshoots - you almost always want the **first non-blank
character**, the start of the actual code or text. So a smart `Home` goes there
first, and only if you are *already* there does it fall back to the true margin at
column 0, toggling between the two on repeated presses. Computing the first non-blank
column - scan past leading spaces and tabs - is the one bit of logic, and it is the
same notion of "indentation" a real editor uses for auto-indent later. On a line with
no leading whitespace the two targets coincide at column 0, so the toggle simply
keeps you there.

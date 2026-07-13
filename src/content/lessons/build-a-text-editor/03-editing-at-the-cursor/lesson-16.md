---
project: build-a-text-editor
lesson: 16
title: Splitting a line with Enter
overview: Pressing Enter breaks one line into two. Today you insert a newline at the cursor and move to the start of the freshly opened line - the operation that gives text its shape.
goal: Insert a newline at the cursor, splitting the line, and place the cursor at the start of the new line.
spec:
  scenario: Enter splits the current line
  status: failing
  lines:
    - kw: Given
      text: 'an editor over "abcd" with the cursor at Row 0, Col 2'
    - kw: When
      text: Enter is called
    - kw: Then
      text: 'Text() is "ab\ncd" and the cursor is at Row 1, Col 0'
    - kw: And
      text: 'the buffer now reports LineCount() 2'
code:
  lang: go
  source: |
    func (e *Editor) Enter() {
      e.Buf.Insert(e.Offset(), "\n") // a newline right at the cursor
      e.Row++                        // drop onto the new line...
      e.Col = 0                      // ...at its very start
    }
checkpoint: Enter splits a line and moves the cursor down. Commit and stop here.
---

Enter is just inserting a `"\n"` at the cursor - but because the buffer treats a
newline as an ordinary byte that happens to end a line, dropping one into the middle
of `"abcd"` splits it cleanly into `"ab"` and `"cd"`. Everything before the cursor
stays on the current line; everything after it becomes the next line. No line list
to update, no re-indexing: the line structure re-derives itself from where the
newlines now sit.

The cursor move is what makes it feel like Enter rather than a stray character. After
the split you belong at the **start of the new line** - row one greater, column back
to zero - which is exactly where you continue typing. This is the mirror of the
line-joining delete from chapter one: inserting a newline makes two lines, deleting
one makes them one again, and both fall straight out of the buffer treating newlines
as content.

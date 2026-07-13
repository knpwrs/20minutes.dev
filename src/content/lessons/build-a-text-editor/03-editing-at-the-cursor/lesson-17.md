---
project: build-a-text-editor
lesson: 17
title: Backspace
overview: Backspace deletes the character before the cursor - and at the start of a line, it pulls that line up onto the one above. Today you handle both cases in one operation.
goal: Delete the character before the cursor; at column 0, delete the preceding newline so the line joins the one above.
spec:
  scenario: Backspace within a line and across a line
  status: failing
  lines:
    - kw: Given
      text: 'an editor over "abc" with the cursor at Row 0, Col 2'
    - kw: When
      text: Backspace is called
    - kw: Then
      text: 'Text() is "ac" and the cursor is at Row 0, Col 1'
    - kw: And
      text: 'over "ab\ncd" at Row 1, Col 0, Backspace gives Text() "abcd" with the cursor at Row 0, Col 2, and at Row 0, Col 0 Backspace does nothing'
code:
  lang: go
  source: |
    func (e *Editor) Backspace() {
      if e.Col > 0 {
        e.Buf.Delete(e.Offset()-1, 1); e.Col--
      } else if e.Row > 0 {
        prev := e.Buf.LineLen(e.Row - 1)     // where the join lands
        e.Buf.Delete(e.Offset()-1, 1)        // delete the newline above
        e.Row--; e.Col = prev
      } // at (0,0): nothing to delete
    }
checkpoint: Backspace deletes and joins lines correctly. Commit and stop here.
---

Backspace has two faces. In the **middle of a line** it is the plain case: delete
the character just before the cursor (at `Offset() - 1`) and step the column back
one. But at **column 0** there is no character to the left on this line - the thing
immediately before the cursor is the newline that ended the previous line. Deleting
that newline joins this line onto the previous one, and the cursor lands where the
join happened: the previous line's old end.

That landing column is the detail to get right - it is the length of the previous
line *before* the join, which is why you read it first. And at the very top of the
file, column 0 of row 0, there is nothing before the cursor at all, so backspace
must do **nothing** rather than delete off the front of the buffer. Pinning all
three - a normal delete, a line join, and the no-op at the origin - is what makes
backspace safe on any input.

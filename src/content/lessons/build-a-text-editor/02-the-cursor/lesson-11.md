---
project: build-a-text-editor
lesson: 11
title: Moving up and down
overview: Vertical movement crosses lines of different lengths, so the column has to be reined in when the new line is shorter. Today you add up and down movement that clamps the column to the target line.
goal: Move the cursor up and down between lines, clamping the column to the length of the line it lands on.
spec:
  scenario: Vertical movement clamps the column
  status: failing
  lines:
    - kw: Given
      text: 'an editor over "hello\nhi\nworld" with the cursor at Row 0, Col 4'
    - kw: When
      text: MoveDown and MoveUp are called
    - kw: Then
      text: 'MoveDown lands at Row 1, Col 2 (line "hi" has length 2, so column 4 is clamped to 2)'
    - kw: And
      text: 'a second MoveDown gives Row 2, Col 2, a third stays at Row 2 (last line), and MoveUp gives Row 1, Col 2'
code:
  lang: go
  source: |
    func (e *Editor) MoveDown() {
      if e.Row < e.Buf.LineCount()-1 { e.Row++; e.clampCol() }
    }
    func (e *Editor) clampCol() {
      if e.Col > e.Buf.LineLen(e.Row) { e.Col = e.Buf.LineLen(e.Row) }
    }
checkpoint: The cursor moves between lines and clamps the column. Commit and stop here.
---

Moving up or down changes the row, but the column raises a question the horizontal
moves never did: the new line might be **shorter** than where the column currently
sits. Dropping from a long line onto a short one has to pull the column back to that
line's end, or the cursor would hover in empty space past the text and produce a
bogus offset. So each vertical move, after changing the row, **clamps the column**
to the new line's length.

Like horizontal movement, vertical movement clamps at the document's edges too:
`MoveUp` from the top line stays put, `MoveDown` from the bottom line stays put.
This is the deliberately simple model - the column is clamped and left there, with
no "remembered" goal column that would restore your original column when you pass
back through a long line. That refinement exists in polished editors, but the
plain clamp is correct, predictable, and exactly one idea.

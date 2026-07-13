---
project: build-a-text-editor
lesson: 10
title: Moving left and right
overview: The most basic navigation is one column at a time - but the cursor must never fall off the ends of a line. Today you add horizontal movement that clamps at column zero and the line's end.
goal: Move the cursor left and right within a line, clamped so it never goes past either end.
spec:
  scenario: Horizontal movement with clamping
  status: failing
  lines:
    - kw: Given
      text: 'an editor over "abc" (a single line of length 3) with the cursor at Col 0'
    - kw: When
      text: MoveLeft and MoveRight are called
    - kw: Then
      text: 'MoveLeft at Col 0 stays at Col 0, and three MoveRight calls give Col 1, 2, 3'
    - kw: And
      text: 'a fourth MoveRight stays at Col 3 (the line length), and MoveLeft from there goes to Col 2'
code:
  lang: go
  source: |
    func (e *Editor) MoveRight() {
      if e.Col < e.Buf.LineLen(e.Row) { e.Col++ } // stop at end of line
    }
    func (e *Editor) MoveLeft() {
      if e.Col > 0 { e.Col-- } // stop at column 0
    }
checkpoint: The cursor moves horizontally and clamps at both ends. Commit and stop here.
---

Moving one column left or right is the simplest navigation there is, and the whole
lesson is the **clamp**. A cursor that walks off the left edge into a negative
column, or off the right edge past the last character, would poison the offset
formula and every edit that follows. So `MoveRight` advances only while the column
is short of the line's length, and `MoveLeft` retreats only while the column is
above zero.

Note the column can legally equal the line **length**, one past the last character:
that is where you stand to append to the end of a line, so it is a valid position,
not an overshoot. Crossing between lines (right at the end of a line wrapping to the
next) is deliberately left out - that is a separate behavior. Today's single job is
horizontal motion that respects the two edges of the current line, and pinning both
clamps proves it.

---
project: build-a-text-editor
lesson: 24
title: Placing the cursor on screen
overview: The buffer cursor lives in text coordinates, but the terminal needs a screen position. Today you map the cursor through the scroll offsets and tab expansion to its on-screen row and column, closing the viewport chapter.
goal: Compute the cursor's on-screen position from its buffer position, the scroll offsets, and tab expansion.
spec:
  scenario: Mapping the cursor to the screen
  status: failing
  lines:
    - kw: Given
      text: 'an editor over the line "a\tbc" with both scroll offsets at 0'
    - kw: When
      text: 'the cursor is at Row 0, Col 2 (the "b") and ScreenCursor is computed'
    - kw: Then
      text: 'the screen cursor is Row 0, Col 8 ("a" then a tab fills to column 8)'
    - kw: And
      text: 'with the column offset at 3, the screen cursor column is 5 (8 minus the offset), and over "x\ny" the cursor at Row 1, Col 1 maps to screen Row 1, Col 1'
code:
  lang: go
  source: |
    func (e *Editor) ScreenCursor() (int, int) {
      sr := e.Row - e.rowOffset
      // renderColumn maps a buffer column to its tab-expanded screen column
      sc := renderColumn(e.Buf.Line(e.Row), e.Col) - e.colOffset
      return sr, sc
    }
checkpoint: The cursor maps to an exact on-screen position - the viewport is complete. Commit and stop here.
---

Everything the viewport does converges here: the terminal will need to physically
place its cursor, and that position is the buffer cursor pushed through the same two
transforms the text goes through. The **screen row** is the buffer row minus the row
offset; the **screen column** is the buffer column's *screen* column (tabs expanded)
minus the column offset. On the line `"a\tbc"`, the `b` at buffer column 2 sits at
screen column 8 because the tab expanded `a` out to the tab stop.

This is the piece that ties rendering and the cursor together into a coherent view:
the frame from `Render` and the position from `ScreenCursor` are computed from the
same offsets and the same tab expansion, so the drawn cursor always lands on the
character it points at, wherever the window has scrolled. That is the entire job of a
viewport - present a movable, tab-aware window onto the buffer and say exactly where
the cursor falls within it - and with it the editor is fully drawable. It reads and
renders; next it needs to load and save real files.

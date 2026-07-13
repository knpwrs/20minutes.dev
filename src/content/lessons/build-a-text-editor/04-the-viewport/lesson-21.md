---
project: build-a-text-editor
lesson: 21
title: Scrolling vertically
overview: A file taller than the screen has to scroll. Today you give the editor a row offset and make it follow the cursor, so the line you are on is always on screen.
goal: Track a vertical scroll offset that keeps the cursor's row visible, and render the window from that offset.
spec:
  scenario: Scrolling the window to follow the cursor
  status: failing
  lines:
    - kw: Given
      text: 'an editor over "a\nb\nc\nd\ne" with a viewport 2 rows tall'
    - kw: When
      text: 'the cursor is at Row 3 and the view is scrolled to follow it'
    - kw: Then
      text: 'the row offset becomes 2 and Render(2, 10) is "c\nd"'
    - kw: And
      text: 'moving the cursor to Row 0 and scrolling sets the offset back to 0, so Render(2, 10) is "a\nb"'
code:
  lang: go
  source: |
    // keep the cursor row inside the window [rowOffset, rowOffset+rows)
    func (e *Editor) Scroll(rows int) {
      if e.Row < e.rowOffset { e.rowOffset = e.Row }
      if e.Row >= e.rowOffset+rows { e.rowOffset = e.Row - rows + 1 }
    }
    // Render now draws buffer line (rowOffset + i) on screen row i
checkpoint: The viewport scrolls vertically to keep the cursor visible. Commit and stop here.
---

Once a file is taller than the screen, the viewport shows a **window** onto it, and
that window is defined by a **row offset** - the buffer line drawn at the top of the
screen. Render draws line `rowOffset + i` on screen row `i`, so shifting the offset
scrolls the view. The offset is editor state, not something the caller passes in,
because it has to persist and track where you are.

The rule that makes scrolling feel automatic is simple: keep the cursor's row inside
the window. If the cursor moves **above** the top of the window, pull the offset up
to it; if it moves **below** the bottom, push the offset down just enough to bring
it onto the last visible row. That is the whole of `Scroll`. With a 2-row window and
the cursor on line 3, the offset settles at 2 so lines `c` and `d` show with the
cursor on `d`; jump the cursor home and the offset snaps back to 0. This is the
same top-of-list bookkeeping the fuzzy-finder used, now in two dimensions.

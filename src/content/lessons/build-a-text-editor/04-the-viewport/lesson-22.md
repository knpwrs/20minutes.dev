---
project: build-a-text-editor
lesson: 22
title: Scrolling horizontally
overview: Long lines run off the right edge, so the view has to scroll sideways too. Today you add a column offset that follows the cursor across a wide line.
goal: Track a horizontal scroll offset that keeps the cursor's column visible, and render each line from that offset.
spec:
  scenario: Scrolling sideways to follow the cursor
  status: failing
  lines:
    - kw: Given
      text: 'an editor over the single line "abcdefghij" with a viewport 4 columns wide'
    - kw: When
      text: 'the cursor is at Col 6 and the view is scrolled to follow it'
    - kw: Then
      text: 'the column offset becomes 3 and Render(1, 4) is "defg"'
    - kw: And
      text: 'moving the cursor to Col 0 and scrolling sets the offset back to 0, so Render(1, 4) is "abcd"'
code:
  lang: go
  source: |
    // mirror the vertical rule on columns
    func (e *Editor) Scroll(rows, cols int) {
      // ... the vertical part from last lesson ...
      if e.Col < e.colOffset { e.colOffset = e.Col }
      if e.Col >= e.colOffset+cols { e.colOffset = e.Col - cols + 1 }
    }
    // Render draws each line starting at colOffset, up to cols wide
checkpoint: The viewport scrolls horizontally as well as vertically. Commit and stop here.
---

Horizontal scrolling is the vertical rule turned ninety degrees. A line wider than
the screen needs a **column offset**: the render shows each visible line starting at
`colOffset` and taking at most `cols` characters, so the window slides across the
line as the cursor moves. With the cursor at column 6 in a 4-wide view, the offset
lands at 3 and you see `"defg"` - columns 3 through 6, the cursor on the last
visible one.

The keep-visible logic is identical to vertical scrolling, just on the column: if
the cursor slides left of the window, pull the offset to it; if it slides off the
right, push the offset so the cursor sits on the rightmost column. Together the two
offsets define a rectangular window that chases the cursor around a document of any
size. The one wrinkle still ahead is that a tab is one character in the buffer but
several columns on screen, so "column" for scrolling will soon need to mean *screen*
column - which the next lesson sorts out.

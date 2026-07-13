---
project: build-a-text-editor
lesson: 27
title: The status line
overview: Editors show a status line - the file name, a modified marker, and where you are. Today you render one, a single width-filling line that reports the editor's state at a glance.
goal: Render a status line showing the file name, a modified marker when dirty, and the cursor's line position, padded to the given width.
spec:
  scenario: Rendering the status line
  status: failing
  lines:
    - kw: Given
      text: 'an editor over "a\nb\nc" with the cursor at Row 1, the file name "notes.txt", width 30'
    - kw: When
      text: the status line is rendered
    - kw: Then
      text: 'when not dirty it is "notes.txt" followed by spaces and then "2/3" so the whole line is exactly 30 characters ("notes.txt", 18 spaces, "2/3")'
    - kw: And
      text: 'when dirty the left side is "notes.txt [modified]" (then 7 spaces and "2/3"), still exactly 30 characters'
code:
  lang: go
  source: |
    func (e *Editor) StatusLine(name string, cols int) string {
      left := name
      if e.Dirty { left += " [modified]" }
      right := fmt.Sprintf("%d/%d", e.Row+1, e.Buf.LineCount())
      pad := cols - len(left) - len(right) // spaces between the two sides
      return left + strings.Repeat(" ", pad) + right
    }
checkpoint: The editor renders an informative status line. Commit and stop here.
---

The **status line** is the strip of information every editor keeps at the bottom of
the screen: what file you are in, whether it has unsaved changes, and where the
cursor sits. You build it as a single string of exactly the screen width, with the
**left side** - the file name, plus a `[modified]` marker when the dirty flag is set
- and the **right side** - the current line number over the total, shown one-based
because users count lines from 1, not 0.

The layout trick is the **padding**: fill the gap between the left and right sides
with enough spaces to push the position flush against the right edge, so the whole
line lands on the exact width. That is why the dirty and clean versions have
different amounts of space but the same total length - the `[modified]` text eats
into the padding, not the width. This reuses the dirty flag directly and gives the
viewport its finishing touch: a frame of text, a placed cursor, and a status line
that tells you where you are.

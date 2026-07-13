---
project: build-a-text-editor
lesson: 20
title: Rendering a frame
overview: The editor finally becomes something you can look at. Today you render the buffer to a frame - a fixed grid of rows and columns - with empty rows past the end of the file marked, the way real terminal editors do.
goal: Render the buffer as a frame of a given height and width, marking rows beyond the text with a tilde.
spec:
  scenario: Rendering the buffer to a fixed grid
  status: failing
  lines:
    - kw: Given
      text: 'an editor over a buffer created from "hi\nyo"'
    - kw: When
      text: 'Render(4, 10) produces the frame'
    - kw: Then
      text: 'the frame is these four lines joined by newlines: "hi", "yo", "~", "~"'
    - kw: And
      text: 'for an editor over "abcdef", Render(1, 3) is "abc" (each line is truncated to the width)'
code:
  lang: go
  source: |
    func (e *Editor) Render(rows, cols int) string {
      var out []string
      for i := 0; i < rows; i++ {
        if i < e.Buf.LineCount() {
          line := e.Buf.Line(i)
          if len(line) > cols { line = line[:cols] } // truncate to width
          out = append(out, line)
        } else { out = append(out, "~") }             // past end of file
      }
      return strings.Join(out, "\n")
    }
checkpoint: The buffer renders to a fixed frame with tilde rows past the end. Commit and stop here.
---

A terminal editor draws a fixed rectangle - so many rows tall, so many columns
wide - and the buffer usually does not fill it exactly. Rendering to a **frame**
means producing exactly `rows` lines: the buffer's lines from the top, and for any
screen row past the end of the file, a marker so the empty space reads as "no text
here" rather than a blank the user might mistake for content. The tilde is the
convention `vi` made famous, and it is the honest signal that the file ended.

Rendering to a plain **string** is the move that keeps the whole viewport testable.
There is no terminal, no escape codes - just a grid of characters you can compare
against an exact expected value, the same way the fuzzy-finder rendered its results
to a frame. Lines longer than the width are **truncated** for now, because a
terminal only has so many columns; scrolling that long line into view is the next
lesson. Everything the screen ever shows will come out of this one method.

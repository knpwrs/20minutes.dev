---
project: build-a-text-editor
lesson: 14
title: Jumping to a line
overview: The widest jumps go straight to a line number or to the ends of the whole file. Today you add a clamped go-to-line, with jumps to the document's start and end riding on top, completing the cursor.
goal: Jump to a given line number, clamped into range, and provide jumps to the document's start and end.
spec:
  scenario: Jumping to a line and to the document ends
  status: failing
  lines:
    - kw: Given
      text: 'an editor over "ab\ncde\nfgh" (three lines) with the cursor anywhere'
    - kw: When
      text: GoToLine, DocStart, and DocEnd are called
    - kw: Then
      text: 'GoToLine(1) moves to Row 1, Col 0; GoToLine(9) clamps to the last line, Row 2, Col 0; GoToLine(-3) clamps to Row 0, Col 0'
    - kw: And
      text: 'DocStart moves to Row 0, Col 0, and DocEnd moves to Row 2, Col 3 (the last line "fgh", at its end)'
code:
  lang: go
  source: |
    func (e *Editor) GoToLine(n int) {
      if n < 0 { n = 0 }                                   // clamp low
      if n > e.Buf.LineCount()-1 { n = e.Buf.LineCount()-1 } // clamp high
      e.Row, e.Col = n, 0
    }
    func (e *Editor) DocStart() { e.GoToLine(0) }
    func (e *Editor) DocEnd() {
      e.GoToLine(e.Buf.LineCount() - 1); e.Col = e.Buf.LineLen(e.Row)
    }
checkpoint: The cursor can jump to any line and to either end of the document - the cursor is complete. Commit and stop here.
---

The broadest navigation jumps to a **line number** - the `:42` you type to leap
across a file - and the one bit of logic it needs is a **clamp**. A go-to-line has to
survive being handed a number past the end of the file or a negative one, folding
either back to a real line rather than dropping the cursor into nowhere. That clamp
is what makes it safe to wire up to user input later, and it is the same
guard-the-edges discipline every cursor move in this chapter has followed.

The two ends of the document then fall out as **special cases**: `DocStart` is
go-to-line 0, and `DocEnd` is go-to-line at the last line followed by a jump to that
line's end column. Building them on top of the clamped `GoToLine` means there is one
place that reasons about line bounds, and the shortcuts just name the positions you
reach for most. That rounds out the cursor: you can move by character, line, and
word, snap to a line's ends, jump to any line, and reach both ends of the file, every
move clamped so the cursor never lands where the buffer cannot describe it. With a
place to stand fully established, the next chapter changes the text at that place.

---
project: build-a-text-editor
lesson: 9
title: An editor with a cursor
overview: Editing needs a place - a cursor. Today you introduce the editor, which owns a buffer and a cursor position, and translate that row-and-column position into a byte offset in the buffer.
goal: Create an editor over a buffer with a cursor at row 0, column 0, and map any cursor position to a buffer offset.
spec:
  scenario: The cursor's offset in the buffer
  status: failing
  lines:
    - kw: Given
      text: 'an editor over a buffer created from "ab\ncd"'
    - kw: When
      text: the cursor position and its offset are read
    - kw: Then
      text: 'the cursor starts at Row 0, Col 0 and Offset() is 0'
    - kw: And
      text: 'with the cursor at Row 1, Col 1, Offset() is 4 (LineStart(1) is 3, plus column 1)'
code:
  lang: go
  source: |
    // the editor pairs a buffer with a cursor position
    type Editor struct { Buf *Buffer; Row, Col int }
    func NewEditor(b *Buffer) *Editor { return &Editor{Buf: b} }
    // a (row, col) cursor is one offset into the flat buffer:
    func (e *Editor) Offset() int { return e.Buf.LineStart(e.Row) + e.Col }
checkpoint: The editor holds a buffer and a cursor with a known offset. Commit and stop here.
---

The buffer knows text; it does not know where you are in it. That is the
**cursor's** job, and the cursor needs an owner that also holds the buffer, so this
lesson introduces the **editor**: a buffer plus a `Row` and `Col`. Wiring the two
together in one type now is deliberate - every editing and movement operation from
here needs both the text and the position, and giving them a shared home is the
design decision that lets those operations be simple methods.

The one piece of real logic is the bridge between the two coordinate systems. The
cursor thinks in `(row, col)`; the buffer thinks in a single flat **offset**. They
relate by exactly one formula: the offset is the line's start plus the column.
`Offset()` is small, but it is the hinge the whole editor turns on - inserting,
deleting, and searching all happen at the cursor, and they all reach the buffer
through this translation.

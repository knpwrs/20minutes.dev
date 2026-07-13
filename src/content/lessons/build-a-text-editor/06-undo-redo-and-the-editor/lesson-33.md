---
project: build-a-text-editor
lesson: 33
title: Snapshotting the state
overview: The piece table gives undo almost for free - a snapshot of the piece list is a snapshot of the whole document. Today you capture and restore that state, the mechanism the rest of the chapter builds on.
goal: Capture the buffer's piece list and cursor as a snapshot, and restore the editor exactly from it.
spec:
  scenario: Capturing and restoring editor state
  status: failing
  lines:
    - kw: Given
      text: 'an editor over "abc" with the cursor at Row 0, Col 0'
    - kw: When
      text: "a snapshot is taken, then InsertChar('X') makes \"Xabc\", then the snapshot is restored"
    - kw: Then
      text: 'Text() is "abc" again and the cursor is back at Row 0, Col 0'
    - kw: And
      text: 'the restore is exact even though the edit happened after the snapshot was taken (the snapshot copied the piece list, so the edit could not corrupt it)'
code:
  lang: go
  source: |
    type Snapshot struct { pieces []Piece; row, col int }
    func (e *Editor) Snapshot() Snapshot {
      cp := append([]Piece{}, e.Buf.pieces...) // COPY the slice, don't alias it
      return Snapshot{cp, e.Row, e.Col}
    }
    func (e *Editor) Restore(s Snapshot) {
      e.Buf.pieces = append([]Piece{}, s.pieces...); e.Row, e.Col = s.row, s.col
    }
checkpoint: You can snapshot and restore the whole editor state. Commit and stop here.
---

This is the moment the piece table pays its second dividend. Because all of a
document's structure lives in the **piece list** - a small slice of pieces pointing
into buffers that never change - capturing the entire editing state is just copying
that list plus the cursor. There is no need to copy the text: the original and add
buffers are immutable and only grow, so an old piece list still describes the old
document perfectly, even after more edits. Undo, which would be expensive over a
mutable string, is nearly free here.

The one real trap is **aliasing**. A piece list is a slice, and a slice is a
reference; if a snapshot merely held the same slice the editor keeps mutating, a
later edit could scribble over the very state you meant to preserve. So the snapshot
**copies** the slice into a fresh one, and restore copies back. That the spec edits
*after* snapshotting and still restores cleanly is the proof the copy is real. This
tiny capture-and-restore pair is the engine every undo and redo in this chapter
turns.

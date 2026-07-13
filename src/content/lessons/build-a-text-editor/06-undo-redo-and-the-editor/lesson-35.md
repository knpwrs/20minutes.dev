---
project: build-a-text-editor
lesson: 35
title: Undo
overview: Now the history pays off. Today you pop the last snapshot and restore it, taking the editor back to exactly where it was before the most recent edit.
goal: Undo the last edit by popping the undo stack and restoring that snapshot, with an empty stack as a no-op.
spec:
  scenario: Undoing the last edit
  status: failing
  lines:
    - kw: Given
      text: "an editor over \"abc\", cursor moved to Row 0, Col 3, then InsertChar('d') makes \"abcd\" with the cursor at Col 4"
    - kw: When
      text: Undo is called
    - kw: Then
      text: 'Text() is "abc" again and the cursor is back at Row 0, Col 3 (exactly the pre-edit state)'
    - kw: And
      text: 'calling Undo again with an empty stack does nothing and leaves the text "abc"'
code:
  lang: go
  source: |
    func (e *Editor) Undo() {
      if len(e.undo) == 0 { return }        // nothing to undo
      last := e.undo[len(e.undo)-1]
      e.undo = e.undo[:len(e.undo)-1]       // pop
      e.Restore(last)                       // back to the pre-edit state
    }
checkpoint: Undo returns the editor to the state before the last edit. Commit and stop here.
---

Undo is the reward for all that recording: pop the most recent snapshot off the undo
stack and `Restore` it. Because a snapshot carries both the piece list and the
cursor, undo brings back not just the text but the **exact position** you were at
before the edit - the cursor lands where it would have been, which is what makes undo
feel like stepping backward through time rather than just reverting text. Typing `d`
onto `"abc"` and undoing returns both the `"abc"` and the cursor at column 3.

The edge that must be safe is an **empty stack**: with no history, undo has nothing
to restore and must quietly do nothing rather than pop off the end of an empty slice
and crash. Notice how little code this takes - the snapshot and restore machinery
did the heavy lifting, so undo is just stack discipline on top. What it cannot do yet
is take you *forward* again after you have undone too far; that is redo, next.

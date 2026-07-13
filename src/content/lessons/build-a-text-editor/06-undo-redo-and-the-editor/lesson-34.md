---
project: build-a-text-editor
lesson: 34
title: Recording before each edit
overview: To undo an edit you need the state from just before it. Today you push a snapshot onto an undo stack before every editing operation, building the history undo will walk.
goal: Push a snapshot onto an undo stack before each editing operation.
spec:
  scenario: Recording history before edits
  status: failing
  lines:
    - kw: Given
      text: 'a fresh editor over "abc" with the cursor at Row 0, Col 3'
    - kw: When
      text: "InsertChar('d') is called, then Enter"
    - kw: Then
      text: 'the undo stack has depth 1 after the InsertChar and depth 2 after the Enter (UndoDepth() reports 1, then 2)'
    - kw: And
      text: 'a brand-new editor has an undo depth of 0'
code:
  lang: go
  source: |
    // before mutating in each edit op, record the pre-edit state:
    func (e *Editor) pushUndo() { e.undo = append(e.undo, e.Snapshot()) }
    // InsertChar / Enter / Backspace / DeleteForward each call pushUndo()
    // as their first line, then do their existing work.
    func (e *Editor) UndoDepth() int { return len(e.undo) }
checkpoint: Every edit records the state before it. Commit and stop here.
---

Undo needs a memory, and the memory is an **undo stack** of snapshots. The rule is
simple: right before an editing operation changes the buffer, push a snapshot of the
state *as it is now* - the state you would return to if that edit were undone. Each
of the four edit operations from chapter three gains a `pushUndo()` as its first
line, so the history grows by one entry per edit.

Recording happens **before** the change, not after, because undo restores the
*previous* state, and the previous state only exists to be captured up until the
instant the edit fires. This lesson just accumulates the history; nothing pops it
yet. Keeping recording and restoring as separate steps is deliberate - it lets the
next lesson focus entirely on the mechanics of undo, and it keeps the coalescing
rule later (where consecutive typing should record only *once*) a clean modification
to this one push point rather than a rewrite of every edit method.

---
project: build-a-text-editor
lesson: 37
title: A new edit clears redo
overview: Once you undo and then type something new, the future you undid past is gone. Today you clear the redo stack on any fresh edit, so redo can never resurrect an abandoned branch.
goal: Discard the redo stack whenever a new edit is recorded, so a stale redo can't reappear.
spec:
  scenario: A fresh edit abandons the redo history
  status: failing
  lines:
    - kw: Given
      text: "an editor over \"abc\", cursor at Row 0, Col 3, InsertChar('d') then one Undo back to \"abc\" (redo now has depth 1)"
    - kw: When
      text: "InsertChar('e') is called, making \"abce\""
    - kw: Then
      text: 'the redo stack is now empty (RedoDepth() is 0), so Redo does nothing and the text stays "abce"'
    - kw: And
      text: 'the undo stack still works - undoing the new edit returns the text to "abc"'
code:
  lang: go
  source: |
    // in pushUndo (called at the start of every edit), also drop redo:
    func (e *Editor) pushUndo() {
      e.undo = append(e.undo, e.Snapshot())
      e.redo = nil // a new edit forks history; the old future is gone
    }
    func (e *Editor) RedoDepth() int { return len(e.redo) }
checkpoint: A new edit after an undo abandons the redo history. Commit and stop here.
---

Undo and redo walk a straight line of edits, but a **new edit after an undo** bends
that line into a fork. Say you type `d`, undo it, then type `e`: the `d` you undid
past is no longer on your timeline - you branched away from it - so redoing back to
it would be meaningless. The universal rule editors follow is to **discard the redo
stack** whenever a fresh edit is recorded. The future you abandoned is gone.

The fix lands in exactly one place: `pushUndo`, which every edit already calls,
clears the redo stack as it records the new history entry. That single line keeps
the invariant that redo only ever re-applies edits along the *current* branch, never
a dead one. This is the kind of edge that is invisible until it bites - without it,
a redo after new typing would splice in text from an abandoned timeline - so pinning
"the redo stack is empty after a new edit" nails the model down. The undo system is
now correct; one refinement of *feel* remains.

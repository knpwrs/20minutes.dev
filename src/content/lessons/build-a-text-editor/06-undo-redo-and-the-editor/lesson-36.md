---
project: build-a-text-editor
lesson: 36
title: Redo
overview: Undo you too far and you want it back. Today you add redo, which re-applies an undone edit by keeping a second stack of the states you undid past.
goal: Redo an undone edit by moving state between an undo stack and a redo stack.
spec:
  scenario: Redoing an undone edit
  status: failing
  lines:
    - kw: Given
      text: "an editor over \"abc\", cursor at Row 0, Col 3, InsertChar('d') making \"abcd\", then one Undo back to \"abc\""
    - kw: When
      text: Redo is called
    - kw: Then
      text: 'Text() is "abcd" again with the cursor at Row 0, Col 4'
    - kw: And
      text: 'calling Redo again with nothing to redo does nothing and leaves the text "abcd"'
code:
  lang: go
  source: |
    // Undo now saves the CURRENT state to the redo stack before restoring:
    //   e.redo = append(e.redo, e.Snapshot()); e.Restore(popFromUndo)
    // Redo is the symmetric move:
    func (e *Editor) Redo() {
      if len(e.redo) == 0 { return }
      last := e.redo[len(e.redo)-1]; e.redo = e.redo[:len(e.redo)-1]
      e.undo = append(e.undo, e.Snapshot()) // so you can undo the redo
      e.Restore(last)
    }
checkpoint: Redo re-applies an edit you undid. Commit and stop here.
---

Redo makes undo reversible. The trick is a **second stack**. When you undo, instead
of throwing the current state away, you push it onto a **redo stack** first - that
saved state is precisely what redo will restore. So undo moves a state from the undo
stack to the redo stack (restoring the older one), and redo moves a state from the
redo stack back to the undo stack (restoring the newer one). The two stacks are
mirror images, and a state slides between them as you step back and forth.

That symmetry is why redoing after an undo lands you exactly where you started -
`"abcd"` with the cursor at column 4 - and why redoing again, with the redo stack
empty, safely does nothing. Undo and redo now let you scrub freely along a straight
line of edits. But that line branches the moment you make a *new* edit after undoing,
and deciding what happens to the redo stack then is the next, subtle lesson.

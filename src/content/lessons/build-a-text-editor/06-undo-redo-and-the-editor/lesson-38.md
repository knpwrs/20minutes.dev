---
project: build-a-text-editor
lesson: 38
title: Coalescing typed runs
overview: Undoing one character at a time is tedious - you want undo to remove a whole typed word at once. Today you coalesce consecutive typing into a single undo step.
goal: Group a run of consecutive character inserts into one undo entry, broken by any other kind of edit.
spec:
  scenario: Consecutive typing undoes as one step
  status: failing
  lines:
    - kw: Given
      text: an editor over an empty buffer
    - kw: When
      text: 'the characters of "cat" are typed, then one Undo'
    - kw: Then
      text: 'the undo depth after typing is 1, and the single Undo removes the whole word, leaving Text() "" with the cursor at Row 0, Col 0'
    - kw: And
      text: 'typing "ab", then Enter, then "cd" gives undo depth 3, and the first Undo removes only "cd" (leaving Text() "ab\n" with the cursor at Row 1, Col 0)'
code:
  lang: go
  source: |
    // InsertChar records a snapshot only when NOT already mid-run:
    func (e *Editor) InsertChar(c byte) {
      if !e.coalescing { e.pushUndo(); e.coalescing = true }
      /* insert + advance */ ; e.Dirty = true
    }
    // Enter/Backspace/DeleteForward pushUndo() and set e.coalescing = false.
    // Undo/Redo also reset e.coalescing = false so the next run is fresh.
checkpoint: Consecutive typing undoes as a single word - chapter's undo model is complete. Commit and stop here.
---

Character-by-character undo is technically correct and practically miserable: nobody
wants to press undo eight times to remove `"elephant"`. Editors **coalesce** a run of
consecutive keystrokes into one undo step. The mechanism is a small flag: the first
character of a run records a snapshot and marks that a run is in progress, and while
that flag is set, further characters skip recording - so the whole word shares the
single snapshot taken before its first letter. One undo, one word.

The run has to **end** somewhere, and the rule is that any *other* kind of edit
breaks it: pressing Enter, backspacing, or deleting records its own snapshot and
clears the flag, so the next typed character starts a fresh group. That is why
`"ab"`, Enter, `"cd"` produces three undo entries, and undoing once peels off just
the `"cd"`. Undo and redo reset the flag too, so a run never bridges across them.
This is the last piece of behavior; the coalesced, cursor-restoring, branch-aware
undo you now have is exactly what a real editor ships. Next, the editor drives
itself from a script.

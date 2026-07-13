---
project: build-a-text-editor
lesson: 26
title: Saving and the dirty flag
overview: Edits are worthless if you cannot write them back - and the editor has to know when there are unsaved changes. Today you save the buffer's text and track a dirty flag that every edit sets and every save clears.
goal: Write the buffer's text to a writer, and track a dirty flag set by edits and cleared by save and load.
spec:
  scenario: Saving text and tracking unsaved changes
  status: failing
  lines:
    - kw: Given
      text: 'an editor over "abc" with the cursor at Row 0, Col 1'
    - kw: When
      text: 'edits, a save, and a load happen in sequence'
    - kw: Then
      text: 'a new editor is not dirty; InsertChar("X") makes Text() "aXbc" and sets dirty true; Save to a writer writes exactly "aXbc" and clears dirty to false'
    - kw: And
      text: 'a further edit sets dirty true again, and Load from a reader of "z" gives Text() "z" and clears dirty to false'
code:
  lang: go
  source: |
    func (e *Editor) Save(w io.Writer) error {
      _, err := io.WriteString(w, e.Buf.Text())
      e.Dirty = false                 // disk now matches the buffer
      return err
    }
    // set e.Dirty = true at the end of every edit (InsertChar, Enter,
    // Backspace, DeleteForward); set it false in Load too.
checkpoint: The editor saves its text and knows when it has unsaved changes. Commit and stop here.
---

Saving is loading run backwards: flatten the piece table into one string with
`Text()` and hand those bytes to a **writer**. The piece table did its clever work
in memory - splitting and trimming pieces so no byte was ever copied while editing -
but a file on disk is a flat sequence, so at save time the pieces are walked once and
concatenated. Writing to a generic `writer` mirrors the generic reader from loading,
so the whole load-edit-save cycle is exercisable without touching the file system.

Riding along with save is the **dirty flag**, the single boolean that answers "are
there changes on screen that are not yet on disk?" Every editing operation sets it,
because each one moves the buffer away from what was last saved; **save** and
**load** clear it, because afterward the buffer matches a file. It is one bit, but it
drives the `[modified]` marker on the status line next lesson and the "you have
unsaved changes" prompt before quitting later. The honest work here is being
thorough - *every* edit method must set the flag, or the editor will cheerfully claim
a changed file is saved.

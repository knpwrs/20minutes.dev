---
project: build-a-text-editor
lesson: 25
title: Loading a file
overview: An editor needs something to edit, so it has to read text in from the outside. Today you load a stream of bytes into the buffer, giving the piece table its immutable original.
goal: Load text from a reader into the editor, replacing the buffer and resetting the cursor to the start.
spec:
  scenario: Loading text from a reader
  status: failing
  lines:
    - kw: Given
      text: 'an editor and a reader yielding "line1\nline2"'
    - kw: When
      text: the editor loads from the reader
    - kw: Then
      text: 'the buffer Text() is "line1\nline2", LineCount() is 2, and the cursor is at Row 0, Col 0'
    - kw: And
      text: 'loading from an empty reader gives Text() "" and LineCount() 1'
code:
  lang: go
  source: |
    func (e *Editor) Load(r io.Reader) error {
      data, err := io.ReadAll(r)
      if err != nil { return err }
      e.Buf = New(string(data)) // the loaded bytes become the original
      e.Row, e.Col = 0, 0
      return nil
    }
checkpoint: The editor can load text from any reader. Commit and stop here.
---

So far the buffer's text came from a string literal in a test; a real editor reads
it from a **file** - or any byte stream, which is why loading takes a generic
`reader` rather than a filename. The bytes it reads become the piece table's
**immutable original**, exactly the role that buffer was built for: it is the
never-changing baseline, and every edit you make afterward lives in the add buffer as
pieces layered on top.

Loading **replaces** the buffer wholesale and resets the cursor to the origin,
because you are now editing a different document. Reading through an interface rather
than opening a path keeps this testable with an in-memory reader and keeps the file
system - the genuinely OS-specific part - out of the core, to be wired up in the
finalize pass. An empty stream still yields a one-line buffer, honoring the "always
at least one line" rule from chapter one.

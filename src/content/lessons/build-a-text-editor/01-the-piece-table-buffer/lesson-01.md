---
project: build-a-text-editor
lesson: 1
title: An empty buffer that holds text
overview: Every editor is built around one thing - a buffer that holds the text you are editing. Today you create the smallest possible buffer so the surface the whole project grows on exists from day one.
goal: Create a buffer from some initial text whose Text and Len report exactly what it holds.
spec:
  scenario: Reading a buffer's contents and length
  status: failing
  lines:
    - kw: Given
      text: 'a buffer created from the text "hello"'
    - kw: When
      text: its Text and Len are read
    - kw: Then
      text: 'Text() is "hello" and Len() is 5'
    - kw: And
      text: 'a buffer created from "" has Text() "" and Len() 0'
code:
  lang: go
  source: |
    // the whole editor grows around this type
    type Buffer struct { original string }
    func New(text string) *Buffer { return &Buffer{original: text} }
    func (b *Buffer) Text() string { return b.original }
    func (b *Buffer) Len() int { return len(b.original) }
checkpoint: You have a buffer you can construct and read back. Commit and stop here.
---

A text editor is, underneath everything, a thing that holds a sequence of
characters and lets you change it. Before cursors, screens, or files matter, that
sequence has to exist as something you can construct and read back. Today the
buffer just wraps the **original text** it was created with, and `Text()` hands it
straight back.

Keeping it this simple pins the contract the rest of the project leans on: a
buffer is created from some starting text, `Text()` returns the whole thing, and
`Len()` reports how many bytes it holds. The clever internal representation - the
piece table that makes edits fast and exact - arrives next lesson, but its public
face is exactly this: give me the text, tell me how long it is.

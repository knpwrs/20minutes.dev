---
project: build-a-text-editor
lesson: 3
title: Inserting by splitting a piece
overview: This is the heart of the piece table - inserting text never rewrites the buffer, it appends to a second buffer and splices a new piece into the list. Today you make insert work at any position, splitting the piece it lands in.
goal: Insert text at any position by appending it to the add buffer and splitting the piece it lands in, including at the buffer's ends.
spec:
  scenario: Inserting inside an existing piece
  status: failing
  lines:
    - kw: Given
      text: 'a buffer created from "Hello"'
    - kw: When
      text: 'Insert(2, "XY") is called'
    - kw: Then
      text: 'Text() is "HeXYllo", Len() is 7, and the list now holds three pieces: the original "He", the added "XY", and the original "llo" (PieceCount() is 3)'
    - kw: And
      text: 'insert also works at the ends and into an empty buffer: New("mid") with Insert(0, "<") then Insert(4, ">") gives Text() "<mid>", and New("").Insert(0, "hi") gives Text() "hi" (an empty split half is dropped, never kept as a piece)'
code:
  lang: go
  source: |
    // append the new text to the add buffer, note where it started
    addStart := len(b.add); b.add += s
    // find the piece holding pos and the offset into it, then rebuild:
    //   pieces before it, {left half of that piece},
    //   {Add, addStart, len(s)}, {right half of that piece}, pieces after
    func (b *Buffer) Insert(pos int, s string) { /* split and splice */ }
checkpoint: You can insert text anywhere inside a piece. Commit and stop here.
---

Here is why the piece table earns its keep. To insert `"XY"` into the middle of
`"Hello"`, you do **not** build a new string. You append `"XY"` to the **add
buffer** (an append-only companion to the immutable original) and then rewrite only
the *piece list*: the single piece for `"Hello"` becomes three - `"He"` from the
original, `"XY"` from the add buffer, and `"llo"` from the original. The backing
bytes never move; only the small list of pieces changes.

The mechanic is a **split**. Find which piece the insert position falls in and how
far into it, cut that piece into a left part and a right part, and drop the new
add-buffer piece between them. Handle the boundaries in the same stroke: inserting at
position 0 or at the very end produces one empty split half, and inserting into an
empty buffer has no piece to split at all, so drop any zero-length half rather than
keeping it. Every character of text still lives in exactly one backing buffer at a
fixed offset - that is what keeps `Text()` correct and, later, what makes undo as
cheap as remembering an old piece list.

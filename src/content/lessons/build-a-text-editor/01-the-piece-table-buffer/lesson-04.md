---
project: build-a-text-editor
lesson: 4
title: Extending the last piece
overview: Typing means inserting one character after another at the same growing point - and a naive piece table makes a new piece for each keystroke. Today you add the optimization that keeps consecutive typing in a single piece.
goal: When an insert continues the previous one at the tip of the last-added piece, extend that piece instead of creating a new one.
spec:
  scenario: Consecutive inserts extend one piece
  status: failing
  lines:
    - kw: Given
      text: 'a buffer created from "" (empty)'
    - kw: When
      text: 'the characters are inserted one at a time at the growing end: Insert(0, "a"), Insert(1, "b"), Insert(2, "c")'
    - kw: Then
      text: 'Text() is "abc" and PieceCount() is 1 (the three consecutive inserts extended a single add-buffer piece rather than making three)'
    - kw: And
      text: 'a following Insert(0, "z") is not at that tip, so it starts a new piece: Text() is "zabc" and PieceCount() is 2'
code:
  lang: go
  source: |
    // an insert continues the previous one when the position lands exactly
    // at the end of the last piece, that piece is an Add piece, and it ends
    // at the current tip of the add buffer:
    //   if endsAtTip(i) { b.add += s; b.pieces[i].Length += len(s); return }
    // otherwise fall back to the split-and-splice from last lesson.
checkpoint: Consecutive typing stays in one piece. Commit and stop here.
---

A piece table that made a fresh piece for every keystroke would work, but the piece
list would balloon - type a hundred characters and you have a hundred one-byte
pieces to walk on every render. Real piece tables avoid this with a small
**append optimization**: when an insert simply *continues* the previous one - the
new text goes right where the last insert ended, and that last piece is add-buffer
text sitting at the current tip of the add buffer - you just **grow that piece's
length** and append to the add buffer. No split, no new piece.

The condition is precise, and that precision is the lesson: the insert position must
be exactly at the end of that last add piece, and the piece must reach the add
buffer's tip, so the new bytes are truly contiguous with it. Typing `a`, `b`, `c`
forward extends one piece to length 3; but an insert somewhere else - here `z` at the
front - fails the condition and takes the normal split path, starting its own piece.
This is why a piece table stays compact under real typing, and it quietly sets up the
undo chapter, where a run of typing you want to undo in one step is often already a
single piece.

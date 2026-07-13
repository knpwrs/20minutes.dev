---
project: build-a-text-editor
lesson: 2
title: Text as a list of pieces
overview: A piece table never stores the text as one string - it stores a list of pieces that each point into a backing buffer. Today you switch to that representation so the next lessons can insert and delete by splitting pieces.
goal: Represent the buffer as a list of pieces over the original text, with Text and Len computed by walking that list.
spec:
  scenario: The piece list over the original text
  status: failing
  lines:
    - kw: Given
      text: 'a buffer created from "hello"'
    - kw: When
      text: its piece list is inspected and Text is read
    - kw: Then
      text: 'it holds exactly one piece spanning the original text (PieceCount() is 1), Text() is "hello", and Len() is the sum of the piece lengths, 5'
    - kw: And
      text: 'a buffer created from "" holds no pieces (PieceCount() is 0) and Text() is ""'
code:
  lang: go
  source: |
    type Source int
    const ( Original Source = iota; Add ) // Add is the append buffer, next lesson
    type Piece struct { Source Source; Start, Length int }
    // New("hello") -> pieces = [{Original, 0, 5}]
    // Text() walks pieces, slicing b.original for each
    func (b *Buffer) Text() string { /* concat content(p) for p in pieces */ }
checkpoint: The buffer text is now assembled from a piece list. Commit and stop here.
---

A piece table represents text as a sequence of **pieces**, each of which says
"take `Length` bytes starting at `Start` from *this* backing buffer." Right now
there is one backing buffer, the immutable **original**, and one piece covering all
of it, so `Text()` walks the list and concatenates each piece's slice back into the
whole string. That looks like a roundabout way to store `"hello"`, and for
unedited text it is - the payoff comes the moment you insert.

Introduce the `Piece` type at its full shape now, including a `Source` field, even
though every piece today points at the original. Next lesson adds a second backing
buffer for inserted text, and because the piece already carries its source, that
lesson only has to append a piece rather than reshape this type. Building the
general representation on the first member of the family keeps every later edit a
clean, one-idea addition.

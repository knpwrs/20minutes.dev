---
project: build-a-text-editor
lesson: 5
title: Deleting within a piece
overview: Deleting is the mirror of inserting - you never erase backing bytes, you trim the piece list so the deleted span is no longer covered. Today you delete a range that falls inside a single piece.
goal: Delete a range of characters by trimming the piece list to skip the removed span.
spec:
  scenario: Deleting a run inside one piece
  status: failing
  lines:
    - kw: Given
      text: 'a buffer created from "Hello"'
    - kw: When
      text: 'Delete(1, 3) is called (remove 3 characters starting at index 1)'
    - kw: Then
      text: 'Text() is "Ho" and Len() is 2'
    - kw: And
      text: 'Delete(0, 0) removes nothing and leaves the text unchanged'
code:
  lang: go
  source: |
    // walk the pieces, tracking the running start offset of each.
    // for the piece overlapping [pos, pos+count):
    //   keep the part before pos as a piece (if non-empty),
    //   keep the part at/after pos+count as a piece (if non-empty),
    //   drop everything the deleted range covers.
    func (b *Buffer) Delete(pos, count int) { /* trim overlapping pieces */ }
checkpoint: You can delete a run of text from inside a piece. Commit and stop here.
---

A delete is the same idea as an insert, run backwards: the backing buffers are
immutable, so you remove text by making the piece list **stop pointing at it**.
Deleting `"ell"` from `"Hello"` leaves the single original piece split into two
survivors - `"H"` before the cut and `"o"` after it - with the covered bytes simply
no longer referenced by any piece. The `"ello"` still sits in the original buffer
untouched; it is just orphaned.

The general shape is a walk over the pieces tracking each one's running start.
When a piece overlaps the deleted range, you keep its **left remainder** (the part
before the cut) and its **right remainder** (the part after), dropping the middle.
Today the whole range lands inside one piece so only that piece is trimmed; the
zero-length guard from insertion applies again, since a delete flush against a
piece edge produces an empty remainder to drop. A no-op delete of length zero
should leave the buffer exactly as it was.

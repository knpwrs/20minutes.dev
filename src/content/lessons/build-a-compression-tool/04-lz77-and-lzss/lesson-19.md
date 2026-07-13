---
project: build-a-compression-tool
lesson: 19
title: Finding the longest match
overview: LZ77 compresses by pointing back at text you have already seen. The heart of it is the match search - given where you are, find the longest run ahead that also appears behind. Today you build exactly that.
goal: Given a buffer and a position, find the longest match of the lookahead in the prior window.
spec:
  scenario: The longest back-reference at a position
  status: failing
  lines:
    - kw: Given
      text: 'the buffer ABCABCD and position 3'
    - kw: When
      text: 'findMatch searches the prior bytes ABC for the longest prefix of the lookahead ABCD'
    - kw: Then
      text: 'it returns offset 3 and length 3 (the earlier ABC)'
    - kw: And
      text: 'when no prefix of the lookahead appears earlier, it returns length 0'
code:
  lang: go
  source: |
    // search every start in [0, pos); track the longest run that matches
    // the bytes beginning at pos. offset = pos - start.
    func findMatch(data []byte, pos int) (offset, length int) {
      for start := 0; start < pos; start++ {
        n := 0
        for pos+n < len(data) && data[start+n] == data[pos+n] { n++ }
        if n > length { length, offset = n, pos-start }
      }
      return
    }
checkpoint: You can find the longest back-reference at any position. Commit and stop here.
---

**LZ77** attacks a different redundancy than Huffman: not skewed symbol
frequencies but **repeated substrings**. Its move is to replace a chunk of text
with a pointer back to an earlier copy - "go back `offset` bytes and copy `length`
of them." The whole scheme rests on one search: at the current position, find the
**longest match** between the upcoming bytes and the bytes already seen.

For `ABCABCD` at position `3`, the earlier text is `ABC` and the lookahead is
`ABCD`; the longest prefix of the lookahead that appears earlier is `ABC`, three
bytes back, so the match is `offset 3, length 3`. If nothing matches, length is
`0` and the position is just a literal. The naive search here - try every earlier
start, count how far it matches - is quadratic but perfectly correct, and
correctness is what we pin first. Notice matches may run right up to the current
position; whether they can run past it (overlap) is a case we handle deliberately
in a couple of lessons.

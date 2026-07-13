---
project: build-a-png-codec
lesson: 25
title: Copying a back-reference
overview: A decoded length and distance is an instruction to copy earlier output. Today you perform that copy, reaching back into the bytes you have already produced - the LZ77 idea at the core of DEFLATE.
goal: Copy length bytes from distance positions back in the output buffer, appending them to the output.
spec:
  scenario: Copying earlier bytes forward
  status: failing
  lines:
    - kw: Given
      text: 'an output buffer holding the bytes 1, 2, 3'
    - kw: When
      text: a copy of length 2 from distance 3 is performed
    - kw: Then
      text: 'the buffer becomes 1, 2, 3, 1, 2'
    - kw: And
      text: 'distance counts backward from the current end of the output, so distance 3 starts at the byte with value 1'
code:
  lang: go
  source: |
    // start reading at len(out)-distance and append `length` bytes.
    func copyMatch(out *[]byte, distance, length int) {
      start := len(*out) - distance
      for i := 0; i < length; i++ {
        *out = append(*out, (*out)[start+i])
      }
    }
checkpoint: You can copy a back-reference into the output. Commit and stop here.
---

This is **LZ77** made concrete. The output buffer you have been appending to is also the **sliding window** the decoder reads from: a back-reference says "go back `distance` bytes from where I am now and copy `length` of them forward." With a buffer of `1, 2, 3`, a copy of length 2 from distance 3 starts at the `1` and appends `1, 2`. The window is conceptually the last 32768 bytes, which is exactly why distances never exceed that.

Copy one byte at a time, appending as you go, rather than slicing out a range up front. That discipline costs nothing here - distance is larger than length, so the regions do not overlap - but it is the *only* correct approach when they do overlap, which is the very next lesson and the classic place a bulk copy silently breaks. Wire the byte-by-byte loop now and the overlap case will just work.

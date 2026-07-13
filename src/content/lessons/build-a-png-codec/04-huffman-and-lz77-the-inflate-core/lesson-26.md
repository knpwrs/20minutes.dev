---
project: build-a-png-codec
lesson: 26
title: The overlapping copy
overview: DEFLATE allows a copy longer than its distance, which reads bytes it is still writing. Today you pin that overlap case - the one that turns a single byte into a run - because a bulk copy gets it wrong.
goal: Perform a back-reference copy where the length exceeds the distance, reading bytes as they are produced.
spec:
  scenario: A copy that overlaps itself
  status: failing
  lines:
    - kw: Given
      text: 'an output buffer holding the single byte 65'
    - kw: When
      text: a copy of length 4 from distance 1 is performed
    - kw: Then
      text: 'the buffer becomes 65, 65, 65, 65, 65'
    - kw: And
      text: 'each copied byte is read one at a time from just-written output, so distance 1 repeats the last byte length times'
code:
  lang: go
  source: |
    // the SAME byte-by-byte loop as before handles overlap correctly:
    // with distance 1, start = len(out)-1, and every appended byte is read
    // back one step later, so the last byte repeats `length` times.
    // A slice-and-append-all would read stale bytes - do NOT do that.
checkpoint: You can perform an overlapping copy, the run-length case of LZ77. Commit and stop here.
---

Here is DEFLATE's cleverest corner. A back-reference may have **length greater than distance**, meaning the copy reads bytes it is *in the middle of writing*. With distance 1 and length 4 over a buffer ending in `65`, you copy the last byte, which appends another `65`, which is now the new last byte, which you copy again - producing a run `65, 65, 65, 65`. This is how DEFLATE encodes runs: one literal plus a self-overlapping copy becomes run-length encoding for free.

The reason the previous lesson insisted on a **byte-at-a-time** loop is exactly this case. A tempting optimization - slice out `out[start : start+length]` and append it all at once - reads the pre-copy bytes and gets the overlap wrong, producing `65` then garbage. Because your copy reads each source byte only after the earlier ones are appended, overlap needs no special code at all; it simply works. This is the single most important correctness pin in the whole inflater.

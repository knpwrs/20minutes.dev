---
project: build-a-compression-tool
lesson: 22
title: The overlapping copy
overview: The most elegant trick in LZ77 is copying a back-reference that overruns itself - a length longer than its offset - to expand a run. Today you pin that edge, where byte-by-byte copying is not just correct but load-bearing.
goal: Decode a match whose length exceeds its offset by copying one byte at a time.
spec:
  scenario: A length-five match at offset one fills a run
  status: failing
  lines:
    - kw: Given
      text: 'the tokens Literal A, Match(offset 1, length 5)'
    - kw: When
      text: 'they are decoded'
    - kw: Then
      text: 'the output is AAAAAA (six copies of A)'
    - kw: And
      text: 'each copied byte is read after the previous one is written, so the single A propagates through the whole match'
    - kw: And
      text: 'the tokens Literal A, Literal B, Match(offset 2, length 7) decode to ABABABABA, so an offset-2 overlap replays the two-byte pattern the same way'
code:
  lang: go
  source: |
    // copy ONE BYTE AT A TIME so freshly written bytes feed later copies.
    // do NOT slice out.append(out, out[start:start+length]...) - that snapshots
    // the source and breaks when length > offset.
    start := len(out) - t.offset
    for k := 0; k < t.length; k++ {
      out = append(out, out[start+k]) // start+k can index bytes just written
    }
checkpoint: Overlapping matches expand runs correctly, byte by byte. Commit and stop here.
---

Here is where LZ77 quietly earns its power. A match with `offset 1, length 5`
starts one byte back and copies five bytes - but there is only one byte back there.
The trick is that copying **one byte at a time** lets each freshly written byte
become the source for the next copy: after `A`, the match copies position `len-1`
(an `A`) to the end, then copies the new last byte (another `A`), and so on, so a
single `A` propagates into `AAAAAA`. This is how LZ77 encodes runs at least as well
as RLE, for free.

The edge is a real trap. If you implement the copy as a single slice-and-append -
grabbing `out[start : start+length]` and appending it in one go - you snapshot the
source **before** writing, and when `length > offset` the overlap bytes come out
wrong. The byte-by-byte loop is not a naive version to optimize away; it is the
**correct** version. Pin `offset 1, length 5` so any implementation that snapshots
the source fails loudly right here.

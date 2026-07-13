---
project: build-a-png-codec
lesson: 46
title: Encoding with the Sub filter
overview: A real encoder filters rows to make them more compressible. Today you apply the Sub filter on the way out - storing each byte as its difference from the left - the exact inverse of the decoder's reconstruction.
goal: Filter a scanline with type 1 (Sub) on encode, the inverse of the decoder's Sub reconstruction.
spec:
  scenario: Applying the Sub filter
  status: failing
  lines:
    - kw: Given
      text: 'a raw scanline with bytes-per-pixel 1 and sample bytes 10, 15, 20'
    - kw: When
      text: the Sub filter is applied
    - kw: Then
      text: 'the filtered bytes are 10, 5, 5 - each byte minus its left neighbor'
    - kw: And
      text: 'the left neighbor is 0 for the first bpp bytes, and subtraction wraps modulo 256'
code:
  lang: go
  source: |
    // filtered[x] = raw[x] - raw[x-bpp], with raw[x-bpp] = 0 when x < bpp.
    // this is the exact inverse of the decoder's unSub (which added it back).
    func filterSub(raw []byte, bpp int) []byte { }
checkpoint: You can apply the Sub filter when encoding. Commit and stop here.
---

Filtering on encode is the mirror of reconstruction on decode. **Sub** stores each byte as its **difference from the left neighbor**: `filtered[x] = raw[x] - raw[x-bpp]`, wrapping modulo 256, with the missing left neighbor treated as `0`. The row `10, 15, 20` becomes `10, 5, 5` - and feeding `10, 5, 5` back through the decoder's `unSub` returns `10, 15, 20`, which is the round-trip guarantee you can now test directly against chapter five.

This matters because Sub turns smooth horizontal gradients into small numbers clustered near zero, which the deflate stage compresses far better than the raw values. A production encoder tries all five filters per row and keeps the cheapest; this teaching encoder can pick None or Sub, which is enough to demonstrate the idea honestly without an elaborate heuristic. The important property is exactness: encode-Sub and decode-Sub are precise inverses, so whichever filter you choose, the image survives the round trip byte for byte.

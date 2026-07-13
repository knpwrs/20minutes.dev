---
project: build-a-png-codec
lesson: 32
title: The None and Sub filters
overview: The first two filters are the simplest - None stores raw bytes, Sub stores each byte's difference from the pixel to its left. Today you reverse both, meeting the left-neighbor rule you will reuse everywhere.
goal: Reconstruct a scanline filtered with type 0 (None) or type 1 (Sub).
spec:
  scenario: Undoing the Sub filter
  status: failing
  lines:
    - kw: Given
      text: 'a Sub-filtered row (filter type 1) with bytes-per-pixel 1 and data bytes 10, 5, 5'
    - kw: When
      text: the row is reconstructed
    - kw: Then
      text: 'the pixel bytes are 10, 15, 20'
    - kw: And
      text: 'a None-filtered row (type 0) is returned unchanged, and the left neighbor is treated as 0 for the first bpp bytes'
code:
  lang: go
  source: |
    // recon[x] = raw[x] + recon[x-bpp], with recon[x-bpp] = 0 when x < bpp.
    // None (type 0): recon[x] = raw[x].
    // add modulo 256 (byte wraparound).
    func unSub(raw []byte, bpp int) []byte { }
checkpoint: You can reverse the None and Sub filters. Commit and stop here.
---

**None** (filter type 0) is the identity: the row bytes are the pixel bytes, nothing to undo. **Sub** (type 1) stores each byte as its difference from the byte one pixel to the **left**, so to reconstruct you add back the already-reconstructed left neighbor: `recon[x] = raw[x] + recon[x-bpp]`. With bpp 1 and data `10, 5, 5`, the first byte has no left neighbor so it stays `10`, then `5 + 10 = 15`, then `5 + 15 = 20`.

Two rules recur through every filter. First, the left neighbor is the byte `bpp` positions back - one whole pixel, not one byte - so on RGBA you subtract from the same channel of the previous pixel. Second, when there is no neighbor (the first pixel of a row), that neighbor's value is **0**. And all arithmetic is **modulo 256**: bytes wrap, so `250 + 10` is `4`. These three habits - reach back bpp, absent-is-zero, wrap at 256 - are the whole game for the filters ahead.

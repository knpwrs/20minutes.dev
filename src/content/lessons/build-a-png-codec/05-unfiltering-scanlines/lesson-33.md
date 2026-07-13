---
project: build-a-png-codec
lesson: 33
title: The Up filter
overview: The Up filter stores each byte's difference from the pixel directly above it in the previous row. Today you reverse it, which means the previous reconstructed row becomes an input.
goal: Reconstruct a scanline filtered with type 2 (Up) using the row above it.
spec:
  scenario: Undoing the Up filter
  status: failing
  lines:
    - kw: Given
      text: 'an Up-filtered row (type 2) with data bytes 5, 5 and a previous row reconstructed as 10, 20'
    - kw: When
      text: the row is reconstructed
    - kw: Then
      text: 'the pixel bytes are 15, 25'
    - kw: And
      text: 'for the first row the byte above is treated as 0, and a byte 7 above a byte 250 reconstructs to 1 (wrapping modulo 256)'
code:
  lang: go
  source: |
    // recon[x] = raw[x] + above[x], with above[x] = 0 for the first row.
    // above is the PREVIOUS row after IT was reconstructed.
    func unUp(raw, above []byte, bpp int) []byte { }
checkpoint: You can reverse the Up filter. Commit and stop here.
---

**Up** (filter type 2) is Sub turned vertical: each byte is stored as its difference from the byte at the same position in the **row above**. Reconstruction adds that above-byte back: `recon[x] = raw[x] + above[x]`. There is no bpp stepping here - you compare byte-to-byte straight up - so a row `5, 5` over a reconstructed row `10, 20` becomes `15, 25`. Vertical gradients and repeated rows compress beautifully under Up.

The boundary case is the **first row**, which has nothing above it; there, every above-byte is `0`, so an Up-filtered first row reconstructs to its raw bytes. The critical detail is that `above` is the previous row **after it was reconstructed**, not its stored filtered bytes - filters unwind top to bottom, each row leaning on the finished row before it. And the modulo-256 wrap still holds: `7` above `250` gives `1`, not `257`. That top-to-bottom dependency is why the whole-image pass next lesson processes rows strictly in order.

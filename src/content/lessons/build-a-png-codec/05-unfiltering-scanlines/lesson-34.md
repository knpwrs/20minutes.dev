---
project: build-a-png-codec
lesson: 34
title: The Average filter
overview: The Average filter predicts each byte from the average of its left and above neighbors. Today you reverse it, combining both directions and pinning the integer-floor rule that makes it exact.
goal: Reconstruct a scanline filtered with type 3 (Average) from its left and above neighbors.
spec:
  scenario: Undoing the Average filter
  status: failing
  lines:
    - kw: Given
      text: 'an Average-filtered byte with value 10, whose reconstructed left neighbor is 8 and above neighbor is 4'
    - kw: When
      text: the byte is reconstructed
    - kw: Then
      text: 'it is 16, because 10 plus floor((8 + 4) / 2) is 10 plus 6'
    - kw: And
      text: 'absent left or above neighbors count as 0, so the very first byte of the first row reconstructs to its raw value'
code:
  lang: go
  source: |
    // recon[x] = raw[x] + floor((left + above) / 2)
    //   left  = recon[x-bpp] or 0 if x < bpp
    //   above = prevRow[x]    or 0 on the first row
    // the average uses the FLOOR of the integer sum (no rounding).
    func unAverage(raw, above []byte, bpp int) []byte { }
checkpoint: You can reverse the Average filter. Commit and stop here.
---

**Average** (filter type 3) predicts a byte from the **mean of its left and above neighbors** and stores the difference. Reconstruction adds that predicted mean back: `recon[x] = raw[x] + floor((left + above) / 2)`. The one detail that must be exact is the **floor**: the sum of the two neighbors is divided by two and truncated toward zero *before* adding, with no rounding. With left 8 and above 4 the mean is 6, so a stored `10` reconstructs to `16`.

As always, missing neighbors are `0` - the left neighbor is 0 for the first pixel of a row, the above neighbor is 0 for the first row - and the final addition wraps modulo 256. Average is the first filter to mix both directions, so it needs the reconstructed left neighbor *and* the finished row above at once. It is also a stepping stone to Paeth, which uses the same two neighbors plus a third and a smarter rule. Pin the floor and the zero-neighbor cases here and Paeth is a short hop.

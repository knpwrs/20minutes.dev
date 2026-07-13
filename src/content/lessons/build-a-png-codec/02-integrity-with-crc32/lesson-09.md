---
project: build-a-png-codec
lesson: 9
title: The CRC32 lookup table
overview: Doing eight shifts per byte is slow; the classic fix is to precompute one remainder for each of the 256 byte values. Today you build that table once, and CRC over any data becomes a single lookup per byte.
goal: Build the 256-entry CRC32 lookup table where entry n is byte value n pushed through the polynomial.
spec:
  scenario: Precomputing the CRC table
  status: failing
  lines:
    - kw: Given
      text: 'the per-byte transform from the previous lesson'
    - kw: When
      text: 'the table is built for every byte value 0 through 255'
    - kw: Then
      text: 'entry 0 is 0x00000000, entry 1 is 0x77073096, and entry 255 is 0x2D02EF8D'
    - kw: And
      text: 'entry 128 is 0xEDB88320, the polynomial itself'
code:
  lang: go
  source: |
    var crcTable [256]uint32
    func init() {
      for n := 0; n < 256; n++ {
        crcTable[n] = crcByte(uint32(n)) // reuse the per-byte step
      }
    }
checkpoint: You have a 256-entry CRC table that turns the eight-shift loop into one lookup. Commit and stop here.
---

The per-byte transform never depends on anything but the byte value it starts from, so there are only 256 possible results. Compute them all **once** into a `crcTable` of 256 `uint32` values and the eight-shift inner loop disappears from every future CRC: you just look up the entry for the byte you are folding in. This is the standard **table-driven CRC**, the form used in zlib and every real PNG decoder.

Pin a few entries so a wrong table cannot slip through. Entry 0 is always `0`, entry 1 is the `0x77073096` you already derived, and entry 128 is the polynomial `0xEDB88320` itself - because byte `128` is `1000_0000`, whose single set bit shifts straight out on the first round. Get these anchors right and the full CRC over real data in the next lesson will land on its known test values.

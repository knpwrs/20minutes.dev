---
project: build-a-png-codec
lesson: 14
title: The Adler-32 checksum
overview: Zlib closes its stream with an Adler-32 checksum of the uncompressed data - a different algorithm from the chunk CRC32. Today you build Adler-32 so the decoder can verify the inflated bytes later.
goal: Compute the Adler-32 checksum of a byte string as two running mod-65521 sums combined into one value.
spec:
  scenario: Checksumming with Adler-32
  status: failing
  lines:
    - kw: Given
      text: 'two running sums, a starting at 1 and b starting at 0, each taken modulo 65521'
    - kw: When
      text: 'the Adler-32 of the ASCII bytes "Wikipedia" is computed'
    - kw: Then
      text: 'it is 0x11E60398'
    - kw: And
      text: 'the Adler-32 of empty input is 0x00000001, and the final value is (b << 16) | a'
code:
  lang: go
  source: |
    func Adler32(data []byte) uint32 {
      a, b := uint32(1), uint32(0)
      for _, c := range data {
        a = (a + uint32(c)) % 65521
        b = (b + a) % 65521
      }
      return b<<16 | a
    }
checkpoint: You can compute the Adler-32 that zlib uses to verify inflated data. Commit and stop here.
---

Zlib ends every stream with a 4-byte **Adler-32** of the *original, uncompressed* data - not to be confused with the CRC32 that guards each PNG chunk. Adler-32 is deliberately simpler and faster: keep two sums modulo the largest prime below 65536, which is **65521**. Sum `a` starts at `1` and adds each byte; sum `b` starts at `0` and adds the running `a` after every byte, so it accumulates a position-weighted total. The final checksum packs them as `b<<16 | a`.

The starting value of `1` for `a` is why empty input checksums to `1`, not `0` - a detail worth pinning so an off-by-one in the seed cannot hide. `0x11E60398` for `Wikipedia` is the textbook worked example for this algorithm. You will not need it until the encoder writes a zlib trailer and the decoder verifies one, but building it here keeps the whole zlib envelope in one chapter.

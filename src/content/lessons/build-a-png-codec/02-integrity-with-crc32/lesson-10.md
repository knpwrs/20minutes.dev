---
project: build-a-png-codec
lesson: 10
title: Table-driven CRC32 over bytes
overview: With the table built, a CRC over any message is a tight loop. Today you write the full CRC32 with its initial and final inversion, and pin it against the canonical test vector every CRC library agrees on.
goal: Compute the CRC32 of a byte string using the lookup table, with the standard pre- and post-inversion.
spec:
  scenario: Checksumming a message
  status: failing
  lines:
    - kw: Given
      text: 'the CRC table from the previous lesson'
    - kw: When
      text: 'the CRC32 of the ASCII bytes "123456789" is computed'
    - kw: Then
      text: 'it is 0xCBF43926'
    - kw: And
      text: 'the CRC32 of an empty input is 0x00000000, and the CRC32 of the four bytes "IEND" is 0xAE426082'
code:
  lang: go
  source: |
    func CRC32(data []byte) uint32 {
      c := uint32(0xFFFFFFFF)              // start all-ones
      for _, b := range data {
        c = crcTable[(c^uint32(b))&0xFF] ^ (c >> 8)
      }
      return c ^ 0xFFFFFFFF               // final inversion
    }
checkpoint: You can checksum any byte string and match the canonical CRC32 test value. Commit and stop here.
---

The full **CRC32** folds each data byte into a running register: XOR the byte into the low eight bits, use that to index the table, and shift the register down by a byte. Two details make it match the world's CRC implementations rather than a private variant: the register **starts at all ones** (`0xFFFFFFFF`), and the result is **inverted** (`^ 0xFFFFFFFF`) at the end. Skip either and every value is wrong, so they are pinned by the test.

`0xCBF43926` for the string `123456789` is *the* canonical CRC32 check value, quoted in every specification of this checksum - if you match it, your implementation is correct. The empty-input case (`0`, because all-ones inverted is zero) and `0xAE426082` for the bytes `IEND` are the two you will meet in real files: that second value is the CRC carried by the `IEND` chunk of literally every PNG ever written.

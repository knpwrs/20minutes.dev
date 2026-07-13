---
project: build-a-qr-code-encoder
lesson: 16
title: Terminator and bit padding
overview: 'A QR symbol has a fixed data capacity, and the payload almost never lands exactly on it. Today you close the payload with a terminator and pad it out to a whole number of bytes.'
goal: 'Append the terminator and zero-pad the payload up to a byte boundary.'
spec:
  scenario: 'Payload is terminated and aligned to bytes'
  status: failing
  lines:
    - kw: Given
      text: 'the 74-bit HELLO WORLD payload and the Version 1-Q data capacity of 13 codewords (104 bits)'
    - kw: When
      text: 'up to four 0 bits of terminator are added (4 here, since capacity remains), then 0 bits are added until the length is a multiple of 8'
    - kw: Then
      text: 'the payload reaches 80 bits, a whole 10 bytes'
    - kw: And
      text: 'those 10 bytes are [32, 91, 11, 120, 209, 114, 220, 77, 67, 64]'
code:
  lang: go
  source: |
    // Terminator: up to 4 zero bits, but never past capacity.
    term := min(4, capacityBits-w.len())
    w.writeBits(0, term)
    // Pad with zeros to the next byte boundary.
    for w.len()%8 != 0 {
      w.writeBits(0, 1)
    }
checkpoint: 'The payload is terminated and byte-aligned. Commit and stop here.'
---

Each symbol version and error-correction level has a **fixed data capacity** - for Version 1 level Q it is 13 codewords, or 104 bits - and the encoder must fill it exactly. First comes the **terminator**: up to four `0` bits that mark the end of the real data, shortened only if the capacity runs out first. For HELLO WORLD there is plenty of room, so all four are added, taking the payload from 74 to 78 bits.

Then the stream is padded with `0` bits up to the next **byte boundary**, because codewords are whole bytes. 78 rounds up to 80, so two more zeros bring the payload to 80 bits - exactly 10 bytes: `[32, 91, 11, 120, 209, 114, 220, 77, 67, 64]`. Those are the first ten data codewords, and they match the worked example. But the capacity is 13 codewords, not 10, so three bytes of space remain - filled not with zeros but with a specific repeating pattern, which is the final encoding step next.

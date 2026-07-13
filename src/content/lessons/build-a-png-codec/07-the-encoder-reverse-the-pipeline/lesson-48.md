---
project: build-a-png-codec
lesson: 48
title: The zlib wrapper on encode
overview: PNG wants its DEFLATE stream wrapped in zlib, with a header and an Adler-32 trailer. Today you add that envelope so the compressed bytes are ready to become IDAT.
goal: Wrap a DEFLATE stream in a valid zlib envelope with a correct header and Adler-32 trailer.
spec:
  scenario: Adding the zlib envelope
  status: failing
  lines:
    - kw: Given
      text: 'the raw data "Hi" and its stored DEFLATE block from the previous lesson'
    - kw: When
      text: it is wrapped in zlib
    - kw: Then
      text: 'the stream is 0x78,0x01, then the deflate bytes, then the Adler-32 of "Hi" as 0x00,0xFB,0x00,0xB2 (big-endian)'
    - kw: And
      text: 'the header 0x78,0x01 satisfies the mod-31 check with no preset dictionary, and the trailer is Adler-32 of the uncompressed data'
code:
  lang: go
  source: |
    // header: 0x78 (CM=8, 32K window), 0x01 (chosen so 0x7801 % 31 == 0).
    // body: the deflate stream. trailer: Adler32(rawData) as 4 big-endian bytes.
    func zlibWrap(deflate, rawData []byte) []byte { }
checkpoint: You can wrap a deflate stream in a valid zlib envelope. Commit and stop here.
---

PNG does not carry bare DEFLATE - it carries **zlib**, so the encoder adds the same envelope the decoder stripped. The header is the two bytes `0x78, 0x01`: method 8 with a 32K window, and a check byte chosen so the pair is divisible by 31. The trailer is the **Adler-32** of the *uncompressed* data - `Hi` gives `0x00FB00B2` - written **big-endian**, unlike the little-endian lengths inside DEFLATE. Note the two different checksums doing two different jobs: Adler-32 guards the decompressed stream here, while the chunk CRC32 guards the bytes on disk.

Getting the trailer right is what lets a strict decoder verify the inflated result, and writing Adler-32 over the *original* bytes (not the compressed ones) is the easy thing to get backwards. With the zlib envelope in place, the compressed image is finally in the exact form an `IDAT` chunk expects: header, deflate body, Adler trailer. One more compression option and then you assemble the whole file.

---
project: build-a-png-codec
lesson: 13
title: The zlib header
overview: A PNG's IDAT data is not raw DEFLATE - it is wrapped in a small zlib envelope. Today you read and check the two-byte zlib header so the decoder knows the compressed stream is one it can handle.
goal: Parse the two zlib header bytes and confirm they describe a valid deflate stream with no preset dictionary.
spec:
  scenario: Reading the zlib envelope
  status: failing
  lines:
    - kw: Given
      text: 'the two header bytes 0x78, 0x01'
    - kw: When
      text: the zlib header is parsed
    - kw: Then
      text: 'the compression method is 8 (deflate), the window size is 32768, no preset dictionary is set, and the header passes its check because (0x78 * 256 + 0x01) is a multiple of 31'
    - kw: And
      text: 'the bytes 0x78, 0x00 fail the check, because 0x7800 is not a multiple of 31'
code:
  lang: go
  source: |
    // CMF = b[0]: low nibble is method (must be 8), high nibble is window exponent.
    // FLG = b[1]: bit 5 is FDICT (preset dictionary). Header valid iff
    //   (uint16(CMF)<<8 | FLG) % 31 == 0.
    func parseZlib(b []byte) (method int, window int, fdict bool, ok bool) { }
checkpoint: You can read and validate the zlib envelope around the compressed data. Commit and stop here.
---

Concatenate a PNG's `IDAT` chunk data and you get a **zlib stream**, not bare DEFLATE. Zlib adds a tiny frame: two header bytes up front and a four-byte checksum at the end. The header is **CMF** and **FLG**. In CMF the low nibble is the compression **method** (always `8`, deflate, for PNG) and the high nibble is the window-size exponent (`7` here, meaning a 32768-byte window). In FLG, bit 5 is **FDICT**, a preset-dictionary flag PNG never sets.

The clever part is the built-in check: the 16-bit value `CMF*256 + FLG` must be **divisible by 31**, a constraint the encoder satisfies by choosing the low FLG bits. `0x7801` passes (it is `31 * 992`); `0x7800` does not. Reading these two bytes, confirming method 8 and no preset dictionary, and running the mod-31 check is all the zlib layer asks before you can reach the DEFLATE bitstream inside.

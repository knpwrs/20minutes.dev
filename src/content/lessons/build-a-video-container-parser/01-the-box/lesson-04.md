---
project: build-a-video-container-parser
lesson: 4
title: The 64-bit largesize
overview: A box bigger than 4 GB cannot state its length in 32 bits, so the format has an escape hatch - a size field of 1 means "the real size is the next 8 bytes." Today you handle that largesize case, which the mdat media box often needs.
goal: When the size field is 1, read the true 64-bit size from the 8 bytes after the type.
spec:
  scenario: A size field of 1 triggers a 64-bit largesize read
  status: failing
  lines:
    - kw: Given
      text: 'a header 0x00 0x00 0x00 0x01, type 0x6D 0x64 0x61 0x74, then 0x00 0x00 0x00 0x00 0x00 0x00 0x10 0x00'
    - kw: When
      text: 'the box header is parsed'
    - kw: Then
      text: 'Size is 4096, Type is "mdat", and HeaderSize is 16'
    - kw: And
      text: 'a normal header whose size field is 24 still gives Size 24 and HeaderSize 8'
code:
  lang: go
  source: |
    // size field == 1 is the sentinel for a 64-bit largesize
    func parseHeader(b []byte) Box {
      size := uint64(readU32(b))
      typ := readType(b[4:8])
      header := 8
      if size == 1 {
        // the real size is the 8 bytes right after the type
        // (read a big-endian uint64 from b[8:16], header becomes 16)
      }
      return Box{Size: size, Type: typ, HeaderSize: header}
    }
checkpoint: You handle the 64-bit largesize form. Commit and stop here.
---

Most boxes fit their length in the 32-bit size field, but a media-data (`mdat`) box
holding a long video easily exceeds 4 GB. The format handles this without wasting
8 bytes on every small box: a size field of exactly **1** is a sentinel meaning
"ignore me, the real 64-bit size follows the type." So the header grows from 8
bytes to 16, and you read a big-endian `uint64` from the two words after the type.

Here `0x00 0x00 0x00 0x00 0x00 0x00 0x10 0x00` is `0x1000` = `4096`. Recording the
right `HeaderSize` (16, not 8) matters because the payload starts after the header,
and getting that offset wrong by 8 bytes derails everything nested inside. A size
field of `0` is another special value - that one is tomorrow.

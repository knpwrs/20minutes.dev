---
project: build-a-video-container-parser
lesson: 5
title: A size of zero means to end of file
overview: The other special size value is 0, which means "this box runs to the end of the file." Today you resolve that case using the total buffer length, so the last box in a file always has a concrete size.
goal: When the size field is 0, set the box size to reach the end of the buffer.
spec:
  scenario: A size field of 0 extends the box to the end of the buffer
  status: failing
  lines:
    - kw: Given
      text: 'a 24-byte buffer whose box at offset 0 has size field 0x00 0x00 0x00 0x00 and type 0x6D 0x64 0x61 0x74'
    - kw: When
      text: 'the box header is parsed knowing the buffer is 24 bytes long'
    - kw: Then
      text: 'Size is 24, Type is "mdat", and HeaderSize is 8'
    - kw: And
      text: 'the same box parsed inside a 40-byte buffer at offset 0 reports Size 40'
code:
  lang: go
  source: |
    // size 0 means "to the end of the enclosing buffer"
    func parseHeaderAt(b []byte, offset int, total int) Box {
      // parse as before, but if the size field is 0,
      // set size = total - offset
      // (fill in)
    }
checkpoint: You resolve a size-zero box to the buffer end. Commit and stop here.
---

A size field of **0** means the box extends to the **end of the file** - it is the
last box, and rather than store its length up front the writer just lets it run
out. To resolve it you need to know where the enclosing buffer ends: the box's true
size is `total - offset`, where `offset` is where this box began. In a 24-byte
buffer a size-0 box at offset 0 is 24 bytes; drop the same bytes into a 40-byte
buffer and it is 40.

This is why parsing needs to carry an `offset` and a `total` alongside the bytes.
With the normal form, the largesize form, and now the to-end-of-file form all
handled, your header parser is complete. Tomorrow you read the first real box's
payload.

---
project: build-a-wasm-runtime
lesson: 5
title: Section framing
overview: After the preamble, a module is a sequence of sections, each a one-byte id, a byte length, and that many bytes of payload. Today you read that frame so the decoder can walk section by section and skip the ones it does not care about.
goal: Read a section's id and size, and be able to skip over a section's payload by its declared length.
spec:
  scenario: Framing and skipping a section
  status: failing
  lines:
    - kw: Given
      text: 'the bytes 00 03 41 42 43 (a custom section, id 0, size 3, payload 41 42 43) followed by 01 at the end'
    - kw: When
      text: the section header is read and the payload is skipped
    - kw: Then
      text: 'the id is 0, the size is 3, and after skipping the payload the cursor sits on the next byte, 0x01'
    - kw: And
      text: a section whose declared size runs past the end of the buffer is rejected with an error
code:
  lang: go
  source: |
    // A section is: id (one byte) + size (varuint32) + size bytes of payload.
    // A decoder that does not understand id 0 (custom) just skips it.
    id, err := c.readByte()
    size, err := c.readVarU32()
    payload, err := c.readBytes(int(size)) // or skip: c.pos += int(size)
checkpoint: You can walk a module section by section and skip any section by its length. Commit and stop here.
---

Past the eight-byte preamble, a module body is just a flat list of **sections**, and every section is framed identically: a single-byte **id** naming what kind it is, a **size** (an unsigned LEB128 byte count), and exactly that many bytes of **payload**. This uniform frame is what lets a decoder be tolerant - it can read the id, and if it does not recognize or care about that section, it simply advances the cursor by `size` bytes and moves on to the next frame.

The **custom** section (id `0`) is the common case you skip: it holds names, debug info, and other metadata that a minimal runtime ignores, so framing lets you step over it without understanding its contents. The safety point is the same one from the cursor lesson: a declared size must never carry you past the end of the buffer. With framing in place, the next chapter fills in the sections you *do* decode - types, functions, exports, and code.

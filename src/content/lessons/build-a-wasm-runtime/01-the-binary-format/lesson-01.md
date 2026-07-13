---
project: build-a-wasm-runtime
lesson: 1
title: The module preamble
overview: 'Every WebAssembly module starts with the same eight bytes: a four-byte magic number and a four-byte version. Today you read and validate that preamble, the first step of turning raw bytes into a module.'
goal: Read the first eight bytes of a module and confirm the magic number and version are what WebAssembly requires.
spec:
  scenario: Validating the module header
  status: failing
  lines:
    - kw: Given
      text: 'a byte slice beginning with 00 61 73 6D 01 00 00 00'
    - kw: When
      text: the preamble is read
    - kw: Then
      text: 'the magic bytes equal 00 61 73 6D (the ASCII for a NUL byte followed by "asm") and the version equals 1'
    - kw: And
      text: 'a slice whose first four bytes are not 00 61 73 6D is rejected with an error, and so is a slice shorter than eight bytes'
code:
  lang: go
  source: |
    // The magic is the four bytes 0x00 'a' 's' 'm'; the version is a
    // little-endian uint32 that must be 1 for the MVP.
    var wasmMagic = []byte{0x00, 0x61, 0x73, 0x6D}
    func readPreamble(b []byte) error {
      if len(b) < 8 { return errShort }
      if !bytes.Equal(b[:4], wasmMagic) { return errMagic }
      // version = little-endian uint32 of b[4:8]; require 1
      return nil
    }
checkpoint: You can recognize a valid WebAssembly module by its header and reject anything else. Commit and stop here.
---

Every `.wasm` file opens with a fixed eight-byte **preamble**: the four **magic** bytes `00 61 73 6D` - a NUL byte followed by the ASCII letters `asm` - and then a four-byte **version** number stored little-endian. For the MVP the version is always `1`, encoded as `01 00 00 00`. Before a runtime does anything else, it reads these eight bytes and checks them: the magic proves this really is WebAssembly, and the version proves it is a format your runtime understands.

Starting here is deliberate. A runtime is fundamentally a program that reads bytes and acts on them, so the very first thing to build is the entry point that reads the first bytes of all. Validating the header is a tiny, self-contained target, and getting it right means every later lesson can assume it is working with a genuine module rather than random data.

---
project: build-a-wasm-runtime
lesson: 2
title: A byte cursor
overview: The decoder reads the module front to back, one field at a time, so it needs to remember how far it has read. Today you build a cursor over the byte slice - the reader every later decoding lesson leans on.
goal: Build a cursor that reads bytes sequentially from a slice, tracks its position, and reports when it runs out of input.
spec:
  scenario: Reading bytes through a moving cursor
  status: failing
  lines:
    - kw: Given
      text: 'a cursor over the bytes 0A 0B 0C 0D'
    - kw: When
      text: one byte is read, then two bytes are read
    - kw: Then
      text: 'the first read returns 0x0A and leaves the position at 1, and the next read returns the two bytes 0B 0C and leaves the position at 3, with one byte remaining'
    - kw: And
      text: reading more bytes than remain returns an error rather than reading past the end
code:
  lang: go
  source: |
    // A cursor is just a slice plus an offset. Every read advances pos and
    // must refuse to run off the end.
    type Cursor struct {
      buf []byte
      pos int
    }
    func (c *Cursor) readByte() (byte, error) { /* bounds-check, advance */ }
    func (c *Cursor) readBytes(n int) ([]byte, error) { /* slice buf[pos:pos+n] */ }
    func (c *Cursor) remaining() int { return len(c.buf) - c.pos }
checkpoint: You have a cursor that reads a module sequentially and never runs off the end. Rewrite the preamble check to use it, then commit and stop here.
---

Decoding a module is a strictly forward walk: read the magic, then the version, then a section header, then that section's contents, on and on to the last byte. To do that cleanly you need one small abstraction that remembers **where you are** in the buffer - a **cursor**. It wraps the byte slice and a position, hands out the next byte or the next `n` bytes on request, and advances itself each time.

The one rule that matters is bounds safety: a truncated or malformed module must never make the cursor read past its buffer. Centralizing that check in `readByte` and `readBytes` means every decoding lesson from here on gets safe reads for free, and a corrupt module surfaces as a clean error instead of a crash. Rewrite the preamble from the last lesson to pull its eight bytes through this cursor so the whole decoder shares one reader.

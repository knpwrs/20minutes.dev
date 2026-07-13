---
project: build-a-png-codec
lesson: 4
title: Walking the chunk stream
overview: One chunk is a step; the whole file is a walk. Today you read chunks one after another from the signature all the way to the terminating IEND, turning a PNG into a list of chunks.
goal: Read every chunk of a PNG in order, stopping after the IEND chunk, and return them as a list.
spec:
  scenario: Collecting all chunks in order
  status: failing
  lines:
    - kw: Given
      text: 'a PNG whose chunks are IHDR, then IDAT, then IEND (with valid headers and CRC fields)'
    - kw: When
      text: the chunk stream is walked
    - kw: Then
      text: 'it returns three chunks whose types in order are "IHDR", "IDAT", "IEND"'
    - kw: And
      text: 'walking stops at IEND even if trailing bytes follow it, and a stream without a valid signature is rejected'
code:
  lang: go
  source: |
    func Chunks(b []byte) ([]Chunk, error) {
      // 1. require HasSignature(b); else error
      // 2. from offset 8, readChunk, append, advance by its span
      // 3. stop once a chunk of type "IEND" was appended
    }
checkpoint: You can turn a whole PNG into an ordered list of chunks. Commit and stop here.
---

The signature gets you to byte 8; from there the file is a **loop**. Read a chunk, append it, advance by the byte span the previous lesson returned, and repeat. The loop has a definite end: the **IEND** chunk is always the last one, so once you have appended an `IEND` you stop, even if the file has stray bytes after it. This is the backbone every later stage stands on - IHDR to learn the image shape, IDAT for the pixel data, PLTE for a palette.

Two guards make this robust. Refuse to start unless the signature is present, so garbage never gets parsed as chunks. And treat `IEND` as the terminator rather than running until the buffer is exhausted, because well-formed files can carry trailing whitespace or padding. With this loop you have the container fully in hand; everything from here reads *inside* these chunks.

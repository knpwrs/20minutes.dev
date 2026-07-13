---
project: build-a-wav-pcm-toolkit
lesson: 6
title: Walking chunks and skipping the unknown
overview: A real WAV file often carries chunks you do not care about between fmt and data. Today you walk the whole chunk list in order, stepping over anything unfamiliar to find the two chunks you need.
goal: Iterate every chunk after the header, collecting ids in order and locating fmt and data.
spec:
  scenario: The walker visits every chunk and finds fmt and data
  status: failing
  lines:
    - kw: Given
      text: 'a WAVE body with chunks in order: fmt (16 bytes), then JUNK (4 bytes), then data (8 bytes)'
    - kw: When
      text: 'the chunks are walked from just after the 12-byte header'
    - kw: Then
      text: 'the visited ids in order are ["fmt ", "JUNK", "data"]'
    - kw: And
      text: 'the fmt chunk is found and the data chunk payload is the 8 data bytes, with JUNK skipped'
code:
  lang: go
  source: |
    // start just past the 12-byte header; readChunk returns consumed bytes
    func walk(b []byte) []Chunk {
      var out []Chunk
      off := 12
      for off+8 <= len(b) {
        c, used, _ := readChunk(b[off:])
        out = append(out, c)
        off += used   // advance to the next chunk
      }
      return out
    }
checkpoint: You can walk every chunk and skip ones you do not recognise. Commit and stop here.
---

The `fmt ` and `data` chunks are the only two a minimal WAV reader must understand,
but files in the wild are full of others - `LIST` (metadata), `fact`, `cue `,
`JUNK` (padding placeholders), and vendor-specific tags. A robust reader **walks**
the chunk list from the first chunk after the header, and for each chunk it either
handles it or steps over it using the size field. That is the whole point of a
self-describing container: you never have to know a chunk to skip it.

The walk is a loop: read a chunk, record it, advance the offset by the bytes that
chunk consumed (its 8-byte header plus its payload), repeat until you run out. To
find `data`, walk until you see that id and keep its payload. This loop is the
backbone of the reader - next lesson hardens it against the one alignment quirk
RIFF has, the padding byte.

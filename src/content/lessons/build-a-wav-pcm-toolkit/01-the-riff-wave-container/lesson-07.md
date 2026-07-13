---
project: build-a-wav-pcm-toolkit
lesson: 7
title: The padding byte
overview: RIFF chunks are word-aligned, so a chunk with an odd payload size is followed by one padding byte that the size field does not count. Today you teach the walker to skip it, the last piece of a robust container reader.
goal: Advance past a padding byte after any odd-sized chunk so the next chunk is found.
spec:
  scenario: An odd-sized chunk is followed by a padding byte
  status: failing
  lines:
    - kw: Given
      text: 'a chunk "cue " with size 3 (payload bytes 0x01 0x02 0x03) then one padding byte 0x00, then a "data" chunk'
    - kw: When
      text: 'the chunks are walked'
    - kw: Then
      text: 'the "cue " chunk reports size 3, and the walker consumes 12 bytes for it (8 header + 3 payload + 1 pad)'
    - kw: And
      text: 'the following "data" chunk is found correctly, not misread from the padding byte'
code:
  lang: go
  source: |
    // after an odd payload, one pad byte follows and is NOT counted by size
    func chunkAdvance(size int) int {
      total := 8 + size
      if size%2 != 0 {
        total++   // step over the padding byte
      }
      return total
    }
checkpoint: The walker handles word-aligned padding. The container reader is complete; commit and stop here.
---

RIFF requires every chunk to begin on an **even byte offset** (word alignment). If
a chunk's payload has an **odd** size, the writer appends a single **padding byte**
(conventionally `0x00`) after the payload to push the next chunk back onto an even
boundary. Crucially, the size field still reports the **true, odd** payload length -
the pad byte is invisible to the size and belongs to no chunk.

So when advancing to the next chunk, you add the 8-byte header, the payload size,
and one extra byte **only when the size is odd**. Miss this and an odd chunk throws
every following chunk off by one, so `data` gets read starting from the padding
byte and the whole file becomes garbage. This mostly bites 8-bit mono audio (whose
data size can be odd) and small metadata chunks. With this in place your reader can
walk any well-formed WAV; now you can turn to what the `data` bytes actually mean.

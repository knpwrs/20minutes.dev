---
project: build-a-wav-pcm-toolkit
lesson: 4
title: Reading one chunk
overview: Inside the RIFF/WAVE header, the file is a sequence of chunks, each a four-byte id followed by a little-endian size followed by that many payload bytes. Today you read exactly one chunk into a struct.
goal: Read a chunk's id, size, and payload from a byte slice.
spec:
  scenario: A chunk splits into id, size, and payload
  status: failing
  lines:
    - kw: Given
      text: 'the bytes "fmt " then 0x10 0x00 0x00 0x00 then 16 payload bytes'
    - kw: When
      text: 'one chunk is read from the start'
    - kw: Then
      text: 'its id is "fmt ", its size is 16, and its payload is those 16 bytes'
    - kw: And
      text: 'the total bytes consumed is 24 (8 header bytes plus the 16-byte payload)'
code:
  lang: go
  source: |
    type Chunk struct {
      ID      string
      Payload []byte
    }
    // id (4) | size (4, LE) | payload (size bytes)
    func readChunk(b []byte) (Chunk, int, error) {
      id := readID(b[0:4])
      size := int(u32(b[4:8]))
      // slice out b[8 : 8+size] as the payload; consumed = 8 + size
    }
checkpoint: You can read a single id/size/payload chunk. Commit and stop here.
---

Everything after the twelve-byte header is a flat list of **chunks**, and they all
share one shape: a four-byte **id**, a little-endian **uint32 size**, and then
exactly `size` bytes of **payload**. That is the entire grammar of RIFF - a
self-describing container where each chunk announces its own length, so a reader
can handle it or step over it without understanding its contents.

The size counts **only the payload**, not the eight bytes of id and size that
precede it. So a `fmt ` chunk whose size field is 16 occupies 24 bytes on disk. You
will need that "bytes consumed" number next lesson to walk from one chunk to the
next, so return it alongside the chunk. Read one chunk cleanly today; the fields
inside the `fmt ` payload come right after.

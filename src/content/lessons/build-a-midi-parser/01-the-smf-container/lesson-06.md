---
project: build-a-midi-parser
lesson: 6
title: Walking the chunk list
overview: With a header reader in hand you can stride the whole file - read a chunk header, take its length bytes of body, and move to the next chunk. Today you split a file into a list of chunks, tolerating types you do not recognise.
goal: Split a byte stream into a list of chunks, skipping unknown chunk types by length.
spec:
  scenario: A file splits into typed chunks, unknown types included by length
  status: failing
  lines:
    - kw: Given
      text: 'a file of an MThd chunk (length 6), then an unknown "FOOB" chunk (length 2), then an MTrk chunk (length 4)'
    - kw: When
      text: 'the file is split into chunks'
    - kw: Then
      text: 'there are 3 chunks with types "MThd", "FOOB", "MTrk"'
    - kw: And
      text: 'their bodies are 6, 2, and 4 bytes long, and the unknown chunk was stepped over using its length'
code:
  lang: go
  source: |
    type Chunk struct {
      Type string
      Body []byte
    }
    // read header at pos, slice Length bytes of body, advance pos by 8+Length
    func splitChunks(b []byte) []Chunk {
      // loop from pos 0 until the bytes run out
    }
checkpoint: You can split a file into a list of chunks. Commit and stop here.
---

Because every chunk header carries its body **length**, you never have to
understand a chunk to skip past it: read the 8-byte header, take the next `Length`
bytes as the body, and the byte right after that is the start of the next chunk.
Loop that until the file ends and you have the file's whole structure as a list of
`(type, body)` pairs.

That length-driven stride is exactly why the format is **extensible**. A file may
carry proprietary chunks between the standard ones; a robust reader keeps or
ignores them but always steps over them correctly, so an unknown `FOOB` chunk never
derails the parse. This is the chapter's payoff - from raw bytes to a list of
chunks you can pick the `MThd` and `MTrk` entries out of, ready for the events
inside each track.

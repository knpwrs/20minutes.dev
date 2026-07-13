---
project: build-a-png-codec
lesson: 7
title: 'Describing a PNG'
overview: Time to see the container work end to end. Today you compose the signature check, the chunk walk, and the IHDR parse into one function that summarizes a PNG and rejects a bad one clearly.
goal: Summarize a PNG as its dimensions, color type, and the ordered list of its chunk types, and return a clear error for a bad signature.
spec:
  scenario: Producing a one-line description of a PNG
  status: failing
  lines:
    - kw: Given
      text: 'a valid PNG whose IHDR says 8 by 4, color type 6, with chunks IHDR, IDAT, IEND'
    - kw: When
      text: it is described
    - kw: Then
      text: 'the summary reports width 8, height 4, color type 6, and chunk types [IHDR IDAT IEND] in order'
    - kw: And
      text: 'a stream that fails the signature check returns an error naming the problem, rather than a summary'
code:
  lang: go
  source: |
    func Describe(b []byte) (string, error) {
      chunks, err := Chunks(b)       // signature + walk
      if err != nil { return "", err }
      hdr := parseIHDR(chunks[0].Data) // IHDR is always first
      // format width, height, color type, and the type list
    }
checkpoint: The container reads and describes a real PNG, and refuses a broken one. Commit and stop here.
---

This is the first payoff. Everything the chapter built - recognizing the signature, walking chunks to `IEND`, and reading `IHDR` - snaps together into a single `Describe` that takes raw PNG bytes and tells you what the file is: its size, its color type, and the sequence of chunks it carries. That sequence (`IHDR`, then one or more `IDAT`, then `IEND`, with an optional `PLTE`) is the skeleton every later chapter fills in.

Just as important is the failure path. Feed `Describe` a stream with the wrong signature and it returns a clear error instead of a summary or a crash. A codec that fails loudly on bad input is worth more than one that guesses, and you will lean on this habit through the whole project. With the container solved, the next chapter earns the right to trust these chunks by checking their CRCs.

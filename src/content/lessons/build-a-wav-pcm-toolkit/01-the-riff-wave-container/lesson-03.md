---
project: build-a-wav-pcm-toolkit
lesson: 3
title: The RIFF/WAVE header
overview: A WAV file opens with a fixed twelve-byte header that says "this is a RIFF file, and its form type is WAVE". Today you parse and validate it, and reject anything that is not a WAV.
goal: Parse the first twelve bytes, confirm the RIFF and WAVE tags, and reject a non-RIFF file.
spec:
  scenario: The header identifies a RIFF/WAVE file
  status: failing
  lines:
    - kw: Given
      text: 'the twelve bytes "RIFF" then 0x24 0x00 0x00 0x00 then "WAVE"'
    - kw: When
      text: 'the header is parsed'
    - kw: Then
      text: 'it succeeds, reporting riffSize 36 and formType "WAVE"'
    - kw: And
      text: 'twelve bytes starting with "RIFX" (not "RIFF") are rejected with an error, not a panic'
code:
  lang: go
  source: |
    // header = "RIFF" | uint32 size | "WAVE"
    func parseHeader(b []byte) (riffSize uint32, err error) {
      if readID(b[0:4]) != "RIFF" {
        return 0, fmt.Errorf("not a RIFF file")
      }
      // read the size at b[4:8], check b[8:12] == "WAVE"
    }
checkpoint: You can parse and validate the RIFF/WAVE header. Commit and stop here.
---

Every WAV file starts with the same **twelve-byte header**: the id `RIFF`, then a
little-endian **uint32** giving the size of everything that follows (the whole file
minus these first eight bytes), then the **form type** `WAVE`. Those two tags are
how a reader knows it is holding a WAV and not some other RIFF file like AVI.

The `riffSize` for our reference header is `0x24` = **36**, which is exactly the
bytes of the `fmt ` chunk (24) plus the `data` chunk header (8) plus... you will
see the arithmetic when you build files later; for now just read it. The important
habit today is **validation**: a file that does not begin with `RIFF` (a big-endian
`RIFX`, a truncated file, random bytes) must return a clear error rather than
crashing. Failing gracefully on bad input is a property the whole toolkit will
keep.

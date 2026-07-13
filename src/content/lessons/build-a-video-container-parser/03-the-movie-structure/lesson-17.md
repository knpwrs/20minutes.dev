---
project: build-a-video-container-parser
lesson: 17
title: The media header and packed language
overview: Each track's mdia has an mdhd box with its own timescale and duration, plus a compactly packed 3-letter language code. Today you parse all three, including the bit-unpacking that recovers the language.
goal: Parse an mdhd box to its timescale, duration, and ISO-639-2 language string.
spec:
  scenario: An mdhd yields per-track timing and language
  status: failing
  lines:
    - kw: Given
      text: 'a version-0 mdhd with timescale 0x00 0x00 0xAC 0x44, duration 0x00 0x02 0x04 0xCC, and language bytes 0x15 0xC7'
    - kw: When
      text: 'the mdhd is parsed'
    - kw: Then
      text: 'the timescale is 44100 and the duration is 132300'
    - kw: And
      text: 'the language decodes to "eng"'
code:
  lang: go
  source: |
    // language is 3 letters packed into 15 bits, 5 bits each,
    // each letter stored as (ascii - 0x60)
    func unpackLang(v uint16) string {
      a := byte((v>>10)&0x1F) + 0x60
      b := byte((v>>5)&0x1F) + 0x60
      c := byte(v&0x1F) + 0x60
      return string([]byte{a, b, c})
    }
checkpoint: You can parse an mdhd. Commit and stop here.
---

`mdhd`, the media header, gives a track its **own** clock, independent of the movie
timescale: an audio track might use a `44100` timescale (its sample rate) while the
movie uses `1000`. In version 0 the timescale and duration are the 32-bit fields at
offsets 12 and 16, exactly like `mvhd`. Here `0xAC44` is `44100` and `0x000204CC`
is `132300` - three seconds at that timescale.

The quirk is the **language**, packed into a single 16-bit word: three 5-bit
letters, each stored as its ASCII code minus `0x60`. So `eng` becomes `(5,14,7)`,
which packs to `0x15C7`. Unpacking masks off 5 bits at a time and adds `0x60` back.
This ISO-639-2 code is how a player labels subtitle and audio track languages.

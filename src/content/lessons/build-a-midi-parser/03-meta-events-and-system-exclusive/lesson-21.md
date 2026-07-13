---
project: build-a-midi-parser
lesson: 21
title: Key signature
overview: The key signature meta event stores how many sharps or flats a piece has, as a signed byte, plus a major/minor flag. Today you decode it, and the point is reading that first byte as signed.
goal: Decode a key-signature meta event with a signed sharps/flats count.
spec:
  scenario: A key-signature byte decodes as a signed sharps/flats count
  status: failing
  lines:
    - kw: Given
      text: 'the bytes 0xFF 0x59 0x02 0xFD 0x00'
    - kw: When
      text: 'they are parsed as a key-signature meta event'
    - kw: Then
      text: 'the count is -3 (three flats) and the mode is major'
    - kw: And
      text: '0xFF 0x59 0x02 0x02 0x01 is +2 (two sharps) and the mode is minor'
code:
  lang: go
  source: |
    // meta type 0x59, length 2: signed sharps/flats, then mode
    sf := int8(d[0]) // -7..+7: negative = flats, positive = sharps
    minor := d[1] == 1 // 0 = major, 1 = minor
checkpoint: You can decode a key-signature meta event. Commit and stop here.
---

The **key signature** meta event (type `0x59`, length 2) names the key. Its first
byte is a **signed** count: `0` is C major or A minor, positive counts sharps, and
**negative counts flats** stored as a two's-complement byte. `0xFD` is not `253`; as
a signed 8-bit value it is `-3`, meaning three flats (E-flat major). Reading it as
unsigned is the classic mistake - force the byte through a signed 8-bit conversion.

The second byte is the **mode**: `0` for major, `1` for minor. So `0xFD 0x00` is
three flats, major; `0x02 0x01` is two sharps, minor (B minor). This is a small
event, but it is the project's clean example of a **signed** field in a format that
is otherwise all unsigned bytes - a distinction that silently changes the answer if
you miss it.

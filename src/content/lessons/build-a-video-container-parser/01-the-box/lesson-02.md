---
project: build-a-video-container-parser
lesson: 2
title: The box type (fourcc)
overview: After its size, every box carries a 4-byte type - a four-character code, or fourcc, like ftyp or moov. Today you read those four bytes as a short string, which is how you will recognise every kind of box from here on.
goal: Read 4 bytes as a four-character ASCII type string.
spec:
  scenario: Four ASCII bytes decode to a fourcc string
  status: failing
  lines:
    - kw: Given
      text: 'the four bytes 0x66 0x74 0x79 0x70'
    - kw: When
      text: 'they are read as a four-character type'
    - kw: Then
      text: 'the type is the string "ftyp"'
    - kw: And
      text: 'the bytes 0x6D 0x6F 0x6F 0x76 give "moov", and the bytes 0x71 0x74 0x20 0x20 give "qt  " (trailing spaces are part of the code)'
code:
  lang: go
  source: |
    // a fourcc is just 4 ASCII bytes turned into a string
    func readType(b []byte) string {
      return string(b[0:4])
    }
checkpoint: You can read a fourcc type. Commit and stop here.
---

A box's **type** is a `fourcc`: four bytes that are almost always printable ASCII,
read directly as a string. `0x66 0x74 0x79 0x70` is `f t y p`, the `ftyp` box that
opens the file and names its brand. `0x6D 0x6F 0x6F 0x76` is `moov`, the movie box
that holds all the structure. The MP4 Registration Authority (mp4ra.org) is the
registry of every official type.

Keep it simple: no endianness question here, just four bytes copied into a string
in order. One quirk worth pinning early: a fourcc is always exactly four bytes, so
shorter codes are padded with **trailing spaces** that are part of the code, like
the QuickTime brand `qt ` (with two spaces) read from `0x71 0x74 0x20 0x20`.
Pairing this with yesterday's size reader gives you both halves of a box header,
which you assemble tomorrow.

---
project: build-a-midi-parser
lesson: 2
title: A chunk type
overview: Every chunk in the file starts with a 4-byte type tag - four ASCII letters like MThd or MTrk. Today you read those four bytes as a short string, which is how you recognise each kind of chunk from here on.
goal: Read 4 bytes as a four-character ASCII chunk type.
spec:
  scenario: Four ASCII bytes decode to a chunk type string
  status: failing
  lines:
    - kw: Given
      text: 'the four bytes 0x4D 0x54 0x68 0x64'
    - kw: When
      text: 'they are read as a four-character type'
    - kw: Then
      text: 'the type is the string "MThd"'
    - kw: And
      text: 'the bytes 0x4D 0x54 0x72 0x6B read the same way give "MTrk"'
code:
  lang: go
  source: |
    // a chunk type is just 4 ASCII bytes turned into a string
    func readType(b []byte) string {
      return string(b[0:4])
    }
checkpoint: You can read a four-character chunk type. Commit and stop here.
---

A Standard MIDI File is built entirely from **chunks**, and each chunk begins with
a 4-byte **type** tag: four printable ASCII bytes read straight through as a
string. `0x4D 0x54 0x68 0x64` is `M T h d`, the **header chunk** that opens every
file. `0x4D 0x54 0x72 0x6B` is `M T r k`, a **track chunk**. Those are the only two
types the standard defines, but a well-behaved reader must tolerate others.

There is no endianness question here - just four bytes copied into a string in
order. Pairing this with yesterday's length reader gives you both halves of a chunk
header, which you assemble tomorrow.

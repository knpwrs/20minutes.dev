---
project: build-a-video-container-parser
lesson: 11
title: The FullBox version and flags
overview: Many boxes are FullBoxes - they begin their payload with a 1-byte version and 3 bytes of flags before any real fields. Today you parse that prefix, because the version byte decides how the boxes in the next chapter are laid out.
goal: Read a FullBox's 1-byte version and 3-byte flags from the front of a payload.
spec:
  scenario: A FullBox prefix decodes to version and flags
  status: failing
  lines:
    - kw: Given
      text: 'a payload beginning with the bytes 0x01 0x00 0x00 0x0F'
    - kw: When
      text: 'the FullBox prefix is parsed'
    - kw: Then
      text: 'the version is 1 and the flags value is 15'
    - kw: And
      text: 'a payload beginning 0x00 0x00 0x00 0x01 parses to version 0 and flags 1'
code:
  lang: go
  source: |
    // version is 1 byte; flags are the next 3 bytes, big-endian
    func parseFullBox(payload []byte) (version uint8, flags uint32) {
      version = payload[0]
      flags = uint32(payload[1])<<16 | uint32(payload[2])<<8 | uint32(payload[3])
      return
    }
checkpoint: You can parse a FullBox prefix. Commit and stop here.
---

A **FullBox** is a box that reserves the first 4 bytes of its payload for a 1-byte
**version** and a 24-bit **flags** field. Most of the structural boxes you parse
next - `mvhd`, `tkhd`, `mdhd`, and every sample table - are FullBoxes, so their real
fields begin at payload offset 4, not 0. Here `0x01` is version 1 and `0x00 0x00
0x0F` is the flags value `15`.

The version byte is the important half: it often selects between two layouts of the
same box. In the movie header, version 0 stores times as 32-bit values and version
1 stores them as 64-bit - so reading the version wrong means reading every field at
the wrong offset. You will lean on this prefix in almost every lesson from here on.

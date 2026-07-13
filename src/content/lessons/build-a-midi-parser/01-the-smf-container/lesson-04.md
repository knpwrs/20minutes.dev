---
project: build-a-midi-parser
lesson: 4
title: The MThd body
overview: The header chunk's six-byte body tells you the whole shape of the file - its format, how many tracks it has, and its timing division. Today you decode all three of those 16-bit fields.
goal: Decode the six-byte MThd body into a format, track count, and division.
spec:
  scenario: The header body decodes to three 16-bit fields
  status: failing
  lines:
    - kw: Given
      text: 'the six body bytes 0x00 0x01 0x00 0x02 0x00 0x60'
    - kw: When
      text: 'they are decoded as the MThd body'
    - kw: Then
      text: 'format is 1, ntrks is 2, and division is 96'
    - kw: And
      text: 'the body bytes 0x00 0x00 0x00 0x01 0x00 0x60 give format 0, ntrks 1, division 96 (a single-track file)'
code:
  lang: go
  source: |
    // each field is a big-endian unsigned 16-bit integer
    func readU16(b []byte) uint16 {
      return uint16(b[0])<<8 | uint16(b[1])
    }
    type Header struct{ Format, Ntrks, Division uint16 }
    // read three u16s from bytes 0..2, 2..4, 4..6
checkpoint: You can decode the header body into format, track count, and division. Commit and stop here.
---

The `MThd` body is always exactly six bytes: three big-endian **16-bit** fields.
The first is the **format** - `0` means a single track holding the whole
performance, `1` means several tracks played together (a conductor track plus one
per instrument), and `2` means a set of independent sequences. The second is
**ntrks**, the number of `MTrk` chunks that follow. The third is the **division**,
which sets the meaning of every delta-time in the file.

You already read 32-bit integers big-endian; a 16-bit field is the same idea with
two bytes, so add a small `readU16` alongside it. Pin both a format-1 multi-track
header and a format-0 single-track one - they differ only in these first four bytes,
and later timing code cares which you have. The division field earns its own lesson
tomorrow, because its top bit changes what the number means.

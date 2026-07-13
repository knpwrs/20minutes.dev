---
project: build-a-wav-pcm-toolkit
lesson: 2
title: Little-endian integers
overview: Every numeric field in a WAV file - sizes, sample rates, channel counts - is stored little-endian, least significant byte first. Today you decode those bytes into integers, the second half of everything the container is made of.
goal: Decode a little-endian uint16 and uint32 from their bytes.
spec:
  scenario: Little-endian bytes decode to integers
  status: failing
  lines:
    - kw: Given
      text: 'the four bytes 0x2C 0x00 0x00 0x00'
    - kw: When
      text: 'they are read as a little-endian uint32'
    - kw: Then
      text: 'the value is 44'
    - kw: And
      text: 'the two bytes 0x10 0x00 read as a little-endian uint16 give 16, and 0x44 0xAC give 44100'
code:
  lang: go
  source: |
    // little-endian: byte 0 is the low 8 bits, byte 1 the next 8, and so on
    func u16(b []byte) uint16 {
      return uint16(b[0]) | uint16(b[1])<<8
    }
    func u32(b []byte) uint32 {
      // combine four bytes, each shifted 8 more bits than the last
    }
checkpoint: You can decode little-endian 16- and 32-bit integers. Commit and stop here.
---

RIFF stores every multi-byte number in **little-endian** order: the least
significant byte comes first. So the four bytes `2C 00 00 00` are not the number
`0x2C000000` - they are `0x0000002C`, which is **44**. You rebuild the value by
taking each byte, shifting it left by eight bits per position, and combining them:
`b[0] | b[1]<<8 | b[2]<<16 | b[3]<<24`.

The two sizes you will use constantly are the 16-bit fields (channel count, block
align, bits per sample) and the 32-bit fields (chunk sizes, sample rate, byte
rate). `0x44 0xAC` little-endian is `0xAC44` = 44100, the most common sample rate
in the wild. With chunk ids from last lesson and integers today, you have every
primitive the container is built from.

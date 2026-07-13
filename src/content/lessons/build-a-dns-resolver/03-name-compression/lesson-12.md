---
project: build-a-dns-resolver
lesson: 12
title: The compression pointer format
overview: To save space, a name in a response can end with a pointer to a name written earlier in the message. Today you learn to recognize a pointer and extract the 14-bit offset it points to - the first half of the trickiest parsing in DNS.
goal: Detect a compression pointer and extract its 14-bit target offset.
spec:
  scenario: A pointer word carries a 14-bit offset
  status: failing
  lines:
    - kw: Given
      text: 'a length byte whose top two bits are set (the 0xC0 mask marks a pointer)'
    - kw: When
      text: 'the two pointer bytes 0xC0 0x0C are read as a 16-bit value and the top two bits are masked off'
    - kw: Then
      text: 'the target offset is 12'
    - kw: And
      text: 'isPointer(0xC0) is true, isPointer(0x03) is false, and the pointer bytes 0xC1 0x00 give offset 256'
code:
  lang: go
  source: |
    func isPointer(b byte) bool { return b&0xC0 == 0xC0 }
    func pointerTarget(hi, lo byte) int {
      // the 14-bit offset is the whole word with the top two bits cleared
      return int(uint16(hi)<<8|uint16(lo)) & 0x3FFF
    }
checkpoint: You can recognize a pointer and read its offset. Commit and stop here.
---

Names repeat constantly in a DNS response - the answer, authority, and additional
sections all mention the same domains - so the format lets a name **point** to an
earlier copy instead of spelling it out again. The trick reuses the label length
byte: a normal label length is at most 63 (six bits), so the top two bits are
free. When **both top bits are set** (the `0xC0` mask), the byte is not a length -
it and the byte after it form a **pointer**.

The pointer is a 16-bit value whose lower **14 bits** are an offset from the start
of the message. Mask off the two flag bits with `& 0x3FFF` and you have the
offset: `0xC0 0x0C` is `0xC00C`, and clearing the top bits leaves `0x000C`, which
is `12` - the offset just past the header, where the question's name usually sits.
Today is only recognition and offset extraction; following the pointer to
reconstruct the name is next.

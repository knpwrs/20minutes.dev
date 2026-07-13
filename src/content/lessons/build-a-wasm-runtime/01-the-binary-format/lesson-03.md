---
project: build-a-wasm-runtime
lesson: 3
title: Unsigned LEB128
overview: WebAssembly stores almost every integer - lengths, indices, counts - in a compact variable-length encoding called LEB128. Today you decode the unsigned form, the workhorse the whole decoder depends on.
goal: Decode an unsigned LEB128 integer from the cursor, consuming exactly the bytes it occupies.
spec:
  scenario: Decoding an unsigned varint
  status: failing
  lines:
    - kw: Given
      text: a cursor positioned at an unsigned LEB128 value
    - kw: When
      text: the value is decoded
    - kw: Then
      text: '0x7F decodes to 127 (one byte), 0x80 0x01 decodes to 128 (two bytes), and 0xE5 0x8E 0x26 decodes to 624485'
    - kw: And
      text: the cursor advances past exactly the bytes the value occupied and no further
code:
  lang: go
  source: |
    // Each byte carries 7 payload bits, low group first. The high bit (0x80)
    // is the continuation flag: set means "another byte follows".
    func (c *Cursor) readVarU32() (uint32, error) {
      var result uint32
      var shift uint
      for {
        b, err := c.readByte()
        if err != nil { return 0, err }
        result |= uint32(b&0x7F) << shift
        if b&0x80 == 0 { break }
        shift += 7
      }
      return result, nil
    }
checkpoint: You can decode the unsigned integers that appear all over a module. Commit and stop here.
---

WebAssembly is dense with integers - section sizes, vector lengths, function and type indices, opcode immediates - and storing each as a fixed four or eight bytes would bloat every module. Instead it uses **LEB128** (Little-Endian Base 128): a variable-length encoding where each byte holds **seven** bits of the value, least-significant group first, and the top bit of each byte is a **continuation** flag. A clear top bit means this is the last byte; a set top bit means keep reading. Small numbers take one byte, larger ones take as many as they need.

Decoding is a short loop: pull seven bits out of each byte, shift them into place, and stop when you hit a byte whose high bit is clear. The subtlety that bites people is consuming **exactly** the right number of bytes - the cursor must sit on the byte right after the value when you finish, because whatever comes next is the next field. Get this decoder right and the rest of the binary format is mostly calling it in the right order.

---
project: build-a-wasm-runtime
lesson: 4
title: Signed LEB128
overview: Constant operands like `i32.const -1` are stored as signed LEB128, and the sign has to be extended correctly or negative numbers come out huge and positive. Today you decode the signed form and pin the sign-extension boundary.
goal: Decode a signed LEB128 integer, sign-extending the result so negative values decode correctly.
spec:
  scenario: Decoding a signed varint with sign extension
  status: failing
  lines:
    - kw: Given
      text: a cursor positioned at a signed LEB128 value
    - kw: When
      text: the value is decoded
    - kw: Then
      text: '0x7F decodes to -1, 0x3F decodes to 63, 0x40 decodes to -64, and 0x80 0x7F decodes to -128'
    - kw: And
      text: '0xC0 0x00 decodes to 64 - the extra byte is needed precisely because bit 6 of a lone 0x40 is the sign bit'
code:
  lang: go
  source: |
    // Same 7-bits-per-byte loop, but after the final byte, if its sign bit
    // (bit 6, value 0x40) is set and there is room, extend the sign upward.
    func (c *Cursor) readVarS32() (int32, error) {
      var result int32
      var shift uint
      var b byte
      for {
        // read b, OR in (b & 0x7F) << shift, shift += 7
        // break when b & 0x80 == 0
      }
      if shift < 32 && b&0x40 != 0 {
        result |= -1 << shift // sign-extend
      }
      return result, nil
    }
checkpoint: Signed operands, including negative ones, decode to the right value. Commit and stop here.
---

Signed LEB128 uses the same 7-bits-per-byte, continuation-flag loop as the unsigned form, but the value is **two's complement**, so the final byte carries a sign. Bit 6 of the last byte (the mask `0x40`, the top bit of that byte's seven payload bits) is the sign bit. If it is set, the number is negative and every higher bit is an implied 1 - so after the loop you must **sign-extend**: fill the bits above what you decoded with ones. Skip that step and `0x7F`, which should be `-1`, comes out as `127`.

The boundary to feel is why `64` needs two bytes while `-64` needs only one. A lone `0x40` has bit 6 set, so it decodes as the negative number `-64`; to encode positive `64` you must add a second byte (`0xC0 0x00`) so the sign bit lands on a clear bit. This same off-by-one sign boundary is exactly where a naive port to a language without a fixed-width `int32` goes wrong, so it is worth pinning now with concrete values.

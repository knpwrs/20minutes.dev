---
project: build-a-wasm-runtime
lesson: 25
title: Integer width conversions
overview: 'Real code moves values between i32 and i64. Today you add the three instructions that convert between the two widths, and pin how sign extension differs from zero extension.'
goal: Execute i32.wrap_i64, i64.extend_i32_s, and i64.extend_i32_u with correct truncation and extension.
spec:
  scenario: Narrowing and widening integers
  status: failing
  lines:
    - kw: Given
      text: the interpreter with an integer operand on the stack
    - kw: When
      text: a width conversion executes
    - kw: Then
      text: 'i32.wrap_i64 of 0x100000001 keeps the low 32 bits, giving 1'
    - kw: And
      text: 'i64.extend_i32_s of -1 gives the i64 -1, but i64.extend_i32_u of -1 gives 4294967295 (0x00000000FFFFFFFF)'
code:
  lang: go
  source: |
    // wrap narrows i64 -> i32 by dropping the high bits. extend widens i32 -> i64:
    // _s copies the sign bit up, _u fills the high half with zeros.
    case 0xA7: // i32.wrap_i64
      a := popI64(); stack.Push(I32(int32(a)))
    case 0xAC: // i64.extend_i32_s
      a := popI32(); stack.Push(I64(int64(a)))
    // 0xAD i64.extend_i32_u: zero-extend uint32 -> i64
checkpoint: The engine converts between i32 and i64. Commit and stop here.
---

Values do not stay one width forever: an index computed as `i64` gets narrowed to address memory, an `i32` gets widened to do 64-bit math. `i32.wrap_i64` **narrows** by keeping only the low 32 bits and discarding the rest, so `0x100000001` (which is 2^32 + 1) wraps to just `1`. There is no trap and no rounding - it is a pure truncation of the bit pattern.

**Widening** is where the sign matters, and it is the crux of the lesson. `i64.extend_i32_s` treats the `i32` as signed and copies its sign bit up through the new high 32 bits, so `-1` (all ones) becomes the 64-bit `-1` (still all ones). `i64.extend_i32_u` treats it as unsigned and fills the high half with zeros, so the same input `-1` becomes `0x00000000FFFFFFFF`, which is `4294967295`. Same 32 input bits, two very different 64-bit results - the identical signed-versus-unsigned fork you have now seen in division and comparison, here deciding what fills the new high bits.

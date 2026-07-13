---
project: build-a-wasm-runtime
lesson: 20
title: i32 shifts and rotations
overview: 'Shifts move bits left or right; rotations wrap them around. Today you add both, and pin the two subtleties: the shift count is taken modulo 32, and the right shift comes in signed and unsigned forms.'
goal: Execute i32.shl, i32.shr_s, i32.shr_u, i32.rotl, and i32.rotr with the count masked to 5 bits.
spec:
  scenario: Shifting and rotating with a masked count
  status: failing
  lines:
    - kw: Given
      text: the interpreter with a value and a shift count on the stack
    - kw: When
      text: a shift or rotate instruction executes
    - kw: Then
      text: '1 shl 4 = 16, and the count wraps modulo 32 so 1 shl 33 = 2 (same as shl 1)'
    - kw: And
      text: 'shr_s keeps the sign so -8 shr_s 1 = -4, shr_u zero-fills so 0x80000000 shr_u 31 = 1, and rotl of 0x80000000 by 1 = 1'
code:
  lang: go
  source: |
    // The shift amount is taken modulo 32 (mask with 0x1F). shr_s is an
    // arithmetic (sign-extending) shift; shr_u is logical (zero-fill).
    case 0x74: // i32.shl
      b := popI32(); a := popI32(); k := uint(b) & 31
      stack.Push(I32(a << k))
    // 0x75 shr_s (arithmetic), 0x76 shr_u (logical), 0x77 rotl, 0x78 rotr
checkpoint: The engine shifts and rotates correctly. Commit and stop here.
---

A **shift** slides the bits of a value; a **rotation** slides them and wraps the ones that fall off the end back around. The first thing to pin is the **count**: WebAssembly masks the shift amount modulo the width, so an `i32` shift uses only the low 5 bits of the count. That is why `1 shl 33` equals `1 shl 1` equals `2` - the `33` is reduced to `1`. Skip the mask and a large shift count gives undefined or zero results depending on the host language, so it must be explicit.

The second subtlety is that the right shift splits by sign. `shr_s` is **arithmetic**: it copies the sign bit down from the top, so `-8 shr_s 1` stays negative at `-4`. `shr_u` is **logical**: it fills with zeros, so `0x80000000 shr_u 31` brings the top bit down to `1`. Left shift (`shl`) has only one form. Rotations (`rotl`, `rotr`) never lose bits at all - `0x80000000 rotl 1` moves the top bit around to the bottom, giving `1`. These five round out i32's bit manipulation.

---
project: build-sha-256
lesson: 7
title: The small sigma functions
overview: The message schedule stretches each block with the two "small sigma" functions - like big sigma, but each mixes two rotations with a shift instead of three rotations. Today you build SmallSigma0 and SmallSigma1, completing the word primitives.
goal: Build the two small sigma functions, each two rotations XOR'd with a right shift.
spec:
  scenario: The small sigma functions XOR two rotations with a shift
  status: failing
  lines:
    - kw: Given
      text: 'the definitions SmallSigma0(x) = ROTR(x,7) XOR ROTR(x,18) XOR SHR(x,3) and SmallSigma1(x) = ROTR(x,17) XOR ROTR(x,19) XOR SHR(x,10)'
    - kw: When
      text: 'they are evaluated'
    - kw: Then
      text: 'SmallSigma0(0x12345678) is 0xe7fce6ee'
    - kw: And
      text: 'SmallSigma1(0x61626380) is 0x7da86405 and SmallSigma0(0x00000001) is 0x02004000'
code:
  lang: go
  source: |
    // two rotations and a SHIFT (SHR), not a third rotation - that is the difference
    func SmallSigma0(x uint32) uint32 {
      return ROTR(x, 7) ^ ROTR(x, 18) ^ SHR(x, 3)
    }
    // SmallSigma1 uses 17, 19, and SHR by 10
    func SmallSigma1(x uint32) uint32 { /* fill in */ return 0 }
checkpoint: You can compute both small sigma functions. The word primitives are complete. Commit and stop here.
---

The **small sigma** functions (lowercase sigma) drive the message schedule, and
they look almost like big sigma with one crucial change: the third term is a
**shift** (SHR), not a rotation. `SmallSigma0` is
`ROTR(x,7) XOR ROTR(x,18) XOR SHR(x,3)` and `SmallSigma1` is
`ROTR(x,17) XOR ROTR(x,19) XOR SHR(x,10)`. Because SHR fills the top with zeros
instead of wrapping, mixing it in is what lets the schedule spread information
without being perfectly reversible - which is why lesson 3 was careful to pin how
SHR and ROTR differ.

Pin the shift's effect deliberately: `SmallSigma0(0x00000001)` is `0x02004000`,
and every set bit there comes from the two rotations - the `SHR(x,3)` term shifts
the lone low bit clean off the bottom and contributes nothing, exactly as a shift
should. `SmallSigma0(0x12345678)` is `0xe7fce6ee`, and `SmallSigma1(0x61626380)`
is `0x7da86405` - that last input, `0x61626380`, is the first word of the "abc"
message block you will meet again once the schedule is built.

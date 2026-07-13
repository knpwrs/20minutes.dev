---
project: build-a-jpeg-codec
lesson: 23
title: Receive and extend
overview: A magnitude category says how many bits follow, and those bits encode a signed value in JPEG's clever scheme. Today you build receive-and-extend, the decode that turns a category plus bits into a signed coefficient.
goal: Read a category's worth of bits and extend them into a signed value, where a leading zero bit means a negative number.
spec:
  scenario: Extending a magnitude to a signed value
  status: failing
  lines:
    - kw: Given
      text: 'a category (size) of 3'
    - kw: When
      text: 'the 3 received bits are 101, then separately the 3 bits are 010'
    - kw: Then
      text: 'the bits 101 extend to +5, and the bits 010 extend to -5'
    - kw: And
      text: 'for category 1 the bit 1 extends to +1 and the bit 0 extends to -1; a category of 0 always means the value 0'
code:
  lang: go
  source: |
    // t == 0 means the value is 0 - return early before shifting (1<<(t-1)
    // underflows for t=0 in fixed-width languages).
    // receive t bits (MSB-first) into v, then EXTEND (T.81 Figure F.12):
    //   if v < (1 << (t-1)) { v += (-1 << t) + 1 }
    // so the top bit acts as a sign: 1 -> positive range, 0 -> negative range.
    func receiveExtend(r *BitReader, t int) int { }
checkpoint: You can decode a signed coefficient from a magnitude category. Commit and stop here.
---

JPEG does not store a sign bit. Instead, for a category `t`, it sends `t` bits and interprets them by their **top bit**: if the top bit is 1 the value is the positive number those bits spell (from `2^(t-1)` up to `2^t - 1`), and if the top bit is 0 the value is negative, offset down by `2^t - 1`. Concretely for `t = 3`: `101` is `5`, but `010` (top bit 0) is `2 - 7 = -5`. The rule in one line is: if the received value is below `2^(t-1)`, add `(-1 << t) + 1`.

This is the exact inverse of the magnitude coding an encoder does, and it is why category 1 encodes just `+1` and `-1`, category 2 covers `-3..-2` and `2..3`, and so on - each category is a symmetric pair of ranges straddling zero, with zero itself needing no bits (category 0). Getting the negative branch right is the single most error-prone line in a JPEG decoder, so the spec pins both a positive and a negative case. Every coefficient, DC and AC, comes through this function.

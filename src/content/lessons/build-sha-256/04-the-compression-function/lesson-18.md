---
project: build-sha-256
lesson: 18
title: Running all sixty-four rounds
overview: One round becomes the whole compression core by looping it 64 times, feeding round t its own constant K[t] and schedule word W[t]. Today you run the full loop and pin the working-variable state after the last round.
goal: Run all 64 compression rounds over a block's schedule.
spec:
  scenario: Sixty-four rounds over the "abc" schedule
  status: failing
  lines:
    - kw: Given
      text: 'working variables a..h set to the initial hash values, the full 64-word schedule of the "abc" block, and the 64 round constants'
    - kw: When
      text: 'the round from the previous lesson runs for t = 0 to 63, each using K[t] and W[t]'
    - kw: Then
      text: 'after round 63, a is 0x506e3058 and e is 0x5ef50f24'
    - kw: And
      text: 'the remaining working variables are b=0xd39a2165, c=0x04d24d6c, d=0xb85e2ce9, f=0xfb121210, g=0x948d25b6, h=0x961f4894'
code:
  lang: go
  source: |
    for t := 0; t < 64; t++ {
      t1 := Add32(Add32(Add32(h, BigSigma1(e)), Add32(Ch(e, f, g), K[t])), W[t])
      t2 := Add32(BigSigma0(a), Maj(a, b, c))
      h, g, f = g, f, e
      e = Add32(d, t1)
      d, c, b = c, b, a
      a = Add32(t1, t2)
    }
checkpoint: You can run the full 64-round compression core. Commit and stop here.
---

Turning one round into the compression core is nothing more than a 64-iteration
loop, but the whole security of SHA-256 lives in that repetition: 64 passes of
mixing, each pulling in a different round constant `K[t]` and a different schedule
word `W[t]`, until every output bit depends on every input bit in a way that is
practically impossible to run backward. The loop body is exactly last lesson's
round, unchanged, with `t` indexing both tables.

Pin the end state for the "abc" block: after round 63 the eight working variables
are `a = 0x506e3058`, `b = 0xd39a2165`, `c = 0x04d24d6c`, `d = 0xb85e2ce9`,
`e = 0x5ef50f24`, `f = 0xfb121210`, `g = 0x948d25b6`, `h = 0x961f4894`. These are
not the digest yet - they are the fully stirred state that still has to be
combined with where it started. That final combination is the next lesson, and it
is what makes the whole function a one-way mixing of block into hash.

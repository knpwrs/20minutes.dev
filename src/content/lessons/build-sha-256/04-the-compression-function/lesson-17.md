---
project: build-sha-256
lesson: 17
title: A single compression round
overview: The heart of SHA-256 is one round that computes two temporary words, T1 and T2, then shifts the eight working variables down like a pipeline. Today you build one round and pin the exact state after round 0 of the "abc" block.
goal: Run one compression round, updating the eight working variables via T1 and T2.
spec:
  scenario: One round transforms the working variables
  status: failing
  lines:
    - kw: Given
      text: 'working variables a..h set to the initial hash values, round constant K[0]=0x428a2f98, and schedule word W[0]=0x61626380 of the "abc" block'
    - kw: When
      text: 'one round runs: T1 = h + BigSigma1(e) + Ch(e,f,g) + K[0] + W[0]; T2 = BigSigma0(a) + Maj(a,b,c); then h=g, g=f, f=e, e=d+T1, d=c, c=b, b=a, a=T1+T2 (all sums modulo 2^32)'
    - kw: Then
      text: 'after the round a is 0x5d6aebcd and e is 0xfa2a4622'
    - kw: And
      text: 'the shift-down copied the old values along: b is 0x6a09e667, f is 0x510e527f, and h is 0x1f83d9ab'
code:
  lang: go
  source: |
    // compute BOTH temporaries from the CURRENT a..h before shifting anything
    t1 := Add32(Add32(Add32(h, BigSigma1(e)), Add32(Ch(e, f, g), K[0])), W[0])
    t2 := Add32(BigSigma0(a), Maj(a, b, c))
    h, g, f = g, f, e
    e = Add32(d, t1)
    d, c, b = c, b, a
    a = Add32(t1, t2)
checkpoint: You can run one compression round. Commit and stop here.
---

This is the engine of SHA-256. A single **round** computes two temporary words
from the current state and then shifts everything down. `T1` gathers the "far
end": `h + BigSigma1(e) + Ch(e,f,g) + K[t] + W[t]` - it pulls in the round
constant and the schedule word, so this is where the message actually enters the
state. `T2` is `BigSigma0(a) + Maj(a,b,c)`, mixing the "near end". Every addition
is modulo `2^32`.

Then the working variables shift down like a pipeline: `h` takes `g`'s old value,
`g` takes `f`, `f` takes `e`, `d` takes `c`, `c` takes `b`, `b` takes `a`. Only
two slots get genuinely new values: `e` becomes `d + T1` and `a` becomes
`T1 + T2`. The one trap is ordering - compute `T1` and `T2` from the *current*
`a..h` first, then do the shifts, or you will feed already-moved values into the
formulas. Pin round 0 of "abc": `a` becomes `0x5d6aebcd`, `e` becomes
`0xfa2a4622`, and the shifted-down slots carry the old state (`b = 0x6a09e667`).

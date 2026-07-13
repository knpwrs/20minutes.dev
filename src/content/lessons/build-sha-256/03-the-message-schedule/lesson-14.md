---
project: build-sha-256
lesson: 14
title: The schedule recurrence
overview: The remaining 48 schedule words are grown from earlier ones by a recurrence that mixes two of them through the small sigma functions. Today you compute the first grown word, W16, wiring together the pieces you built earlier.
goal: Compute a schedule word from four earlier words using the small sigma recurrence.
spec:
  scenario: W16 and W17 come from the recurrence
  status: failing
  lines:
    - kw: Given
      text: 'the sixteen words W[0..15] of the "abc" block and the recurrence W[t] = SmallSigma1(W[t-2]) + W[t-7] + SmallSigma0(W[t-15]) + W[t-16], all added modulo 2^32'
    - kw: When
      text: 'W[16] is computed (using W[14], W[9], W[1], W[0])'
    - kw: Then
      text: 'W[16] is 0x61626380'
    - kw: And
      text: 'W[17], computed from W[15], W[10], W[2], W[1], is 0x000f0000'
code:
  lang: go
  source: |
    // note the index offsets: t-2, t-7, t-15, t-16
    func nextWord(w []uint32, t int) uint32 {
      return Add32(Add32(SmallSigma1(w[t-2]), w[t-7]),
                   Add32(SmallSigma0(w[t-15]), w[t-16]))
    }
    // for t=16: SmallSigma1(w[14]) + w[9] + SmallSigma0(w[1]) + w[0]
checkpoint: You can compute a schedule word from earlier ones. Commit and stop here.
---

The other 48 schedule words are not read from the message - they are **grown**
from the sixteen you already have, and this recurrence is where every primitive
you built comes together. Each new word is
`SmallSigma1(W[t-2]) + W[t-7] + SmallSigma0(W[t-15]) + W[t-16]`, with all four
terms added **modulo 2^32**. The two small sigma functions scramble the two words
they touch, the plain additions of the other two spread the message across the
whole schedule, and the wrap-around addition keeps everything 32 bits wide.

The index offsets are the easy thing to get wrong, so pin the first grown word.
For `W[16]`, the offsets `t-2, t-7, t-15, t-16` pick `W[14], W[9], W[1], W[0]`. In
the "abc" block `W[1]` through `W[14]` are all zero, so `SmallSigma1(0)`,
`SmallSigma0(0)`, and `W[9]` all vanish and `W[16]` reduces to `W[0]`, giving
`0x61626380`. `W[17]` is `0x000f0000` - here `SmallSigma0(W[2])` is still zero but
`SmallSigma1(W[15])` is not, so the length word starts to bleed into the schedule.

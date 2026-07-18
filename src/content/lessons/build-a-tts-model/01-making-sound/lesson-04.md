---
project: build-a-tts-model
lesson: 4
title: An envelope (attack and decay)
overview: 'A sine wave that starts and stops abruptly clicks, because you have just snapped the speaker cone to a nonzero position in zero time. Today you build the ramp that fixes it.'
goal: 'Build a linear attack and decay envelope and apply it to a buffer.'
spec:
  scenario: Ramping a tone in and out
  status: failing
  lines:
    - kw: Given
      text: 'a buffer of 10 samples, every sample equal to 1.0, at any sample rate'
    - kw: When
      text: 'an envelope with a 3-sample linear attack and a 3-sample linear decay is applied'
    - kw: Then
      text: 'the first three samples are 0, 0.333333 and 0.666667 - ramping up linearly from silence'
    - kw: And
      text: 'the middle four samples stay at 1.0, the full sustain level'
    - kw: And
      text: 'the last three samples are 0.666667, 0.333333 and 0 - ramping back down to silence'
code:
  lang: go
  source: |
    // gain starts at 1.0 (sustain), then attack/decay override it at the ends
    gain := 1.0
    if i < attackN {
      gain = float64(i) / float64(attackN)
    }
    if i >= n-decayN {
      gain = float64(n-1-i) / float64(decayN)
    }
    out[i] = in[i] * gain
checkpoint: 'Every tone you generate can now fade in and out instead of clicking. Commit and stop for today.'
---

Play lesson 2's sine wave on its own and you will hear a **click** at the
start and another at the end, underneath the tone itself. A sine wave that
begins mid-cycle is fine - a sine wave that begins at full amplitude in a
single sample is not, because that is an instantaneous jump the speaker cone
has to make, and an instantaneous jump is a burst of energy spread across
every frequency at once. The fix is not to change the sine wave; it is to
multiply it by something else first.

That something is an **envelope**: a gain curve that starts at `0`, rises to
`1` over the **attack**, holds there through the **sustain**, and falls back
to `0` over the **decay**. Linear is the simplest ramp shape, and it is enough
to turn a click into a fade - one divided evenly across `attackN` samples
going up, and the mirror image across the last `decayN` samples going down. A
tone with an envelope applied no longer disagrees with silence at either end.

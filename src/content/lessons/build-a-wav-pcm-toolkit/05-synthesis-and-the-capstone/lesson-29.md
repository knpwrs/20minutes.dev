---
project: build-a-wav-pcm-toolkit
lesson: 29
title: An ADSR-lite envelope
overview: A raw tone starts and stops abruptly; an envelope shapes its loudness over time so it swells and releases like a real instrument. Today you build an attack-sustain-release envelope from linear segments.
goal: Shape a signal with a piecewise-linear attack, sustain, and release envelope.
spec:
  scenario: An envelope ramps up, holds, and ramps down
  status: failing
  lines:
    - kw: Given
      text: 'the constant signal [1000, 1000, 1000, 1000, 1000, 1000] with attack 2 samples and release 2 samples (sustain fills the middle)'
    - kw: When
      text: 'the envelope is applied, attack factor a/A rising to 1, then sustain at 1, then release factor 1-(r+1)/R falling to 0'
    - kw: Then
      text: 'the result is [0, 500, 1000, 1000, 500, 0]'
    - kw: And
      text: 'the attack rises from 0, the sustain holds at full level, and the release ends at 0'
code:
  lang: go
  source: |
    func envelope(sig []int, attack, release int) []int {
      n := len(sig)
      out := make([]int, n)
      for i, s := range sig {
        var f float64
        switch {
        case i < attack:        f = float64(i) / float64(attack)          // 0 -> 1
        case i >= n-release:    f = 1 - float64(i-(n-release)+1)/float64(release) // 1 -> 0
        default:                f = 1                                       // sustain
        }
        out[i] = int(math.Round(float64(s) * f))
      }
      return out
    }
checkpoint: You can shape a signal with an ADSR-lite envelope. Commit and stop here.
---

An **envelope** controls how a sound's loudness changes from the moment it begins to
the moment it fades - the difference between a plucked string and a bowed one. The
classic model is **ADSR** (attack, decay, sustain, release); the lite version here
keeps three linear segments: an **attack** ramp from `0` up to full level, a
**sustain** hold at full level, and a **release** ramp back down to `0`. (Adding a
decay from the attack peak down to a lower sustain level is the same linear-segment
idea, one more piece.)

It is the fade from lesson 22 generalized: instead of one ramp, a per-sample
multiplier that rises, holds, then falls. With attack `2` and release `2` over six
samples, the factors are `0, 0.5, 1, 1, 0.5, 0`, so a constant `1000` becomes
`[0, 500, 1000, 1000, 500, 0]` - a little hill. Round each scaled sample. Because the
envelope never exceeds `1`, it only ever attenuates, so no clipping. This is what
turns the bare oscillator tones into something that sounds shaped rather than
switched on.

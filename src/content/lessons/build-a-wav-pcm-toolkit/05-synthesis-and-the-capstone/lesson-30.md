---
project: build-a-wav-pcm-toolkit
lesson: 30
title: A delay echo
overview: A delay effect adds a quieter, time-shifted copy of a signal to itself, producing an echo. It is your first effect that reaches back in time, and it reuses mixing's clamp. Today you build it.
goal: Add a delayed, attenuated copy of a signal to itself, clamping the sum.
spec:
  scenario: A delay adds an attenuated echo after a fixed lag
  status: failing
  lines:
    - kw: Given
      text: 'the signal [10000, 0, 0, 0], a delay of 2 samples, and a decay of 0.5, with out[n] = clamp(in[n] + round(decay*in[n-delay]))'
    - kw: When
      text: 'the delay is applied'
    - kw: Then
      text: 'the result is [10000, 0, 5000, 0] - the echo of the first sample lands 2 positions later at half level'
    - kw: And
      text: 'for [30000, 0, 30000, 0] the echoed sample 30000 + 0.5*30000 = 45000 clamps to 32767'
code:
  lang: go
  source: |
    func delay(in []int, lag int, decay float64) []int {
      out := make([]int, len(in))
      for n := range in {
        v := in[n]
        if n >= lag {
          v += int(math.Round(decay * float64(in[n-lag])))   // add the echo
        }
        out[n] = clampInt16(v)
      }
      return out
    }
checkpoint: You can apply a delay echo. The synthesis toolkit is complete; commit and stop here.
---

A **delay** is the simplest time-based effect: for each sample it adds a copy of an
**earlier** sample, attenuated by a **decay** factor, producing an audible echo. The
`lag` sets how far back (how long until the echo), and `decay` sets how much quieter
the echo is. The rule is `out[n] = in[n] + decay * in[n-lag]`, and for the first
`lag` samples there is no earlier sample to fetch, so they pass through untouched.

With lag `2` and decay `0.5`, the lone `10000` at index `0` reappears at half level,
`5000`, at index `2` - a single slap-back echo. Because you are summing two signals,
the result can exceed the range exactly like mixing, so you reuse `clampInt16`:
`30000 + 0.5*30000 = 45000` clamps to `32767` rather than wrapping. (Feeding the
output back in instead of the input would give a repeating echo - feedback delay - a
natural extension.) This completes the toolkit; the capstone puts every piece to
work at once.

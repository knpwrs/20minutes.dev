---
project: build-an-stt-model
lesson: 12
title: Log mel energies
overview: Filterbank energies span many orders of magnitude, and loudness is perceived on something closer to a logarithmic scale. Today you take that log, with a small floor standing between you and log(0).
goal: Take the natural log of each filterbank energy, flooring first so log(0) never happens.
spec:
  scenario: Taking the log, with a floor
  status: failing
  lines:
    - kw: Given
      text: 'the 8 filterbank energies computed by lesson 11 on frame 2 - use lesson 11''s own full-precision output as the input here, not rounded copies; to eight decimals they read 0.00001011, 0.00001854, 0.00001551, 0.59336675, 0.29674191, 0.00004224, 0.00006125, 0.00007499, but the log values below are taken from the full-precision numbers, so re-typing these rounded figures as the input drifts past the tolerance'
    - kw: And
      text: 'a floor of 1e-10 applied to any energy before its log is taken, so log(0) never happens'
    - kw: When
      text: 'the natural log of each (floored) energy is computed'
    - kw: Then
      text: 'the log-mel energies are approximately -11.50211721, -10.89539975, -11.07379989, -0.52194261, -1.21489250, -10.07213375, -9.70058333, -9.49821027'
    - kw: And
      text: 'had a filter''s energy been exactly 0, the floor would pin it to 1e-10 first, giving log(1e-10) = -23.02585093 rather than negative infinity'
code:
  lang: go
  source: |
    // natural log, not log10 - and floor before logging, never after
    func LogMelEnergies(e []float64) []float64 {
      out := make([]float64, len(e))
      for i, v := range e {
        if v < 1e-10 {
          v = 1e-10
        }
        out[i] = math.Log(v)
      }
      return out
    }
checkpoint: Every filter energy is now on a log scale, and the one boundary case - total silence - can never blow it up. Commit and stop for today.
---

Loudness compresses the way frequency does: a jump from `0.01` to `0.02` energy is as perceptually large as a jump from `0.1` to `0.2`, a relationship a logarithm captures and a raw ratio does not. Taking the natural log of each filterbank energy also shrinks today's six-order-of-magnitude spread (from `0.00001` up to `0.59`) down to a much more manageable few units, which is what makes the coefficients in the next two lessons well-behaved instead of dominated by whichever filter happened to be loudest.

The one edge worth pinning is silence. `log(0)` is negative infinity, and a genuinely silent filter's energy really can round to `0.0`, so every energy is **floored** to `1e-10` before the log runs. Get the order wrong - log first, floor second - and the infinity has already happened; the floor has to come first, every time, not just when a value looks suspiciously small.

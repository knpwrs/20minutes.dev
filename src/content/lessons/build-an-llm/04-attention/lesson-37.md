---
project: build-an-llm
lesson: 37
title: Layer normalization
overview: 'Layer normalization rescales one row to zero mean and unit variance, dividing by the row''s own length rather than length minus one, then applies a learnable scale and shift.'
goal: Normalize a row to zero mean and unit biased variance, then apply a per-column scale and shift.
spec:
  scenario: Normalizing one row of the input
  status: failing
  lines:
    - kw: Given
      text: 'the row [-0.25, -0.1, 0.05, 0.2, 0.1, -0.25, -0.1, 0.05] (row 0 of X from lesson 26), epsilon 0.00001, and identity scale and shift (gamma all 1.0, beta all 0.0)'
    - kw: When
      text: 'the row''s mean is subtracted, the result is divided by the square root of the row''s variance plus epsilon - variance computed as the sum of squared deviations divided by the row length N, not N minus 1 - then scaled by gamma and shifted by beta'
    - kw: Then
      text: 'the normalized row is about [-1.383147, -0.406808, 0.569531, 1.545871, 0.894978, -1.383147, -0.406808, 0.569531]'
    - kw: And
      text: 'the mean of the normalized row is 0'
    - kw: And
      text: 'the biased variance (divide by N) of the normalized row is about 0.999576, not exactly 1 because of epsilon'
    - kw: And
      text: 'dividing by N minus 1 instead gives a variance of about 1.142373 - the wrong answer for this project, since it does not match the biased convention'
code:
  lang: go
  source: |
    // divide the sum of squared deviations by N (len(row)), not N-1 -
    // that choice is the entire trap this lesson pins down
    func (ln *LayerNorm) NormalizeRow(row []*Value) []*Value {
      n := NewValue(float64(len(row)))
      // mean := sum(row) / n; variance := sum((v-mean)^2) / n
      // std := sqrt(variance + eps); xhat := (v-mean)/std; out := gamma*xhat+beta
      return make([]*Value, len(row))
    }
checkpoint: You can normalize any row to (near) zero mean and unit variance, using the biased variance convention this project commits to. Commit and stop for today.
---

**Layer normalization** rescales a single row so its values sit around zero with a consistent spread, regardless of how large or small the row's raw entries happened to be: subtract the row's own mean, then divide by its own standard deviation. A small `epsilon` is added inside the square root purely to avoid dividing by zero on a row whose variance happens to be exactly `0`. After that, a learnable `gamma` (scale) and `beta` (shift) are applied per column - today both are the identity, `1.0` and `0.0`, so they change nothing yet, but the mechanism is in place for later lessons that give them other values.

The variance in that division is **biased**: divide the sum of squared deviations by the row length `N`, not `N - 1`. This matches how `nn.LayerNorm` is defined everywhere it is used in practice, and it is worth checking by hand today, because the more familiar sample-variance formula (`N - 1`) gives a visibly different, and wrong, answer for this project - `1.142373` instead of the `0.999576` above. The two numbers are close enough to look like a rounding difference and different enough to silently break every later lesson that reuses this normalized row.

---
project: build-a-bloom-filter
lesson: 23
title: The harmonic-mean estimate
overview: Each register carries a noisy guess at the cardinality. HyperLogLog combines them with a harmonic mean and a correction constant to produce one raw estimate. Today you compute that formula.
goal: Compute the raw cardinality estimate from the registers using the harmonic mean with the alpha constant.
spec:
  scenario: The raw estimate from the register values
  status: failing
  lines:
    - kw: Given
      text: 'a NewHLL(4) whose 16 registers hold [0,0,0,3,0,3,0,0,0,0,0,2,1,1,0,2], and the raw rule estimate = alpha times m squared divided by the sum over registers of 2 to the power of minus that register, with alpha = 0.673 for 16 registers'
    - kw: When
      text: 'the raw estimate is computed'
    - kw: Then
      text: 'the sum of 2 to the minus register is 11.75'
    - kw: And
      text: 'the raw estimate is about 14.66, which is far from the true distinct count of 8 - a bias the next lesson corrects'
code:
  lang: go
  source: |
    func (h *HLL) rawEstimate() float64 {
      sum := 0.0
      for _, v := range h.registers { sum += math.Pow(2, -float64(v)) }
      m := float64(len(h.registers))
      return alpha(len(h.registers)) * m * m / sum // alpha(16) = 0.673
    }
checkpoint: You can turn the registers into a raw cardinality estimate. Commit and stop here.
---

Each register's maximum rank is itself a rough, high-variance estimate of the cardinality. HyperLogLog tames that noise by combining all `m` registers with a **harmonic mean**, which is far more robust to a single unusually large register than an ordinary average would be. Concretely: sum `2^(-register)` over every register, divide `m^2` by that sum, and scale by a bias constant **alpha** that depends on `m` (`0.673` for `16` registers). That is the raw estimate `E`.

Empty registers - those still at zero - contribute `2^0 = 1` each to the sum, so a mostly-empty sketch has a large denominator and a small estimate. Here ten of the sixteen registers are still zero, which is a warning sign: this many empties means very few distinct items have been seen, and the raw formula is known to be **biased** in exactly that regime. The raw estimate of about `14.66` badly overshoots the true `8`. The formula is right for large cardinalities but needs a correction when the sketch is nearly empty, which is next.

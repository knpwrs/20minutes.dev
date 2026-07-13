---
project: build-a-bloom-filter
lesson: 25
title: Sizing HyperLogLog
overview: More registers mean a tighter estimate, at a fixed cost per register. The relationship between register count and accuracy is exact, so you can choose p for a target error. Today you compute it.
goal: Compute the standard error for a register count, and choose p for a target relative error.
spec:
  scenario: Register count sets the accuracy
  status: failing
  lines:
    - kw: Given
      text: 'the standard error rule relative_error = 1.04 divided by the square root of m, with m = 2 to the p registers, so reaching a target needs m at least (1.04 / target) squared and p = ceil of log base 2 of that'
    - kw: When
      text: 'p is chosen for a target relative error of 0.02'
    - kw: Then
      text: 'it is 12, giving 4096 registers'
    - kw: And
      text: 'the standard error at p = 4 (16 registers) is about 0.26'
code:
  lang: go
  source: |
    func StandardError(p uint) float64 { return 1.04 / math.Sqrt(float64(uint(1)<<p)) }
    func ChooseP(target float64) uint {
      m := math.Ceil(math.Pow(1.04/target, 2))
      return uint(math.Ceil(math.Log2(m)))
    }
checkpoint: You can size a HyperLogLog for a target accuracy. Commit and stop here.
---

HyperLogLog's accuracy is governed by a single clean law: the relative standard error of the estimate is about `1.04 / sqrt(m)`, where `m` is the number of registers. Because each register is one small byte, this is a direct memory-for-accuracy dial - quadrupling the registers halves the error. The `16` registers used throughout this chapter give a `26%` standard error, which is why the estimates here are only roughly right; they were chosen small so every register value could be checked by hand.

To size for a real target, invert the law: to get relative error at or below `target`, you need `m` at least `(1.04 / target)^2` registers, and `p = ceil(log2(m))`. A two-percent error needs about `2704` registers, rounded up to `4096` (that is `p = 12`), which is roughly four kilobytes total - a famously good deal for counting the distinct items in an unbounded stream. This is the last piece of the toolkit; the final chapter runs all three sketches over one stream at once.

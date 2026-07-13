---
project: build-a-bloom-filter
lesson: 24
title: The small-range correction
overview: When few distinct items have arrived, most registers are still empty and the raw formula overshoots. HyperLogLog switches to counting the empty registers directly - linear counting - in that regime. Today you add that correction.
goal: Apply linear counting when the raw estimate is small and some registers are empty.
spec:
  scenario: Linear counting rescues the small-cardinality estimate
  status: failing
  lines:
    - kw: Given
      text: 'the registers [0,0,0,3,0,3,0,0,0,0,0,2,1,1,0,2], whose raw estimate 14.66 is small (at most 2.5 times the 16 registers) and which have V = 10 empty registers'
    - kw: When
      text: 'the small-range correction m times the natural log of (m divided by V) is applied'
    - kw: Then
      text: 'the corrected estimate is about 7.52, close to the true distinct count of 8'
    - kw: And
      text: 'when the raw estimate exceeds 2.5 times m, or no registers are empty, the raw estimate is used unchanged'
code:
  lang: go
  source: |
    func (h *HLL) Estimate() float64 {
      e := h.rawEstimate()
      m := float64(len(h.registers))
      if v := countZeros(h.registers); e <= 2.5*m && v > 0 {
        return m * math.Log(m/float64(v)) // linear counting
      }
      return e
    }
checkpoint: Your HyperLogLog corrects its estimate for small cardinalities. Commit and stop here.
---

The raw harmonic-mean formula is accurate once the sketch is reasonably full, but it is biased high when most registers are still empty - precisely the state you saw in the previous lesson. HyperLogLog detects that regime with a simple test - the raw estimate is at most `2.5 * m` **and** at least one register is empty - and switches to a completely different estimator that works beautifully when data is sparse: **linear counting**.

Linear counting ignores the ranks and just looks at how many registers are still zero. If `V` of the `m` registers are empty, the estimate is `m * ln(m / V)` - the same reasoning as counting how many balls you must throw into `m` bins to leave `V` empty. With `10` of `16` registers empty it gives about `7.52`, a far better read on the true `8` than the raw `14.66`. Above the threshold the sketch is full enough that the harmonic-mean formula is trusted directly. Two estimators, each used where it is strong, stitched together at a threshold - that is the whole `Estimate`.

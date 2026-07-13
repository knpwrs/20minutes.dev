---
project: build-a-skip-list
lesson: 7
title: A seeded random generator
overview: Skip lists pick tower heights at random, which would make them impossible to test with exact values. Today you sidestep that by writing your own tiny seeded generator - a linear congruential generator - so the same seed always produces the same stream of numbers.
goal: Build a seeded generator whose next value is a fixed function of its state, producing a reproducible stream.
spec:
  scenario: A seeded generator produces a fixed, reproducible stream
  status: failing
  lines:
    - kw: Given
      text: 'a generator seeded with 1, using state = state * 1664525 + 1013904223 truncated to 32 bits'
    - kw: When
      text: 'next is called four times'
    - kw: Then
      text: 'it yields 1015568748, 1586005467, 2165703038, then 3027450565'
    - kw: And
      text: 'a second generator seeded with 1 yields the same first value, 1015568748 (identical seed, identical stream)'
code:
  lang: go
  source: |
    // A linear congruential generator: one multiply-add per step. The uint32
    // wraparound IS the "truncate to 32 bits" (mod 2^32). next returns the
    // NEW state, so the seed itself is never returned.
    type rng struct{ state uint32 }
    func newRNG(seed uint32) *rng { return &rng{state: seed} }
    func (r *rng) next() uint32 {
      r.state = r.state*1664525 + 1013904223
      return r.state
    }
checkpoint: You have a reproducible seeded generator. Commit and stop here.
---

Real skip lists lean on a source of randomness, and if we used the language's
built-in generator every run would build a different structure and nothing could be
pinned to an exact value. So we bring our own: a **linear congruential generator**,
the classic one-line pseudo-random recipe. It holds a single 32-bit `state` and
advances it with one multiply and one add, `state = state * 1664525 + 1013904223`,
keeping only the low 32 bits (which unsigned 32-bit arithmetic does for you by
wrapping around). The number it returns is the new state.

Because the next value is a pure function of the current state, a given seed
produces one fixed, repeatable stream - seed 1 always yields 1015568748 first. That
determinism is the whole point: it lets a skip list make "random" choices that you
can nonetheless reproduce and assert on down to the exact tower. The next lesson
turns this stream of numbers into random tower heights.

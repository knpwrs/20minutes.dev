---
project: build-a-sudoku-solver
lesson: 22
title: A deterministic generator
overview: To generate puzzles you need randomness, but reproducible randomness - the same seed must give the same puzzle in any language. Today you build a tiny linear congruential generator whose sequence you define yourself, so the values are identical everywhere.
goal: Build a seeded pseudo-random number generator with a fixed, reproducible sequence.
spec:
  scenario: A seeded generator produces a fixed sequence
  status: failing
  lines:
    - kw: Given
      text: 'a generator with state update next = (1664525 * state + 1013904223) mod 2^32, seeded with 1'
    - kw: When
      text: 'the first three values are drawn'
    - kw: Then
      text: 'they are 1015568748, 1586005467, and 2165703038'
    - kw: And
      text: 'a bounded draw takes the value modulo n, so with the same seed the first draw modulo 9 is 0'
code:
  lang: go
  source: |
    // classic LCG constants (Numerical Recipes); 32-bit wraparound is the point
    type RNG struct{ state uint32 }
    func (r *RNG) Next() uint32 {
      r.state = 1664525*r.state + 1013904223 // wraps at 2^32
      return r.state
    }
    func (r *RNG) Intn(n int) int { return int(r.Next() % uint32(n)) }
checkpoint: You have a seeded generator with a reproducible sequence. Commit and stop here.
---

Generation needs random choices, but a solver library must be **reproducible**: the
same seed has to yield the same puzzle whether you wrote it in Go, Python, or Rust.
A language's built-in random generator will not do that - its sequence differs by
implementation. So you define your own, a **linear congruential generator**: each
step is `state = a*state + c` reduced modulo `2^32`, with the well-known constants
`a = 1664525` and `c = 1013904223`. Because you specify the arithmetic exactly, the
sequence is identical on every machine.

The 32-bit wraparound is not an accident to paper over - it *is* the generator. Seed
it with 1 and the first output is `1664525*1 + 1013904223 = 1015568748`, then the
next two follow from the same rule. A bounded draw is just the value modulo `n`,
which is all the generator needs to offer: pick an index in a range, and pick it the
same way everywhere. This small, honest generator is what makes seeded generation
portable.

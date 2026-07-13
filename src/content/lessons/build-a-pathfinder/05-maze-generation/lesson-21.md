---
project: build-a-pathfinder
lesson: 21
title: A seeded random number generator
overview: Maze generation needs randomness, but a maze you cannot reproduce cannot be tested. Today you build your own seeded generator so a given seed always yields the same stream of numbers, in any language.
goal: Build a seeded xorshift32 generator whose output stream is fixed by its seed.
spec:
  scenario: A seed produces a fixed, reproducible number stream
  status: failing
  lines:
    - kw: Given
      text: 'a generator seeded with 1, using xorshift32 (x ^= x<<13; x ^= x>>17; x ^= x<<5) on a 32-bit unsigned state'
    - kw: When
      text: 'Next is called five times'
    - kw: Then
      text: 'it returns 270369, 67634689, 2647435461, 307599695, 2398689233 in that order'
    - kw: And
      text: 'a fresh generator seeded with 1 reproduces the exact same five values'
code:
  lang: go
  source: |
    type RNG struct{ state uint32 }
    func NewRNG(seed uint32) *RNG {
      if seed == 0 { seed = 1 }   // xorshift must not start at 0
      return &RNG{state: seed}
    }
    func (r *RNG) Next() uint32 {
      x := r.state                 // keep to 32 bits (mask 0xFFFFFFFF if no uint32)
      x ^= x << 13
      x ^= x >> 17
      x ^= x << 5
      r.state = x
      return x
    }
checkpoint: A seeded generator produces a fixed, reproducible stream. Commit and stop here.
---

Randomly generated mazes are only useful here if they are **reproducible**: the same
seed must always build the same maze, or no spec could pin one. Rather than depend on
a language's built-in generator (each does something different), we build our own tiny
one so its output is identical everywhere.

The algorithm is **xorshift32**, three lines of exclusive-or and bit shifts on a
32-bit state that produce a long, well-mixed sequence. The seed is the entire memory
of the generator: two generators with the same seed march through the exact same
numbers forever. The one rule is that the state can never be **zero**, since
xorshift on zero yields zero and the stream dies, so we bump a zero seed to 1. Keep
the arithmetic to 32 bits and the stream is bit-for-bit the same in Go, Python, or
JavaScript. That reproducible stream is the foundation every maze in this chapter
stands on.

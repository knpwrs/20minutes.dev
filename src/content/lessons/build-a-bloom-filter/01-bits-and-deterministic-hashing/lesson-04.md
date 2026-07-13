---
project: build-a-bloom-filter
lesson: 4
title: A second hash by mixing
overview: A Bloom filter needs several independent hashes, not one. Rather than write a whole second hash function, we scramble the first hash's output through the splitmix64 mixing steps to get a well-spread second value.
goal: Derive a second hash by passing Hash1's output through the splitmix64 finalizer.
spec:
  scenario: A splitmix64 mix of Hash1 gives a second hash
  status: failing
  lines:
    - kw: Given
      text: 'the splitmix64 finalizer applied to a value x - add 0x9E3779B97F4A7C15, then set x to (x XOR (x shifted right 30)) times 0xBF58476D1CE4E5B9, then x to (x XOR (x shifted right 27)) times 0x94D049BB133111EB, then x to x XOR (x shifted right 31), all modulo 2 to the 64'
    - kw: When
      text: 'Hash2("cat") is computed as the mix of Hash1("cat")'
    - kw: Then
      text: 'it returns 870555677502330999'
    - kw: And
      text: 'Hash2("the") returns 18410501238811984819'
code:
  lang: go
  source: |
    func mix(x uint64) uint64 {
      x += 0x9E3779B97F4A7C15
      x = (x ^ (x >> 30)) * 0xBF58476D1CE4E5B9
      x = (x ^ (x >> 27)) * 0x94D049BB133111EB
      return x ^ (x >> 31)
    }
    func Hash2(data []byte) uint64 { return mix(Hash1(data)) }
checkpoint: You have a second, independent hash for every input. Commit and stop here.
---

The next lesson needs two hashes that behave independently, so that combining them produces well-spread bit positions. Computing a whole second hash over the input bytes would work, but there is a cheaper trick: take the first hash's output and run it through a strong **bit mixer**. The splitmix64 finalizer is a fixed sequence of add, multiply, and xor-shift steps that thoroughly scrambles a 64-bit value, so `mix(Hash1(x))` is effectively independent of `Hash1(x)` even though it is derived from it.

Each `x >> n` is a right shift that folds high bits down into the low bits, and each multiply by a large odd constant diffuses them back across the whole word; two rounds are enough to erase any structure. We now have `Hash1` and `Hash2` for any input, computed from a single pass over the bytes - the two ingredients double hashing needs next.

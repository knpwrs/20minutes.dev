---
project: build-a-consistent-hash-ring
lesson: 2
title: A position on the ring
overview: A hash ring is a circle of positions, and both nodes and keys live on it. Today you fold the 32-bit hash down onto a small 16-bit ring so every key has a position between 0 and 65535 - a number small enough to reason about and plot.
goal: Map a key to a position in the ring space [0, 65536) by folding the hash to 16 bits.
spec:
  scenario: A key maps to a fixed position on a 16-bit ring
  status: failing
  lines:
    - kw: Given
      text: 'a ring space of 65536 positions (0 to 65535) and Pos(s) defined as Hash(s) modulo 65536'
    - kw: When
      text: 'Pos("apple") is computed'
    - kw: Then
      text: 'it returns 10943'
    - kw: And
      text: 'Pos("") returns 40389 (2166136261 modulo 65536)'
code:
  lang: go
  source: |
    // Fold the full hash down to the ring space by taking the low 16 bits.
    func Pos(s string) uint16 {
      return uint16(Hash(s) % 65536) // % 65536 keeps the position in [0, 65536)
    }
checkpoint: Every key now has a fixed position in the ring space. Commit and stop here.
---

A **hash ring** is exactly what it sounds like: a circle of positions wrapping from a
maximum back around to 0. Anything we want to place on it - a cache key, a server -
gets a position by hashing its name. The size of the ring is a design choice; we use
**65536 positions** (a 16-bit ring) so that positions are small, easy to sort, and easy
to check by hand. Production rings are usually the full 32-bit or 160-bit hash space,
but nothing about the logic changes with the size.

Folding the 32-bit hash onto the ring is just taking it modulo the ring size, which for
a power of two is the same as keeping the low bits. From here on, `Pos` is the one
function that places things on the ring: give it a key or a node name and it returns
where that thing sits. Note that different strings can in principle land on the same
position (a collision); with our handful of nodes and keys they will not, but the ring
must never assume positions are unique.

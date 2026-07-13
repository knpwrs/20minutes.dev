---
project: build-a-merkle-tree
lesson: 1
title: A deterministic hash
overview: A Merkle tree is built entirely from hashes, so the first thing you need is a hash - a function that turns any bytes into a fixed fingerprint. Today you build a simple, fully deterministic hash you can reproduce by hand.
goal: Turn a byte string into a 32-bit fingerprint using the FNV-1a hash.
spec:
  scenario: A deterministic hash of some bytes
  status: failing
  lines:
    - kw: Given
      text: 'the FNV-1a 32-bit hash - start at 0x811c9dc5, and for each byte XOR it in then multiply by 0x01000193 (keeping only the low 32 bits)'
    - kw: When
      text: 'hashBytes is called on the bytes of "abc"'
    - kw: Then
      text: 'it returns 0x1a47e90b'
    - kw: And
      text: 'hashBytes of an empty input returns the starting value 0x811c9dc5'
code:
  lang: go
  source: |
    type Hash uint32
    func hashBytes(data []byte) Hash {
      var h uint32 = 0x811c9dc5      // FNV offset basis
      for _, b := range data {
        h ^= uint32(b)               // fold in the byte
        h *= 0x01000193              // FNV prime; uint32 wraps at 2^32
      }
      return Hash(h)
    }
checkpoint: You have a deterministic hash that maps any bytes to a 32-bit fingerprint. Commit and stop here.
---

A **hash** takes any bytes and returns a fixed-size fingerprint, in a way that is
deterministic (same input, same output) and sensitive (a tiny change in the input
scrambles the output). Real Merkle trees use a cryptographic hash like SHA-256, but
those produce 32-byte outputs that are impractical to check by hand and behave a
little differently in every language. So this project uses **FNV-1a**, a tiny,
well-defined hash that fits in a 32-bit integer and prints as eight hex digits.
Every leaf hash, node, root, and proof you meet will be an exact number you can
recompute.

The algorithm is two lines in a loop: start from a fixed **offset basis**, and for
each byte XOR it into the running value and then multiply by a fixed **prime**,
letting the 32-bit integer wrap. That is it. The tree you build on top is completely
**hash-agnostic** - swap in SHA-256 and only this one function changes; every
structural idea in the rest of the project stays identical.

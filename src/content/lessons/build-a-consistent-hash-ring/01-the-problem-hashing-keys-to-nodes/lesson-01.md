---
project: build-a-consistent-hash-ring
lesson: 1
title: A deterministic hash
overview: Every consistent hash ring starts with a hash function that turns a key into a number, the same number every time. Today you build that function - a small, fully specified FNV-1a hash - so that every position on the ring later in the project is a value you can pin down exactly.
goal: Turn a string key into a deterministic 32-bit number with FNV-1a.
spec:
  scenario: The same key always hashes to the same number
  status: failing
  lines:
    - kw: Given
      text: 'the FNV-1a 32-bit hash (offset basis 2166136261, prime 16777619, XOR each byte then multiply, all modulo 2^32)'
    - kw: When
      text: 'Hash("apple") is computed'
    - kw: Then
      text: 'it returns 280767167'
    - kw: And
      text: 'Hash("") returns the offset basis unchanged, 2166136261'
code:
  lang: go
  source: |
    // FNV-1a: start from the basis, fold in one byte at a time.
    func Hash(s string) uint32 {
      h := uint32(2166136261)
      for i := 0; i < len(s); i++ {
        h ^= uint32(s[i]) // XOR the byte in
        h *= 16777619     // then multiply by the prime (wraps at 2^32)
      }
      return h
    }
checkpoint: You have a deterministic hash that maps any key to a fixed 32-bit number. Commit and stop here.
---

Consistent hashing is built on one simple guarantee: a key always lands in the same
place. That guarantee comes entirely from the hash function, so we pin it down first.
We use **FNV-1a**, a tiny non-cryptographic hash that needs no library: start from a
fixed **offset basis**, and for each byte of the key, XOR the byte into the running
value and multiply by a fixed **prime**. The multiply is 32-bit and wraps around on
overflow, which is what mixes the bits.

Real systems reach for SHA-1 or MD5 here, and the ring you build works with any of
them - it only cares that the hash is deterministic and well spread. We pick FNV-1a
because it is short enough to hold in your head and gives numbers you can reproduce by
hand, which matters when every later lesson asserts an exact position. The empty-string
case is the cleanest check that you started from the right basis: with no bytes to fold
in, `Hash("")` is the offset basis itself.

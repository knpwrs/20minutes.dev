---
project: build-a-qr-code-encoder
lesson: 1
title: Addition is XOR
overview: 'Every byte in a QR code''s error correction lives in a finite field called GF(256), where the very first surprise is that adding two values means XOR-ing them. Today you write that one operation - the arithmetic everything else in the project stands on.'
goal: 'Add two field elements by XOR-ing their bytes, and confirm a value plus itself is zero.'
spec:
  scenario: 'Field addition is a byte XOR'
  status: failing
  lines:
    - kw: Given
      text: 'two GF(256) elements 0x40 and 0x05'
    - kw: When
      text: 'gadd(0x40, 0x05) is called'
    - kw: Then
      text: 'it returns 0x45'
    - kw: And
      text: 'gadd(0xA3, 0xA3) returns 0x00 - any element added to itself is zero, so in this field subtraction is the same operation as addition'
code:
  lang: go
  source: |
    // A GF(256) element is just a byte. Addition and subtraction
    // are the identical operation here: bitwise XOR.
    func gadd(a, b byte) byte {
      return a ^ b
    }
checkpoint: 'You can add and subtract in GF(256). Commit and stop here.'
---

QR codes recover from damage using **Reed-Solomon error correction**, and that math does not run on ordinary integers. It runs on a **finite field** written GF(256): a set of exactly 256 values (all the bytes) with its own rules for add, subtract, multiply, and divide, where every operation stays inside the set. The whole first chapter builds this field, because every codeword you compute later is an element of it.

The friendliest rule comes first. **Addition in GF(256) is bitwise XOR.** There are no carries, so `0x40 + 0x05` is `0x45` (the bits never collide) and, crucially, a value XOR-ed with itself is `0`. That last fact means **subtraction is the same as addition** - to subtract, you XOR, exactly as you would to add. Keep that in mind: later, when a formula says "minus", you will reach for the very same `gadd`.

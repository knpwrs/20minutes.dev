---
title: 'Build SHA-256 from Scratch'
order: 37
lessons: 25
size: 'Small'
tech: ['SHA-256', 'Merkle-Damgard', 'Bitwise operations']
estMin: 20
desc: 'Implement SHA-256 from scratch: the message schedule, compression rounds, and real test vectors.'
blurb: 'Implement SHA-256 the way FIPS 180-4 defines it, one exact value at a time. Every lesson is a concrete spec with pinned hex: modular addition wrapping at 2^32, ROTR versus SHR giving different results on the same word, Ch and Maj bit by bit, padding that forces a whole extra block at the 448-mod-512 boundary, the message schedule words for the "abc" block, the working-variable state after round 0 and round 63, and the finished digests - empty string e3b0c442..., "abc" ba7816bf..., and a two-block message - each checked against the published standard.'
overview: |
  Over 25 lessons you build SHA-256 from scratch on fixed-width 32-bit words, calling no crypto library for the taught computation. Every intermediate value is a fixed number defined by the standard, so the whole thing is exactly testable: you check each step against FIPS 180-4 and RFC 6234, and the finished digests against the official test vectors. The deliverable is a small library that hashes a byte string to a 32-byte digest and its hex, correct against the published vectors, plus an optional HMAC-SHA256.

  You start with the arithmetic SHA-256 is built from: addition modulo 2^32, rotate-right (ROTR) versus shift-right (SHR) and why they differ, the logical functions Ch and Maj, and the four sigma functions that combine rotations and shifts. Then you pin the constants (the eight initial hash values from square roots of primes, the 64 round constants from cube roots), pad a message to a multiple of 512 bits and split it into 64-byte blocks, expand each block into a 64-word message schedule, and run the 64-round compression function - pinning the working-variable state after round 0 and after round 63 for the "abc" block. Finally you drive multiple blocks to a full digest, reproduce the empty-string, "abc", and two-block vectors exactly, and add HMAC-SHA256 against a known RFC 4231 vector.

  This is an educational implementation, correct against the standard test vectors but deliberately not hardened: it is not constant-time and makes no attempt at side-channel resistance, so it is for learning how SHA-256 works, not for protecting real secrets. It is also worth remembering that SHA-256 is a one-way hash, not encryption - it produces a fixed 256-bit fingerprint and there is nothing to decrypt. What you get is the honest core of a real hash function - the same word primitives, padding, schedule, and compression that ship inside every production SHA-256 - built to match the standard byte for byte.
parts:
  - name: '32-bit word primitives'
    count: 7
  - name: 'Constants and message padding'
    count: 5
  - name: 'The message schedule'
    count: 3
  - name: 'The compression function'
    count: 5
  - name: 'Full hashing and the capstone'
    count: 5
caveats:
  note: 'The finished program correctly hashes stdin, files, or a demo string via SHA-256 or HMAC-SHA256 using the from-scratch library, but it is an educational, non-constant-time implementation with no streaming API and no SHA-224/384/512 support.'
  future:
    - 'Add a streaming Writer-style API (New / Write / Sum) so large files can be hashed without loading them fully into memory'
    - 'Add a check mode to the CLI that verifies a file against an expected digest'
    - 'Implement SHA-224 and SHA-384/512 alongside SHA-256 to build out the full SHA-2 family'
    - 'Add HKDF (RFC 5869) on top of the existing HMAC function'
    - 'Add fuzz tests around padding and hashing for edge cases beyond the fixed vector suite'
    - 'Add benchmarks to quantify the performance gap versus a hardened, constant-time implementation'
resources:
  - title: 'FIPS 180-4: Secure Hash Standard (SHS)'
    author: 'National Institute of Standards and Technology'
    url: 'https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf'
    note: 'The authoritative specification. Section 4 defines the logical functions and constants, section 5 the padding and parsing, section 6.2 the SHA-256 algorithm - this project follows its structure and notation directly.'
  - title: 'RFC 6234: US Secure Hash Algorithms (SHA and SHA-based HMAC and HKDF)'
    author: 'Tony Hansen, Donald Eastlake'
    url: 'https://www.rfc-editor.org/rfc/rfc6234'
    note: 'The IETF companion to FIPS 180-4, with reference C code for the whole SHA family and HMAC. Handy when you want a second, cross-checkable statement of the same algorithm.'
  - title: 'SHA-2 (Wikipedia)'
    url: 'https://en.wikipedia.org/wiki/SHA-2'
    note: 'The "Pseudocode" section is a compact, readable statement of the initial values, round constants, message schedule, and compression loop - the fastest way to sanity-check an intermediate value against the spec.'
  - title: 'RFC 2104: HMAC - Keyed-Hashing for Message Authentication'
    author: 'Hugo Krawczyk, Mihir Bellare, Ran Canetti'
    url: 'https://www.rfc-editor.org/rfc/rfc2104'
    note: 'Defines HMAC in terms of any hash function - the inner and outer padding and the key handling the bonus lesson implements on top of your SHA-256.'
  - title: 'RFC 4231: Test Vectors for HMAC-SHA-224, HMAC-SHA-256, ...'
    author: 'Manoj Sethi, Steve Bellovin'
    url: 'https://www.rfc-editor.org/rfc/rfc4231'
    note: 'The official HMAC-SHA256 test vectors. The capstone and the HMAC lesson check against these exact values.'
  - title: 'Cryptography Engineering'
    author: 'Niels Ferguson, Bruce Schneier, Tadayoshi Kohno'
    note: 'Chapter 5 on hash functions covers the Merkle-Damgard construction, length-extension, and why a raw hash is not a message authentication code - the context that motivates HMAC and the caveats on this implementation.'
---

---
project: build-sha-256
lesson: 23
title: A multi-block vector and length extension
overview: Today you confirm a longer, two-block message against its official digest through the public API, then meet length extension - a real property of the Merkle-Damgard design that explains why a raw hash is not a message authentication code.
goal: Hash a two-block message end to end and match the published digest.
spec:
  scenario: The 56-byte multi-block vector
  status: failing
  lines:
    - kw: Given
      text: 'the 56-byte message "abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq" (which pads into two blocks)'
    - kw: When
      text: 'it is hashed with Sum256 through padding, blocking, and the compression loop'
    - kw: Then
      text: "Hex of it is \"248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1\""
    - kw: And
      text: 'this is a published NIST test vector, and hashing it exercises the full two-block chaining path end to end'
code:
  lang: go
  source: |
    msg := []byte("abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq")
    want := "248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1"
    // Hex(msg) == want
checkpoint: Your SHA-256 matches a multi-block NIST vector. Commit and stop here.
---

This 56-byte message is a published NIST test vector chosen precisely because it
crosses a block boundary: as you saw in lesson 11, 56 bytes forces padding into a
second block, so hashing it end to end exercises the full chaining path -
`Compress` running twice with the state threaded between. Matching its digest,
`248d6a61...19db06c1`, confirms your whole pipeline works on real multi-block
input, not just the single-block "abc".

The chaining that makes this work also has a famous consequence worth understanding:
**length extension**. Because the digest *is* the internal hash state after the last
block, anyone who knows `Sum256(message)` and the message's length can keep hashing
from that state, computing `Sum256(message || padding || extra)` **without knowing
the original message**. That is why you must never authenticate a message by hashing
a secret key in front of it (`Sum256(key || message)`) - an attacker can extend it.
The correct fix is **HMAC**, a keyed construction built on top of the hash, which is
exactly what the next lesson builds.

---
project: build-sha-256
lesson: 25
title: 'Capstone: the vector suite'
overview: The finale runs your SHA-256 and HMAC against the full set of official test vectors at once - empty, single-block, multi-block boundary, a natural-language string, and a keyed HMAC. Every layer you built has to agree for all of them to pass.
goal: Assert your implementation reproduces the published FIPS, NIST, and RFC vectors exactly.
spec:
  scenario: The whole vector suite passes
  status: failing
  lines:
    - kw: Given
      text: 'your finished Sum256 and HMAC'
    - kw: When
      text: 'they are run against the official vectors'
    - kw: Then
      text: "Hex(\"\") is \"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855\", Hex(\"abc\") is \"ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad\", and Hex of the 56-byte boundary message is \"248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1\""
    - kw: And
      text: "Hex(\"The quick brown fox jumps over the lazy dog\") is \"d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592\", and HMAC(\"Jefe\", \"what do ya want for nothing?\") is \"5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843\""
code:
  lang: go
  source: |
    cases := []struct{ in, want string }{
      {"", "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},
      {"abc", "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"},
      {"The quick brown fox jumps over the lazy dog",
       "d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592"},
    }
    // assert Hex(c.in) == c.want for each, plus the two-block and HMAC vectors
checkpoint: Your SHA-256 reproduces every official vector exactly. The project is complete; commit and stop here.
---

This is the promise the whole project was built to keep: a **SHA-256 that matches
the standard byte for byte**. The suite is chosen to leave nowhere to hide. The
empty string exercises pure padding; `"abc"` a single block; the 56-byte NIST
message the two-block chaining and the 448-mod-512 boundary that forces an extra
padding block; the pangram a natural-length input; and the HMAC vector proves the
keyed construction on top. Every one is a value published by NIST, the IETF, or in
FIPS 180-4 - none are self-generated, so passing them means your implementation
agrees with the world's.

Look back at what that took: modular addition, ROTR and SHR, Ch and Maj, the four
sigma functions, the initial hash values and round constants, padding and blocking,
the message schedule, and the 64-round compression with its feed-forward - all built
from first principles on fixed-width words, calling no crypto library. From adding
two words that wrap at `2^32`, you have reached a working hash function and the HMAC
that authenticates messages with it. It is an educational build, not a hardened one -
not constant-time, no side-channel defenses - but it is correct against the standard,
and it is entirely yours.

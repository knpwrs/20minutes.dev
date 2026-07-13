---
project: build-sha-256
lesson: 22
title: The empty-string vector
overview: The most important edge case for any hash is the empty input. Today you confirm your SHA-256 produces the official digest of the empty string - a message that is all padding and no data.
goal: Hash the empty message and match the published digest exactly.
spec:
  scenario: Hashing the empty string
  status: failing
  lines:
    - kw: Given
      text: 'the empty message (zero bytes)'
    - kw: When
      text: 'it is padded and hashed with Sum256'
    - kw: Then
      text: 'the padding is a single 64-byte block: 0x80 followed by 63 zero bytes (the length field is zero because there are zero bits)'
    - kw: And
      text: "Hex(\"\") is \"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855\""
code:
  lang: go
  source: |
    // no message bytes at all, yet padding still produces one full block
    got := Hex([]byte{})
    want := "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    // got == want
checkpoint: Your SHA-256 matches the official empty-string digest. Commit and stop here.
---

The empty string is the sharpest test of your padding, because there is no message
data at all - the entire block is padding. The rule still applies unchanged: append
the `0x80` marker, fill with zeros, and write a 64-bit length of `0` (zero bits).
That yields exactly one block: `0x80` followed by 63 zero bytes. A hash function
that mishandled the "no data" case would stumble here, which is why this vector is
the first thing to check.

You likely need no new code today - the `Pad` and `Sum256` you already built
generalize to the empty input on their own, and this lesson is the test that proves
it. The result, `e3b0c442...7852b855`, is probably the single most widely recognized
hash value in computing - it is what you get from `sha256sum` on an empty file, and
it shows up constantly as the "hash of nothing" sentinel. Matching it exactly
confirms your padding, compression, and serialization all behave correctly on the
degenerate input, which is strong evidence they are right on real ones too.

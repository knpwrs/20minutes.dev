---
project: build-an-http-client
lesson: 29
title: Base64 encoding
overview: Basic authentication puts credentials on the wire as base64, so first you need a base64 encoder. Today you build one from the alphabet up, including the padding rule for partial groups.
goal: Base64-encode bytes using the standard alphabet, padding partial groups with equals signs.
spec:
  scenario: Encoding bytes to base64
  status: failing
  lines:
    - kw: Given
      text: 'the bytes "foo"'
    - kw: When
      text: they are base64-encoded
    - kw: Then
      text: 'the result is "Zm9v" (three bytes become four base64 characters, no padding)'
    - kw: And
      text: 'partial groups are padded with "=" - "fo" gives "Zm8=" (one pad) and "f" gives "Zg==" (two pads)'
code:
  lang: go
  source: |
    // alphabet: A-Z a-z 0-9 + / . take input 3 bytes (24 bits) at a
    // time, split into 4 groups of 6 bits, index the alphabet.
    // a final group of 2 bytes -> 3 chars + "=", of 1 byte -> 2 chars + "==".
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
    func base64Encode(data []byte) string { /* 3-byte groups -> 4 chars */ }
checkpoint: You can base64-encode any bytes with correct padding. Commit and stop here.
---

**Base64** encodes arbitrary bytes as text using 64 printable characters, three
input bytes at a time. Twenty-four bits split evenly into **four groups of six
bits**, and each group indexes the alphabet `A-Z a-z 0-9 + /`. So `foo` (three
bytes) becomes exactly four characters, `Zm9v`, with nothing left over.

The wrinkle is the **last group**. When the input length is not a multiple of three,
you pad: two leftover bytes produce three characters plus one `=`, and one leftover
byte produces two characters plus `==`. That is why `fo` encodes to `Zm8=` and `f`
to `Zg==`. Getting the padding exactly right matters because the decoder on the
other end relies on it - and because the next lesson feeds it credentials that are
rarely a tidy multiple of three.

---
project: build-a-url-parser
lesson: 11
title: Percent-decoding
overview: URIs are limited to a small ASCII alphabet, so any other byte is written as a percent sign and two hex digits. Today you build the decoder that turns those escapes back into the bytes they stand for, and reject the malformed ones.
goal: Decode percent-escapes into bytes, accepting either case of hex and erroring on malformed input.
spec:
  scenario: Decoding percent-escapes
  status: failing
  lines:
    - kw: Given
      text: 'the strings "%20", "a%2Fb", and "a%2fb"'
    - kw: When
      text: 'each is percent-decoded'
    - kw: Then
      text: '"%20" decodes to a single space, and both "a%2Fb" and "a%2fb" decode to "a/b"'
    - kw: And
      text: 'decoding "%2" fails because the escape is truncated, and decoding "%zz" fails because z is not a hex digit'
code:
  lang: go
  source: |
    // '%' is followed by exactly two hex digits (0-9 a-f A-F)
    func PercentDecode(s string) (string, error) {
      // on '%': need two more chars, both hex; combine hi<<4 | lo
      // otherwise the byte is literal
    }
checkpoint: You can decode any well-formed percent-escaped string and reject broken ones. Commit and stop here.
---

A URI may only spell its components with a restricted set of ASCII characters, so every other byte - a space, a slash used as data, a non-ASCII UTF-8 byte - is written as a **percent-encoded** triplet: a `%` followed by two hexadecimal digits giving the byte's value. `%20` is the byte `0x20`, a space; `%2F` is `0x2F`, a slash. Decoding walks the string and, at each `%`, reads the next two characters as hex and emits the resulting byte; every other character passes through unchanged.

Two details make the decoder correct. First, the hex digits are **case-insensitive**: `%2F` and `%2f` both mean a slash, so your digit parser must accept `a`-`f` and `A`-`F` alike. Second, the escape can be malformed - a `%` at the end of the string with fewer than two characters after it (`%2`), or two characters that are not both hex (`%zz`). Those are not valid URIs, so decoding reports an error rather than guessing. Decoding to raw *bytes* (not characters) is deliberate: a multi-byte UTF-8 sequence is several escapes in a row, and you reassemble it byte by byte.

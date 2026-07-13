---
project: build-an-http-client
lesson: 6
title: Percent-decoding
overview: URLs carry characters that are not allowed literally - spaces, slashes inside a value - as percent-escapes like %20. Today you decode those escapes back into the bytes they stand for.
goal: Decode percent-escapes in a string, turning each %XX into the byte its two hex digits name.
spec:
  scenario: Decoding percent-escapes
  status: failing
  lines:
    - kw: Given
      text: 'the string "a%20b%2Fc"'
    - kw: When
      text: it is percent-decoded
    - kw: Then
      text: 'the result is "a b/c" (%20 is a space, %2F is a slash)'
    - kw: And
      text: 'decoding is case-insensitive in the hex digits - "%2f" and "%2F" both give "/", and a plain "abc" with no escapes is unchanged'
code:
  lang: go
  source: |
    // scan the string. on "%", read the next two characters as a
    // hex byte (0-9, a-f, A-F both cases) and emit that byte.
    // any other character is copied through unchanged.
    func unescape(s string) (string, error) {
      // walk the bytes; on '%' parse two hex digits into one byte
    }
checkpoint: You can decode percent-escapes back into their literal bytes. Commit and stop here.
---

A URL may only contain a limited set of characters, so anything outside that set -
a space, a slash that is part of a value rather than a separator, a non-ASCII byte -
is written as a **percent-escape**: a `%` followed by two hex digits naming the
byte. `%20` is a space, `%2F` is a `/`. **Percent-decoding** reverses this,
scanning for `%XX` and replacing each with the single byte it names.

The hex digits are **case-insensitive** - `%2f` and `%2F` both decode to `/` - so
your parser must accept both. Every other character passes through untouched, which
means a string with no escapes comes back exactly as it went in. This decoder is a
small workhorse: chapter five reuses it to decode query and form data, where the
same `%XX` rule applies.

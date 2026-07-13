---
project: build-an-http-server
lesson: 16
title: Percent-decode the path
overview: URLs escape spaces and special characters as %XX hex sequences, so the path on the wire is not the path on disk. Today you decode those escapes back into real bytes.
goal: Decode percent-escaped sequences in a path back into their literal characters.
spec:
  scenario: Decoding a percent-encoded path
  status: failing
  lines:
    - kw: Given
      text: 'the path "/a%20b/%7Euser"'
    - kw: When
      text: it is decoded
    - kw: Then
      text: 'the result is "/a b/~user"'
    - kw: And
      text: 'a path with no escapes like "/plain" is returned unchanged'
code:
  lang: go
  source: |
    // walk the string; on '%' read the next two hex digits as one byte
    b, err := strconv.ParseUint(path[i+1:i+3], 16, 8)
    // 0x20 -> ' ', 0x7E -> '~'
checkpoint: 'Percent-escapes in the path decode back to real bytes. Commit.'
---

A URL may only contain a limited set of characters, so anything outside it — a
space, a tilde, a slash you want treated as data — is written as `%` followed by
two hex digits giving the byte's value. `%20` is a space, `%7E` is `~`. The path
you route on and read files from must be the **decoded** form, or `/a%20b` will
never match the file `a b`.

Walk the string, copying ordinary characters straight through; when you hit `%`,
read the next two characters as a hex byte and emit it. A path with no `%` comes
out identical, which is the common case and a good check that you are not
corrupting anything.

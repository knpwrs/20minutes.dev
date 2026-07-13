---
project: build-an-http-client
lesson: 31
title: Form component encoding
overview: Form data uses a percent-encoding of its own, where a space becomes a plus. Today you build the form component encoder - a close cousin of the URL escaper from chapter one, with different space handling.
goal: Encode a string for application/x-www-form-urlencoded, turning spaces into plus signs.
spec:
  scenario: Encoding one form value
  status: failing
  lines:
    - kw: Given
      text: 'the string "a b&c"'
    - kw: When
      text: it is form-encoded
    - kw: Then
      text: 'the result is "a+b%26c" (space becomes "+", "&" becomes "%26")'
    - kw: And
      text: 'the unreserved characters A-Z a-z 0-9 - _ . ~ pass through unchanged'
code:
  lang: go
  source: |
    // like the URL escaper, but space -> "+" instead of "%20".
    // unreserved (A-Z a-z 0-9 - _ . ~) pass through; every other
    // byte -> "%XX" uppercase; a space specifically -> "+".
    func formEscape(s string) string {
      // for each byte: unreserved copy; space -> '+'; else %XX
    }
checkpoint: You can encode a single value in the form-urlencoded style, spaces as plus. Commit and stop here.
---

HTML forms post their data as **application/x-www-form-urlencoded**, a variant of
percent-encoding with one notable difference: a **space becomes `+`**, not `%20`.
Everything else follows the familiar rule - the unreserved characters pass through,
and any other byte (including `&` and `=`, which separate the pairs) becomes `%XX`.
So `a b&c` encodes to `a+b%26c`: the space is a `+`, the ampersand is `%26`.

This is deliberately the close cousin of the URL escaper from chapter one - same
unreserved set, same `%XX` fallback, only the space differs. Escaping `&` and `=` is
what keeps them from being mistaken for the separators between pairs, which is the
whole point of the encoding once you assemble multiple values, next.

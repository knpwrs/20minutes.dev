---
project: build-an-http-client
lesson: 32
title: Encode a set of pairs
overview: A form body is many key-value pairs joined together. Today you encode an ordered set of pairs into the full body string, each side escaped and the pairs joined by ampersands.
goal: Encode an ordered list of key-value pairs into a form-urlencoded body string.
spec:
  scenario: Encoding a full form body
  status: failing
  lines:
    - kw: Given
      text: 'the ordered pairs (q, "a b") and (lang, "en")'
    - kw: When
      text: they are encoded as a form body
    - kw: Then
      text: 'the result is "q=a+b&lang=en" (each key and value form-encoded, joined by "=", pairs joined by "&")'
    - kw: And
      text: 'the pairs keep the given order, so the output is deterministic'
code:
  lang: go
  source: |
    // for each pair: formEscape(key) + "=" + formEscape(value).
    // join the pairs with "&". keep the caller's order (use an
    // ordered list, not a map) so the bytes are deterministic.
    type Pair struct { Key, Value string }
    func encodeForm(pairs []Pair) string { /* join "k=v" with "&" */ }
checkpoint: You can encode an ordered set of pairs into a form body. Commit and stop here.
---

A form body is a run of `key=value` pairs joined by `&`, each key and value
individually **form-encoded**. The pairs `(q, "a b")` and `(lang, "en")` become
`q=a+b&lang=en` - the space in the value is a `+`, the `=` between key and value and
the `&` between pairs are the structural separators (which is why any literal `=` or
`&` inside a value gets escaped to `%3D` or `%26`).

Keep the pairs in an **ordered list**, not a map, so the output is deterministic -
the same input always produces the same bytes, exactly as you did with sorted
headers in chapter two. Deterministic form bodies are what make the request tests
exact. This is the encoder; reading a form body back into pairs is the decoder,
next, and it doubles as the URL query parser you deferred in chapter one.

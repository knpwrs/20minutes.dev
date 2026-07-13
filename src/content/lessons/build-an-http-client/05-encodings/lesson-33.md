---
project: build-an-http-client
lesson: 33
title: Decode a form body
overview: Reading form data is the inverse - split a body into pairs and decode each side. The same grammar parses a URL query string, so today you also finish the query parsing you deferred in chapter one.
goal: Parse a form-urlencoded string into ordered pairs, decoding plus to space and percent-escapes to bytes.
spec:
  scenario: Decoding a form body into pairs
  status: failing
  lines:
    - kw: Given
      text: 'the string "q=a+b&x=&y"'
    - kw: When
      text: it is parsed into pairs
    - kw: Then
      text: 'the pairs are (q, "a b"), (x, ""), and (y, "") - "+" decodes to a space, an empty value stays empty, and a bare key gets an empty value'
    - kw: And
      text: 'this is the same grammar as a URL query string, so the raw query kept in chapter one parses the same way'
code:
  lang: go
  source: |
    // split on "&" into pairs, then each pair on the FIRST "=".
    // decode both sides: "+" -> space, then percent-decode.
    // a pair with no "=" is a key with an empty value.
    func parseForm(s string) []Pair {
      // split "&"; split each on first "="; decode key and value
    }
checkpoint: You can decode a form body or URL query into ordered key-value pairs. Commit and stop here.
---

Decoding reverses the last two lessons: split the body on `&` into pairs, split each
pair on its **first `=`** into key and value, then decode both sides - `+` back to a
space, then percent-decode the `%XX` escapes with the decoder from chapter one. So
`q=a+b&x=&y` yields `(q, "a b")`, `(x, "")`, and `(y, "")`: a normal pair, an empty
value, and a bare key that gets an empty value.

Because a **URL query string uses this exact grammar**, this same parser finishes the
job you left open in chapter one, where the query was kept raw. Feed a URL's raw
query through `parseForm` and you get its parameters as pairs. One decoder serves
both form bodies and query strings, which is the tidy symmetry the form encoding was
designed around. Next you use the encoder to build a real form post.

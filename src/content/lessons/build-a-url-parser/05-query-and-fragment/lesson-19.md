---
project: build-a-url-parser
lesson: 19
title: Parsing the query into pairs
overview: The query string is opaque to the URI grammar, but by web convention it is a list of key/value pairs. Today you parse that convention, splitting a query into an ordered list of pairs.
goal: Split a query string into an ordered list of key/value pairs.
spec:
  scenario: Query into key/value pairs
  status: failing
  lines:
    - kw: Given
      text: 'the query strings "a=1&b=2" and "k"'
    - kw: When
      text: 'each is parsed into pairs'
    - kw: Then
      text: '"a=1&b=2" yields the pairs (a, 1) and (b, 2) in that order'
    - kw: And
      text: '"k" yields a single pair (k, "") because a key with no equals sign has an empty value'
code:
  lang: go
  source: |
    type Pair struct { Key, Value string }
    // split on '&' into fields; split each field on the FIRST '='
    // a field with no '=' is a key with an empty value
    func ParseQuery(q string) []Pair { /* ... */ }
checkpoint: ParseQuery turns a query string into an ordered list of key/value pairs. Commit and stop here.
---

To the URI grammar the **query** is just an opaque string after the `?`, but nearly every web application reads it with the same convention: a list of `key=value` pairs joined by `&`. Parsing it means splitting the query on `&` into fields, then splitting each field on its **first** `=` into a key and a value. Splitting on the first `=` (not every `=`) matters because a value may legitimately contain one, as in `redirect=/a=b`.

Order is preserved and duplicates are kept - the query is a *list*, not a map, because `a=1&a=2` is meaningful and the same key can repeat. A field with no `=` at all, like `k`, is a key with an empty value: the flag-style parameter. Returning a slice of pairs rather than a map keeps both order and repetition, matching how real query strings behave. Today the keys and values are still in their raw, percent-encoded form; the next lesson decodes each part, including the web's peculiar treatment of `+`.

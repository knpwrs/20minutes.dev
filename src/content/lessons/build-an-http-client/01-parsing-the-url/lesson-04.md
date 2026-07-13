---
project: build-an-http-client
lesson: 4
title: The query string
overview: The path can be followed by a question mark and a query string - the key-value data a request carries in its URL. Today you split the raw query off the path, keeping it verbatim for now; a later lesson decodes it into pairs.
goal: Split the query string off the path at the first question mark, keeping the raw query.
spec:
  scenario: Separating the query from the path
  status: failing
  lines:
    - kw: Given
      text: 'the URL string "http://example.com/search?q=cats&n=10"'
    - kw: When
      text: it is parsed
    - kw: Then
      text: 'the URL has path "/search" and rawQuery "q=cats&n=10"'
    - kw: And
      text: 'parsing "http://example.com/a" (no query) gives path "/a" and rawQuery "" (empty)'
code:
  lang: go
  source: |
    // the query is everything after the first "?" in the path portion.
    // the "?" itself is the separator and belongs to neither side.
    // keep the query text raw for now; decoding into pairs comes later.
    func Parse(raw string) (*URL, error) {
      // split the path on the first "?" into Path and RawQuery
    }
checkpoint: A parsed URL now separates its path from a raw query string. Commit and stop here.
---

A path can be followed by a `?` and a **query string** - the part of a URL that
carries key-value parameters, like `q=cats&n=10` in a search request. The `?` marks
the boundary: everything before it is the path, everything after it is the query,
and the `?` itself belongs to neither.

Today you only need to *split* the two apart and keep the query **raw** - the exact
text between the `?` and the end (or the `#` fragment, next lesson). Decoding it
into `q -> cats`, `n -> 10` pairs is a job for chapter five, which reuses the same
form-decoding it builds there. When there is no `?` at all, the raw query is simply
empty.

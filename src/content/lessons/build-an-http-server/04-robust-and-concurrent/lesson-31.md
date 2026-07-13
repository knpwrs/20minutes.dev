---
project: build-an-http-server
lesson: 31
title: Parse query parameters
overview: The query string carries a handler's inputs as key=value pairs. Today you decode it into a lookup so a handler can read parameters like q and page.
goal: Parse a raw query string into named parameters a handler can read.
spec:
  scenario: Decoding the query string
  status: failing
  lines:
    - kw: Given
      text: 'the raw query "q=cats&n=2"'
    - kw: When
      text: it is parsed
    - kw: Then
      text: 'the parameter "q" is "cats" and "n" is "2"'
    - kw: And
      text: 'a parameter that was not present, like "missing", reads as the empty string'
code:
  lang: go
  source: |
    params := map[string]string{}
    for _, pair := range strings.Split(rawQuery, "&") {
        if pair == "" { continue }
        k, v, _ := strings.Cut(pair, "=") // "a=b" -> "a","b"; "a" -> "a",""
        params[k] = v
    }
checkpoint: 'The query string parses into named parameters a handler can read. Commit.'
---

Back in the parsing chapter you split the raw query string off the target but left
it as one opaque string. Handlers need it broken up: a query like `q=cats&n=2` is
a set of **key=value pairs** joined by `&`, and a search handler wants `q` and `n`
individually.

Split on `&`, then split each pair on its first `=`. A pair with no `=` (`flag`)
has an empty value; an absent key reads back empty, mirroring how `Headers.Get`
behaves. Now a handler can offer real behavior — search, pagination, filtering —
driven by the URL.

---
project: build-a-url-parser
lesson: 16
title: Case normalization
overview: Two URIs that differ only in letter case for the scheme or host are equivalent, so normalization lowercases them. Today you start the Normalize function with case folding, the first of three syntax-based normalization rules.
goal: Normalize a URI by lowercasing its scheme and host.
spec:
  scenario: Lowercasing scheme and host
  status: failing
  lines:
    - kw: Given
      text: 'the input "HTTP://EXAMPLE.COM/Path"'
    - kw: When
      text: 'it is parsed and then normalized'
    - kw: Then
      text: 'the normalized URI has Scheme "http" and Host "example.com"'
    - kw: And
      text: 'Path keeps its original case as "/Path", since only the scheme and host are case-insensitive'
code:
  lang: go
  source: |
    // scheme and host are case-insensitive; lowercase them.
    // path, query, fragment are case-SENSITIVE - leave them alone.
    func Normalize(u *URI) *URI {
      out := *u
      out.Scheme = strings.ToLower(out.Scheme)
      out.Host = strings.ToLower(out.Host)
      return &out
    }
checkpoint: Normalize now case-folds the scheme and host. Commit and stop here.
---

Two URIs can be spelled differently yet identify the same resource, and **syntax-based normalization** is the process of rewriting a URI into a canonical form so such equivalences become plain string equality. RFC 3986 Section 6.2.2 lists the safe transformations that never change meaning, and the simplest is **case normalization**. The scheme and the host are defined to be case-insensitive, so `HTTP` and `http`, `EXAMPLE.COM` and `example.com`, are the same - normalization lowercases both.

The discipline is knowing what *not* to touch. The path, query, and fragment are case-sensitive: `/Path` and `/path` may be different resources, so `Normalize` must leave their case exactly as parsed. Only the scheme and host get folded. `Normalize` returns a new URI so the original stays intact, and today it changes just those two fields - the next two lessons add the other two normalization rules on top of this same function before the resolution chapter recomposes a URI back into a string.

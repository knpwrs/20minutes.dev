---
project: build-a-url-parser
lesson: 21
title: Recomposing a URI into a string
overview: Parsing takes a string apart; today you do the reverse, reassembling the five components back into a URI string. This recomposition is what lets you print a resolved reference, and it is where the present-versus-absent flags finally pay off.
goal: Recompose a URI's components back into a string, following RFC 3986 Section 5.3.
spec:
  scenario: Component recomposition
  status: failing
  lines:
    - kw: Given
      text: 'the URI parsed from "http://a/b/c/d;p?q"'
    - kw: When
      text: 'it is recomposed with String'
    - kw: Then
      text: 'the result is exactly "http://a/b/c/d;p?q"'
    - kw: And
      text: 'Parse("p?").String() is "p?" and Parse("path#").String() is "path#", because an empty-but-present query or fragment still writes its delimiter'
code:
  lang: go
  source: |
    // RFC 3986 5.3: put back each delimiter only if the part is present
    func (u *URI) String() string {
      // scheme + ":" if scheme != ""
      // "//" + authority if HasAuthority
      // path
      // "?" + query if HasQuery
      // "#" + fragment if HasFragment
    }
checkpoint: A URI recomposes back into the exact string it was parsed from. Commit and stop here.
---

Recomposition is the inverse of the Chapter 1 split, and RFC 3986 Section 5.3 spells out the exact procedure: write the scheme and its colon if there is a scheme, then `//` and the authority if there is an authority, then the path, then `?` and the query if there is a query, then `#` and the fragment if there is a fragment. Reassembled in that order, a parsed URI round-trips back to its original text.

This is where the `Has...` booleans earn their keep. The delimiter is written based on **presence**, not on whether the string is non-empty: `p?` has an empty but present query, so recomposition must emit the `?`, and `path#` must emit the trailing `#`. If you tested `Query != ""` instead of `HasQuery`, both delimiters would vanish and the round-trip would break. Getting recomposition exact matters immediately, because reference resolution produces a new URI as five components and the only way to read out an absolute URL - the thing the whole project builds toward - is to recompose it into a string.

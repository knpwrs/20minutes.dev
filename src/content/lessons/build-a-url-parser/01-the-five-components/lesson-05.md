---
project: build-a-url-parser
lesson: 5
title: The query, and the full five-way split
overview: The last delimiter is the question mark that introduces the query. Adding it completes the generic-syntax split, so today you finish Parse and prove it by taking a complete URL apart into all five components at once.
goal: Split off the query and confirm the full five-component split on a complete URL.
spec:
  scenario: The complete split
  status: failing
  lines:
    - kw: Given
      text: 'the input "http://user@a:8080/b/c?q=1#frag"'
    - kw: When
      text: 'Parse is called'
    - kw: Then
      text: 'Scheme is "http", Authority is "user@a:8080", Path is "/b/c", Query is "q=1", and Fragment is "frag"'
    - kw: And
      text: 'Parse("http://a/b?") has HasQuery true with Query "", and Parse("http://a/b") has HasQuery false'
code:
  lang: go
  source: |
    // the query is between the first '?' and the fragment
    // (the fragment was already removed last lesson)
    if i := strings.IndexByte(rest, '?'); i >= 0 {
      u.Query = rest[i+1:]
      u.HasQuery = true
      rest = rest[:i]
    }
    u.Path = rest // whatever survives is the path
checkpoint: Parse splits any URI into all five components. The first chapter is done - commit and stop here.
---

The **query** carries parameters after a `?`. It sits between the path and the fragment, so once the fragment is gone (you stripped it last lesson) the query is simply everything after the first `?` in what remains. Split it off the same way, set `HasQuery` so an empty `?` query stays distinct from no query, and whatever is left is the **path** - the one component that is always present, even if only as an empty string.

That completes the RFC 3986 generic-syntax split: scheme, authority, path, query, fragment, found by locating each delimiter in turn. This is exactly the decomposition the specification captures in its Appendix B regular expression, built here one boundary at a time so each rule is visible. Run it on a fully loaded URL and every component lands in its field. The path may still be relative or absolute, the authority is still one opaque string, and nothing is decoded yet - but the skeleton is complete, and every remaining chapter refines one of these five slots.

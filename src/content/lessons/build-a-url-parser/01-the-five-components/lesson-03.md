---
project: build-a-url-parser
lesson: 3
title: Splitting off the authority
overview: After the scheme, a URI may carry an authority - the host part, introduced by a double slash. Today you recognize that // marker and slice the authority out, distinguishing it from a plain absolute path that starts with a single slash.
goal: Recognize the // marker and split the authority from the path that follows it.
spec:
  scenario: Detecting the authority
  status: failing
  lines:
    - kw: Given
      text: 'the input "//example.com/over/there"'
    - kw: When
      text: 'Parse is called'
    - kw: Then
      text: 'HasAuthority is true, Authority is "example.com", and Path is "/over/there"'
    - kw: And
      text: 'Parse("/over/there") has HasAuthority false and Path "/over/there", because a single leading slash is a path, not an authority'
code:
  lang: go
  source: |
    // after the scheme, if what remains begins with "//",
    // the authority runs up to the next '/', '?', or '#'
    if strings.HasPrefix(rest, "//") {
      rest = rest[2:]
      j := strings.IndexAny(rest, "/?#")
      // j < 0 means the authority is the whole remainder
      u.HasAuthority = true
    }
checkpoint: Parse now extracts the authority when the URI has one. Commit and stop here.
---

The **authority** is the part that names *who* or *where* - typically a host, sometimes with a user and a port. RFC 3986 introduces it with a literal double slash `//` right after the scheme's colon (or at the very start, for a scheme-relative reference). Everything from just after the `//` up to the next `/`, `?`, or `#` is the authority; that following slash, if present, begins the path. If there is no such delimiter, the authority is the entire remainder and the path is empty.

The single-slash case is the trap. `//example.com/p` has an authority, but `/p` is just an absolute path with no authority at all - the double slash is what makes the difference. That distinction is real and load-bearing: later, resolving a reference like `//g` against a base means "keep the scheme but replace the authority", which only works because you can tell an authority-bearing reference from a path-only one. Store the raw authority string for now; breaking it into userinfo, host, and port is the next chapter's work.

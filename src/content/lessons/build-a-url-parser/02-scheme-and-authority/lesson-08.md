---
project: build-a-url-parser
lesson: 8
title: Separating the port
overview: The last piece of the authority is the optional port after a colon. Today you split it off the end of the host, again tracking present-but-empty, which sets up the one tricky case the next lesson has to handle.
goal: Split an optional port off the end of the host on the last colon.
spec:
  scenario: Host and port
  status: failing
  lines:
    - kw: Given
      text: 'the input "//example.com:8080/path"'
    - kw: When
      text: 'Parse is called'
    - kw: Then
      text: 'Host is "example.com", HasPort is true, and Port is "8080"'
    - kw: And
      text: 'Parse("//example.com:") has HasPort true with Port "", and Parse("//example.com") has HasPort false'
code:
  lang: go
  source: |
    // after userinfo is gone, a ':' introduces the port
    if i := strings.LastIndexByte(a, ':'); i >= 0 {
      u.Host = a[:i]
      u.Port = a[i+1:]
      u.HasPort = true
    } else {
      u.Host = a
    }
checkpoint: parseAuthority now separates host and port. Commit and stop here.
---

The **port** is a decimal number after the host, introduced by a colon: `example.com:8080`. Once the userinfo is stripped, whatever remains is `host` optionally followed by `:port`, so split on the colon - the host is before it, the port after. As with every optional piece, `example.com:` (a trailing colon with no digits) is an empty-but-present port, distinct from `example.com` with no port, so set `HasPort` the instant you see the colon.

Splitting on the colon works cleanly here because a plain registered name or IPv4 host contains no colons of its own. That is about to change. An IPv6 address is written with colons inside it - `::1` - so a naive "split on the colon" would mistake part of the address for a port. RFC 3986 solves this by wrapping IPv6 hosts in square brackets, and the next lesson teaches the parser to look for the closing bracket before it goes hunting for a port colon. For now, splitting on the last colon is the right rule for the hosts you have.

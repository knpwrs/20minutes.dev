---
project: build-a-url-parser
lesson: 9
title: IPv6 hosts in brackets
overview: An IPv6 address is full of colons, so RFC 3986 wraps it in square brackets to keep those colons from being read as a port separator. Today you handle the bracketed host and only look for a port after the closing bracket.
goal: Parse a bracketed IPv6 host and find the port only after the closing bracket.
spec:
  scenario: A bracketed IPv6 host with a port
  status: failing
  lines:
    - kw: Given
      text: 'the input "//[2001:db8::1]:443/p"'
    - kw: When
      text: 'Parse is called'
    - kw: Then
      text: 'Host is "[2001:db8::1]", HasPort is true, and Port is "443"'
    - kw: And
      text: 'Parse("//[::1]") has Host "[::1]" and HasPort false, with none of the inner colons taken as a port'
code:
  lang: go
  source: |
    // if the host starts with '[', the host runs THROUGH the ']';
    // only a ':' AFTER the bracket is a port
    if strings.HasPrefix(a, "[") {
      j := strings.IndexByte(a, ']')
      u.Host = a[:j+1]
      rest := a[j+1:]
      if strings.HasPrefix(rest, ":") { u.Port = rest[1:]; u.HasPort = true }
      return
    }
checkpoint: parseAuthority handles IPv6 literals without mistaking their colons for a port. Commit and stop here.
---

An **IPv6 address** like `2001:db8::1` uses colons as its own separators, which collides head-on with the `host:port` colon. RFC 3986 resolves the ambiguity with an **IP-literal** form: the address goes inside square brackets, `[2001:db8::1]`, and the brackets are part of the host as the parser sees it. Because the whole address is bracketed, none of its internal colons can be confused with the port delimiter.

So when the host portion begins with `[`, scan to the closing `]` and take everything up to and including it as the host. Only a colon *after* that bracket introduces a port. This is why last lesson's "split on the last colon" was not the final rule: for `[2001:db8::1]:443` the last colon is inside the address, and splitting there would be wrong. Checking for the bracket first, and searching for the port colon only in the tail after `]`, is what makes both the plain-host and IPv6 cases come out right. The keeps-the-brackets choice also means recomposing the URI later just writes the host back verbatim.

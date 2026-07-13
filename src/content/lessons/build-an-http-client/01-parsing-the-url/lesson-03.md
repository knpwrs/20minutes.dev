---
project: build-an-http-client
lesson: 3
title: Ports and defaults
overview: A host names a machine, but a connection needs a port too. Today you read an explicit port when the URL gives one and fall back to the scheme's default when it does not - 80 for http, 443 for https.
goal: Parse an explicit port from the host, or supply the scheme's default port when none is given.
spec:
  scenario: Resolving the port
  status: failing
  lines:
    - kw: Given
      text: 'the URL string "http://example.com:8080/a"'
    - kw: When
      text: it is parsed
    - kw: Then
      text: 'the URL has host "example.com" and port 8080'
    - kw: And
      text: 'parsing "http://example.com/a" gives port 80, and parsing "https://example.com/a" gives port 443'
code:
  lang: go
  source: |
    // the authority may be "host" or "host:port". if a ":" is present,
    // the part after it is the port. otherwise pick the default:
    //   http  -> 80
    //   https -> 443
    func defaultPort(scheme string) int {
      // return 80 or 443 based on the scheme
    }
checkpoint: Every parsed URL now has a concrete port, explicit or defaulted. Commit and stop here.
---

To open a connection you need a host *and* a **port**. The URL may state one
explicitly as `host:port` - `example.com:8080` means port `8080` - and when it
does, the host is just the part before the colon. When the URL gives no port, the
**scheme's default** applies: `80` for `http`, `443` for `https`. A browser hides
this from you, but a client has to make the default concrete before it can dial.

Pin both cases now: an explicit port must be parsed as a number and split cleanly
off the host, and each scheme must resolve to the right default. From here on every
URL carries a real port, so nothing downstream has to guess.

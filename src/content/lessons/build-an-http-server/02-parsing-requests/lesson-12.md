---
project: build-an-http-server
lesson: 12
title: Require a Host header
overview: HTTP/1.1 makes the Host header mandatory - it is how one server tells apart the many sites it may host. Today you reject a 1.1 request that omits it, the first real protocol rule your parser enforces.
goal: Report an error when an HTTP/1.1 request has no Host header, and accept it when Host is present.
spec:
  scenario: Enforcing the Host requirement
  status: failing
  lines:
    - kw: Given
      text: 'an HTTP/1.1 request with headers {"Accept": "*/*"} and no Host'
    - kw: When
      text: it is validated
    - kw: Then
      text: it is reported as an error
    - kw: And
      text: 'the same request with "Host: example.com" added validates successfully'
code:
  lang: go
  source: |
    if version == "HTTP/1.1" && headers.Get("Host") == "" {
        return errors.New("missing Host header")
    }
checkpoint: 'An HTTP/1.1 request without Host is rejected. Commit.'
---

HTTP/1.1 introduced **virtual hosting**: one IP address and port can serve many
different websites, and the `Host` header is how the client says which one it
wants. Because of that the spec makes `Host` **mandatory** for 1.1 — a request
without it is malformed, no matter how well-formed everything else is.

This is your parser's first semantic rule, as opposed to pure syntax. Checking it
now means the server can answer a hostless request with a clean `400` later
instead of guessing. Lean on the case-insensitive `Get` you just built — clients
capitalize `Host` every possible way.

---
project: build-an-http-client
lesson: 11
title: The Host header
overview: HTTP/1.1 requires every request to name its host in a Host header, because one server can host many sites. Today you derive that header automatically from the URL, including the port when it is not the default.
goal: Set the Host header on a request from its URL, appending the port only when it is not the scheme default.
spec:
  scenario: Deriving the Host header
  status: failing
  lines:
    - kw: Given
      text: 'a request whose URL is parsed from "http://example.com/a"'
    - kw: When
      text: its Host header is derived
    - kw: Then
      text: 'the Host header is "example.com" (port 80 is the http default, so it is omitted)'
    - kw: And
      text: 'a URL of "http://example.com:8080/a" gives Host "example.com:8080" (non-default port included)'
code:
  lang: go
  source: |
    // Host is the URL host, plus ":port" ONLY when the port is not
    // the scheme default (80 for http, 443 for https).
    func (r *Request) setHost() {
      // if port == defaultPort(scheme): Host = host
      // else: Host = host + ":" + port
    }
checkpoint: A request derives a correct Host header, with the port shown only when non-default. Commit and stop here.
---

In HTTP/1.1 the **Host header is mandatory** - a single IP address can serve many
different sites (virtual hosting), so the request must state which host it means.
The value comes straight from the URL you parsed: the host name, and the port *only
when it differs from the scheme's default*. `http://example.com` sends
`Host: example.com` because port 80 is implied; `http://example.com:8080` sends
`Host: example.com:8080` because 8080 is not.

This is the first header the client sets on its own rather than the caller setting
it, and the rule - omit the default port, include an explicit one - is exactly the
port defaulting you built in chapter one, now running in reverse. With Host in the
collection, a request is nearly ready to serialize whole.

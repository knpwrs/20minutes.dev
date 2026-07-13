---
project: build-an-http-server
lesson: 34
title: Honor Connection close
overview: A client can ask the server to close the connection after one response by sending Connection close. Today you honor that request, the counterpart to the keep-alive loop.
goal: Close the connection after responding when the request asks for Connection close, and echo that intent in the response.
spec:
  scenario: A client requests connection close
  status: failing
  lines:
    - kw: Given
      text: 'a request with header "Connection: close"'
    - kw: When
      text: the server responds
    - kw: Then
      text: 'the response includes header "Connection: close"'
    - kw: And
      text: the server closes the connection instead of looping for another request
code:
  lang: go
  source: |
    resp := handle(req)
    if strings.EqualFold(req.Headers.Get("Connection"), "close") {
        resp.Headers["Connection"] = "close"
        conn.Write(resp.serialize())
        return // break out of the keep-alive loop
    }
checkpoint: 'The server honors Connection: close and hangs up after responding. Commit.'
---

Persistence is the default, but a client can opt out per request with
**`Connection: close`** — "answer this one, then hang up." A server must honor it:
send the response, mark the response with `Connection: close` too so the client
knows the socket is going away, and then break out of the keep-alive loop and
close.

This is the mirror of the previous lesson. Together they give the connection a
clear lifetime: loop while both sides want to continue, close the moment either
side signals it is finished. Checking the header case-insensitively matters — the
value, like the name, arrives capitalized every which way.

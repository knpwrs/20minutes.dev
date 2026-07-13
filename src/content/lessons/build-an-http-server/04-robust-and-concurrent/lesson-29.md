---
project: build-an-http-server
lesson: 29
title: Return 400 on a malformed request
overview: Not every client sends valid HTTP, and a broken request should get a clean 400 rather than a dropped connection. Today you turn the parse errors you have been raising into a real response.
goal: Respond with 400 Bad Request when the request cannot be parsed.
spec:
  scenario: The server rejects a malformed request
  status: failing
  lines:
    - kw: Given
      text: 'the server receives "GET /\r\n\r\n" (a request line with only two tokens)'
    - kw: When
      text: it fails to parse the request
    - kw: Then
      text: 'it responds with "HTTP/1.1 400 Bad Request"'
code:
  lang: go
  source: |
    req, err := parseRequest(r)
    if err != nil {
        conn.Write(Response{Status: 400, Body: []byte("Bad Request")}.serialize())
        return
    }
checkpoint: 'A malformed request gets a well-formed 400 instead of a dropped connection. Commit.'
---

Your parser has been returning errors since chapter two — a request line without
three tokens, a missing `Host`, a bad header — but the connection loop ignored
them. Now it handles them: a parse error becomes a **`400 Bad Request`** response
instead of a crash or a hang.

This is the server's contract with the outside world. The internet is full of
malformed and malicious input, and answering it with a well-formed `400` (rather
than dropping the connection) is what separates a robust server from a fragile
one. Every guard you built earlier now has a visible effect.

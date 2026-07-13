---
project: build-an-http-server
lesson: 22
title: Send a real response
overview: The hand-built reply bytes finally retire - today the connection loop serializes a real Response, so the server speaks proper HTTP with headers and a correct length.
goal: Have the connection loop build a Response and write its serialized form to the client.
spec:
  scenario: The server sends a serialized Response
  status: failing
  lines:
    - kw: Given
      text: the server receives any valid request
    - kw: When
      text: it responds
    - kw: Then
      text: 'the response is "HTTP/1.1 200 OK\r\nContent-Length: 13\r\nContent-Type: text/plain\r\n\r\nHello, world!" (headers serialize in sorted order, so Content-Length comes before Content-Type)'
code:
  lang: go
  source: |
    resp := Response{
        Status:  200,
        Headers: map[string]string{"Content-Type": "text/plain"},
        Body:    []byte("Hello, world!"),
    }
    conn.Write(resp.serialize()) // Content-Length is filled in for you
checkpoint: 'curl -v shows a proper HTTP/1.1 response with headers and a matching Content-Length. Commit.'
---

Everything the chapter built now runs live. The connection loop stops
concatenating strings by hand and instead constructs a `Response` and calls
`serialize`. The `Content-Length` is computed, the status line is looked up, the
headers are formatted — the server emits fully correct HTTP.

`curl -v` against it now shows real response headers, and a browser renders the
body. From here the body and status stop being constant: the next lessons pick
them based on the request, which is what a web server actually does.

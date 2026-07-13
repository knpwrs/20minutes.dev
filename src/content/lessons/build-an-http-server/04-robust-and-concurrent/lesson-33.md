---
project: build-an-http-server
lesson: 33
title: Keep the connection alive
overview: HTTP/1.1 connections are persistent - a client can send several requests down one connection. Today you loop on a connection, answering request after request instead of closing after one.
goal: Read and answer multiple requests on a single connection until the client stops sending.
spec:
  scenario: Two requests on one connection
  status: failing
  lines:
    - kw: Given
      text: 'one connection on which the client sends two complete GET "/" requests back to back'
    - kw: When
      text: the server handles the connection
    - kw: Then
      text: it sends two responses on that same connection, one per request
    - kw: And
      text: it closes the connection only when the client stops sending (the reader reaches end of input)
code:
  lang: go
  source: |
    r := bufio.NewReader(conn)
    for {
        req, err := parseRequest(r)
        if err == io.EOF { break } // client closed; nothing more to read
        conn.Write(handle(req).serialize())
    }
checkpoint: 'The server answers several requests on one persistent connection. Commit.'
---

Under HTTP/1.1 a connection is **persistent by default**: opening a fresh TCP
connection per request is wasteful, so a client sends several requests down the
same one and reads back several responses in order. Your handler must therefore
**loop**, parsing and answering requests until the client is done.

The loop ends when the reader hits end of input — the client closed its side —
which surfaces as an EOF from the parser. Because you always wrote an accurate
`Content-Length`, each response's boundary is unambiguous, so the next request
starts cleanly right after the previous body.

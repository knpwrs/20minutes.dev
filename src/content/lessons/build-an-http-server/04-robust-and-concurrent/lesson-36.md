---
project: build-an-http-server
lesson: 36
title: Log every request
overview: A server you can operate is a server you can see, so today you add an access log line for every request. It is the finishing touch on a real, runnable HTTP server.
goal: Write a log line recording the method, path, and status of every request the server handles.
spec:
  scenario: Logging a handled request
  status: failing
  lines:
    - kw: Given
      text: 'the server handles GET "/index.html" and responds with status 200'
    - kw: When
      text: the request completes
    - kw: Then
      text: 'a log line containing "GET /index.html 200" is written'
code:
  lang: go
  source: |
    resp := handle(req)
    log.Printf("%s %s %d", req.Method, req.Path, resp.Status)
    conn.Write(resp.serialize())
checkpoint: 'Your server logs every request it handles - run it and watch the access log. Commit; the project is complete.'
---

An **access log** is how you know what your server is doing: one line per request
with the method, the path, and the status it returned. `GET /index.html 200`,
`POST /submit 405`, `GET /nope 404` — the shape every web server's log shares.
Emit it right after computing the response, so the status is known.

That completes the project: a concurrent HTTP/1.1 server that parses requests,
routes them, serves static files with correct content types, keeps connections
alive, handles the common error codes, and logs what it does. Run it, point a
browser or `curl` at it, and watch the log fill up — then keep extending it.

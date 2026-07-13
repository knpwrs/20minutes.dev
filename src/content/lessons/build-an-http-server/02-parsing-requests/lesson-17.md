---
project: build-an-http-server
lesson: 17
title: Serve the parsed request
overview: Your server still replies with hard-coded bytes - today you feed it the real parser so the handler sees a Request and its response reflects what was actually asked for.
goal: Wire the request parser into the connection loop so the response echoes the request's method and path.
spec:
  scenario: The server responds based on the parsed request
  status: failing
  lines:
    - kw: Given
      text: 'the server receives "GET /hello HTTP/1.1\r\nHost: example.com\r\n\r\n"'
    - kw: When
      text: it parses the request and responds
    - kw: Then
      text: 'the response is "HTTP/1.1 200 OK\r\n\r\nGET /hello"'
code:
  lang: go
  source: |
    func handle(conn net.Conn) {
        defer conn.Close()
        req, _ := parseRequest(bufio.NewReader(conn))
        body := req.Method + " " + req.Path
        conn.Write([]byte("HTTP/1.1 200 OK\r\n\r\n" + body))
    }
checkpoint: 'curl http://localhost:PORT/hello now returns "GET /hello" - the server sees a real parsed request. Commit.'
---

The canned response from chapter one gives way to the real parser. Instead of
ignoring the request, `handle` now turns it into a `Request` and builds its reply
from actual fields — here, echoing the method and decoded path. The server has
gone from "answers everything identically" to "answers based on what was asked."

That is the whole point of the parsing chapter proved end to end: `curl` a path
and watch it come back. The response is still assembled by hand, which is exactly
what the next chapter replaces — a proper status line, headers, and body built
from a `Response`.

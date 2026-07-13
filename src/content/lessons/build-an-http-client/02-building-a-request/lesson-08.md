---
project: build-an-http-client
lesson: 8
title: The request line
overview: With a URL parsed, you can write the first line an HTTP server reads - the request line naming the method, the target, and the protocol version. Today you build the Request type and produce that line exactly.
goal: Produce the request line for a method and URL, ending in a carriage return and line feed.
spec:
  scenario: Forming the request line
  status: failing
  lines:
    - kw: Given
      text: 'a Request with method "GET" and the URL parsed from "http://example.com/a/b"'
    - kw: When
      text: its request line is produced
    - kw: Then
      text: 'it is exactly "GET /a/b HTTP/1.1\r\n"'
    - kw: And
      text: 'a URL with a query, "http://example.com/s?q=1", gives "GET /s?q=1 HTTP/1.1\r\n" (the target carries the query)'
code:
  lang: go
  source: |
    // the request line is: METHOD SP request-target SP "HTTP/1.1" CRLF
    // the request-target is the URL's path, plus "?"+rawQuery if a
    // query is present. CRLF is the two bytes "\r\n".
    type Request struct { Method string; URL *URL }
    func (r *Request) requestLine() string {
      // target := path; if rawQuery != "" { target += "?" + rawQuery }
    }
checkpoint: A Request can produce its request line with the correct target and CRLF ending. Commit and stop here.
---

An HTTP/1.1 request opens with a **request line**: the method, a space, the
**request-target**, a space, the protocol version, and a `CRLF` - the two bytes
`\r\n` that end every line in an HTTP message. For a normal request the target is
the **origin form**: the URL's path, with `?` and the query appended when there is
one. So `GET` on `http://example.com/a/b` produces `GET /a/b HTTP/1.1\r\n`.

Two details matter for exactness. The version is literally `HTTP/1.1` - that is the
protocol this whole project speaks. And the line ends in `\r\n`, not a bare
newline; HTTP is strict about carriage-return-line-feed, and every line you emit
from here on carries it. The path already defaults to `/` from chapter one, so the
target is never empty.

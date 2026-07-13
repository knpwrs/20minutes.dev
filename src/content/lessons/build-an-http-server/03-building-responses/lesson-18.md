---
project: build-an-http-server
lesson: 18
title: Format the status line
overview: Every response opens with a status line naming the version, a numeric code, and a human reason phrase. Today you format that line from a code, backed by a small table of standard reasons.
goal: Turn a status code into a full status line, looking its reason phrase up from a table.
spec:
  scenario: Formatting the status line
  status: failing
  lines:
    - kw: Given
      text: the status code 200
    - kw: When
      text: the status line is formatted
    - kw: Then
      text: 'it is "HTTP/1.1 200 OK\r\n"'
    - kw: And
      text: 'the code 404 gives "HTTP/1.1 404 Not Found\r\n"'
code:
  lang: go
  source: |
    var reasons = map[int]string{
        200: "OK", 400: "Bad Request", 404: "Not Found",
        405: "Method Not Allowed", 500: "Internal Server Error",
    }
    line := fmt.Sprintf("HTTP/1.1 %d %s\r\n", code, reasons[code])
checkpoint: 'A status code formats into a full status line. Commit.'
---

A response mirrors a request: it starts with one line, then headers, then a blank
line, then the body. The **status line** is `HTTP/1.1`, a three-digit status
code, and a short **reason phrase** — `OK`, `Not Found` — that exists purely for
humans reading the wire.

Back the reason phrases with a lookup table, and seed it now with the codes this
chapter will use (`200`, `400`, `404`, `405`, `500`). Building the table once,
even before every code has a caller, means later lessons just add a status number
and get a correct line for free.

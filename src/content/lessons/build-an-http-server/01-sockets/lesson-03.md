---
project: build-an-http-server
lesson: 3
title: Read a CRLF-terminated line
overview: HTTP is a line-based text protocol, and every line ends with a carriage-return plus line-feed. Today you read one such line off a connection, the primitive the whole parser is built from.
goal: Read one CRLF-terminated line from a stream and return it with the trailing CRLF removed.
spec:
  scenario: Reading a single request line
  status: failing
  lines:
    - kw: Given
      text: 'a stream holding "GET / HTTP/1.1\r\nHost: example.com\r\n"'
    - kw: When
      text: you read one line
    - kw: Then
      text: 'you get "GET / HTTP/1.1" with no trailing "\r\n"'
    - kw: And
      text: 'the next read begins at "Host: example.com"'
code:
  lang: go
  source: |
    r := bufio.NewReader(conn) // buffered so the next read continues where this left off
    line, err := r.ReadString('\n') // includes the \n
    line = strings.TrimRight(line, "\r\n") // drop the CR and LF
checkpoint: 'You can pull one CRLF line off a stream, leaving the rest intact. Commit.'
---

HTTP framing is built on **lines** separated by `\r\n` (carriage return, then
line feed — often written CRLF). The request line, every header, and the blank
line that ends the header block are all CRLF-terminated. So the first tool you
need is "read up to the next line feed, then strip the line ending."

Wrap the connection in a **buffered reader** and keep using that same reader for
the rest of the request. It remembers its position, so after you pull off one
line the next read naturally continues with the following bytes — exactly what
you need to read a request line and *then* its headers.

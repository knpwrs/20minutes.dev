---
project: build-an-http-client
lesson: 25
title: Wire chunked into the response
overview: The response parser has to choose how to read the body based on the headers. Today you make it pick chunked decoding when Transfer-Encoding says so, and length framing otherwise.
goal: Dispatch body reading to chunked decoding when Transfer-Encoding is chunked, else use Content-Length.
spec:
  scenario: Choosing the body framing from the headers
  status: failing
  lines:
    - kw: Given
      text: 'a response with header Transfer-Encoding "chunked" and body bytes "3\r\nabc\r\n0\r\n\r\n"'
    - kw: When
      text: its body is read
    - kw: Then
      text: 'the body is "abc" (decoded as chunked)'
    - kw: And
      text: 'a response with Content-Length "3" and body "abc" is still read by length - the header decides which framing applies'
code:
  lang: go
  source: |
    // when reading the body, check the headers IN ORDER:
    //   1. Transfer-Encoding: chunked  -> decodeChunked
    //   2. Content-Length present      -> readN(length)
    //   3. otherwise                   -> readAll (to EOF)
    // chunked takes priority over Content-Length when both appear.
checkpoint: The response parser selects chunked or length framing from the headers. Commit and stop here.
---

You now have three ways to read a body - by length, to end of stream, and chunked -
and the response's **headers decide which one applies**. The rule the parser
follows, in order: if `Transfer-Encoding: chunked` is present, decode the body as
chunks; otherwise if `Content-Length` is present, read that many bytes; otherwise
read to the end of the stream. Chunked takes precedence when both somehow appear.

This is the dispatch that makes `Do` handle any real response. It reuses the
chunked decoder from the last two lessons and the length and read-to-end readers
from chapter three - the parser just picks the right one by inspecting the headers.
With framing fully general, the client can read whatever a server sends, which is
the precondition for reading *several* responses off one connection.

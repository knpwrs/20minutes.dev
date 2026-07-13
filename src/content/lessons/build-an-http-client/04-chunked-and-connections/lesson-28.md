---
project: build-an-http-client
lesson: 28
title: A chunked then a plain response
overview: The chapter's payoff is reading a chunked response and a length-framed response back to back off one connection, exercising every framing rule and the keep-alive alignment at once.
goal: Read a chunked response then a length-framed response off a single stream in sequence.
spec:
  scenario: Mixed framings on one keep-alive stream
  status: failing
  lines:
    - kw: Given
      text: 'a stream holding "HTTP/1.1 200 OK\r\nTransfer-Encoding: chunked\r\n\r\n5\r\nhello\r\n0\r\n\r\n" then "HTTP/1.1 200 OK\r\nContent-Length: 3\r\n\r\nbye"'
    - kw: When
      text: two requests are sent over one persistent connection to that stream
    - kw: Then
      text: 'the first response body is "hello" (chunked) and the second is "bye" (length-framed)'
    - kw: And
      text: 'the chunked decoder consumed exactly through its "0\r\n\r\n" terminator, leaving the stream aligned for the second response'
code:
  lang: go
  source: |
    // no new code - this is the integration test. one persistent
    // connection, two round-trips:
    //   conn := NewConn(stream)
    //   r1, _ := conn.Do(req1)   // chunked body -> "hello"
    //   r2, _ := conn.Do(req2)   // length-framed -> "bye"
    // both parse because each body reader stops at its frame boundary.
checkpoint: You can read mixed-framing responses off one persistent stream. The connection layer works - commit and stop here.
---

This ties the chapter together. The first response is **chunked** - its body arrives
as `5\r\nhello\r\n0\r\n\r\n` and decodes to `hello`, with the decoder consuming
exactly through the `0\r\n\r\n` terminator. That precise stop is what leaves the
stream sitting at the start of the second response, which is **length-framed** and
reads `bye` by its `Content-Length`. Two different framings, one connection, both
clean.

No new code is needed today - if the earlier lessons framed each body exactly, this
just works, which is the satisfying proof that the framing rules compose. This is
the walking skeleton grown into a real HTTP/1.1 transport: it can send requests and
read any response the protocol allows, one after another, over a single stream. From
here the project turns to the behaviors layered on top - encodings, redirects, and
cookies.

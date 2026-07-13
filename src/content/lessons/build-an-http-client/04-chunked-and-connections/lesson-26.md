---
project: build-an-http-client
lesson: 26
title: Two responses on one stream
overview: The point of exact framing is that after one response ends, the next begins cleanly on the same connection. Today you read two responses off one stream, proving the framing leaves it aligned.
goal: Perform two round-trips on the same stream and read both responses correctly in sequence.
spec:
  scenario: Reading back-to-back responses
  status: failing
  lines:
    - kw: Given
      text: 'a stream preloaded with "HTTP/1.1 200 OK\r\nContent-Length: 2\r\n\r\nhi" immediately followed by "HTTP/1.1 200 OK\r\nContent-Length: 5\r\n\r\nworld"'
    - kw: When
      text: two requests are sent over one persistent connection to that stream
    - kw: Then
      text: 'the first response body is "hi" and the second is "world"'
    - kw: And
      text: 'the second parse succeeds only because the first read exactly 2 bytes and stopped, leaving the stream at the next response'
code:
  lang: go
  source: |
    // the buffered reader must PERSIST across calls, or the second read
    // loses bytes the first already buffered. wrap the stream in a
    // connection that owns one reader, and round-trip through it:
    //   conn := NewConn(stream)
    //   resp1, _ := conn.Do(req1)   // reads exactly 2 bytes, stops
    //   resp2, _ := conn.Do(req2)   // same reader, next response
checkpoint: Two responses read cleanly off one stream because framing is exact. Commit and stop here.
---

Keeping a connection open for more than one exchange - **keep-alive** - only works
if each response is framed exactly. Read one byte too few and the next parse starts
mid-body; one too many and it starts mid-header. Because your body readers consume
*precisely* the bytes the framing declares, the stream is left sitting exactly at
the start of the next response. Two responses, `hi` then `world`, come off one
buffer in order.

There is one thing to notice: the reader **buffers** bytes as it reads lines, so it
has to *persist* across both round-trips. If each request made a fresh reader, the
second one could miss bytes the first already pulled off the stream. So wrap the
stream in a small **connection** that owns a single reader and round-trip through it.
This is why reading exactly `Content-Length` bytes mattered: exact framing plus one
persistent reader is what makes a persistent connection possible. All that remains
is knowing *when* the server intends to keep the connection open - the `Connection`
header, next.

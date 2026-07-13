---
project: build-an-http-server
lesson: 35
title: Decode a chunked request body
overview: When a client does not know a body's size up front it sends it in chunks, each prefixed by its length. Today you decode that framing into the whole body.
goal: Decode a chunked transfer-encoded body into the concatenated bytes it represents.
spec:
  scenario: Reassembling a chunked body
  status: failing
  lines:
    - kw: Given
      text: 'a body encoded as "5\r\nhello\r\n6\r\n world\r\n0\r\n\r\n"'
    - kw: When
      text: it is decoded
    - kw: Then
      text: 'the reassembled body is "hello world"'
    - kw: And
      text: 'the terminating "0" chunk ends the body'
code:
  lang: go
  source: |
    for {
        line, _ := readLine(r)
        n, _ := strconv.ParseInt(line, 16, 64) // chunk size is HEX
        if n == 0 { break }                    // last chunk
        chunk := readBody(r, int(n))
        readLine(r)                            // consume the trailing CRLF
        out = append(out, chunk...)
    }
checkpoint: 'A chunked request body reassembles into the bytes it represents. Commit.'
---

Sometimes a client streams a body whose total size it does not know in advance —
so it cannot send a `Content-Length`. **Chunked transfer encoding** solves this:
the body is a series of chunks, each written as its **size in hexadecimal**, a
CRLF, the chunk bytes, and another CRLF. A zero-size chunk marks the end.

Decoding is a loop: read the size line, parse it as hex, read exactly that many
bytes (reusing your read-exactly primitive), consume the trailing CRLF, and
append. Stop at the `0` chunk. The result is the same body a `Content-Length`
request would have carried — the framing just arrived differently.

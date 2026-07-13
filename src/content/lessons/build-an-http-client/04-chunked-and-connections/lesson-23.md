---
project: build-an-http-client
lesson: 23
title: Decode one chunk
overview: Chunked transfer-encoding sends a body in sized pieces with no length known up front, ending in a zero-length chunk. Today you decode the simplest case - one chunk followed by the terminator.
goal: Decode a chunked body of a single chunk, stopping at the zero-length terminating chunk.
spec:
  scenario: Decoding a single-chunk body
  status: failing
  lines:
    - kw: Given
      text: 'the chunked body "5\r\nhello\r\n0\r\n\r\n"'
    - kw: When
      text: it is decoded
    - kw: Then
      text: 'the decoded body is "hello"'
    - kw: And
      text: 'decoding stops at the terminating chunk "0\r\n\r\n" - a chunk of size zero marks the end of the body'
code:
  lang: go
  source: |
    // each chunk is: SIZE CRLF DATA CRLF, where SIZE is the byte count.
    // for TODAY handle exactly ONE data chunk, then the terminator - do
    // NOT loop yet (looping over many chunks is tomorrow). read the size
    // line, read that many data bytes, read the trailing CRLF; then read
    // the next size line, expect 0, read the final CRLF, and stop.
    func decodeChunked(r *reader) ([]byte, error) {
      // read one chunk's size + data + CRLF; then read 0-terminator + CRLF
    }
checkpoint: You can decode a one-chunk body and recognize the zero-length terminator. Commit and stop here.
---

**Chunked transfer-encoding** frames a body without knowing its total length in
advance - useful when a server generates content on the fly. The body is a sequence
of **chunks**, each written as a size line, then that many bytes of data, then a
`\r\n`. `5\r\nhello\r\n` is one chunk: five bytes, `hello`. The body ends with a
**zero-length chunk** - `0\r\n\r\n` - a size of `0` followed by a final blank line.

Today handle exactly the **single-chunk** case so the mechanics are clear, and do
not loop yet: read the size line, read exactly that many data bytes, read the
trailing `\r\n`; then read the next size line, see the `0`, consume the terminating
`\r\n`, and stop. Pin that terminator precisely - the whole framing depends on
recognizing `0\r\n\r\n` as "body complete." Handling *many* chunks (and reading the
size as hex) is tomorrow's one job, when you turn this straight-line code into a
loop.

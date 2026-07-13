---
project: build-an-http-client
lesson: 21
title: Body to the end of the stream
overview: Not every response declares a length. When there is no Content-Length, the body runs until the connection closes - so today you read the body as everything left on the stream.
goal: Read the body as all remaining bytes when no Content-Length header is present.
spec:
  scenario: Reading a body with no declared length
  status: failing
  lines:
    - kw: Given
      text: 'a response with no Content-Length header, the reader positioned at the body "the rest of the stream"'
    - kw: When
      text: the body is read to the end of the stream
    - kw: Then
      text: 'the body is exactly "the rest of the stream" (every remaining byte until the stream ends)'
    - kw: And
      text: 'an empty remaining stream yields an empty body ""'
code:
  lang: go
  source: |
    // when there is no Content-Length (and no chunked encoding yet),
    // the body is delimited by the connection closing: read the
    // reader until EOF and take all of it as the body.
    func (r *reader) readAll() ([]byte, error) {
      // read until the stream is exhausted
    }
checkpoint: You can read an unframed body as everything up to the end of the stream. Commit and stop here.
---

Some responses give no `Content-Length` - the server just streams the body and then
**closes the connection** to signal the end. HTTP/1.0 worked this way by default,
and HTTP/1.1 still allows it. With no declared length, the only framing is the end
of the stream itself, so the body is **all remaining bytes** until EOF. For `the
rest of the stream` sitting on the reader, that is the whole thing.

This is the third and simplest body-framing rule, and it completes the set for now:
read `Content-Length` bytes when the header is present, read to EOF when it is not.
The one framing still missing is **chunked transfer-encoding**, where the body
arrives in sized pieces with no length known up front - that is the headline of
chapter four. Notice that read-to-close consumes the whole stream, so it cannot
share a connection; that tension is exactly what keep-alive resolves.

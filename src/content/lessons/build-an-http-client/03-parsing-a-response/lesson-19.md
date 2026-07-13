---
project: build-an-http-client
lesson: 19
title: Body by Content-Length
overview: With headers parsed, the reader sits at the body - and Content-Length tells you exactly how many bytes it is. Today you read precisely that many bytes, no more and no less.
goal: Read the response body as exactly the number of bytes given by Content-Length.
spec:
  scenario: Reading a length-framed body
  status: failing
  lines:
    - kw: Given
      text: 'a response whose Content-Length header is "5", with the reader positioned at the body "hello"'
    - kw: When
      text: the body is read
    - kw: Then
      text: 'the body is exactly "hello" (5 bytes)'
    - kw: And
      text: 'a Content-Length of "0" yields an empty body "" and consumes no bytes'
code:
  lang: go
  source: |
    // read the Content-Length header, parse it as an int N, then
    // read EXACTLY N bytes from the reader as the body. N may be 0.
    func (r *reader) readN(n int) ([]byte, error) {
      // read n bytes and return them
    }
checkpoint: You can read a length-framed body of exactly the declared size, including empty bodies. Commit and stop here.
---

The most common way a response frames its body is **Content-Length**: a header
stating the exact byte count that follows the blank line. The reader is already
sitting at the first body byte, so reading the body is just reading **exactly that
many bytes** - `Content-Length: 5` means read five, giving `hello`. Read fewer and
you truncate the body; read more and you steal bytes from whatever comes next on the
connection, which matters the moment a connection carries more than one response.

Pin the **empty body**: `Content-Length: 0` is legitimate and common - a redirect, a
204, a HEAD response - and it means read *zero* bytes, leaving the reader untouched.
Reading exactly the declared count, even when that count is zero, is what keeps the
stream aligned for the keep-alive work in chapter four.

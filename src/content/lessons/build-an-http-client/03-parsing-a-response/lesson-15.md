---
project: build-an-http-client
lesson: 15
title: A reader over bytes
overview: A response arrives as a stream of bytes, and the first tool you need is one that reads a single line at a time. Today you build a reader over an abstract byte stream that returns one CRLF-terminated line per call.
goal: Build a reader that returns the next line up to a CRLF, with the CRLF stripped, advancing the stream.
spec:
  scenario: Reading one line at a time
  status: failing
  lines:
    - kw: Given
      text: 'a reader over the bytes "abc\r\ndef\r\n"'
    - kw: When
      text: readLine is called twice
    - kw: Then
      text: 'the first call returns "abc" and the second returns "def" (each with the trailing CRLF removed)'
    - kw: And
      text: 'the reader advances past each CRLF, so successive calls consume successive lines'
code:
  lang: go
  source: |
    // wrap any byte stream (a reader). readLine consumes bytes up to
    // and including the next "\r\n", returning the bytes BEFORE it.
    // model the transport as a stream, not a socket - a bytes reader
    // works exactly the same as a real connection here.
    type reader struct { /* an underlying byte stream + buffer */ }
    func (r *reader) readLine() (string, error) {
      // read until "\r\n"; return the line without it
    }
checkpoint: You can read an HTTP message one CRLF-terminated line at a time. Commit and stop here.
---

A response is a **byte stream**, and HTTP frames it in lines ended by `\r\n`. So the
foundation of parsing is a reader that hands you **one line at a time**: it consumes
bytes up to the next `\r\n`, returns everything before it, and leaves the stream
positioned at the start of the following line. Ask twice on `abc\r\ndef\r\n` and you
get `abc`, then `def`.

The important idea here is that the transport is **abstract**: this reader wraps
*any* stream of bytes. In these lessons that stream is an in-memory buffer, which is
what makes every response test exact and offline - but the same reader will wrap a
real network connection in the capstone without a single change. Everything in this
chapter reads through this one small tool.

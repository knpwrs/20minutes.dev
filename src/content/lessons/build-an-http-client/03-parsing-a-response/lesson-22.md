---
project: build-an-http-client
lesson: 22
title: A round-trip over a stream
overview: The two halves meet today, as you write a request onto a stream and read the response back off it, giving the client its central round-trip in one function - the walking skeleton everything later runs through.
goal: Write a request to a byte stream and parse the full response back from it in one call.
spec:
  scenario: One request-response round-trip
  status: failing
  lines:
    - kw: Given
      text: 'a stream preloaded with "HTTP/1.1 200 OK\r\nContent-Length: 2\r\n\r\nhi" and a GET request for "http://example.com/a"'
    - kw: When
      text: 'Do(stream, request) is called'
    - kw: Then
      text: 'it returns a response with status 200 and body "hi"'
    - kw: And
      text: 'the stream captured the request bytes exactly: "GET /a HTTP/1.1\r\nHost: example.com\r\n\r\n"'
code:
  lang: go
  source: |
    // Do writes the request bytes to the stream, then parses a
    // response back from the same stream. the stream is any
    // read+write byte channel (in-memory here, a socket later).
    func Do(stream io.ReadWriter, req *Request) (*Response, error) {
      // stream.Write(req.Bytes())
      // wrap stream in a reader; parse status line, headers, body
    }
checkpoint: The client can perform a full request-response round-trip over an abstract stream. Commit and stop here.
---

This is the heart of the client: **Do** takes a stream and a request, writes the
request's bytes onto it, then reads and parses the response back. The stream is an
abstract **read-and-write byte channel** - in these lessons an in-memory buffer that
captures what you write and replays a canned response, in the capstone a real TCP
socket. Because Do only ever touches that abstract stream, the exact same code works
in both.

Everything from chapters two and three converges here: the request serializes to
bytes, those bytes go out, the status line and headers parse back, and the body is
read by the framing rule its headers imply. This is the **walking skeleton** - a
usable round-trip you will thicken with chunked bodies, keep-alive, redirects, and
cookies, but which already does the one thing a client exists to do. Every later
feature is a layer on top of this single call.

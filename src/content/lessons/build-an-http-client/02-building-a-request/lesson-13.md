---
project: build-an-http-client
lesson: 13
title: A body and Content-Length
overview: A POST or PUT carries a body, and the server needs to know how many bytes to read - that is the Content-Length header. Today you attach a body and set its length automatically.
goal: Attach a body to a request, set Content-Length to its byte count, and append it after the blank line.
spec:
  scenario: Framing a request body by length
  status: failing
  lines:
    - kw: Given
      text: 'a POST request for "http://example.com/s" with the body "hello" attached'
    - kw: When
      text: the request is serialized
    - kw: Then
      text: 'the Content-Length header is "5" and the bytes end with "\r\n\r\nhello"'
    - kw: And
      text: 'attaching an empty body sets Content-Length "0", while a request with no body attached has no Content-Length header at all'
code:
  lang: go
  source: |
    // attaching a body sets Content-Length to its byte length
    // (only if not already set), and serialize appends the body
    // bytes after the header block's blank line.
    func (r *Request) SetBody(b []byte) {
      // record the body; Set("Content-Length", len(b)) if absent
    }
checkpoint: A request frames its body with a correct Content-Length. Commit and stop here.
---

When a request carries content - a form post, a JSON payload - the receiver has to
know **where the body ends**, and the simplest way to say so is the
**Content-Length** header: the exact number of bytes that follow the blank line.
Attaching a body of `hello` sets `Content-Length: 5`, and serialize writes those
five bytes right after the header block. A request with no body attached sends no
`Content-Length` at all - which is why the bodyless GET from last lesson is still
correct and unchanged.

Two edges are worth pinning. An **empty body** is still a body: `Content-Length: 0`
is a valid, meaningful header. And set the length **only if it is not already set**,
so a later lesson that wants to control the header itself (a HEAD-style request, or
a re-sent body) is not overridden. Length-framing is the default; chunked framing,
the harder case, is chapter four.

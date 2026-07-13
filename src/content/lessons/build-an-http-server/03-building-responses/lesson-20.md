---
project: build-an-http-server
lesson: 20
title: Assemble a full response
overview: With a status line and a header block in hand, today you assemble the whole response - status, headers, a blank line, then the body - into the exact bytes that go on the wire.
goal: Serialize a Response of status, headers, and body into a complete HTTP response.
spec:
  scenario: Serializing a full response
  status: failing
  lines:
    - kw: Given
      text: 'a Response with status 200, header "Content-Type: text/plain", and body "hi"'
    - kw: When
      text: it is serialized
    - kw: Then
      text: 'the bytes are "HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\n\r\nhi"'
code:
  lang: go
  source: |
    type Response struct {
        Status  int
        Headers map[string]string
        Body    []byte
    }
    // serialize: statusLine + headerBlock + "\r\n" + body
checkpoint: 'A Response serializes to the exact bytes for the wire. Commit.'
---

The two halves join into a **`Response`** and its serializer: status line, then
the header block, then a single blank line (`\r\n`), then the body bytes. That
blank line is the same delimiter you scanned for when reading a request — here you
are writing it.

`Response` is the counterpart to `Request`: handlers will return one, and the
connection loop will serialize it to the socket. Getting the byte layout exactly
right — CRLFs in the right places, one blank line before the body — is what makes
a browser accept your output as HTTP.

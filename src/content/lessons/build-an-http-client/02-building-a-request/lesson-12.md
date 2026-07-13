---
project: build-an-http-client
lesson: 12
title: Serialize the whole request
overview: You have a request line and a header block; today you join them into the complete bytes of a request with no body - the full message a server reads before any content.
goal: Serialize a full request - request line then header block - to exact bytes ending in the blank line.
spec:
  scenario: Writing a complete bodyless request
  status: failing
  lines:
    - kw: Given
      text: 'a GET request for "http://example.com/a" with its Host header derived'
    - kw: When
      text: the whole request is serialized
    - kw: Then
      text: 'the bytes are exactly "GET /a HTTP/1.1\r\nHost: example.com\r\n\r\n"'
    - kw: And
      text: 'the message ends in the blank line "\r\n\r\n" that separates headers from a (here empty) body'
code:
  lang: go
  source: |
    // a full request is: request line, then the header block.
    // the header block already ends in the blank line, so this is
    // just a concatenation of the two pieces you built.
    func (r *Request) Bytes() []byte {
      // requestLine() + header.serialize()
    }
checkpoint: A request serializes to its complete wire bytes, terminated by the blank line. Commit and stop here.
---

A complete request is just the two pieces you already have stacked together: the
**request line**, then the **header block**. Because the header block ends in the
blank line, the whole message already terminates correctly - `GET /a HTTP/1.1\r\n`,
then `Host: example.com\r\n`, then the closing `\r\n`. That trailing blank line is
the universal HTTP boundary between headers and body; a server reads headers until
it sees it.

This is the client's first genuinely usable output: hand it a URL and it produces
the exact bytes a server expects to receive. It carries no body yet - the next
lesson attaches one and slots its length into the headers - but the framing is
already complete and correct, which is what makes the byte-for-byte tests possible.

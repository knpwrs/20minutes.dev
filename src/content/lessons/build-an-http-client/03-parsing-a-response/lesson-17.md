---
project: build-an-http-client
lesson: 17
title: The header block
overview: After the status line come the response headers, one per line, until a blank line ends them. Today you parse that block into the same case-insensitive header collection the request side uses.
goal: Parse header lines into the header collection until the blank line, trimming whitespace after the colon.
spec:
  scenario: Parsing the response headers
  status: failing
  lines:
    - kw: Given
      text: 'a reader positioned at "Content-Type: text/html\r\nContent-Length: 3\r\n\r\nabc"'
    - kw: When
      text: the header block is parsed
    - kw: Then
      text: 'Get("content-type") is "text/html" and Get("content-length") is "3" (lookup is case-insensitive)'
    - kw: And
      text: 'parsing stops at the blank line, leaving the reader positioned at the body "abc"'
    - kw: And
      text: 'a value containing colons is preserved - the line splits on the FIRST colon only, so "Date: Mon, 02 Jan 2006 15:04:05 GMT" gives Get("Date") of "Mon, 02 Jan 2006 15:04:05 GMT"'
code:
  lang: go
  source: |
    // read lines until an EMPTY line (the end of the block). each
    // line is "Name:" + optional-whitespace + "Value"; split on the
    // FIRST colon only (so a value like a Date keeps its own colons)
    // and trim leading/trailing spaces from the value.
    // store into the case-insensitive Header from chapter two.
    func (r *reader) parseHeaders() (*Header, error) {
      // loop readLine until ""; Set(name, trimmed value)
    }
checkpoint: A response parses its headers into the case-insensitive collection, stopping at the blank line. Commit and stop here.
---

The headers follow the status line, one field per line, and the block ends at the
**blank line** - the same boundary you emit when building a request, now read from
the other side. Each line is a name, a colon, optional whitespace, and a value; you
split on the colon, trim the surrounding whitespace off the value, and store it into
the **case-insensitive header collection** you built in chapter two. Reuse pays off:
the container is identical whether the header came from your code or the server's.

Split each line on the **first colon only**. Many header values carry colons of
their own - a `Date` holds a time like `15:04:05`, a `Location` holds a URL - and
splitting greedily on every colon would truncate them. The name is what precedes the
first colon; the value is everything after, with just its surrounding whitespace
trimmed. The loop reads lines until it hits the empty one, which it consumes and
stops on - leaving the reader sitting exactly at the first byte of the body. That
precise positioning is what lets the next lessons read the body by length.

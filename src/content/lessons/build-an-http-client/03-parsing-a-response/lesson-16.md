---
project: build-an-http-client
lesson: 16
title: The status line
overview: The first line of a response is the status line - the protocol version, a numeric status code, and a reason phrase. Today you parse it into those three parts.
goal: Parse a status line into version, a numeric status code, and the reason phrase.
spec:
  scenario: Parsing the status line
  status: failing
  lines:
    - kw: Given
      text: 'the status line "HTTP/1.1 200 OK"'
    - kw: When
      text: it is parsed
    - kw: Then
      text: 'the version is "HTTP/1.1", the status code is 200 (a number), and the reason is "OK"'
    - kw: And
      text: 'parsing "HTTP/1.1 404 Not Found" gives code 404 and reason "Not Found" (the reason may contain spaces)'
code:
  lang: go
  source: |
    // status-line = HTTP-version SP status-code SP reason-phrase
    // split into exactly THREE parts on the first two spaces; the
    // reason is the remainder and may itself contain spaces.
    type Response struct { Version string; Status int; Reason string }
    func parseStatusLine(line string) (*Response, error) {
      // split off version, then code, then the rest as the reason
    }
checkpoint: You can parse a status line into version, numeric code, and reason. Commit and stop here.
---

A response opens with a **status line**: the HTTP version, a space, a three-digit
**status code**, a space, and a **reason phrase** - `HTTP/1.1 200 OK`. The status
code is the number your client acts on (200 success, 404 not found, 301 redirect),
so parse it as an integer, not a string. The reason phrase is human-readable text
that may contain spaces, so `404 Not Found` has reason `Not Found`.

The clean split is on the **first two spaces only**: the first separates version
from code, the second separates code from reason, and everything after that second
space - spaces and all - is the reason. Splitting greedily on every space would
break `Not Found` in two. With the status line parsed, the response object exists;
next you read its headers.

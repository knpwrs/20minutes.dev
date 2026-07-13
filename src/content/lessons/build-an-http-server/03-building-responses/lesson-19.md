---
project: build-an-http-server
lesson: 19
title: Serialize response headers
overview: A response carries headers just like a request does, written one per line. Today you turn a header map into that wire text, the inverse of the parsing you did earlier.
goal: 'Serialize a set of response headers into CRLF-terminated "Name: Value" lines.'
spec:
  scenario: Writing headers to the wire
  status: failing
  lines:
    - kw: Given
      text: 'a response header "Content-Type" with value "text/plain"'
    - kw: When
      text: the headers are serialized
    - kw: Then
      text: 'the output contains the line "Content-Type: text/plain\r\n"'
code:
  lang: go
  source: |
    var b strings.Builder
    for name, value := range headers {
        fmt.Fprintf(&b, "%s: %s\r\n", name, value)
    }
checkpoint: 'Response headers serialize to CRLF-terminated lines. Commit.'
---

Writing headers is the mirror image of parsing them: each entry becomes one
`Name: Value` line ending in CRLF. Where parsing split on the first colon and
trimmed whitespace, serializing joins with `": "` and terminates with `\r\n`.

Keep the response's header names in the exact case you want on the wire — clients
do not care, but `Content-Type` reads better than `content-type` in a debugger.
Emit the lines in a **stable order** — sorting by name is simplest — so that once
a response carries several headers it serializes to predictable bytes you can
check exactly. This block sits between the status line and the body; the blank
line that separates headers from body comes when you assemble the whole response
next.

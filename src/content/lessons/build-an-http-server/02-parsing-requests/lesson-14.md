---
project: build-an-http-server
lesson: 14
title: Assemble the Request struct
overview: You have parsed the request line, the headers, and the body separately - today you gather them into one Request value, the single object every handler will receive.
goal: Read a full request off a stream and return one Request holding its method, target, version, headers, and body.
spec:
  scenario: Parsing a complete request
  status: failing
  lines:
    - kw: Given
      text: 'the request "POST /submit HTTP/1.1\r\nHost: example.com\r\nContent-Length: 2\r\n\r\nhi"'
    - kw: When
      text: it is parsed
    - kw: Then
      text: 'method = "POST", target = "/submit", version = "HTTP/1.1"'
    - kw: And
      text: 'the Host header is "example.com" and the body is "hi"'
code:
  lang: go
  source: |
    type Request struct {
        Method, Target, Version string
        Headers Headers
        Body    []byte
    }
    // parseRequest: readHead -> parse request line -> collect headers -> read body
checkpoint: 'A raw stream parses into a complete Request value. Commit.'
---

Every piece you have built so far — the head reader, the request-line parser, the
header collector, the Content-Length body reader — now snaps together into one
function that turns a raw stream into a **`Request`**. This struct is the shape
every handler in the rest of the project speaks; nothing downstream touches raw
bytes again.

The order is fixed by the wire format: read the head, split off the request line,
fold the remaining lines into headers, then read the body its `Content-Length`
describes. One value comes out carrying everything the request said.

---
project: build-an-http-client
lesson: 27
title: The Connection header
overview: A client needs to know whether to keep the connection open or close it after a response, and the answer depends on both the Connection header and the HTTP version. Today you encode that full rule.
goal: Decide whether to close the connection after a response, honoring the version-dependent default and the Connection header.
spec:
  scenario: Deciding whether to close the connection
  status: failing
  lines:
    - kw: Given
      text: 'an HTTP/1.1 response with no Connection header'
    - kw: When
      text: ShouldClose is checked
    - kw: Then
      text: 'it is false - HTTP/1.1 keeps the connection alive by default'
    - kw: And
      text: 'an HTTP/1.1 response with Connection "close" gives true; an HTTP/1.0 response with no Connection header gives true (1.0 closes by default); an HTTP/1.0 response with Connection "keep-alive" gives false'
code:
  lang: go
  source: |
    // the rule, in order:
    //   Connection contains "close"      -> true  (close)
    //   version is HTTP/1.1 (or later)   -> false (persistent)
    //   version is HTTP/1.0              -> true UNLESS Connection
    //                                       contains "keep-alive"
    // compare the Connection value case-insensitively.
    func (r *Response) ShouldClose() bool {
      // branch on Connection value, then on Version
    }
checkpoint: The client applies the full persistence rule to decide whether to reuse or close. Commit and stop here.
---

Whether a connection stays open after a response depends on **two** things: the
`Connection` header and the HTTP **version**. In **HTTP/1.1** connections are
persistent by default - a server keeps the socket open unless it sends
`Connection: close`. In **HTTP/1.0** the default is the opposite: the connection
closes after each response *unless* the server opts in with `Connection:
keep-alive`. Your client has to honor both defaults to know whether it may send
another request on the same connection.

So `ShouldClose` is a small decision tree: if `Connection` says `close`, close; else
if the response is HTTP/1.1, keep it open; else (HTTP/1.0) close unless `Connection`
says `keep-alive`. Compare the header value case-insensitively, like every header.
This is the flag a real client consults before reusing a connection, and getting the
version-dependent default right is what keeps it from hanging on a 1.0 server or
needlessly redialing a 1.1 one.

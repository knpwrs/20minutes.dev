---
project: build-an-http-client
lesson: 14
title: Build a POST
overview: The chapter comes together as you build a complete POST request with a custom header and a body, and assert its exact wire bytes end to end. This is the whole request side of the client working at once.
goal: Build a POST with a header and a body and serialize it to the exact expected bytes.
spec:
  scenario: A complete POST on the wire
  status: failing
  lines:
    - kw: Given
      text: 'a POST for "http://example.com/submit" with header Content-Type "text/plain", body "hi", and Host derived'
    - kw: When
      text: the request is serialized
    - kw: Then
      text: 'the bytes are exactly "POST /submit HTTP/1.1\r\nContent-Length: 2\r\nContent-Type: text/plain\r\nHost: example.com\r\n\r\nhi"'
    - kw: And
      text: 'the headers appear in sorted order (content-length, content-type, host) regardless of the order they were set'
code:
  lang: go
  source: |
    // put it together with what you built:
    //   req := &Request{Method: "POST", URL: mustParse(...)}
    //   req.setHost()
    //   req.Set("Content-Type", "text/plain")
    //   req.SetBody([]byte("hi"))
    //   wire := req.Bytes()
    // then assert wire equals the expected string byte-for-byte
checkpoint: You can build and serialize a complete POST request to exact bytes. The request half of the client is done - commit and stop here.
---

This is the request side of the client proving itself. Everything from the chapter
runs at once: the **request line** with method and target, the **Host header**
derived from the URL, a caller-set **Content-Type**, a body framed by
**Content-Length**, headers in deterministic **sorted order**, and the whole thing
terminated by the blank line before the body. The result is `POST /submit
HTTP/1.1`, three headers in alphabetical order, a blank line, then `hi`.

Because the header order is fixed and every value is derived by a rule, the entire
message is predictable down to the last byte - which is exactly what makes it
testable without a network. You now have half of a client: it can build any request
a server will accept. Chapter three builds the other half - reading the response
back off a stream.

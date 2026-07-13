---
project: build-an-http-server
lesson: 13
title: Read the body with Content-Length
overview: A request that carries data announces its size in the Content-Length header. Today you read exactly that many body bytes, connecting the header map to the read-exactly primitive you built earlier.
goal: Use the Content-Length header to read exactly that many bytes of body, and read no body when the header is absent.
spec:
  scenario: Reading a Content-Length body
  status: failing
  lines:
    - kw: Given
      text: 'headers with "Content-Length: 5" and the stream positioned at "hello!"'
    - kw: When
      text: the body is read
    - kw: Then
      text: 'the body is "hello" (5 bytes) and "!" remains unread'
    - kw: And
      text: with no Content-Length header the body is empty
code:
  lang: go
  source: |
    n := 0
    if cl := headers.Get("Content-Length"); cl != "" {
        n, _ = strconv.Atoi(cl)
    }
    body := readBody(r, n) // read-exactly, from chapter 1
checkpoint: 'Bodies are read to the length Content-Length announces. Commit.'
---

Now the header map and the read-exactly primitive combine. A body's length is not
in the byte stream — it is announced by the **`Content-Length`** header. Parse
that number, then read precisely that many bytes off the reader that is still
parked at the start of the body.

When there is no `Content-Length`, treat the body as empty: a plain `GET` sends
no body and no length header, and reading zero bytes is the correct behavior. Do
not read past what the header promised, or you will swallow the start of the next
request on a reused connection.

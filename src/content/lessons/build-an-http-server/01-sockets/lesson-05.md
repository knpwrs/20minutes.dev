---
project: build-an-http-server
lesson: 5
title: Read exactly N body bytes
overview: A message body is not line-based - it is a fixed number of raw bytes. Today you read exactly that many, the counterpart to line reading that the header block deliberately left alone.
goal: Read exactly n bytes from a stream, no more and no fewer.
spec:
  scenario: Reading a length-delimited body
  status: failing
  lines:
    - kw: Given
      text: 'a stream positioned at "hello!" and n = 5'
    - kw: When
      text: you read the body
    - kw: Then
      text: 'you get exactly "hello" (5 bytes)'
    - kw: And
      text: 'given n = 0, you get an empty body and read nothing'
code:
  lang: go
  source: |
    body := make([]byte, n)
    _, err := io.ReadFull(r, body) // reads until the slice is full, or errors
    // n == 0 is fine: ReadFull returns immediately with an empty body
checkpoint: 'You can read exactly N body bytes, zero included. Commit.'
---

Unlike the head, a body has no delimiter to scan for — its length is stated
elsewhere (you will get it from a header next chapter). So reading a body means
"give me **exactly** this many bytes." A single `Read` can return fewer bytes
than you asked for, so you must keep reading until the count is satisfied.

Read-exactly is the right primitive here: it loops internally until your buffer
is full or the stream ends early. Handle **n = 0** cleanly — a body of zero bytes
is completely normal (every GET has one) and should read nothing and return
empty.

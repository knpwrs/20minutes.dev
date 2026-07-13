---
project: build-an-http-server
lesson: 4
title: Read the header block
overview: A request's head is a run of lines that ends at the first blank line. Today you read that whole block, so you have the request line and all its headers in hand before parsing any of them.
goal: Read lines until a blank line and return every non-empty line that came before it.
spec:
  scenario: Reading the head of a request
  status: failing
  lines:
    - kw: Given
      text: 'a stream holding "GET / HTTP/1.1\r\nHost: example.com\r\nAccept: */*\r\n\r\nBODY" (some body bytes follow the blank line)'
    - kw: When
      text: you read the head
    - kw: Then
      text: 'you get the lines ["GET / HTTP/1.1", "Host: example.com", "Accept: */*"]'
    - kw: And
      text: 'reading stops at the blank line, so a following read still yields "BODY"'
code:
  lang: go
  source: |
    var lines []string
    for {
        line, _ := readLine(r) // from the previous lesson
        if line == "" {        // the blank line ends the head
            break
        }
        lines = append(lines, line)
    }
checkpoint: Your reader pulls a request's whole head off the wire and stops at the blank line. Commit.
---

Every HTTP request begins with a **head**: the request line followed by zero or
more header lines. The head is terminated by a single empty line — the `\r\n\r\n`
sequence you have surely seen at the end of raw requests. Reading the head means
looping `readLine` until you hit that empty line.

Stopping *exactly* at the blank line matters: whatever comes after it is the
message **body**, which is not line-based and must not be read as lines. Break the
moment you see an empty line and leave the reader parked at the start of the body
for a later lesson.

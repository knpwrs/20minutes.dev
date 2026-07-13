---
project: build-an-http-server
lesson: 7
title: Parse the request line
overview: The first line of every request names the method, the target, and the protocol version. Today you split it into those three parts and reject anything that is not shaped that way.
goal: Split a request line into method, target, and version, and report an error if it does not have exactly three parts.
spec:
  scenario: Parsing the request line
  status: failing
  lines:
    - kw: Given
      text: 'the line "GET /index.html HTTP/1.1"'
    - kw: When
      text: it is parsed
    - kw: Then
      text: 'method = "GET", target = "/index.html", version = "HTTP/1.1"'
    - kw: And
      text: 'the line "GET /index.html" (only two parts) is reported as an error'
code:
  lang: go
  source: |
    parts := strings.Split(line, " ")
    if len(parts) != 3 { // method, target, version — exactly three
        return "", "", "", errors.New("malformed request line")
    }
    method, target, version := parts[0], parts[1], parts[2]
checkpoint: 'The request line parses into method, target, and version, and rejects malformed lines. Commit.'
---

The request line is three tokens separated by single spaces: the **method**
(`GET`, `POST`, …), the **request target** (the path being asked for), and the
**HTTP version**. Splitting on spaces and taking the three pieces is all it takes
to read it.

Insist on exactly three parts. A line with two or four tokens is malformed, and
returning an error here — rather than limping on with a missing version — is what
lets the server answer a broken request with a clean `400` later. The target
never contains a space, so a plain three-way split is safe. For now just return
the three strings; a few lessons from now they will become fields on a `Request`.

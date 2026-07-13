---
project: build-an-http-server
lesson: 8
title: Parse a header line
overview: Every header is a name and a value separated by a colon. Today you split one header line into its two parts, trimming the optional whitespace HTTP allows after the colon.
goal: Split a header line into a name and a value at the first colon, trimming surrounding whitespace from the value.
spec:
  scenario: Parsing one header field
  status: failing
  lines:
    - kw: Given
      text: 'the line "Host: example.com"'
    - kw: When
      text: it is parsed
    - kw: Then
      text: 'name = "Host" and value = "example.com" (the space after the colon is trimmed)'
    - kw: And
      text: 'the line "X-Time: 10:30" splits at the first colon only, so value = "10:30"'
code:
  lang: go
  source: |
    i := strings.IndexByte(line, ':') // FIRST colon only
    if i < 0 {
        return "", "", errors.New("bad header")
    }
    name := line[:i]
    value := strings.TrimSpace(line[i+1:])
checkpoint: 'One header line splits cleanly into name and value. Commit.'
---

A header field is `Name: Value`. The split happens at the **first** colon,
because values are free to contain colons of their own — timestamps, URLs, and
IPv6 addresses all do. Slicing at the first colon and keeping the rest verbatim
avoids mangling them.

HTTP permits optional whitespace around a header value (it is called OWS in the
spec), so trim spaces off the value. Leave the name exactly as written for now —
the next lesson handles the fact that names are matched case-insensitively.

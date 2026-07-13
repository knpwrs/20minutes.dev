---
project: build-an-http-server
lesson: 10
title: Case-insensitive header names
overview: HTTP header names ignore case - "Content-Type" and "content-type" are the same field. Today you make lookups case-insensitive so a handler can ask for a header without guessing how the client capitalized it.
goal: Make header lookup succeed regardless of the case used when storing or querying the name.
spec:
  scenario: Looking up a header by any casing
  status: failing
  lines:
    - kw: Given
      text: 'a header stored from the line "Content-Type: text/html"'
    - kw: When
      text: 'it is looked up as "content-type"'
    - kw: Then
      text: 'the value is "text/html"'
    - kw: And
      text: 'looking it up as "CONTENT-TYPE" also gives "text/html"'
code:
  lang: go
  source: |
    // canonicalize on the way in AND on the way out
    func (h Headers) Get(name string) string {
        return h[strings.ToLower(name)]
    }
    // when building: headers[strings.ToLower(name)] = value
checkpoint: 'Header lookup ignores case. Commit.'
---

The HTTP spec says field names are **case-insensitive**: a client may send
`Content-Type`, `content-type`, or `CONTENT-TYPE` and mean the same header. If
your map keys on the exact bytes received, a handler asking for `"Content-Length"`
will miss a client that wrote `"content-length"`.

The fix is to pick one canonical form — lowercasing is simplest — and apply it
**both** when storing and when looking up. Then every casing collapses to the
same key. Note this keeps your earlier exact-case lookups working too, since
`Get("Host")` still lowercases to the same entry.

---
project: build-an-http-server
lesson: 15
title: Split path from query string
overview: A request target bundles the path and an optional query string behind a question mark. Today you separate the two, since routing cares about the path while handlers care about the query.
goal: Split a request target at the first "?" into a path and a raw query string.
spec:
  scenario: Separating path and query
  status: failing
  lines:
    - kw: Given
      text: 'the target "/search?q=cats&n=2"'
    - kw: When
      text: it is split
    - kw: Then
      text: 'path = "/search" and rawQuery = "q=cats&n=2"'
    - kw: And
      text: 'the target "/about" gives path = "/about" and rawQuery = ""'
code:
  lang: go
  source: |
    if i := strings.IndexByte(target, '?'); i >= 0 {
        path, rawQuery = target[:i], target[i+1:]
    } else {
        path, rawQuery = target, ""
    }
checkpoint: 'The target splits into a path and a raw query string. Commit.'
---

The request target is really two things glued together: the **path** that names a
resource and an optional **query string** carrying parameters. They are separated
by the first `?`. Routing decisions look only at the path, so pulling the query
off keeps `/search?q=cats` from being treated as a different route than
`/search`.

Split at the first `?` and keep everything after it as the raw query — you will
decode it into key/value pairs in a later lesson. A target with no `?` has an
empty query, and the path is the whole target. Store both on the `Request` so
handlers can reach them.

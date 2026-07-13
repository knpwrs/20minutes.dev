---
project: build-an-http-server
lesson: 21
title: Set Content-Length from the body
overview: A client needs to know how many body bytes to read, and that count is the Content-Length header. Today the serializer computes it from the body so you never set it by hand.
goal: Automatically include a Content-Length header equal to the body's byte length when serializing a response.
spec:
  scenario: Deriving Content-Length
  status: failing
  lines:
    - kw: Given
      text: 'a Response with body "hello" and no explicit Content-Length'
    - kw: When
      text: it is serialized
    - kw: Then
      text: 'the headers include "Content-Length: 5"'
    - kw: And
      text: 'a Response with an empty body includes "Content-Length: 0"'
code:
  lang: go
  source: |
    // just before serializing headers:
    headers["Content-Length"] = strconv.Itoa(len(body))
checkpoint: 'The serializer sets Content-Length from the body automatically. Commit.'
---

The reader side already used `Content-Length` to know how many body bytes to
pull; the writer side must **provide** it, or the client cannot tell where your
body ends — especially once connections are reused and one response runs straight
into the next. Computing it from `len(body)` guarantees it is always correct.

Derive it in the serializer rather than asking every handler to remember it. An
empty body is `Content-Length: 0`, not a missing header — the count is always
present, which is what keeps the framing unambiguous.

One knock-on effect: your responses now carry a second header, so the exact bytes
you checked last lesson gain a `Content-Length` line — update that check, and
remember headers serialize in sorted order (so `Content-Length` lands before
`Content-Type`). Add it only when the caller has not set one, so a response that
deliberately fixes its own `Content-Length` (a `HEAD` reply, later) is left
alone.

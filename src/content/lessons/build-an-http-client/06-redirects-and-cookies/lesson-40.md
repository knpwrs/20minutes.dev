---
project: build-an-http-client
lesson: 40
title: Emit the Cookie header
overview: The other half of the jar - sending its cookies back to the server on the next request as a single Cookie header. Today you produce that header from the jar.
goal: Produce a Cookie header value from the jar as name-value pairs joined by a semicolon and space.
spec:
  scenario: Sending cookies back
  status: failing
  lines:
    - kw: Given
      text: 'a jar holding cookies a=1 and b=2'
    - kw: When
      text: the Cookie header value is produced
    - kw: Then
      text: 'it is "a=1; b=2" - name=value pairs joined by "; ", in name order'
    - kw: And
      text: 'an empty jar produces no Cookie header (an empty value that the client omits)'
code:
  lang: go
  source: |
    // join every stored cookie as "name=value", separated by "; ".
    // emit in sorted name order so the header is deterministic.
    // an empty jar yields "" (and the client sends no Cookie header).
    func (j *Jar) header() string {
      // sort names; join "name=value" with "; "
    }
checkpoint: The jar emits a Cookie header carrying its stored cookies. Commit and stop here.
---

The jar's second job is to hand its cookies back. Unlike `Set-Cookie` (one header per
cookie, with attributes), the request side sends **all cookies in a single `Cookie`
header**, as `name=value` pairs joined by `; `. A jar holding `a=1` and `b=2` produces
`a=1; b=2`. Emit them in **sorted name order** so the header is deterministic - the
same jar always produces the same bytes, the same discipline as sorted request
headers and ordered form pairs.

An empty jar produces an empty string, and the client simply sends no `Cookie` header
at all - there is nothing to say. With `Set-Cookie` parsed into the jar and the jar
emitting `Cookie`, the client can carry a session across requests. The capstone puts
it together: follow a redirect while carrying a cookie the first response set.

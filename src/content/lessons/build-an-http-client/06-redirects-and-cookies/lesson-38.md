---
project: build-an-http-client
lesson: 38
title: Parse Set-Cookie
overview: Servers hand out cookies with the Set-Cookie header, a name-value pair plus attributes. Today you parse one into its parts, the first step toward a cookie jar.
goal: Parse a Set-Cookie value into the cookie name, value, and its attributes.
spec:
  scenario: Parsing a Set-Cookie header
  status: failing
  lines:
    - kw: Given
      text: 'the Set-Cookie value "sid=abc123; Path=/; Domain=example.com"'
    - kw: When
      text: it is parsed
    - kw: Then
      text: 'the cookie name is "sid", the value is "abc123", the Path attribute is "/" and the Domain attribute is "example.com"'
    - kw: And
      text: 'the first "key=value" pair is the cookie itself; the remaining semicolon-separated parts are attributes'
code:
  lang: go
  source: |
    // split the value on ";". the FIRST part is "name=value" (the
    // cookie). each remaining part is an attribute, itself "key=value"
    // (or a bare flag like "HttpOnly"). trim spaces around each part.
    type Cookie struct { Name, Value string; Attrs map[string]string }
    func parseSetCookie(v string) Cookie { /* first pair + attributes */ }
checkpoint: You can parse a Set-Cookie header into a cookie with its attributes. Commit and stop here.
---

A **cookie** is how a server keeps state across requests: it sends `Set-Cookie` with
a `name=value` pair, and the client is expected to send that pair back on later
requests. The header carries **attributes** too - `Path`, `Domain`, `Expires`,
`HttpOnly` - separated by semicolons. The structure is regular: the first
semicolon-separated part is the cookie's `name=value`, and each part after it is an
attribute (a `key=value`, or a bare flag).

So `sid=abc123; Path=/; Domain=example.com` parses to a cookie named `sid` with value
`abc123`, plus `Path` and `Domain` attributes. Today just parse the structure; the
attributes are captured but the jar you build next stores cookies by name and value.
Full attribute semantics - path and domain matching, expiry - are a place this
teaching client deliberately keeps simple.

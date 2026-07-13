---
project: build-an-http-client
lesson: 41
title: 'Capstone: follow a redirect carrying a cookie'
overview: The whole client in one exchange - a request gets a 302 that both sets a cookie and points elsewhere, and the follow-up request lands at the new location carrying that cookie. This is a real session in miniature.
goal: Follow a redirect that sets a cookie, producing a follow-up request to the new location carrying the Cookie header.
spec:
  scenario: A redirect-and-cookie round-trip
  status: failing
  lines:
    - kw: Given
      text: 'an empty jar and a GET to "http://example.com/login" whose stream returns "HTTP/1.1 302 Found\r\nLocation: /home\r\nSet-Cookie: sid=xyz; Path=/\r\nContent-Length: 0\r\n\r\n"'
    - kw: When
      text: the client follows the redirect
    - kw: Then
      text: 'it stores sid=xyz, resolves the Location to "http://example.com/home", and the follow-up is a GET carrying header Cookie "sid=xyz"'
    - kw: And
      text: 'the follow-up request bytes are exactly "GET /home HTTP/1.1\r\nCookie: sid=xyz\r\nHost: example.com\r\n\r\n"'
code:
  lang: go
  source: |
    // 1. Do the login request; get the 302 response
    // 2. parse Set-Cookie into the jar (SetCookie)
    // 3. resolveLocation(current, resp.Get("Location")) -> /home
    // 4. redirectMethod(302, "GET") -> GET
    // 5. build the follow-up; set Cookie header from jar.header()
    // 6. assert its bytes match exactly
checkpoint: Your client follows a redirect while carrying a server-set cookie. The project is complete - commit and stop here.
---

This is the promise the whole project was built to keep: a client that holds a real
**conversation** with a server. The login response does two things at once - it sets
a cookie (`sid=xyz`) and redirects you (`Location: /home`) - and a working client has
to honor both. It parses the `Set-Cookie` into its jar, resolves `/home` against the
current host, keeps the method a `GET` per the 302 rule, and issues the follow-up
request **carrying the cookie it was just handed**: `GET /home` with `Cookie:
sid=xyz`.

Every layer is doing its job. The URL parser resolved the relative location, the
request builder framed the follow-up with sorted headers, the redirect rule chose the
method, and the cookie jar carried the session forward. From parsing a scheme off a
string you have built the honest core of an HTTP/1.1 client - request serialization,
response parsing, chunked and length framing, keep-alive, encodings, redirects, and
cookies - all verified against exact bytes. The finalize wraps this unchanged core in
a real socket to fetch a live page. That is a real client, and it is yours.

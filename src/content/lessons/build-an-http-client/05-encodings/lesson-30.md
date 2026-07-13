---
project: build-an-http-client
lesson: 30
title: Basic authentication
overview: With base64 in hand you can send credentials. Today you build the Authorization header for HTTP Basic auth, the simplest way a client proves who it is.
goal: Set an Authorization header carrying base64-encoded credentials for Basic authentication.
spec:
  scenario: Building a Basic auth header
  status: failing
  lines:
    - kw: Given
      text: 'the username "Aladdin" and password "open sesame"'
    - kw: When
      text: Basic auth is applied to a request
    - kw: Then
      text: 'the Authorization header is "Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ=="'
    - kw: And
      text: 'the value is the literal "Basic " followed by base64 of "username:password" (the two joined by a single colon)'
code:
  lang: go
  source: |
    // Basic auth: Authorization: Basic base64(user + ":" + pass)
    // note the single colon joining them BEFORE encoding.
    func (r *Request) SetBasicAuth(user, pass string) {
      // Set("Authorization", "Basic "+base64Encode([]byte(user+":"+pass)))
    }
checkpoint: A request can carry Basic auth credentials in its Authorization header. Commit and stop here.
---

**HTTP Basic authentication** is the simplest way a client identifies itself: join
the username and password with a **single colon**, base64-encode the result, and put
it in an `Authorization` header prefixed with `Basic `. The classic example
`Aladdin` / `open sesame` becomes `Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==` - the string
`Aladdin:open sesame` run through the encoder you just built.

There is no hashing or challenge here - Basic auth is only as safe as the transport
carrying it, which is why it belongs over HTTPS in practice. But the header itself is
a clean, exact construction, and it is a perfect use of the base64 encoder. With
credentials handled, the rest of the chapter turns to the other thing clients encode
constantly: form data.

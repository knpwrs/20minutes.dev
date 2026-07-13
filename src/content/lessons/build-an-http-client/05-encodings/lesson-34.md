---
project: build-an-http-client
lesson: 34
title: A urlencoded POST
overview: The chapter's payoff is building a POST whose body is a form and whose headers say so. Today you wire the form encoder into a request with the right Content-Type and length.
goal: Build a form POST whose body is encoded pairs, with the correct Content-Type and Content-Length.
spec:
  scenario: Posting a form
  status: failing
  lines:
    - kw: Given
      text: 'a POST for "http://example.com/submit" with form pairs (name, "Ada") and (city, "NYC"), Host derived'
    - kw: When
      text: the request is built and serialized
    - kw: Then
      text: 'the body is "name=Ada&city=NYC", the Content-Type header is "application/x-www-form-urlencoded", and Content-Length is "17"'
    - kw: And
      text: 'the headers serialize in sorted order (content-length, content-type, host) before the blank line and body'
code:
  lang: go
  source: |
    // combine the pieces: encode the pairs into a body, set the
    // form Content-Type, and attach the body (which sets Content-Length).
    //   body := encodeForm(pairs)
    //   req.Set("Content-Type", "application/x-www-form-urlencoded")
    //   req.SetBody([]byte(body))
checkpoint: You can post a form with a correctly encoded body and matching headers. The encodings chapter is done - commit and stop here.
---

This is the everyday form submission a browser makes, built from your own pieces.
The pairs `(name, "Ada")` and `(city, "NYC")` encode to the body `name=Ada&city=NYC`;
the **Content-Type** header declares it `application/x-www-form-urlencoded` so the
server knows how to parse it; and attaching the body sets **Content-Length** to its
seventeen bytes automatically, using the body-framing from chapter two.

Everything composes: the form encoder from this chapter produces the body, the
request builder from chapter two frames it, and the header block serializes in sorted
order. The client can now authenticate and submit forms - the two encodings that
carry real data to a server. The final chapter turns to how a client *follows a
conversation* across responses: redirects and cookies.

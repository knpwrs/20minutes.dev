---
project: build-an-http-client
lesson: 35
title: Detect a redirect
overview: A 3xx response with a Location header is asking the client to go somewhere else. Today you detect that case, the first step toward following a redirect.
goal: Report whether a response is a followable redirect and expose its Location.
spec:
  scenario: Recognizing a redirect
  status: failing
  lines:
    - kw: Given
      text: 'a response with status 302 and header Location "http://example.com/new"'
    - kw: When
      text: it is checked for a redirect
    - kw: Then
      text: 'it is a redirect and its Location is "http://example.com/new"'
    - kw: And
      text: 'a status 200 is not a redirect, and a 3xx response with no Location header is not followable'
code:
  lang: go
  source: |
    // a followable redirect is: status in 300..399 AND a Location
    // header is present. return the Location value too.
    func (r *Response) redirect() (location string, ok bool) {
      // ok := status >= 300 && status < 400 && Get("Location") != ""
    }
checkpoint: The client can detect a followable redirect and read its Location. Commit and stop here.
---

A **redirect** is the server telling the client "what you asked for lives elsewhere,
go here instead." It is signalled by a **3xx status code** together with a
**Location** header naming the new target. So `302 Found` with `Location:
http://example.com/new` is a redirect to that URL. A `200` is not a redirect, and a
3xx with no `Location` has nowhere to send you, so it is not followable.

Detecting the redirect is the easy first step; the interesting parts follow. The
`Location` may be a relative reference that has to be resolved against the current
URL (next lesson), and the status code decides whether the follow-up keeps the
original method or switches to `GET` (the lesson after). But it all starts with
noticing that a response is asking to be followed.

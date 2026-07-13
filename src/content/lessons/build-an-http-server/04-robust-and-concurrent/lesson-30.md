---
project: build-an-http-server
lesson: 30
title: Handle HEAD requests
overview: A HEAD request asks for a resource's headers without its body - browsers and caches use it to check things cheaply. Today you serve HEAD as a GET with the body stripped off.
goal: Answer a HEAD request with the same status and headers as the GET, but no body.
spec:
  scenario: HEAD returns headers without a body
  status: failing
  lines:
    - kw: Given
      text: 'GET "/index.html" would return status 200, Content-Length 13, and a 13-byte body'
    - kw: When
      text: 'a HEAD "/index.html" request is served'
    - kw: Then
      text: 'the status is 200 and the header "Content-Length: 13" is present'
    - kw: And
      text: the response body is empty
code:
  lang: go
  source: |
    resp := m.dispatch(asGet(r)) // route it as if it were GET
    if r.Method == "HEAD" {
        resp.Body = nil // keep Content-Length, drop the bytes
    }
checkpoint: 'HEAD returns the headers a GET would, with no body. Commit.'
---

A **`HEAD`** request is a `GET` that returns everything *except* the body: same
status, same headers — crucially the same `Content-Length` — but zero body bytes.
Clients use it to check whether a resource changed, or how big it is, without
paying to download it.

The clean way to implement it is to route the request as though it were a `GET`,
then blank the body on the way out. Keep `Content-Length` reporting what the body
*would* have been — that is the whole value of a `HEAD`. Mind the interaction with
your serializer: if it derives `Content-Length` from the body, blanking the body
would zero it, so set the length **explicitly** from the `GET` body first (this is
why the serializer only fills in a `Content-Length` the caller has not already
set).

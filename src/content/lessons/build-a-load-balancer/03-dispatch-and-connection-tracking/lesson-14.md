---
project: build-a-load-balancer
lesson: 14
title: Dispatching through a transport
overview: A balancer has to actually forward the request somewhere. To stay testable offline, forwarding goes through an injected transport - a function from backend and request to a response - so Dispatch drives the whole flow with no real network.
goal: Dispatch a request by leasing a backend, calling the transport, and releasing - returning the transport's response.
spec:
  scenario: Dispatch forwards through the transport and releases
  status: failing
  lines:
    - kw: Given
      text: 'a Balancer over round-robin for A, B, C, and a transport that returns a Response with Body "ok:" + the backend''s id'
    - kw: When
      text: 'Dispatch is called three times in a row'
    - kw: Then
      text: 'it returns bodies "ok:A", "ok:B", "ok:C"'
    - kw: And
      text: 'after each Dispatch returns, the chosen backend''s Active() is back to 0 because the lease was released'
code:
  lang: go
  source: |
    type Request struct { Key, Body string }
    type Response struct { Body string }
    type Transport func(b *Backend, req Request) (Response, error)
    func (bal *Balancer) Dispatch(req Request) (Response, error) {
      b, release, err := bal.Begin()
      if err != nil { return Response{}, err }
      defer release()                 // always free the lease
      return bal.transport(b, req)
    }
checkpoint: The Balancer forwards a request through the transport and frees the lease when done. Commit and stop here.
---

The **transport** is the seam that keeps this whole project offline-testable. A real
balancer would open a socket to the backend's address and proxy bytes; instead the
`Balancer` holds a `Transport` function - given the chosen backend and the request,
it returns a response. In a test the transport is a stub that returns a canned body,
so `Dispatch` is fully deterministic. At the very end, the finalize pass swaps in a
transport that speaks real TCP, and the same `Dispatch` code drives a live reverse
proxy.

`Dispatch` ties the lease to the request lifetime: `Begin` picks a backend and marks
it busy, the transport does the work, and a `defer`red `release` frees the lease when
the call returns. Because the release is deferred, the active count is raised for
exactly the duration of the transport call and back to 0 afterward - which is what
you assert today, and what makes the in-flight counts meaningful next.

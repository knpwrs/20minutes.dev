---
project: build-a-load-balancer
lesson: 1
title: A backend and its status
overview: A load balancer spreads work across a set of backends, so the first thing to model is one backend - an address it forwards to and whether it is currently up. Today you build that type and toggle its health.
goal: Create a backend with an id and address that starts up, and can be marked down and up again.
spec:
  scenario: A backend tracks whether it is up
  status: failing
  lines:
    - kw: Given
      text: 'a backend created with NewBackend("A", "10.0.0.1:80")'
    - kw: When
      text: 'its status is queried'
    - kw: Then
      text: 'ID is "A", Addr is "10.0.0.1:80", and IsUp reports true'
    - kw: And
      text: 'after MarkDown it reports false, after MarkUp it reports true again, and a second backend created with NewBackend("B", "10.0.0.2:80") is up and unaffected'
code:
  lang: go
  source: |
    // status is an enum so DRAINING can join UP and DOWN later
    type Status int
    const ( Up Status = iota; Down )
    type Backend struct {
      ID, Addr string
      status   Status
    }
    func NewBackend(id, addr string) *Backend { return &Backend{ID: id, Addr: addr, status: Up} }
    func (b *Backend) IsUp() bool { return b.status == Up }
    func (b *Backend) MarkDown() { b.status = Down }
    func (b *Backend) MarkUp()   { b.status = Up }
checkpoint: You have a backend that carries an address and a toggleable health status. Commit and stop here.
---

Every load balancer sits in front of a group of **backends** - the real servers
that do the work. A backend is mostly an **address** to forward a request to, plus
a little state the balancer keeps about it. The most important piece of that state
is whether the backend is **healthy** right now, because a balancer must never send
new work to a server it believes is down.

Model the health as a small **status** value rather than a bare boolean. Today it
only needs `Up` and `Down`, but later in the project a backend can also be
`Draining` (finishing its in-flight work while taking no new requests), and an
enum leaves room for that third state without a rewrite. Start every backend `Up`;
the health-check chapter is where status starts changing on its own.

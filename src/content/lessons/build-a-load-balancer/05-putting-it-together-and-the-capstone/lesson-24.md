---
project: build-a-load-balancer
lesson: 24
title: Sticky routing through the balancer
overview: Sticky selection needs a request key, which only the balancer sees at dispatch time. Today you wire session affinity end to end - Balance routes by the request's key, so a client keeps landing on the same backend through the full transport flow.
goal: Add a key-aware Balance that routes a request by its session key when the selector is sticky, staying stable as the pool changes.
spec:
  scenario: The balancer routes a session key to a stable backend end to end
  status: failing
  lines:
    - kw: Given
      text: 'a Balancer whose selector is sticky over round-robin for A, B, C, and a transport returning "ok:" + the backend id'
    - kw: When
      text: 'Balance is called for Request{Key:"u1"}, then Request{Key:"u1"} again, then Request{Key:"u2"}'
    - kw: Then
      text: 'the bodies are "ok:A", "ok:A", "ok:B" - u1 sticks to A, u2 gets the next round-robin pick B'
    - kw: And
      text: 'after a backend D is added, Balance for Request{Key:"u1"} still returns "ok:A", and every backend''s Active() is 0 after each call'
code:
  lang: go
  source: |
    type KeyedSelector interface{ SelectFor(key string) (*Backend, error) }
    func (bal *Balancer) Balance(req Request) (Response, error) {
      var b *Backend; var err error
      if ks, ok := bal.sel.(KeyedSelector); ok {
        b, err = ks.SelectFor(req.Key)   // sticky path
      } else {
        b, err = bal.sel.Select()        // stateless path
      }
      if err != nil { return Response{}, err }
      b.Incr(); defer b.Decr()
      resp, terr := bal.transport(b, req)
      if terr != nil { b.RecordFailure() } else { b.RecordSuccess() }
      return resp, terr
    }
checkpoint: Session affinity works through the full dispatch path, stable across pool changes. Commit and stop here.
---

The sticky selector you built in the selection chapter needs one thing the bare
`Select` signature never carried: the request's **session key**. That key only
becomes available when a real request arrives, so affinity has to be threaded through
the dispatch layer. `Balance` is that key-aware entry point - it checks whether its
selector is a `KeyedSelector` and, if so, routes by `req.Key`; otherwise it falls
back to the ordinary stateless pick. A type assertion keeps the stateless algorithms
untouched while giving sticky selection the key it needs.

With this, everything you built now composes into one call: `Balance` selects
(stateless or sticky), leases the connection, forwards through the transport, records
the outcome for passive health, and releases - the complete request path. The pins
confirm affinity survives the round trip: `u1` sticks to `A` across calls and even
after `D` joins the pool, while the active counts still return to 0 because each
lease is released. This is the public surface the finalize pass will put behind a real
TCP listener.

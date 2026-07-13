---
project: build-a-load-balancer
lesson: 25
title: 'Capstone: a scripted request stream'
overview: The finale drives a full request stream through the balancer - real selection, live connection tracking, passive ejection, draining, and an all-down moment - and asserts the exact backend chosen for every request and that every connection count ends at zero. Every layer you built proves itself at once.
goal: Run a scripted stream across flapping and draining backends and assert the exact per-request routing and final counts.
spec:
  scenario: A full workload routes exactly and leaks no connections
  status: failing
  lines:
    - kw: Given
      text: 'a round-robin Balancer over A, B, C all up, and a transport that fails for B but succeeds for A and C (returning "ok:" + id)'
    - kw: When
      text: 'Dispatch is called 11 times in a row'
    - kw: Then
      text: 'the backends chosen are A,B,C,A,B,C,A,B,A,C,A - B is picked on requests 2, 5, and 8, and its third consecutive failure marks it down, so from request 9 on the cycle runs over [A,C] only'
    - kw: And
      text: 'then marking A draining and dispatching once picks C; marking C down makes the next Dispatch return ErrNoHealthyBackend (no panic); marking C up and dispatching once picks C again; and at the end A.Active(), B.Active(), and C.Active() are all 0'
code:
  lang: go
  source: |
    // transport: return an error when b.ID == "B", else Response{Body:"ok:"+b.ID}
    for i := 0; i < 11; i++ { _, _ = bal.Dispatch(req) }        // A,B,C,A,B,C,A,B,A,C,A; B ejected after its 3rd fail
    poolA.MarkDraining(); bal.Dispatch(req)                     // -> C (avail is [C])
    poolC.MarkDown(); _, err := bal.Dispatch(req)              // err == ErrNoHealthyBackend
    poolC.MarkUp(); bal.Dispatch(req)                          // -> C
    // assert every backend's Active() == 0
checkpoint: Your balancer routes a full scripted stream exactly, ejects and drains cleanly, and leaks no connections. The project is complete; commit and stop here.
---

This is the promise the whole project was built to keep: a real **load balancer**
that makes every routing decision on purpose and can prove it. The scripted stream
exercises every layer at once - round-robin **selection** walking the pool, the
**lease** raising and lowering active counts, the **transport** returning success or
failure, **passive ejection** counting `B`'s failures until its third in a row pulls
it from rotation, and the cycle silently reshaping from three backends to two the
moment it happens. Tracing the ever-climbing round-robin counter by hand is the only
way to be sure of the exact `A,B,C,A,B,C,A,B,A,C,A` sequence, which is why the spec
pins the whole stream.

Then the endgame closes every loop: **draining** `A` removes it from new work while
its counts stay honest, an all-down moment returns `ErrNoHealthyBackend` instead of
panicking or spinning, recovery brings `C` back, and the final assertion that every
`Active()` count is 0 proves not a single connection leaked. From a bare backend
struct you have built the honest core of a real balancer - every selection algorithm,
connection tracking, and a passive-and-active health state machine - the same design
that sits inside HAProxy, NGINX, and Envoy, minus the real sockets, concurrency, and
richer routing they layer on top. The finalize pass puts this core behind a live TCP
reverse proxy; the decisions it makes are the ones you wrote.

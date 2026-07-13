---
project: build-an-http-server
lesson: 32
title: Serve connections concurrently
overview: One slow client should never freeze everyone else. Today you handle each connection on its own thread of execution so the server serves many clients at once.
goal: Handle each accepted connection concurrently so a slow client does not block others.
spec:
  scenario: Two clients served at once
  status: failing
  lines:
    - kw: Given
      text: 'a handler that sleeps briefly before responding, and two clients connecting at nearly the same time'
    - kw: When
      text: both requests are in flight
    - kw: Then
      text: both receive their response, and the second does not wait for the first to finish before it starts
code:
  lang: go
  source: |
    for {
        conn, err := ln.Accept()
        if err != nil { continue }
        go handle(conn) // each connection on its own goroutine
    }
checkpoint: 'Connections are handled concurrently, so one slow client cannot block others. Commit.'
---

So far the accept loop handled one connection to completion before accepting the
next — a single slow client would stall every other. Real servers handle
connections **concurrently**: accept, hand the connection to its own unit of
execution, and immediately loop back to accept the next.

In Go that unit is a goroutine — `go handle(conn)`. Other languages reach for
threads, an event loop, or an async runtime; the shape is the same. The accept
loop's only job becomes accepting, while handlers run in parallel. Mind that any
shared state (the router is read-only here, which keeps this simple) is safe to
touch from many goroutines.

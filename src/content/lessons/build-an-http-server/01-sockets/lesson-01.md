---
project: build-an-http-server
lesson: 1
title: Listen and accept a connection
overview: An HTTP server is a program that waits on a port for clients to connect. Today you open a listening socket and accept one connection, the raw foundation every later layer sits on.
goal: Open a TCP listener on a port and accept a single incoming connection without error.
spec:
  scenario: A client can connect to the server
  status: failing
  lines:
    - kw: Given
      text: 'a server listening on an address the operating system assigns (port 0)'
    - kw: When
      text: a client dials that same address
    - kw: Then
      text: the server accepts the connection and reports no error
code:
  lang: go
  source: |
    ln, err := net.Listen("tcp", "127.0.0.1:0") // :0 = OS picks a free port
    // ln.Addr() tells you which port you actually got
    conn, err := ln.Accept() // blocks until a client connects
    _ = conn
checkpoint: 'Your server binds a port and accepts a connection. Commit.'
---

Before any HTTP exists, there must be a **socket**: an operating-system handle
for one end of a network connection. A server *listens* on an address, and each
time a client connects, `Accept` hands back a fresh connection you can read from
and write to.

Binding to port **0** asks the OS for any free port, which keeps tests from
colliding on a fixed number. Read the real port back from the listener's address
so your test client knows where to dial. That is the whole handshake — bytes come
next.

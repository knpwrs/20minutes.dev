---
project: build-an-http-server
lesson: 2
title: Echo the bytes back
overview: A connection is a two-way pipe of bytes. Today you read what a client sends and write the same bytes back, giving you a running server you can actually talk to.
goal: Read the bytes a client sends on a connection and write the identical bytes back.
spec:
  scenario: The server echoes what it receives
  status: failing
  lines:
    - kw: Given
      text: an accepted connection
    - kw: When
      text: 'the client sends the bytes "ping"'
    - kw: Then
      text: 'the client reads back exactly "ping"'
code:
  lang: go
  source: |
    func handle(conn net.Conn) {
        defer conn.Close()
        buf := make([]byte, 1024)
        n, _ := conn.Read(buf) // n = how many bytes actually arrived
        conn.Write(buf[:n])    // write back only those n bytes
    }
checkpoint: You have a running echo server - start it, connect, and see your bytes come back. Commit.
---

A connection is just a stream of bytes in each direction. `Read` fills a buffer
with whatever has arrived and tells you **how many** bytes that was; `Write`
sends bytes the other way. Echoing means writing back exactly the slice you
read — `buf[:n]`, never the whole 1024-byte buffer.

This is your first runnable server. Wire `handle` into an accept loop and you can
start it, connect with any TCP client, and watch your input bounce straight back.
Every later lesson thickens this same read-then-write shape into real HTTP.

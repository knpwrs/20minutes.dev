---
project: build-a-dns-resolver
lesson: 24
title: The transport seam
overview: A resolver sends query bytes and gets response bytes back. Today you make that exchange an injectable function so the whole resolver is testable without a network - and use it to check the reply's ID echoes the query's.
goal: Send a query through an injectable transport and verify the response ID matches.
spec:
  scenario: A response echoes the query ID through an injectable transport
  status: failing
  lines:
    - kw: Given
      text: 'a resolver whose transport is a function query([]byte) -> ([]byte, error) that returns a response copying the request ID and setting the QR bit'
    - kw: When
      text: 'the resolver sends a query for "www.example.com" with ID 0x1314'
    - kw: Then
      text: 'the parsed response has ID 0x1314, matching the query, and its QR bit is set'
    - kw: And
      text: 'if the transport returns a response whose ID is not 0x1314, the resolver reports an ID-mismatch error'
code:
  lang: go
  source: |
    type Transport func(request []byte) (response []byte, err error)
    type Resolver struct{ send Transport }
    // today ask only parses the header; lesson 25 returns a full Message
    func (r *Resolver) ask(id uint16, name string) (Header, error) {
      resp, err := r.send(BuildQuery(id, name))
      // parse the header; reject if its ID != id
    }
checkpoint: The resolver exchanges bytes through an injectable transport and checks the ID. Commit and stop here.
---

A real resolver would open a UDP socket, send the query bytes, and read the reply.
That socket is OS-specific and impossible to test with exact values, so we hide it
behind a **seam**: an injectable function `query([]byte) -> ([]byte, error)` that
takes request bytes and returns response bytes. In production it wraps a socket; in
a test it returns **scripted** bytes you control. The resolver never knows the
difference, which is what keeps every remaining lesson exact and offline.

The first thing the resolver does with a reply is check the **ID**. You chose the
ID when building the query (lesson 11), and the server must echo it back so you can
match a response to the question you asked - important because a UDP socket might
receive a stray or forged packet. A mismatched ID means "this is not my answer,"
and the resolver rejects it. This seam plus the ID check is the backbone the rest
of the chapter hangs on.

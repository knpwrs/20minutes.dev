---
project: build-a-dns-resolver
lesson: 30
title: 'Capstone: resolve a name end to end'
overview: The finale drives the whole resolver against a scripted root, .com, and authoritative server to resolve www.example.com from nothing but a root address - echoing the query ID, honoring the RCODE, and returning the real answer. Every layer proves itself at once.
goal: Resolve www.example.com end to end through scripted nameserver responses.
spec:
  scenario: A full delegation resolves to an address
  status: failing
  lines:
    - kw: Given
      text: 'scripted responses for one delegation: the root refers .com to a TLD server, .com refers example.com to an authoritative server, and the authoritative server returns an A answer 93.184.216.34 with RCODE 0, each response echoing the query ID it was sent'
    - kw: When
      text: 'the resolver resolves "www.example.com" from the root address'
    - kw: Then
      text: 'it returns "93.184.216.34", having verified every response ID matched its query'
    - kw: And
      text: 'if the authoritative server instead replies RCODE 3, resolution returns an NXDOMAIN error rather than an address'
code:
  lang: go
  source: |
    root := scriptedRoot()  // refers .com
    tld  := scriptedCom()   // refers example.com
    auth := scriptedAuth()  // answers A 93.184.216.34
    r := &Resolver{dial: dialFor(root, tld, auth)}
    got, err := r.resolve("www.example.com") // "93.184.216.34"
checkpoint: Your resolver resolves a name from the root to its address. The project is complete; commit and stop here.
---

This is the promise the whole project was built to keep: a working **DNS
resolver**. The capstone assembles a complete delegation as scripted responses - a
root server that refers to `.com`, a `.com` server that refers to `example.com`'s
authoritative server, and an authoritative server that answers with the address -
and then lets your resolver walk it from a single root address to the final A
record `93.184.216.34`. Every piece you built runs at once: the query is encoded to
exact bytes, each response is parsed with compression and record decoding, the ID
is checked on every hop, the referral reader picks the next server from glue, and
the RCODE decides success or failure.

Swap the authoritative reply for an NXDOMAIN and the same code returns an error
instead of an address, proving the status handling is real and not decoration. From
a single big-endian helper you have built the honest core of a resolver - the wire
format, name compression, every common record type, and the iterative
root-to-authoritative algorithm - the same design that sits inside Unbound and
BIND, minus the live sockets, caching, and DNSSEC they layer on top. That is a real
resolver, and it is yours.

---
project: build-a-url-parser
lesson: 10
title: Classifying the host
overview: RFC 3986 allows three kinds of host - a registered name, an IPv4 address, or an IPv6 literal - and it helps to know which one you have. Today you write a classifier that labels the host, pinning the boundary where a dotted-decimal string stops being a valid IPv4 address.
goal: Classify a host as a registered name, an IPv4 address, or an IPv6 literal.
spec:
  scenario: Which kind of host
  status: failing
  lines:
    - kw: Given
      text: 'the hosts "192.168.0.1", "example.com", "[::1]", and "256.0.0.1"'
    - kw: When
      text: 'each host is classified'
    - kw: Then
      text: '"192.168.0.1" is IPv4 and "[::1]" is IPv6'
    - kw: And
      text: '"example.com" is a registered name, and "256.0.0.1" is also a registered name because 256 is not a valid octet'
code:
  lang: go
  source: |
    type HostKind int
    const ( RegName HostKind = iota; IPv4; IPv6 )
    func classifyHost(h string) HostKind {
      if strings.HasPrefix(h, "[") { return IPv6 }
      // IPv4 = four dot-separated octets, each 0..255
      // anything that fails that is still a legal reg-name
    }
checkpoint: A host now reports whether it is a name, an IPv4 address, or an IPv6 literal. Commit and stop here.
---

RFC 3986 says a host is one of three things: an **IP-literal** (the bracketed IPv6 form from last lesson), an **IPv4 address** in dotted-decimal, or a **registered name** - and knowing which lets a program decide whether to resolve a name or connect to an address directly. The bracketed case is unmistakable. IPv4 is a stricter pattern: exactly four parts separated by dots, each a number from 0 to 255. Everything else is a registered name, which is the permissive catch-all.

The instructive edge is `256.0.0.1`. It *looks* like an IPv4 address, but `256` is out of range for an octet, so it fails the IPv4 grammar. It does not become an error, though - a registered name is allowed to contain digits and dots, so `256.0.0.1` is simply a (perhaps unresolvable) registered name. That fall-through is the whole point of the classification order: try IPv6, then IPv4, and let anything that matches neither be a reg-name. Check the octet upper bound at exactly 255, so 255 passes and 256 falls through - the boundary is where the classification flips.

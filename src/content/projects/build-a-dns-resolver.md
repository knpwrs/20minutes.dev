---
title: 'Build a DNS Resolver'
order: 25
lessons: 30
size: 'Small'
tech: ['DNS wire format', 'Name compression', 'Recursive resolution']
estMin: 20
desc: 'Build a real DNS resolver from first principles, one exact byte at a time. Start with the 12-byte header and its packed flag bits, encode and decode domain names as length-prefixed labels, handle the classic 0xC0 compression pointers with a loop guard, parse every common record type (A, AAAA, NS, CNAME, MX, TXT, SOA), then drive the resolution algorithm through an injectable transport - build a query, parse a response, follow a CNAME chain, and walk root to TLD to authoritative using referrals and glue - ending in a resolver that resolves www.example.com end to end against scripted nameserver responses with no network at all.'
blurb: 'Model the network as a single injectable function query(bytes) -> bytes so the whole resolver is testable against exact message bytes and canned responses, no sockets required. Every lesson is one concrete spec with real wire bytes: the RD flag landing in the right bit, a QNAME ending in its zero root label, a 0xC0 0x0C pointer resolving to offset 12, a rejected pointer loop, four RDATA bytes becoming 93.184.216.34, a CNAME target that itself uses compression, and a response whose ID must echo the query it answered.'
overview: |
  Over 30 lessons you build a working DNS resolver from scratch, entirely offline. The trick that keeps every step exactly testable is to treat DNS as what it really is - a byte format - and to model the network as a single injectable function, query(bytes) -> bytes. Because the transport is injected, you drive the whole resolver with scripted nameserver responses held in memory: no sockets, no flakiness, and the same resolver runs identically in any language.

  You start at the bottom of the stack and climb. First the 12-byte header: the ID, the flag bits (QR, Opcode, AA, TC, RD, RA, Z, RCODE) packed across two bytes, and the four section counts, encoded and decoded to exact bytes. Then domain names as length-prefixed labels ending in a zero root, the question section, and a complete query message with a fixed ID. Next the classic tricky bit - name compression, following a 0xC0 pointer to an earlier offset, chasing a pointer chain, and guarding against pointer loops. Then the resource records: the RR wire format bounded by RDLENGTH, and the common RDATA types A, AAAA, NS, CNAME, MX, TXT, and SOA. Finally the resolver itself: build a query and parse a full response, honor the RCODE and the truncation bit, follow a CNAME chain, read NS referrals and glue, and run the iterative root to TLD to authoritative algorithm - all through the injectable transport. The capstone resolves www.example.com against a scripted root, .com, and authoritative server and returns its A record.

  This is a teaching-grade resolver built around the message format in RFC 1035. The graded core - the wire-format codec and the resolution logic - is complete and exact, proven end to end against scripted responses. On top of it a small command-line tool adds the real network layer: a stub-resolver mode that queries a configured server over UDP resolves real A, AAAA, NS, CNAME, MX, TXT, and SOA records and reports NXDOMAIN, SERVFAIL, timeout, and truncation cleanly. It deliberately stops short of the pieces the live root demands: there is no EDNS0, so full iterative resolution against real root servers truncates, and there is no TCP fallback, DNSSEC validation, or caching. That honest core is exactly what production resolvers like Unbound and BIND extend with those transports, security, and a cache.
parts:
  - name: 'The 12-byte header'
    count: 5
  - name: 'Names and the question section'
    count: 6
  - name: 'Name compression'
    count: 4
  - name: 'Resource records'
    count: 8
  - name: 'The resolver'
    count: 7
caveats:
  note: 'The stub resolver reliably resolves real A, AAAA, NS, CNAME, MX, TXT, and SOA records against any configured DNS server end to end, with graceful handling of NXDOMAIN, SERVFAIL, timeout, and truncation - but the iterative root-to-authoritative mode, while correctly wired to real per-server UDP, fails against live root servers today because there is no EDNS0 support, so their referral responses exceed the legacy 512-byte UDP limit and truncate.'
  future:
    - 'Add EDNS0 (the OPT pseudo-record, RFC 6891) so referral responses from real root and TLD servers stop truncating and iterative resolution works against the live internet'
    - 'Add TCP fallback and a retry when a response has the TC (truncation) bit set, the standard recovery for oversized replies'
    - 'Generalize the resolver to chase AAAA, MX, and other record types through a referral chain, not just A records'
    - 'Add TTL-respecting caching so repeated lookups reuse answers until they expire, the way a real recursive resolver does'
    - 'Add retries with backoff and failover to a secondary server on timeout, plus source-port and ID randomization to harden against spoofing'
    - 'Add DNSSEC signature validation to authenticate answers rather than trusting them'
resources:
  - title: 'RFC 1035: Domain Names - Implementation and Specification'
    author: 'P. Mockapetris'
    url: 'https://www.rfc-editor.org/rfc/rfc1035'
    note: 'The authoritative wire-format reference and the backbone of this project. Section 4 gives the exact byte layout of the header, question, and resource records; section 4.1.4 is the message-compression pointer scheme you implement in chapter three.'
  - title: 'RFC 1034: Domain Names - Concepts and Facilities'
    author: 'P. Mockapetris'
    url: 'https://www.rfc-editor.org/rfc/rfc1034'
    note: 'The companion concepts document: the domain namespace as a tree, zones and delegation, and the iterative resolution algorithm (start at the root, follow NS referrals down to the authoritative server) that chapter five turns into code.'
  - title: 'Implement DNS in a Weekend'
    author: 'Julia Evans'
    url: 'https://implement-dns.wizardzines.com/'
    note: 'A friendly, hands-on guided project that builds a toy resolver from the wire format up - header, questions, records, compression, and iterative resolution. The closest companion to this project, well worth reading alongside it.'
  - title: 'How DNS Works (a comic)'
    author: 'Julia Evans and Monica Dinculescu'
    url: 'https://howdns.works/'
    note: 'A short illustrated tour of what happens when you look up a name - resolvers, root servers, TLD servers, and authoritative servers. Read it first for the big picture the resolver chapter implements.'
  - title: 'RFC 3596: DNS Extensions to Support IP Version 6'
    author: 'S. Thomson, C. Huitema, V. Ksinant, M. Souissi'
    url: 'https://www.rfc-editor.org/rfc/rfc3596'
    note: 'Defines the AAAA record (type 28) whose 16-byte RDATA you parse into an IPv6 address in chapter four.'
  - title: 'DNS and BIND (5th edition)'
    author: 'Cricket Liu, Paul Albitz'
    note: 'The classic operational reference for the domain name system: zones, delegation, record types, and how real resolvers and authoritative servers behave. Good background for the concepts the lessons implement in miniature.'
---

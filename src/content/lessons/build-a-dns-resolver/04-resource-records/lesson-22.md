---
project: build-a-dns-resolver
lesson: 22
title: SOA records
overview: The SOA record describes a zone - two names and five 32-bit timers that govern how the zone is served and cached. Today you parse all seven fields, the last and richest record type in the chapter.
goal: Parse an SOA record's two names and five 32-bit fields.
spec:
  scenario: An SOA record parses into two names and five timers
  status: failing
  lines:
    - kw: Given
      text: 'an SOA RDATA of MNAME ns.example.com, RNAME admin.example.com, then serial 1, refresh 3600, retry 600, expire 604800, minimum 300 (each a 32-bit big-endian value)'
    - kw: When
      text: 'the RDATA is parsed'
    - kw: Then
      text: 'MNAME is "ns.example.com", RNAME is "admin.example.com", and Serial/Refresh/Retry/Expire/Minimum are 1/3600/600/604800/300'
    - kw: And
      text: 'the five 32-bit fields are read in that order right after the two names'
code:
  lang: go
  source: |
    // two names (each may compress), then five uint32 timers
    mname, n1, _ := decodeName(msg, off)      // name, consumed, err
    rname, n2, _ := decodeName(msg, off+n1)
    i := off + n1 + n2
    serial := uint32At(msg, i); i += 4 // then refresh, retry, expire, minimum
checkpoint: You can parse an SOA record. Commit and stop here.
---

The **SOA record** (start of authority) sits at the top of every zone and holds its
administrative metadata: an **MNAME** (the primary name server), an **RNAME** (the
administrator's mailbox, written as a domain name), and five **32-bit timers** -
**serial** (a version number for the zone), **refresh**, **retry**, **expire**, and
**minimum**. The two names come first, each decoded with your name decoder (and
each able to use compression), then the five timers as consecutive big-endian
32-bit values.

Reading it is a matter of staying oriented: decode MNAME, decode RNAME starting
right after it, then read five `uint32`s in order. The values here - serial `1`,
refresh `3600`, retry `600`, expire `604800`, minimum `300` - are the kind of
timers a real zone publishes. SOA is the most fields of any record you parse, but
every field reuses a tool you already built. With it done, the next lesson stops
parsing one record at a time and reads a whole section.

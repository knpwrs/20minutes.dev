---
project: build-a-dns-resolver
lesson: 5
title: Parsing the header
overview: With encoding and flag accessors in hand, you can now read a header off the wire. Today you decode 12 bytes back into a Header struct and prove a full round-trip, closing the chapter with a header you can both write and read.
goal: Parse 12 bytes into a Header and confirm it round-trips with encoding.
spec:
  scenario: Twelve bytes parse back into a header
  status: failing
  lines:
    - kw: Given
      text: 'the 12 bytes 13 14 01 00 00 01 00 00 00 00 00 00 (a query with ID 0x1314, RD set, QDCOUNT 1)'
    - kw: When
      text: 'the bytes are parsed into a Header'
    - kw: Then
      text: 'ID is 0x1314, QDCOUNT is 1, ANCOUNT/NSCOUNT/ARCOUNT are 0, and the flags word is 0x0100 (RD set)'
    - kw: And
      text: 'encoding that Header reproduces the original 12 bytes exactly'
code:
  lang: go
  source: |
    func ParseHeader(b []byte) (Header, error) {
      if len(b) < 12 {
        return Header{}, errShort
      }
      // read six uint16 fields with uint16At at offsets 0,2,4,6,8,10
    }
checkpoint: You can parse a header and it round-trips with Encode. Commit and stop here.
---

Reading a header is the mirror of writing one: pull six 16-bit values off the
front of the message at offsets `0, 2, 4, 6, 8, 10` and drop them into the struct
fields. The only new discipline is a **bounds check** - a real message might be
too short, so refuse anything under 12 bytes rather than reading past the end.

Parsing the query header from today's bytes gives back exactly the struct that
produced them: ID `0x1314`, flags `0x0100` (RD set, which the accessors from
lesson 4 confirm), QDCOUNT `1`, and the rest zero. A **round-trip** test - parse
then re-encode and compare to the original bytes - is the cleanest proof the two
halves agree, and it is the pattern you will reuse for names and records. The
header is now something you can both build and read.

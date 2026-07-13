---
project: build-a-dns-resolver
lesson: 2
title: The 12-byte header
overview: Every DNS message begins with a fixed 12-byte header - six 16-bit fields in a row. Today you define the header struct and encode it to those exact 12 bytes, leaving the flag bits (a field of their own) as zero for now.
goal: Encode a header struct to its exact 12 bytes with the flags word left zero.
spec:
  scenario: A header encodes to twelve big-endian bytes
  status: failing
  lines:
    - kw: Given
      text: 'a Header with ID 0x1314, QDCOUNT 1, and every other field (flags and the three other counts) 0'
    - kw: When
      text: 'the header is encoded'
    - kw: Then
      text: 'the result is exactly the 12 bytes 13 14 00 00 00 01 00 00 00 00 00 00'
    - kw: And
      text: 'the six fields appear in the order ID, flags, QDCOUNT, ANCOUNT, NSCOUNT, ARCOUNT'
code:
  lang: go
  source: |
    type Header struct {
      ID                             uint16
      Flags                          uint16 // packed bits - stays 0 today
      QDCOUNT, ANCOUNT, NSCOUNT, ARCOUNT uint16
    }
    func (h Header) Encode() []byte {
      // append putUint16 of each field, in order
    }
checkpoint: A header encodes to its exact 12 bytes. Commit and stop here.
---

Every DNS message - query or response - starts with a **12-byte header** made of
six 16-bit fields laid out in a fixed order: the **ID** (a number the client picks
so it can match a reply to its question), a **flags** word (sixteen packed control
bits we will unpack next), and four **section counts** - QDCOUNT, ANCOUNT,
NSCOUNT, ARCOUNT - saying how many entries follow in the question, answer,
authority, and additional sections.

Today you only need to lay those six fields down in order using the big-endian
helper from lesson 1. Leave the flags word as `0` for now; a query with one
question and nothing else has QDCOUNT `1` and the rest `0`, which is exactly the
header you encode here. Getting the field order and the fixed 12-byte width right
is the point.

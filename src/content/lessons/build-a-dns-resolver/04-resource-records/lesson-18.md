---
project: build-a-dns-resolver
lesson: 18
title: AAAA records
overview: An AAAA record holds an IPv6 address - sixteen bytes read as eight 16-bit groups. Today you format those groups into the colon-separated hex form, the IPv6 counterpart to the A record.
goal: Convert a 16-byte AAAA record RDATA into a colon-separated IPv6 string.
spec:
  scenario: Sixteen bytes of RDATA become an IPv6 address
  status: failing
  lines:
    - kw: Given
      text: 'an AAAA record whose RDATA is 20 01 0d b8 00 00 00 00 00 00 00 00 00 00 00 01'
    - kw: When
      text: 'the RDATA is formatted as eight 16-bit groups in lowercase hex, each without leading zeros, joined by colons'
    - kw: Then
      text: 'the result is "2001:db8:0:0:0:0:0:1"'
    - kw: And
      text: 'RDATA of all zero bytes formats as "0:0:0:0:0:0:0:0"'
code:
  lang: go
  source: |
    func formatAAAA(rdata []byte) string {
      var groups []string
      for i := 0; i < 16; i += 2 {
        g := uint16(rdata[i])<<8 | uint16(rdata[i+1])
        groups = append(groups, fmt.Sprintf("%x", g)) // lowercase, no pad
      }
      return strings.Join(groups, ":")
    }
checkpoint: You can turn an AAAA record into an IPv6 string. Commit and stop here.
---

The **AAAA record** is the IPv6 address record, and its RDATA is **sixteen bytes**
- an IPv6 address is 128 bits. Read them as **eight 16-bit groups** and print each
in lowercase hex, dropping leading zeros within a group, joined by colons. So
`2001:0db8:...:0001` prints as `2001:db8:0:0:0:0:0:1`.

Real IPv6 notation also collapses the longest run of zero groups into a `::`, but
that shortening is a display convenience with fiddly rules, so we deliberately skip
it and emit all eight groups every time - a fully valid, unambiguous form that is
trivial to produce and to test. Like the A record, an AAAA record's RDATA has a
fixed length (sixteen bytes), so a real parser rejects any other length; we keep
this formatter simple and trust the RDLENGTH framing to hand it the right sixteen.
The four bytes of A and the sixteen of AAAA are the two address records; the next
records swap raw bytes for names.

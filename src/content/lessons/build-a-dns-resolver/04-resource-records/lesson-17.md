---
project: build-a-dns-resolver
lesson: 17
title: A records
overview: The A record is the point of most lookups - four bytes of RDATA that are an IPv4 address. Today you turn those four bytes into a dotted-decimal string, the answer a resolver ultimately hands back.
goal: Convert a 4-byte A record RDATA into a dotted-decimal IPv4 string, rejecting any other length.
spec:
  scenario: Four bytes of RDATA become a dotted IPv4 address
  status: failing
  lines:
    - kw: Given
      text: 'an A record whose RDATA is the 4 bytes 5D B8 D8 22'
    - kw: When
      text: 'the RDATA is formatted as an IPv4 address'
    - kw: Then
      text: 'the result is "93.184.216.34"'
    - kw: And
      text: '00 00 00 00 formats as "0.0.0.0" and FF FF FF FF as "255.255.255.255"'
    - kw: And
      text: 'RDATA that is not exactly 4 bytes long (for example 3 bytes) is rejected as a malformed A record rather than formatted'
code:
  lang: go
  source: |
    func formatA(rdata []byte) (string, error) {
      if len(rdata) != 4 { // an A record's RDATA is always 4 bytes
        return "", errBadA
      }
      // each byte is one octet, joined by dots
      return fmt.Sprintf("%d.%d.%d.%d",
        rdata[0], rdata[1], rdata[2], rdata[3]), nil
    }
checkpoint: You can turn an A record into a dotted IPv4 string. Commit and stop here.
---

An **A record** answers the most common question in DNS: what is the IPv4 address
for this name? Its RDATA is exactly **four bytes**, one per octet of the address,
and formatting it is just printing each byte in decimal joined by dots. The four
bytes `5D B8 D8 22` are `93`, `184`, `216`, `34` - the address `93.184.216.34`.

There is little more to the A record than that, which is what makes it the
satisfying payoff of all the framing work: RDLENGTH told you there are four bytes,
and those four bytes are the address. Cover the boundaries - `00 00 00 00` is
`0.0.0.0` and `FF FF FF FF` is `255.255.255.255`. The one guard worth adding is a
**length check**: an A record's RDATA is defined to be exactly four bytes, so
anything else is a malformed record and should be rejected rather than read past
the end of a short slice. That check is why the formatter returns an error
alongside the string. Every other record type is the same move with a different
RDATA shape, starting with A's 128-bit sibling next.

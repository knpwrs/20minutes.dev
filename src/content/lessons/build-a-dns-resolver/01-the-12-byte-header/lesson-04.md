---
project: build-a-dns-resolver
lesson: 4
title: RCODE and unpacking the flags
overview: The low flag byte carries RA, three reserved Z bits, and the 4-bit RCODE - the response's success-or-failure code. Today you finish the low byte and, just as importantly, unpack a whole flags word back into its named fields so a parsed response can be read.
goal: Pack the low flag byte and unpack a flags word back into its fields.
spec:
  scenario: The low flag byte holds RCODE, and a flags word unpacks
  status: failing
  lines:
    - kw: Given
      text: 'the low byte layout RA (bit 7), Z (bits 6-4), RCODE (bits 3-0)'
    - kw: When
      text: 'a response sets RA and RCODE 3 (NXDOMAIN)'
    - kw: Then
      text: 'the low flag byte is 0x83'
    - kw: And
      text: 'unpacking the flags word 0x8183 gives QR true, RD true, RA true, and RCODE 3'
code:
  lang: go
  source: |
    // low byte: RCODE is the bottom 4 bits, RA is the top bit
    func rcode(flags uint16) uint8 { return uint8(flags & 0x000F) }
    func ra(flags uint16) bool     { return flags&0x0080 != 0 }
    func qr(flags uint16) bool     { return flags&0x8000 != 0 }
    // build the low byte by OR-ing RA (0x80) with the RCODE value (0..15)
checkpoint: You can read RCODE and unpack any flags word into fields. Commit and stop here.
---

The low byte of the flags word finishes the set: **RA** (recursion available, set
by a server that will recurse), three reserved **Z** bits that must be zero, and
the 4-bit **RCODE** in the lowest nibble. RCODE is how a server reports the
outcome: `0` is success (NOERROR), `2` is SERVFAIL, and `3` is **NXDOMAIN**, the
name does not exist. Because RCODE lives in bits 3-0 of the low byte, a response
that sets RA and RCODE `3` has a low flag byte of `0x80 | 0x03 = 0x83`.

The other half of today is **unpacking**. When you parse a response you will have
a raw 16-bit flags word and need to pull out the fields by masking: RCODE is
`flags & 0x000F`, RA is bit 7 of the low byte (`0x0080`), QR is the top bit
(`0x8000`). Read the word `0x8183` this way and you find a recursive response
(QR set, RD set, RA set) that failed with NXDOMAIN. These accessors are what the
resolver later uses to decide whether a reply succeeded.

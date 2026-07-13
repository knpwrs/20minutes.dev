---
project: build-a-dns-resolver
lesson: 3
title: Packing the flag bits
overview: The header's flags word is sixteen bits packing eight separate fields. Today you build the high flag byte - QR, Opcode, AA, TC, and RD - and pin the RD bit to its exact position, the bit a standard query sets to ask for recursion.
goal: Pack the high-byte flag fields into the top byte of the flags word.
spec:
  scenario: The high flag byte packs QR, Opcode, AA, TC, and RD
  status: failing
  lines:
    - kw: Given
      text: 'the flag layout where the high byte holds QR (bit 7), Opcode (bits 6-3), AA (bit 2), TC (bit 1), and RD (bit 0)'
    - kw: When
      text: 'a query sets only RD (recursion desired)'
    - kw: Then
      text: 'the high flag byte is 0x01 and the flags word is 0x0100'
    - kw: And
      text: 'setting QR, AA, and RD together makes the high flag byte 0x85 (0x80 | 0x04 | 0x01)'
code:
  lang: go
  source: |
    // high byte bit positions (a query with recursion desired sets RD)
    const (
      flagRD uint16 = 1 << 8  // bit 0 of the high byte
      flagTC uint16 = 1 << 9
      flagAA uint16 = 1 << 10
      flagQR uint16 = 1 << 15 // top bit of the whole word
    )
    // Opcode occupies bits 11-14; OR the flags you want set together
checkpoint: The high flag byte packs correctly, with RD in the right place. Commit and stop here.
---

The flags word looks like one 16-bit number but is really **eight fields packed
into its bits**. The high byte, reading from the top bit down, is **QR** (0 for a
query, 1 for a response), a 4-bit **Opcode**, **AA** (authoritative answer),
**TC** (truncated), and **RD** (recursion desired) in the lowest bit. Because a
DNS message is stored big-endian, this high byte is the third byte of the whole
message, right after the two ID bytes.

The bit that matters most for a client is **RD**: set it and you are asking the
server to do the recursive work of chasing the answer for you. RD is bit 0 of the
high byte, so a query that sets only RD has a high flag byte of `0x01` and a flags
word of `0x0100`. Build the packing as an OR of the individual bit masks so you
can combine any set of flags; the low byte (RA, Z, RCODE) is tomorrow's job.

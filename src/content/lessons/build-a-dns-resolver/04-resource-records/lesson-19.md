---
project: build-a-dns-resolver
lesson: 19
title: NS and CNAME records
overview: NS and CNAME records carry a domain name as their RDATA, and that name can use compression - so it must be decoded against the whole message, not just the RDATA slice. Today you parse a name-valued record whose target is a compression pointer.
goal: Decode an NS or CNAME record whose RDATA is a possibly-compressed name.
spec:
  scenario: A CNAME's RDATA is a name that may use a pointer
  status: failing
  lines:
    - kw: Given
      text: 'a message where offset 12 holds the name example.com (07 65 78 61 6d 70 6c 65 03 63 6f 6d 00), and a CNAME record whose 6-byte RDATA is 03 77 77 77 C0 0C'
    - kw: When
      text: 'the RDATA is decoded as a name against the full message'
    - kw: Then
      text: 'the name is "www.example.com" (the label www then a pointer to offset 12)'
    - kw: And
      text: 'an NS record parses its name the same way, since both hold a single domain name'
code:
  lang: go
  source: |
    // NS and CNAME RDATA is just a name - decode it against the WHOLE
    // message so its pointer can reach back to offset 12
    func decodeNameRData(msg []byte, rdataOff int) (string, error) {
      name, _, err := decodeName(msg, rdataOff) // decodeName returns name, consumed, err
      return name, err
    }
checkpoint: You can decode NS and CNAME name-valued records. Commit and stop here.
---

**CNAME** (a canonical-name alias) and **NS** (a name server for a zone) both hold
a single **domain name** as their RDATA, and here is the catch that makes them
trickier than A or AAAA: that name can use **compression**, so its pointer offsets
are relative to the start of the **whole message**, not the RDATA slice. If you
tried to decode the name from an isolated copy of the RDATA bytes, the pointer
`C0 0C` would have nothing at offset 12 to point at. You must decode against the
full message buffer.

That is exactly what your chapter-three decoder does, so the record parse is a
one-liner: call `decodeName` at the RDATA's offset within the message. The RDATA
`03 77 77 77 C0 0C` is the label `www` followed by a pointer to `example.com` at
offset 12, yielding `www.example.com`. NS records work identically - a lone name -
which is why they share this handling. Keeping name decoding message-relative is
what lets these records reference domains introduced earlier in the response.

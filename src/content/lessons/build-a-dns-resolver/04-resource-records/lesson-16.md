---
project: build-a-dns-resolver
lesson: 16
title: The resource record header
overview: Every answer is a resource record - a name, a type, a class, a time-to-live, and a length-prefixed data blob. Today you parse that fixed framing and use RDLENGTH to carve out exactly the right RDATA bytes.
goal: Parse a resource record's fixed fields and bound its RDATA by RDLENGTH.
spec:
  scenario: A resource record parses into its fields with bounded RDATA
  status: failing
  lines:
    - kw: Given
      text: 'the bytes 00 00 01 00 01 00 00 01 2C 00 04 5D B8 D8 22 FF (a root name, then type, class, TTL, RDLENGTH, RDATA, and a trailing byte)'
    - kw: When
      text: 'a resource record is parsed at offset 0'
    - kw: Then
      text: 'Type is 1 (A), Class is 1 (IN), TTL is 300, and RDLENGTH is 4'
    - kw: And
      text: 'RDATA is exactly the 4 bytes 5D B8 D8 22 (the trailing FF is not included) and the record consumed 15 bytes'
code:
  lang: go
  source: |
    type RR struct {
      Name              string
      Type, Class       uint16
      TTL               uint32
      RData             []byte
    }
    // name, then TYPE(2) CLASS(2) TTL(4) RDLENGTH(2), then RDLENGTH data bytes
    rdlen := int(uint16At(b, i)); i += 2
    rr.RData = b[i : i+rdlen] // bounded strictly by RDLENGTH
checkpoint: You can parse a resource record's header and bounded RDATA. Commit and stop here.
---

An answer in a DNS response is a **resource record** (RR), and it opens with a
fixed frame you already have most of the pieces for: a **NAME** (a possibly
compressed name, decoded with chapter three's decoder), a 16-bit **TYPE**, a
16-bit **CLASS**, a 32-bit **TTL** (how many seconds the answer may be cached), and
a 16-bit **RDLENGTH**. After that come exactly RDLENGTH bytes of type-specific
**RDATA**.

The rule that keeps a parser honest is that **RDLENGTH bounds the RDATA** - you
slice off precisely that many bytes and no more, even if useful-looking bytes
follow (here a stray `FF` that belongs to the next record). That is why the record
consumes fifteen bytes, not sixteen. TTL is your first 32-bit field, so read it as
four big-endian bytes. It is also worth recording **where the RDATA begins** (its
offset within the whole message), not just the slice: some record types (NS, CNAME,
MX, SOA) put a compressed name in their RDATA whose pointers are relative to the
start of the message, so a later lesson will need that absolute offset to decode
them. Once the frame is parsed, each record type is just a different way of reading
the RDATA - which is the whole rest of this chapter.

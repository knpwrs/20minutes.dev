---
project: build-a-dns-resolver
lesson: 10
title: The question section
overview: A question is a name plus two 16-bit fields - the record type you want and its class. Today you encode a complete question, the part of the message that says what you are actually asking for.
goal: Encode a question as a QNAME followed by QTYPE and QCLASS.
spec:
  scenario: A question is a name plus type and class
  status: failing
  lines:
    - kw: Given
      text: 'a question for "www.example.com" of type A (1) and class IN (1)'
    - kw: When
      text: 'the question is encoded'
    - kw: Then
      text: 'the result is the QNAME bytes followed by 00 01 (QTYPE A) and 00 01 (QCLASS IN), 21 bytes in all'
    - kw: And
      text: 'the last four bytes are 00 01 00 01'
code:
  lang: go
  source: |
    const (
      TypeA  uint16 = 1
      ClassIN uint16 = 1
    )
    func encodeQuestion(name string, qtype, qclass uint16) []byte {
      out := encodeName(name)
      out = append(out, putUint16(qtype)...)
      return append(out, putUint16(qclass)...)
    }
checkpoint: You can encode a complete question. Commit and stop here.
---

The **question section** is where a query states its request. Each question is a
**QNAME** (the name from lessons 7 and 8) followed by two 16-bit fields: **QTYPE**,
the kind of record you want, and **QCLASS**, the network class. For internet names
the class is always **IN**, value `1`, and the most common type is **A**, an IPv4
address, also value `1`. So a question for `www.example.com A IN` is the 17-byte
name plus `00 01 00 01`, twenty-one bytes total.

That is the entire question format. QTYPE reuses the same numbering as record types
- you will meet AAAA (28), NS (2), CNAME (5), MX (15), TXT (16), and SOA (6) in
chapter four - and a query simply names the one it wants. With a header and a
question you now have both halves a real query packet needs; the next lesson snaps
them together.

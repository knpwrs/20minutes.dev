---
project: build-a-dns-resolver
lesson: 11
title: A complete query message
overview: Header plus question is a real, sendable DNS query. Today you assemble the full packet with a fixed ID and recursion desired, producing the exact bytes a resolver would put on the wire - the first genuinely usable artifact of the project.
goal: Assemble a complete query message from a header and one question.
spec:
  scenario: A full query message is header plus question
  status: failing
  lines:
    - kw: Given
      text: 'a query for "www.example.com" A IN with ID 0x1314 and RD set'
    - kw: When
      text: 'the message is built'
    - kw: Then
      text: 'the first 12 bytes are the header 13 14 01 00 00 01 00 00 00 00 00 00'
    - kw: And
      text: 'the remaining 21 bytes are the question, so the whole message is 33 bytes ending in 00 01 00 01'
code:
  lang: go
  source: |
    func BuildQuery(id uint16, name string) []byte {
      h := Header{ID: id, Flags: flagRD, QDCOUNT: 1}
      msg := h.Encode()
      return append(msg, encodeQuestion(name, TypeA, ClassIN)...)
    }
checkpoint: You can build a complete, sendable query message. Commit and stop here.
---

Everything so far comes together here: a **query message** is the 12-byte header
followed by the question section, and nothing else for a simple lookup. Set
QDCOUNT to `1` because there is one question, set the **RD** flag so the header
reads `01 00` in its flags bytes, pick an **ID** the reply must echo back, and
append the encoded question. The result is a 33-byte packet that is byte-for-byte
what a real resolver sends.

This is the project's first genuinely **usable** output. In a real program you
would hand these bytes to a UDP socket aimed at a DNS server and read the reply;
because we keep the socket out of the testable core, you instead pass them through
an injectable transport later. Either way, the packet is correct and complete. The
next chapter tackles the trickiest part of reading the reply that comes back:
names compressed with pointers.

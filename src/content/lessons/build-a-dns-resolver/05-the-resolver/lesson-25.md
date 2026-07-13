---
project: build-a-dns-resolver
lesson: 25
title: Parsing a full response
overview: A response is a header, the echoed question, and three record sections. Today you parse the whole message into one struct, composing every parser you have built into a single Message you can inspect.
goal: Parse a complete response message into a Message with its questions and record sections.
spec:
  scenario: A whole response parses into header, question, and answers
  status: failing
  lines:
    - kw: Given
      text: 'a response with ID 0x1314, QR and RA set, QDCOUNT 1 and ANCOUNT 1: the question www.example.com A IN at offset 12, then one A answer (name pointer C0 0C, type A, class IN, TTL 300, RDATA 5D B8 D8 22)'
    - kw: When
      text: 'the message is parsed'
    - kw: Then
      text: 'it has 1 question ("www.example.com", A, IN) and 1 answer whose A address is "93.184.216.34"'
    - kw: And
      text: 'the answer''s name is "www.example.com", resolved through its compression pointer to offset 12'
code:
  lang: go
  source: |
    type Message struct {
      Header                          Header
      Questions                       []Question
      Answers, Authority, Additional  []RR
    }
    // parse header, then QDCOUNT questions, then the three sections by count
    // using parseRecords for each, threading the cursor through
checkpoint: You can parse a complete response into a Message. Commit and stop here.
---

A response has the same shape as a query but fuller: the 12-byte **header**, then
QDCOUNT **questions** (the server echoes back what you asked), then three record
sections - **answer** (ANCOUNT), **authority** (NSCOUNT), and **additional**
(ARCOUNT). Parsing it is pure composition of what you already have: parse the
header, decode each question (a name plus QTYPE and QCLASS), then call
`parseRecords` three times with the three counts, threading the cursor forward
through the whole message.

The one thing to get right is that everything shares **one byte buffer**, because
compression pointers in the records reach back to the question's name at offset 12.
That is why the answer's `C0 0C` resolves to `www.example.com` - the parser passes
the full message to every name decode. With a `Message` struct in hand you can now
ask real questions of a reply: did it succeed, what are the answers, is there a
referral? Those are the next lessons.

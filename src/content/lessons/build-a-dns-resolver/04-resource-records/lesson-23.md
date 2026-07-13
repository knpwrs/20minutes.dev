---
project: build-a-dns-resolver
lesson: 23
title: Parsing a section of records
overview: A response section is simply a count of resource records back to back. Today you parse a run of N records into a list, each one advancing the cursor past its RDATA - the demo that ties the whole chapter together.
goal: Parse a run of N resource records into a list, tracking the cursor across each.
spec:
  scenario: A count of records parses into a list
  status: failing
  lines:
    - kw: Given
      text: 'a message where offset 12 holds www.example.com, followed by two A records that both point their name to offset 12 (C0 0C), type A, class IN, TTL 300, RDLENGTH 4, with RDATA 5D B8 D8 22 and 5D B8 D8 23'
    - kw: When
      text: 'two records are parsed starting just after the name'
    - kw: Then
      text: 'the list has 2 records, both named "www.example.com", with A addresses "93.184.216.34" and "93.184.216.35"'
    - kw: And
      text: 'each record advances the cursor past its own RDATA so the second parses right after the first'
code:
  lang: go
  source: |
    func parseRecords(msg []byte, off, count int) ([]RR, int, error) {
      var rrs []RR
      for k := 0; k < count; k++ {
        rr, n, err := parseRR(msg, off) // record, byte length, err
        if err != nil { return nil, off, err }
        rrs = append(rrs, rr)
        off += n
      }
      return rrs, off, nil
    }
checkpoint: You can parse a whole section of records. Commit and stop here.
---

A response does not hold one record - it holds **sections**, and each section is
just a **count** of resource records laid end to end (the counts come from the
header: ANCOUNT, NSCOUNT, ARCOUNT). Parsing a section is therefore a loop: parse a
record, advance the cursor by however many bytes it consumed, and repeat for the
count. The per-record consumed length you have tracked all chapter is exactly what
makes the cursor land on the next record.

The two A records here share a name via compression (both `C0 0C` pointing at
`www.example.com` at offset 12), which is the common case in a real answer section
listing several addresses for one host. Parsing them yields a two-element list with
addresses `93.184.216.34` and `93.184.216.35`. This is the chapter's payoff: you
can now read an entire block of answers. Next chapter uses it to parse a full
response and start resolving names for real.

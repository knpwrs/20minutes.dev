---
project: build-a-dns-resolver
lesson: 21
title: TXT records
overview: A TXT record holds one or more character-strings, each itself length-prefixed, packed inside the RDATA. Today you parse them into a list, staying strictly within RDLENGTH.
goal: Parse a TXT record's RDATA into a list of length-prefixed strings.
spec:
  scenario: TXT RDATA is a sequence of length-prefixed strings
  status: failing
  lines:
    - kw: Given
      text: 'a TXT record whose RDATA is 05 68 65 6c 6c 6f 05 77 6f 72 6c 64 (RDLENGTH 12)'
    - kw: When
      text: 'the RDATA is parsed'
    - kw: Then
      text: 'the strings are ["hello", "world"]'
    - kw: And
      text: 'RDATA of the single byte 00 parses to a list with one empty string [""]'
code:
  lang: go
  source: |
    func parseTXT(rdata []byte) []string {
      var out []string
      for i := 0; i < len(rdata); {
        n := int(rdata[i]); i++       // each string is length-prefixed
        out = append(out, string(rdata[i:i+n]))
        i += n
      }
      return out
    }
checkpoint: You can parse a TXT record into its strings. Commit and stop here.
---

A **TXT record** carries arbitrary text - used for domain verification, SPF mail
policy, and more - and its RDATA is **one or more character-strings**, each with
its own length byte, packed one after another. It reuses the length-prefix idea
from labels but with no zero terminator: you keep reading strings until you have
consumed all RDLENGTH bytes. So `05 hello 05 world` is the two strings `hello` and
`world`.

The bound is what keeps it safe: loop only while there are RDATA bytes left, using
RDLENGTH (which you already captured when framing the record) as the limit. A
length byte of `0` is a legitimate **empty string**, so a single `00` byte parses
to a list containing one empty string, not an empty list. Watching that edge is the
whole subtlety. One multi-field record remains - the zone's SOA - and then you can
parse a whole section of records at once.

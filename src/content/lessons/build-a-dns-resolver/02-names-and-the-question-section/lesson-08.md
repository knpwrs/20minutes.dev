---
project: build-a-dns-resolver
lesson: 8
title: The root name
overview: The root of the DNS tree has an empty name, and it encodes to a single zero byte. Today you handle that edge so an empty or dot-only name does not produce a stray empty label.
goal: Encode the empty root name as exactly one zero byte.
spec:
  scenario: The empty root name is a single zero byte
  status: failing
  lines:
    - kw: Given
      text: 'the empty name "" (and equivalently ".")'
    - kw: When
      text: 'it is encoded as a QNAME'
    - kw: Then
      text: 'the result is exactly the one byte 00'
    - kw: And
      text: 'the single-label name "a" still encodes to 01 61 00'
code:
  lang: go
  source: |
    func encodeName(name string) []byte {
      name = strings.TrimSuffix(name, ".")
      if name == "" {
        return []byte{0x00} // the root is just the terminator
      }
      // ...otherwise encode each label then append 0x00
    }
checkpoint: The root name encodes to a single zero byte. Commit and stop here.
---

The very top of the domain namespace is the **root**, written as `.` or nothing at
all, and its on-the-wire form is a name with no labels - just the zero terminator,
a single `00` byte. Your lesson 7 encoder would trip on this: splitting `""` on
dots yields one empty string, which would encode as a bogus zero-length label and
then another zero terminator. Both look like `00`, so the result would be two
zero bytes instead of one.

The fix is a small guard: strip a trailing dot, and if nothing is left, emit just
the single terminator. This matters because the root name appears for real - it is
the name you query when you ask a root server for a top-level domain's servers, and
it is the SOA and NS owner at a zone apex. Handle it now and every later name,
from `a` to a long fully-qualified one, encodes cleanly.
